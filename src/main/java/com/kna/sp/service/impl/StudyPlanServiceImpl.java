package com.kna.sp.service.impl;

import com.kna.sp.pkg.algorithm.StudyScheduleGenerator;
import com.kna.sp.entity.StudyPlan;
import com.kna.sp.entity.Subject;
import com.kna.sp.repository.StudyPlanRepository;
import com.kna.sp.service.StudyPlanService;
import com.kna.sp.service.SubjectService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class StudyPlanServiceImpl implements StudyPlanService {

    private final StudyPlanRepository studyPlanRepository;
    private final StudyScheduleGenerator studyScheduleGenerator;
    private final SubjectService subjectService;

    public StudyPlanServiceImpl(StudyScheduleGenerator studyScheduleGenerator, StudyPlanRepository studyPlanRepository, SubjectService subjectService) {
        this.studyScheduleGenerator = studyScheduleGenerator;
        this.studyPlanRepository = studyPlanRepository;
        this.subjectService = subjectService;
    }

    @Override
    public StudyPlan createStudyPlan(StudyPlan studyPlan) {
        return studyPlanRepository.save(studyPlan);
    }

    @Override
    public List<StudyPlan> retrieveStudyPlan() {
        return studyPlanRepository.findAll();
    }

    @Override
    public StudyPlan updateStudyPlan(StudyPlan studyPlan) {
        return studyPlanRepository.save(studyPlan);
    }

    @Override
    public boolean deleteStudyPlan(Long id) {
        studyPlanRepository.deleteById(id);
        return true;
    }

    @Override
    public Map<LocalDate, List<Subject>> generateSchedule(int month, int year) {
        List<Subject> subjectList = subjectService.findActiveSubjectsForSchedule();
        return studyScheduleGenerator.generate(month, year, subjectList);
    }
}
