package com.kna.sp.pkg.algorithm;

import com.kna.sp.entity.Subject;

import java.util.Collection;
import java.util.List;

public record DaySignature(List<Long> subjectIds) {
    public DaySignature {
        subjectIds = List.copyOf(subjectIds.stream().sorted().toList());
    }

    public static DaySignature of(Collection<Subject> subjects) {
        return new DaySignature(subjects.stream().map(Subject::getId).toList());
    }
}
