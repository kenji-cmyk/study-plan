package com.kna.sp.handler.model;

import java.time.Instant;
import java.util.List;

public record ApiError(
        String code,
        String message,
        List<FieldErrorDetail> errors,
        int status,
        String requestURI,
        Instant timestamp) {
}

