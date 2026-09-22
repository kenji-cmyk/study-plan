package com.kna.sp.dto.response;

import java.time.LocalDate;

public record StudySessionResponse(
        Long id,
        Long studyPlanId,
        LocalDate studyDate,
        Integer slot,
        Boolean completed,
        SubjectResponse subject) {
}
