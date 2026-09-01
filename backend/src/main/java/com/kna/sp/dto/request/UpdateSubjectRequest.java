package com.kna.sp.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record UpdateSubjectRequest(
        @NotBlank()
        @Size(max = 6, min = 6)
        String code,

        @NotBlank()
        @Size(max = 255)
        String name,

        @NotNull()
        @DecimalMin(value = "0.01")
        @Digits(integer = 3, fraction = 2)
        BigDecimal weight,

        Boolean active
) {
}
