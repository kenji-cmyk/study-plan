package com.kna.sp.dto.response;

import java.util.List;

public record StudyPlanResponse (int month, int year, List<DailyScheduleResponse> days) {
}
