package com.kna.sp.controller;

import com.kna.sp.dto.response.KpiSummaryResponse;
import com.kna.sp.dto.response.StudySessionResponse;
import com.kna.sp.service.StudySessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/v1/sessions")
@RequiredArgsConstructor
public class StudySessionController {
    private final StudySessionService studySessionService;

    @GetMapping
    public Page<StudySessionResponse> findAll(
            @RequestParam(required = false) Long studyPlanId,
            @RequestParam(required = false) LocalDate fromDate,
            @RequestParam(required = false) LocalDate toDate,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) Long subjectId,
            @PageableDefault(size = 20, sort = {"studyDate", "slot"}) Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            throw new IllegalArgumentException("size must not exceed 100");
        }
        return studySessionService.findAll(
                studyPlanId, fromDate, toDate, completed, subjectId, pageable);
    }

    @GetMapping("/{id}")
    public StudySessionResponse findById(@PathVariable Long id) {
        return studySessionService.findById(id);
    }

    @PatchMapping("/{id}/complete")
    public KpiSummaryResponse complete(@PathVariable Long id) {
        return studySessionService.complete(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        studySessionService.delete(id);
    }
}
