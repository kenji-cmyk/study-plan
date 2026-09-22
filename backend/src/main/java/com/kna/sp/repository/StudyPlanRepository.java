package com.kna.sp.repository;

import com.kna.sp.entity.StudyPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

public interface StudyPlanRepository extends JpaRepository<StudyPlan, Long>, JpaSpecificationExecutor<StudyPlan> {

    @Override
    @EntityGraph(attributePaths = {"sessions", "sessions.subject"})
    Page<StudyPlan> findAll(Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"sessions", "sessions.subject"})
    Page<StudyPlan> findAll(Specification<StudyPlan> specification, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"sessions", "sessions.subject"})
    java.util.Optional<StudyPlan> findById(Long id);

    boolean existsByYearAndMonth(Integer year, Integer month);
}
