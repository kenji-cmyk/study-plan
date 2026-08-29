package com.kna.sp.algorithm;

import com.kna.sp.entity.Subject;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

@Component
public class StudyScheduleGenerator {

    private static final int SUBJECT_PER_DAY = 3;

    public Map<LocalDate, List<Subject>> generate(
            int month,
            int year,
            List<Subject> subjectList
    ){
        validateSubjects(subjectList);

        Map<LocalDate, List<Subject>> schedule = new HashMap<>();
        YearMonth yearMonth = YearMonth.of(year, month);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)){

            List<Subject> shuffleSubjects = new ArrayList<>(subjectList);

            Collections.shuffle(shuffleSubjects);

            List<Subject> dailySubject = shuffleSubjects.subList(0, SUBJECT_PER_DAY);

            schedule.put(date,new ArrayList<>(dailySubject));
        }

        return schedule;
    }

    private void validateSubjects (List<Subject> subjectList){
        if( subjectList == null || subjectList.size() < SUBJECT_PER_DAY){
            throw new IllegalArgumentException(
                    "At least 3 subjects are required"
            );
        }
    }
}
