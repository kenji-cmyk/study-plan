package com.kna.sp.service.impl;

import com.kna.sp.dto.response.KpiSummaryResponse;
import com.kna.sp.dto.response.StudySessionResponse;
import com.kna.sp.entity.StudySession;
import com.kna.sp.handler.exception.ResourceNotFoundException;
import com.kna.sp.mapper.StudySessionMapper;
import com.kna.sp.repository.StudySessionRepository;
import com.kna.sp.service.StudySessionService;
import com.kna.sp.specification.StudySessionSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudySessionServiceImpl implements StudySessionService {

    private final StudySessionRepository studySessionRepository;

    @Override
    @Transactional(readOnly = true)
    public Page<StudySessionResponse> findAll(
            Long studyPlanId, LocalDate fromDate, LocalDate toDate,
            Boolean completed, Long subjectId, Pageable pageable) {
        return studySessionRepository.findAll(
                        StudySessionSpecification.withFilters(
                                studyPlanId, fromDate, toDate, completed, subjectId), pageable)
                .map(StudySessionMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public StudySessionResponse findById(Long id) {
        return StudySessionMapper.toResponse(getEntity(id));
    }

    @Override
    @Transactional
    public KpiSummaryResponse complete(Long id) {
        StudySession session = getEntity(id);
        session.setCompleted(true);
        studySessionRepository.save(session);

        List<StudySession> sessions = studySessionRepository.findAllByStudyPlanId(session.getStudyPlan().getId());
        long completedSessions = sessions.stream().filter(StudySession::getCompleted).count();
        BigDecimal totalWeight = sessions.stream()
                .map(item -> item.getSubject().getWeight())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal completedWeight = sessions.stream()
                .filter(StudySession::getCompleted)
                .map(item -> item.getSubject().getWeight())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal score = totalWeight.signum() == 0
                ? BigDecimal.ZERO.setScale(2)
                : completedWeight.multiply(BigDecimal.valueOf(100))
                        .divide(totalWeight, 2, RoundingMode.HALF_UP);

        return new KpiSummaryResponse(score, sessions.size(), completedSessions, score);
    }

    @Override
    @Transactional
    public void delete(Long id) {
        studySessionRepository.delete(getEntity(id));
    }

    private StudySession getEntity(Long id) {
        return studySessionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Study session", id));
    }
}
