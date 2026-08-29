package com.kna.sp.service.impl;

import com.kna.sp.algorithm.StudyScheduleGenerator;
import com.kna.sp.entity.StudyPlan;
import com.kna.sp.entity.Subject;
import com.kna.sp.repository.StudyPlanRepository;
import com.kna.sp.repository.SubjectRepository;
import com.kna.sp.service.StudyPlanService;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Service
public class StudyPlanServiceImpl implements StudyPlanService {

    private final StudyPlanRepository studyPlanRepository;
    private final StudyScheduleGenerator studyScheduleGenerator;
    private final SubjectRepository subjectRepository;

    public StudyPlanServiceImpl(StudyScheduleGenerator studyScheduleGenerator, StudyPlanRepository studyPlanRepository, SubjectRepository subjectRepository) {
        this.studyScheduleGenerator = studyScheduleGenerator;
        this.studyPlanRepository = studyPlanRepository;
        this.subjectRepository = subjectRepository;
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
        List<Subject> subjectList = subjectRepository.findByActiveTrueOrderByIdAsc();
        return studyScheduleGenerator.generate(month, year, subjectList);
    }
}
