package com.kna.sp.pkg.algorithm;

import com.kna.sp.entity.Subject;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class ScheduleValidator {
    public void validate(Map<LocalDate, List<Subject>> schedule, Map<Long, Integer> quotas, YearMonth yearMonth, int subjectsPerDay) {
        if (schedule.size() != yearMonth.lengthOfMonth())
            throw new IllegalStateException("Schedule does not cover every day in the requested month");
        Map<Long, Integer> counts = new HashMap<>();
        quotas.keySet().forEach(id -> counts.put(id, 0));
        for (LocalDate date = yearMonth.atDay(1); !date.isAfter(yearMonth.atEndOfMonth()); date = date.plusDays(1)) {
            List<Subject> dailySubjects = schedule.get(date);
            if (dailySubjects == null || dailySubjects.size() != subjectsPerDay)
                throw new IllegalStateException("Every day must contain exactly " + subjectsPerDay + " subjects");
            if (dailySubjects.stream().map(Subject::getId).distinct().count() != subjectsPerDay)
                throw new IllegalStateException("A subject cannot occur twice on one day");
            dailySubjects.forEach(subject -> counts.merge(subject.getId(), 1, Integer::sum));
        }
        if (!counts.equals(quotas))
            throw new IllegalStateException("Generated subject counts do not match the target quotas");
    }
}
