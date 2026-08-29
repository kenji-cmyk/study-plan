package com.kna.sp.service;

import com.kna.sp.entity.StudyPlan;
import com.kna.sp.entity.Subject;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface StudyPlanService {

    StudyPlan createStudyPlan(StudyPlan studyPlan);

    List<StudyPlan> retrieveStudyPlan();

    StudyPlan updateStudyPlan(StudyPlan studyPlan);

    boolean deleteStudyPlan(Long id);

    Map<LocalDate, List<Subject>> generateSchedule(int month, int year);
}
