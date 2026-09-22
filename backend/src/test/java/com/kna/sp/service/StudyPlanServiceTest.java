package com.kna.sp.service;

import com.kna.sp.dto.request.CreateStudyPlanRequest;
import com.kna.sp.entity.StudyPlan;
import com.kna.sp.entity.Subject;
import com.kna.sp.handler.exception.ResourceNotFoundException;
import com.kna.sp.mapper.StudyPlanMapper;
import com.kna.sp.pkg.algorithm.StudyScheduleGenerator;
import com.kna.sp.repository.StudyPlanRepository;
import com.kna.sp.repository.StudySessionRepository;
import com.kna.sp.service.impl.StudyPlanServiceImpl;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class StudyPlanServiceTest {
    private final StudyScheduleGenerator generator = mock(StudyScheduleGenerator.class);
    private final SubjectService subjectService = mock(SubjectService.class);
    private final StudyPlanRepository planRepository = mock(StudyPlanRepository.class);
    private final StudySessionRepository sessionRepository = mock(StudySessionRepository.class);
    private final StudyPlanServiceImpl service = new StudyPlanServiceImpl(
            generator, subjectService, new StudyPlanMapper(), planRepository, sessionRepository);

    @Test
    void createsGeneratedPlanAndMapsSessions() {
        Subject subject = subject();
        LocalDate date = LocalDate.of(2028, 2, 1);
        when(subjectService.findActiveSubjectsForSchedule()).thenReturn(List.of(subject));
        when(generator.generate(2, 2028, 1, List.of(subject))).thenReturn(Map.of(date, List.of(subject)));
        when(planRepository.save(any())).thenAnswer(invocation -> {
            StudyPlan plan = invocation.getArgument(0);
            plan.setId(9L);
            return plan;
        });

        var response = service.createStudyPlan(new CreateStudyPlanRequest(2028, 2, 1));

        assertEquals(2, response.month());
        assertEquals(1, response.days().size());
        assertEquals("CS101", response.days().getFirst().slots().getFirst().code());
        verify(sessionRepository).saveAll(argThat(sessions -> sessions.iterator().next().getStudyPlan().getId() == 9L));
    }

    @Test
    void findsAndDeletesExistingPlan() {
        StudyPlan plan = new StudyPlan();
        plan.setId(4L);
        plan.setYear(2028);
        plan.setMonth(2);
        when(planRepository.findById(4L)).thenReturn(Optional.of(plan));

        assertEquals(2028, service.findById(4L).year());
        service.deleteStudyPlan(4L);

        verify(planRepository).delete(plan);
    }

    @Test
    void reportsMissingPlan() {
        when(planRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> service.findById(99L));
    }

    private Subject subject() {
        Subject subject = new Subject();
        subject.setId(1L);
        subject.setCode("CS101");
        subject.setName("Programming");
        subject.setWeight(BigDecimal.ONE);
        subject.setActive(true);
        return subject;
    }
}
