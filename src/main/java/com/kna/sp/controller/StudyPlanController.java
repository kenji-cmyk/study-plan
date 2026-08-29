package com.kna.sp.controller;

import com.kna.sp.dto.GenerateScheduleRequest;
import com.kna.sp.dto.GenerateScheduleResponse;
import com.kna.sp.entity.Subject;
import com.kna.sp.service.StudyPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/study-plan")
@RequiredArgsConstructor
public class StudyPlanController {

    private final StudyPlanService studyPlanService;

    @GetMapping("/generate")
    public ResponseEntity<GenerateScheduleResponse> generateSchedule(
            @Valid @ModelAttribute GenerateScheduleRequest request
    ) {
        Map<LocalDate, List<Subject>> schedule = studyPlanService.generateSchedule(request.month(), request.year());

        GenerateScheduleResponse response = new GenerateScheduleResponse(request.year(), request.month(), schedule);

        return ResponseEntity.ok(response);
    }
}
