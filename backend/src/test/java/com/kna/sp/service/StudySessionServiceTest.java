package com.kna.sp.service;

import com.kna.sp.entity.StudyPlan;
import com.kna.sp.entity.StudySession;
import com.kna.sp.entity.Subject;
import com.kna.sp.repository.StudySessionRepository;
import com.kna.sp.service.impl.StudySessionServiceImpl;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.*;

class StudySessionServiceTest {
    @Test
    void completionReturnsWeightedPlanKpi() {
        StudySessionRepository repository = mock(StudySessionRepository.class);
        StudySessionServiceImpl service = new StudySessionServiceImpl(repository);
        StudyPlan plan = new StudyPlan();
        plan.setId(7L);
        StudySession completed = session(1L, plan, "3.00", false);
        StudySession pending = session(2L, plan, "1.00", false);
        when(repository.findById(1L)).thenReturn(Optional.of(completed));
        when(repository.findAllByStudyPlanId(7L)).thenReturn(List.of(completed, pending));

        var summary = service.complete(1L);

        assertTrue(completed.getCompleted());
        assertEquals(new BigDecimal("75.00"), summary.kpiScore());
        assertEquals(2, summary.totalSessions());
        assertEquals(1, summary.completedSessions());
    }

    private StudySession session(Long id, StudyPlan plan, String weight, boolean completed) {
        Subject subject = new Subject();
        subject.setWeight(new BigDecimal(weight));
        StudySession session = new StudySession();
        session.setId(id);
        session.setStudyPlan(plan);
        session.setSubject(subject);
        session.setCompleted(completed);
        return session;
    }
}
