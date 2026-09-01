package com.kna.sp.mapper;

import com.kna.sp.dto.response.DailyScheduleResponse;
import com.kna.sp.dto.response.StudyPlanResponse;
import com.kna.sp.entity.StudyPlan;
import com.kna.sp.entity.StudySession;
import com.kna.sp.entity.Subject;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;
import java.util.stream.Collectors;

@Component
public class StudyPlanMapper {

    public StudyPlanResponse toStudyPlanResponse(
            Map<LocalDate, List<Subject>> schedule
    ) {
        List<DailyScheduleResponse> days = schedule.entrySet().stream()
                .sorted(Map.Entry.comparingByKey()).map(
                        entry -> new DailyScheduleResponse(
                                entry.getKey(),
                                entry.getValue().stream().map(
                                        SubjectMapper::toResponse
                                ).toList()
                        )

                ).toList();

        LocalDate firstDate = schedule.keySet().stream()
                .min(LocalDate::compareTo)
                .orElseThrow();

        return new StudyPlanResponse(
                firstDate.getMonthValue(),
                firstDate.getYear(),
                days
        );
    }

    public StudyPlanResponse toPlanResponse(StudyPlan plan, List<StudySession> sessions){
        List<DailyScheduleResponse> days = sessions.stream()
                .sorted(java.util.Comparator
                        .comparing(StudySession::getStudyDate)
                        .thenComparing(StudySession::getSlot))
                .collect(Collectors.groupingBy(
                        StudySession::getStudyDate,
                        TreeMap::new,
                        Collectors.mapping(
                                session -> SubjectMapper.toResponse(session.getSubject()),
                                Collectors.toList()
                        )
                ))
                .entrySet()
                .stream()
                .map(entry -> new DailyScheduleResponse(
                        entry.getKey(),
                        entry.getValue()
                ))
                .toList();
        int year = plan.getYear();
        int month = plan.getMonth();

        return new StudyPlanResponse(month, year, days);
    }

}

