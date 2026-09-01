package com.kna.sp.dto.response;

import java.time.LocalDate;
import java.util.List;

public record DailyScheduleResponse(LocalDate date, List<SubjectResponse> slots) {

}
