package com.kna.sp.pkg.algorithm;

import com.kna.sp.entity.Subject;

import java.time.LocalDate;

final class SubjectState {
    private final Subject subject;
    private final int targetQuota;
    private int remainingQuota;
    private LocalDate lastScheduledDate;

    SubjectState(Subject subject, int targetQuota) {
        this.subject = subject;
        this.targetQuota = targetQuota;
        this.remainingQuota = targetQuota;
    }

    Subject subject() {
        return subject;
    }

    int targetQuota() {
        return targetQuota;
    }

    int remainingQuota() {
        return remainingQuota;
    }

    LocalDate lastScheduledDate() {
        return lastScheduledDate;
    }

    void scheduleOn(LocalDate date) {
        if (remainingQuota <= 0) throw new IllegalStateException("Subject quota has already been exhausted");
        remainingQuota--;
        lastScheduledDate = date;
    }
}
