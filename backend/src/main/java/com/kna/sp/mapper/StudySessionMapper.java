package com.kna.sp.mapper;

import com.kna.sp.dto.response.StudySessionResponse;
import com.kna.sp.entity.StudySession;

public final class StudySessionMapper {
    private StudySessionMapper() {
    }

    public static StudySessionResponse toResponse(StudySession session) {
        return new StudySessionResponse(
                session.getId(),
                session.getStudyPlan().getId(),
                session.getStudyDate(),
                session.getSlot(),
                session.getCompleted(),
                SubjectMapper.toResponse(session.getSubject())
        );
    }
}
