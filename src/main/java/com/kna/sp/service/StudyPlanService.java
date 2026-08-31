package com.kna.sp.service;

import com.kna.sp.dto.response.StudyPlanResponse;
import com.kna.sp.entity.StudyPlan;

import java.util.List;

public interface StudyPlanService {

    StudyPlanResponse createStudyPlan(StudyPlan studyPlan);

    List<StudyPlanResponse> findAll();

    StudyPlan updateStudyPlan(StudyPlan studyPlan);

    boolean deleteStudyPlan(Long id);

    StudyPlanResponse preview(int month, int year);
}
