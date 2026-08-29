package com.kna.sp.service;

import com.kna.sp.entity.Subject;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;

public class ScheduleGenerator {


    private static final int SUBJECT_PER_DAY = 3;

    public Map<LocalDate, List<Subject>> generate(
            YearMonth month,
            List<Subject> subjectList
    ){
        validateSubjects(subjectList);

        Map<LocalDate, List<Subject>> schedule = new HashMap<>();

        LocalDate startDate = month.atDay(1);
        LocalDate endDate = month.atEndOfMonth();

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
