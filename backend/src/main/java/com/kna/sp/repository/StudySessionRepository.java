package com.kna.sp.repository;

import com.kna.sp.entity.StudySession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

public interface StudySessionRepository extends JpaRepository<StudySession, Long>, JpaSpecificationExecutor<StudySession> {

    @Override
    @EntityGraph(attributePaths = {"subject", "studyPlan"})
    Page<StudySession> findAll(Specification<StudySession> specification, Pageable pageable);

    @Override
    @EntityGraph(attributePaths = {"subject", "studyPlan"})
    Optional<StudySession> findById(Long id);

    @EntityGraph(attributePaths = {"subject", "studyPlan"})
    List<StudySession> findAllByStudyPlanId(Long studyPlanId);
}
