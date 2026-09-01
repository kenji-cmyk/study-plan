package com.kna.sp.dto.request;

import jakarta.validation.constraints.*;

import java.math.BigDecimal;

public record CreateSubjectRequest(
        @NotBlank(message = "Subject code is required")
        @Size(min = 6, max = 6, message = "Subject code must be 6 characters")
        String code,

        @NotBlank(message = "Subject name is required")
        @Size(max = 255, message = "Subject name must not exceed 255 characters")
        String name,

        @NotNull(message = "Subject weight is required")
        @DecimalMin(value = "0.01", message = "Subject weight must be at least 0.01")
        @Digits(integer = 3, fraction = 2, message = "Weight format is not valid")
        BigDecimal weight,

        Boolean active
) {
}
