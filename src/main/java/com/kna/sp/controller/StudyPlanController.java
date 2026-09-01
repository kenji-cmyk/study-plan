package com.kna.sp.controller;

import com.kna.sp.dto.request.CreateStudyPlanRequest;
import com.kna.sp.dto.request.CreateSubjectRequest;
import com.kna.sp.dto.response.StudyPlanResponse;
import com.kna.sp.service.StudyPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/study-plan")
@RequiredArgsConstructor
public class StudyPlanController {

    private final StudyPlanService studyPlanService;

    @GetMapping("/preview")
    public ResponseEntity<StudyPlanResponse> generateSchedule(
            @Valid @ModelAttribute CreateStudyPlanRequest request
    ) {
        StudyPlanResponse response = studyPlanService.preview(request.month(), request.year(), request.slotsPerDay());

        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<StudyPlanResponse> createStudyPlan(
            @Valid @RequestBody CreateStudyPlanRequest request
    ) {

        StudyPlanResponse response = studyPlanService.createStudyPlan(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


}
