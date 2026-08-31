package com.kna.sp.dto.response;

import com.kna.sp.entity.Subject;

import java.time.LocalDate;
import java.util.List;

public record DailyScheduleResponse(LocalDate date, List<SubjectResponse> slots) {

}
