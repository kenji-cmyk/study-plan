package com.kna.sp.dto;

import java.time.LocalDateTime;
import java.util.List;

public record ErrorResponse(
        String message,
        List<String> errors,
        int status,
        String requestURI,
        LocalDateTime timestamp) {
}

