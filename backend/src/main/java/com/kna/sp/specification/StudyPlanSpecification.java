package com.kna.sp.specification;

import com.kna.sp.entity.StudyPlan;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDate;

public final class StudyPlanSpecification {
    private StudyPlanSpecification() {
    }

    public static Specification<StudyPlan> withFilters(
            Integer year, Integer month, LocalDate fromDate, LocalDate toDate, Long subjectId) {
        return Specification.<StudyPlan>allOf(
                year == null ? null : (root, query, cb) -> cb.equal(root.get("year"), year),
                month == null ? null : (root, query, cb) -> cb.equal(root.get("month"), month),
                fromDate == null ? null : (root, query, cb) ->
                        cb.greaterThanOrEqualTo(root.join("sessions", JoinType.LEFT).get("studyDate"), fromDate),
                toDate == null ? null : (root, query, cb) ->
                        cb.lessThanOrEqualTo(root.join("sessions", JoinType.LEFT).get("studyDate"), toDate),
                subjectId == null ? null : (root, query, cb) ->
                        cb.equal(root.join("sessions", JoinType.LEFT).join("subject").get("id"), subjectId)
        ).and((root, query, cb) -> {
            query.distinct(true);
            return cb.conjunction();
        });
    }
}
