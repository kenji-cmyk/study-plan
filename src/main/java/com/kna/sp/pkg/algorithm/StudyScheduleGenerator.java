package com.kna.sp.pkg.algorithm;

import com.kna.sp.entity.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.MathContext;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.random.RandomGenerator;

@Component
public class StudyScheduleGenerator {

    public static final int DEFAULT_SUBJECTS_PER_DAY = 3;
    private static final int RECENT_DAYS_TO_COMPARE = 2;

    private final MonthlyQuotaCalculator quotaCalculator;
    private final ScheduleValidator scheduleValidator;
    private final RandomGenerator random;

    @Autowired
    public StudyScheduleGenerator(MonthlyQuotaCalculator quotaCalculator, ScheduleValidator scheduleValidator) {
        this(quotaCalculator, scheduleValidator, new SplittableRandom());
    }

    public StudyScheduleGenerator(MonthlyQuotaCalculator quotaCalculator, ScheduleValidator scheduleValidator, RandomGenerator random) {
        this.quotaCalculator = quotaCalculator;
        this.scheduleValidator = scheduleValidator;
        this.random = random;
    }

    public Map<LocalDate, List<Subject>> generate(
            int month,
            int year,
            List<Subject> subjectList
    ) {
        return generate(month, year, DEFAULT_SUBJECTS_PER_DAY, subjectList);
    }

    public Map<LocalDate, List<Subject>> generate(
            int month,
            int year,
            int subjectsPerDay,
            List<Subject> subjectList
    ) {
        validateSubjects(subjectList, subjectsPerDay);

        YearMonth yearMonth = YearMonth.of(year, month);
        Map<Long, Integer> quotas = quotaCalculator.allocate(subjectList, yearMonth.lengthOfMonth(), subjectsPerDay);
        Map<Long, SubjectState> states = new HashMap<>();
        subjectList.forEach(subject -> states.put(subject.getId(), new SubjectState(subject, quotas.get(subject.getId()))));
        Map<LocalDate, List<Subject>> schedule = new LinkedHashMap<>();
        Set<DaySignature> usedSignatures = new HashSet<>();
        Deque<Set<Long>> recentDays = new ArrayDeque<>();

        for (LocalDate date = yearMonth.atDay(1); !date.isAfter(yearMonth.atEndOfMonth()); date = date.plusDays(1)) {
            int daysAfter = (int) (yearMonth.atEndOfMonth().toEpochDay() - date.toEpochDay());
            DailyCandidate selected = selectCandidate(
                    buildCandidates(states.values(), daysAfter, subjectsPerDay),
                    usedSignatures,
                    recentDays,
                    date
            );
            List<Subject> dailySubjects = selected.states().stream().map(SubjectState::subject).toList();
            schedule.put(date, dailySubjects);
            LocalDate scheduledDate = date;
            selected.states().forEach(state -> state.scheduleOn(scheduledDate));
            usedSignatures.add(DaySignature.of(dailySubjects));
            recentDays.addFirst(selected.subjectIds());
            if (recentDays.size() > RECENT_DAYS_TO_COMPARE) recentDays.removeLast();
        }
        scheduleValidator.validate(schedule, quotas, yearMonth, subjectsPerDay);
        return schedule;
    }

    private void validateSubjects(List<Subject> subjectList, int subjectsPerDay) {
        if (subjectsPerDay < 1) {
            throw new IllegalArgumentException("Subjects per day must be positive");
        }
        if (subjectList == null || subjectList.size() < subjectsPerDay) {
            throw new IllegalArgumentException("At least " + subjectsPerDay + " subjects are required");
        }
        Set<Long> ids = new HashSet<>();
        for (Subject subject : subjectList) {
            if (subject == null || subject.getId() == null || subject.getWeight() == null || subject.getWeight().signum() <= 0 || !ids.add(subject.getId())) {
                throw new IllegalArgumentException("Subjects must have unique IDs and positive weights");
            }
        }
    }

    private List<DailyCandidate> buildCandidates(Collection<SubjectState> states, int daysAfter, int subjectsPerDay) {
        List<SubjectState> eligible = states.stream().filter(state -> state.remainingQuota() > 0)
                .sorted(Comparator.comparing(state -> state.subject().getId())).toList();
        List<DailyCandidate> candidates = new ArrayList<>();
        buildCombinations(eligible, 0, new ArrayList<>(), candidates, states, daysAfter, subjectsPerDay);
        if (candidates.isEmpty()) throw new IllegalStateException("No quota-feasible daily schedule is available");
        return candidates;
    }

    private void buildCombinations(List<SubjectState> eligible, int index, List<SubjectState> selected,
                                   List<DailyCandidate> candidates, Collection<SubjectState> allStates, int daysAfter,
                                   int subjectsPerDay) {
        if (selected.size() == subjectsPerDay) {
            if (preservesFutureFeasibility(selected, allStates, daysAfter))
                candidates.add(new DailyCandidate(List.copyOf(selected)));
            return;
        }
        for (int current = index; current <= eligible.size() - (subjectsPerDay - selected.size()); current++) {
            selected.add(eligible.get(current));
            buildCombinations(eligible, current + 1, selected, candidates, allStates, daysAfter, subjectsPerDay);
            selected.removeLast();
        }
    }

    private boolean preservesFutureFeasibility(List<SubjectState> selected, Collection<SubjectState> allStates, int daysAfter) {
        Set<Long> selectedIds = selected.stream().map(state -> state.subject().getId()).collect(java.util.stream.Collectors.toSet());
        return allStates.stream().allMatch(state -> state.remainingQuota() - (selectedIds.contains(state.subject().getId()) ? 1 : 0) <= daysAfter);
    }

    private DailyCandidate selectCandidate(List<DailyCandidate> candidates, Set<DaySignature> usedSignatures,
                                           Deque<Set<Long>> recentDays, LocalDate date) {
        Comparator<DailyCandidate> comparator = Comparator.comparing((DailyCandidate candidate) -> usedSignatures.contains(candidate.signature()))
                .thenComparingInt(candidate -> overlap(candidate.subjectIds(), recentDays.peekFirst()))
                .thenComparingInt(candidate -> recentOverlap(candidate.subjectIds(), recentDays))
                .thenComparingInt(candidate -> consecutiveSubjects(candidate.states(), date))
                .thenComparing(this::urgency, Comparator.reverseOrder());
        List<DailyCandidate> ranked = candidates.stream().sorted(comparator).toList();
        DailyCandidate best = ranked.getFirst();
        List<DailyCandidate> ties = ranked.stream().takeWhile(candidate -> comparator.compare(candidate, best) == 0).toList();
        return ties.get(random.nextInt(ties.size()));
    }

    private int overlap(Set<Long> candidate, Set<Long> previous) {
        return previous == null ? 0 : (int) candidate.stream().filter(previous::contains).count();
    }

    private int recentOverlap(Set<Long> candidate, Deque<Set<Long>> recentDays) {
        return recentDays.stream().mapToInt(day -> overlap(candidate, day)).sum();
    }

    private int consecutiveSubjects(List<SubjectState> states, LocalDate date) {
        return (int) states.stream().filter(state -> date.minusDays(1).equals(state.lastScheduledDate())).count();
    }

    private BigDecimal urgency(DailyCandidate candidate) {
        return candidate.states().stream().map(state -> BigDecimal.valueOf(state.remainingQuota())
                .divide(BigDecimal.valueOf(state.targetQuota()), MathContext.DECIMAL64)
                .add(BigDecimal.valueOf(state.remainingQuota()))).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private record DailyCandidate(List<SubjectState> states) {
        DaySignature signature() {
            return DaySignature.of(states.stream().map(SubjectState::subject).toList());
        }

        Set<Long> subjectIds() {
            return states.stream().map(state -> state.subject().getId()).collect(java.util.stream.Collectors.toSet());
        }
    }
}
