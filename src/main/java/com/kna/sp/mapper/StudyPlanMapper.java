package com.kna.sp.mapper;

import com.kna.sp.dto.response.DailyScheduleResponse;
import com.kna.sp.dto.response.StudyPlanResponse;
import com.kna.sp.dto.response.SubjectResponse;
import com.kna.sp.entity.StudyPlan;
import com.kna.sp.entity.Subject;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Component
public class StudyPlanMapper {

    public StudyPlanResponse toStudyPlanResponse(
            Map<LocalDate, List<Subject>> schedule
    ) {
       List<DailyScheduleResponse> days = schedule.entrySet().stream().map(
               entry -> new DailyScheduleResponse(
                       entry.getKey(),
                       entry.getValue().stream().map(
                               SubjectMapper::toResponse
                       ).toList()
               )

       ) .toList();

        LocalDate firstDate = schedule.keySet().stream()
                .findFirst()
                .orElseThrow();

        return new StudyPlanResponse(
                firstDate.getMonthValue(),
                firstDate.getYear(),
                days
        );
    }

}

