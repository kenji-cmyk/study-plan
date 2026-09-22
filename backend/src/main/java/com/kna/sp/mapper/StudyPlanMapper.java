package com.kna.sp.mapper;

import com.kna.sp.dto.request.CreateStudyPlanRequest;
import com.kna.sp.dto.response.DailyScheduleResponse;
import com.kna.sp.dto.response.StudyPlanResponse;
import com.kna.sp.entity.StudyPlan;
import com.kna.sp.entity.StudySession;
import com.kna.sp.entity.Subject;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class StudyPlanMapper {


    public StudyPlanResponse toResponse(StudyPlan plan) {
        return toResponse(plan, plan.getSessions());
    }

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

    public StudyPlanResponse toResponse(StudyPlan plan, Collection<StudySession> sessions) {
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
        return new StudyPlanResponse(plan.getMonth(), plan.getYear(), days);
    }

    public StudyPlan toStudyPlan(CreateStudyPlanRequest request) {

        StudyPlan plan = new StudyPlan();
        plan.setYear(request.year());
        plan.setMonth(request.month());
        plan.setCreatedAt(Instant.now());
        return plan;
    }

}

