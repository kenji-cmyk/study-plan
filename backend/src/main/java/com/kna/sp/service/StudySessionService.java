package com.kna.sp.service;

import com.kna.sp.dto.response.KpiSummaryResponse;
import com.kna.sp.dto.response.StudySessionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;

public interface StudySessionService {

    Page<StudySessionResponse> findAll(
            Long studyPlanId, LocalDate fromDate, LocalDate toDate,
            Boolean completed, Long subjectId, Pageable pageable);

    StudySessionResponse findById(Long id);

    KpiSummaryResponse complete(Long id);

    void delete(Long id);
}
