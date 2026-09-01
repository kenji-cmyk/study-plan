package com.kna.sp.repository;

import com.kna.sp.entity.StudyPlan;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudyPlanRepository extends JpaRepository<StudyPlan, Long> {



    boolean existsByYearAndMonth(Integer year, Integer month);
}
