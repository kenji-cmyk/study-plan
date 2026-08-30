package com.kna.sp.dto.response;

import com.kna.sp.entity.Subject;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public record GenerateScheduleResponse(int year,
                                       int month,
                                       Map<LocalDate, List<Subject>> schedule) {
}
