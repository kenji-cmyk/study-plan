package com.kna.sp.service.impl;

import com.kna.sp.dto.request.CreateStudyPlanRequest;
import com.kna.sp.dto.response.StudyPlanResponse;
import com.kna.sp.entity.StudyPlan;
import com.kna.sp.entity.StudySession;
import com.kna.sp.entity.Subject;
import com.kna.sp.handler.exception.ConflictException;
import com.kna.sp.mapper.SessionMapper;
import com.kna.sp.mapper.StudyPlanMapper;
import com.kna.sp.pkg.algorithm.StudyScheduleGenerator;
import com.kna.sp.repository.StudyPlanRepository;
import com.kna.sp.repository.StudySessionRepository;
import com.kna.sp.service.StudyPlanService;
import com.kna.sp.service.SubjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class StudyPlanServiceImpl implements StudyPlanService {

    private final StudyScheduleGenerator studyScheduleGenerator;
    private final SubjectService subjectService;
    private final StudyPlanMapper studyPlanMapper;
    private final StudyPlanRepository studyPlanRepository;
    private final StudySessionRepository studySessionRepository;

    @Override
    @Transactional
    public StudyPlanResponse createStudyPlan(CreateStudyPlanRequest request) {

        log.info("Creating study plan: year={}, month={}", request.year(), request.month());

        if (studyPlanRepository.existsByYearAndMonth(request.year(), request.month())) {
            log.warn("Study plan already exists: year={}, month={}", request.year(), request.month());
            throw new ConflictException("A plan already exists for this month");
        }

        List<Subject> subjects = subjectService.findActiveSubjectsForSchedule();
        Map<LocalDate, List<Subject>> schedule = studyScheduleGenerator.generate(
                request.month(),
                request.year(),
                request.slotsPerDay(),
                subjects
        );

        StudyPlan plan = studyPlanRepository.save(newStudyPlan(request));

        List<StudySession> sessions = SessionMapper.toSessions(plan, schedule);
        studySessionRepository.saveAll(sessions);

        log.info(
                "Study plan created successfully: planId={}, sessions={}",
                plan.getId(),
                sessions.size()
        );

        return studyPlanMapper.toPlanResponse(plan, sessions);
    }

    private StudyPlan newStudyPlan(CreateStudyPlanRequest request) {
        StudyPlan plan = new StudyPlan();
        plan.setYear(request.year());
        plan.setMonth(request.month());
        plan.setCreatedAt(Instant.now());
        return plan;
    }


    @Override
    public List<StudyPlanResponse> findAll() {
        return List.of();
    }

    @Override
    public StudyPlan updateStudyPlan(StudyPlan studyPlan) {
        return null;
    }

    @Override
    public boolean deleteStudyPlan(Long id) {
        return false;
    }

    @Override
    @Transactional(readOnly = true)
    public StudyPlanResponse preview(int month, int year) {

        log.info("Preview study plan: month={}, year={}", month, year);

        List<Subject> subjectList = subjectService.findActiveSubjectsForSchedule();

        log.debug("Found {} active subjects for schedule", subjectList.size());

        Map<LocalDate, List<Subject>> schedule =
                studyScheduleGenerator.generate(month, year, subjectList);

        log.info(
                "Study plan generated successfully: month={}, year={}, days={}, subjects={}",
                month,
                year,
                schedule.size(),
                subjectList.size()
        );

        return studyPlanMapper.toStudyPlanResponse(schedule);
    }
}
