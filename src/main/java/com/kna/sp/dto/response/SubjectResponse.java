package com.kna.sp.dto.response;

import java.math.BigDecimal;

public record SubjectResponse(
        Long id,
        String code,
        String name,
        BigDecimal weight,
        Boolean active) {
}
