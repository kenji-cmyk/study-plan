package com.kna.sp.dto.request;

import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.YearMonth;

public record GenerateScheduleRequest(

        @NotNull(message = "Year is required")
        @Min(value = 1, message = "Year must be a positive number")
        Integer year,

        @NotNull(message = "Month is required")
        @Min(value = 1, message = "Month must be between 1 and 12")
        @Max(value = 12, message = "Month must be between 1 and 12")
        Integer month
) {

    @AssertTrue(message = "Year must be greater than or equal to current year")
    public boolean isYearValid() {

        if (year == null) {
            return true;
        }

        if (year < 1) {
            return true;
        }

        return year >= LocalDate.now().getYear();
    }

    @AssertTrue(message = "Year and month must represent a valid date")
    public boolean isValidYearMonth() {

        if (year == null || month == null) {
            return true;
        }

        if (year < 1) {
            return true;
        }

        if (month < 1 || month > 12) {
            return true;
        }

        YearMonth requested = YearMonth.of(year, month);
        YearMonth current = YearMonth.now();

        return !requested.isBefore(current);
    }
}