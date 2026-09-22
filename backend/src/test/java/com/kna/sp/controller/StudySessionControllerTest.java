package com.kna.sp.controller;

import com.kna.sp.dto.response.KpiSummaryResponse;
import com.kna.sp.dto.response.StudySessionResponse;
import com.kna.sp.dto.response.SubjectResponse;
import com.kna.sp.service.StudySessionService;
import org.junit.jupiter.api.Test;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.data.web.PageableHandlerMethodArgumentResolver;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class StudySessionControllerTest {
    private final StudySessionService service = mock(StudySessionService.class);
    private final MockMvc mvc = MockMvcBuilders.standaloneSetup(new StudySessionController(service))
            .setCustomArgumentResolvers(new PageableHandlerMethodArgumentResolver())
            .build();

    @Test
    void completesSessionAndReturnsKpi() throws Exception {
        when(service.complete(5L)).thenReturn(
                new KpiSummaryResponse(new BigDecimal("60.00"), 10, 6, new BigDecimal("60.00")));

        mvc.perform(patch("/api/v1/sessions/5/complete"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.kpiScore").value(60.0))
                .andExpect(jsonPath("$.completedSessions").value(6));
    }

    @Test
    void searchesSessionsWithFiltersAndPagination() throws Exception {
        var subject = new SubjectResponse(2L, "CS101", "Programming", BigDecimal.ONE, true);
        var response = new StudySessionResponse(5L, 3L, LocalDate.of(2028, 2, 1), 1, true, subject);
        when(service.findAll(eq(3L), any(), any(), eq(true), eq(2L), any()))
                .thenReturn(new PageImpl<>(List.of(response), PageRequest.of(0, 20), 1));

        mvc.perform(get("/api/v1/sessions")
                        .param("studyPlanId", "3")
                        .param("fromDate", "2028-02-01")
                        .param("toDate", "2028-02-29")
                        .param("completed", "true")
                        .param("subjectId", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(5))
                .andExpect(jsonPath("$.content[0].subject.code").value("CS101"));
    }
}
