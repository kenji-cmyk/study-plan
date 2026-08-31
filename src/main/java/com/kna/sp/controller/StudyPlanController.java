package com.kna.sp.controller;

import com.kna.sp.dto.request.GenerateScheduleRequest;
import com.kna.sp.dto.response.StudyPlanResponse;
import com.kna.sp.service.StudyPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/study-plan")
@RequiredArgsConstructor
public class StudyPlanController {

    private final StudyPlanService studyPlanService;

    @GetMapping("/preview")
    public ResponseEntity<StudyPlanResponse> generateSchedule(
            @Valid @ModelAttribute GenerateScheduleRequest request
    ) {
        StudyPlanResponse response = studyPlanService.preview(request.month(), request.year());

        return ResponseEntity.ok(response);
    }


}
