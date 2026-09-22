package com.kna.sp.controller;

import com.kna.sp.dto.request.CreateStudyPlanRequest;
import com.kna.sp.dto.response.StudyPlanResponse;
import com.kna.sp.service.StudyPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

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

    @GetMapping
    public Page<StudyPlanResponse> findAll(
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate,
            @RequestParam(required = false) Long subjectId,
            @PageableDefault(size = 20, sort = "id") Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            throw new IllegalArgumentException("size must not exceed 100");
        }
        return studyPlanService.findAll(year, month, fromDate, toDate, subjectId, pageable);
    }

    @GetMapping("/{id}")
    public StudyPlanResponse findById(@PathVariable Long id) {
        return studyPlanService.findById(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        studyPlanService.deleteStudyPlan(id);
    }


}
