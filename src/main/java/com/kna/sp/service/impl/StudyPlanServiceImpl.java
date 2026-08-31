package com.kna.sp.service.impl;

import com.kna.sp.dto.response.StudyPlanResponse;
import com.kna.sp.entity.StudyPlan;
import com.kna.sp.entity.Subject;
import com.kna.sp.mapper.StudyPlanMapper;
import com.kna.sp.pkg.algorithm.StudyScheduleGenerator;
import com.kna.sp.service.StudyPlanService;
import com.kna.sp.service.SubjectService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@AllArgsConstructor
public class StudyPlanServiceImpl implements StudyPlanService {

    private final StudyScheduleGenerator studyScheduleGenerator;
    private final SubjectService subjectService;
    private final StudyPlanMapper studyPlanMapper;

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
