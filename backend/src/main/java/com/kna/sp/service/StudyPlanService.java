package com.kna.sp.service;

import com.kna.sp.dto.request.CreateStudyPlanRequest;
import com.kna.sp.dto.response.StudyPlanResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface StudyPlanService {

    StudyPlanResponse createStudyPlan(CreateStudyPlanRequest request);

    Page<StudyPlanResponse> findAll(
            Integer year, Integer month, LocalDate fromDate, LocalDate toDate, Long subjectId, Pageable pageable);

    void deleteStudyPlan(Long id);

    StudyPlanResponse preview(int month, int year, int subjectsPerDay);

    StudyPlanResponse findById(Long id);
}
