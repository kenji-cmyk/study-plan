package com.kna.sp.service.impl;

import com.kna.sp.dto.response.StudyPlanResponse;
import com.kna.sp.entity.StudyPlan;
import com.kna.sp.entity.Subject;
import com.kna.sp.mapper.StudyPlanMapper;
import com.kna.sp.pkg.algorithm.StudyScheduleGenerator;
import com.kna.sp.repository.StudyPlanRepository;
import com.kna.sp.service.StudyPlanService;
import com.kna.sp.service.SubjectService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class StudyPlanServiceImpl implements StudyPlanService {

    private final StudyPlanRepository studyPlanRepository;
    private final StudyScheduleGenerator studyScheduleGenerator;
    private final SubjectService subjectService;
    private final StudyPlanMapper studyPlanMapper;

    public StudyPlanServiceImpl(StudyScheduleGenerator studyScheduleGenerator, StudyPlanRepository studyPlanRepository, SubjectService subjectService,  StudyPlanMapper studyPlanMapper) {
        this.studyScheduleGenerator = studyScheduleGenerator;
        this.studyPlanRepository = studyPlanRepository;
        this.subjectService = subjectService;
        this.studyPlanMapper = studyPlanMapper;
    }


    @Override
    public StudyPlanResponse createStudyPlan(StudyPlan studyPlan) {
        return null;
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
    @Transactional
    public StudyPlanResponse preview(int month, int year) {
         List<Subject> subjectList = subjectService.findActiveSubjectsForSchedule();

         return studyPlanMapper.toStudyPlanResponse(studyScheduleGenerator.generate(month, year, subjectList));
    }
}
