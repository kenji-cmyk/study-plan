package com.kna.sp.dto.response;

import java.math.BigDecimal;

public record KpiSummaryResponse(
        BigDecimal kpiScore,
        long totalSessions,
        long completedSessions,
        BigDecimal weightedCompletionPercentage) {
}
