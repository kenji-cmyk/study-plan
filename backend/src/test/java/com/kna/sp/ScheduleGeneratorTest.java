package com.kna.sp;

import com.kna.sp.entity.Subject;
import com.kna.sp.pkg.algorithm.DaySignature;
import com.kna.sp.pkg.algorithm.MonthlyQuotaCalculator;
import com.kna.sp.pkg.algorithm.ScheduleValidator;
import com.kna.sp.pkg.algorithm.StudyScheduleGenerator;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.SplittableRandom;
import java.util.stream.Collectors;

class ScheduleGeneratorTest {

    private final MonthlyQuotaCalculator quotaCalculator = new MonthlyQuotaCalculator();
    private final StudyScheduleGenerator generator = new StudyScheduleGenerator(
            quotaCalculator, new ScheduleValidator(), new SplittableRandom(42));

    @Test
    void shouldGenerateWeightedDistinctDailySchedules() {
        List<Subject> subjects = subjects("10", "5", "1", "1", "1");
        Map<LocalDate, List<Subject>> schedule = generator.generate(2, 2028, 3, subjects);
        Map<Long, Integer> quotas = quotaCalculator.allocate(subjects, 29, 3);

        Assertions.assertEquals(29, schedule.size());
        schedule.values().forEach(day -> {
            Assertions.assertEquals(3, day.size());
            Assertions.assertEquals(3, day.stream().map(Subject::getId).distinct().count());
        });
        Map<Long, Long> counts = schedule.values().stream().flatMap(List::stream)
                .collect(java.util.stream.Collectors.groupingBy(Subject::getId, Collectors.counting()));
        quotas.forEach((id, quota) -> Assertions.assertEquals(quota.longValue(), counts.getOrDefault(id, 0L)));
        Assertions.assertEquals(87, counts.values().stream().mapToLong(Long::longValue).sum());
        Assertions.assertTrue(quotas.get(1L) >= quotas.get(2L));
        Assertions.assertTrue(quotas.get(2L) > quotas.get(3L));
    }

    @Test
    void shouldRejectInvalidSubjectsAndCapExtremeWeights() {
        Assertions.assertThrows(IllegalArgumentException.class, () -> generator.generate(2, 2028, 3, subjects("1", "1")));
        List<Subject> invalid = subjects("1", "1", "1");
        invalid.getFirst().setWeight(BigDecimal.ZERO);
        Assertions.assertThrows(IllegalArgumentException.class, () -> generator.generate(2, 2028, 3, invalid));

        Map<Long, Integer> quotas = quotaCalculator.allocate(subjects("999.99", "0.01", "0.01", "0.01"), 28, 3);
        Assertions.assertEquals(84, quotas.values().stream().mapToInt(Integer::intValue).sum());
        Assertions.assertEquals(28, quotas.get(1L));
    }

    @Test
    void shouldAvoidDuplicateCombinationsWhenEnoughCombinationsExist() {
        Map<LocalDate, List<Subject>> schedule = generator.generate(2, 2028, subjects("1", "1", "1", "1", "1", "1", "1", "1"));
        long uniqueCombinations = schedule.values().stream().map(DaySignature::of).distinct().count();
        Assertions.assertEquals(schedule.size(), uniqueCombinations);
    }

    @Test
    void shouldHonorRequestedSubjectsPerDay() {
        List<Subject> subjects = subjects("5", "4", "3", "2", "1");

        Map<LocalDate, List<Subject>> schedule = generator.generate(2, 2028, 4, subjects);
        Map<Long, Integer> quotas = quotaCalculator.allocate(subjects, 29, 4);

        schedule.values().forEach(day -> {
            Assertions.assertEquals(4, day.size());
            Assertions.assertEquals(4, day.stream().map(Subject::getId).distinct().count());
        });
        Map<Long, Long> counts = schedule.values().stream()
                .flatMap(List::stream)
                .collect(Collectors.groupingBy(Subject::getId, Collectors.counting()));
        quotas.forEach((id, quota) -> Assertions.assertEquals(quota.longValue(), counts.getOrDefault(id, 0L)));
    }

    private List<Subject> subjects(String... weights) {
        return java.util.stream.IntStream.range(0, weights.length).mapToObj(index -> {
            Subject subject = new Subject();
            subject.setId((long) index + 1);
            subject.setCode("SUB" + String.format("%03d", index));
            subject.setName("Subject " + index);
            subject.setWeight(new BigDecimal(weights[index]));
            subject.setActive(true);
            return subject;
        }).toList();
    }
}
