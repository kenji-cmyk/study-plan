package com.kna.sp.specification;

import com.kna.sp.entity.Subject;
import org.springframework.data.jpa.domain.Specification;

public final class SubjectSpecification {
    private SubjectSpecification() {
    }

    public static Specification<Subject> withFilters(String code, String name, Boolean active) {
        return Specification.<Subject>allOf(
                containsIgnoreCase("code", code),
                containsIgnoreCase("name", name),
                active == null ? Specification.unrestricted()
                        : (root, query, cb) -> cb.equal(root.get("active"), active)
        );
    }

    private static Specification<Subject> containsIgnoreCase(String field, String value) {
        if (value == null || value.isBlank()) {
            return Specification.unrestricted();
        }
        String pattern = "%" + value.trim().toLowerCase() + "%";
        return (root, query, cb) -> cb.like(cb.lower(root.get(field)), pattern);
    }
}
