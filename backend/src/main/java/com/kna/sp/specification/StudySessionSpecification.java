package com.kna.sp.specification;

import com.kna.sp.entity.StudySession;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public final class StudySessionSpecification {
    private StudySessionSpecification() {
    }

    public static Specification<StudySession> withFilters(
            Long studyPlanId, LocalDate fromDate, LocalDate toDate, Boolean completed, Long subjectId) {
        return Specification.<StudySession>allOf(
                studyPlanId == null ? null : (root, query, cb) -> cb.equal(root.get("studyPlan").get("id"), studyPlanId),
                fromDate == null ? null : (root, query, cb) -> cb.greaterThanOrEqualTo(root.get("studyDate"), fromDate),
                toDate == null ? null : (root, query, cb) -> cb.lessThanOrEqualTo(root.get("studyDate"), toDate),
                completed == null ? null : (root, query, cb) -> cb.equal(root.get("completed"), completed),
                subjectId == null ? null : (root, query, cb) -> cb.equal(root.get("subject").get("id"), subjectId)
        );
    }
}
