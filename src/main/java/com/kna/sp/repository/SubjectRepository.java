package com.kna.sp.repository;

import com.kna.sp.entity.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findSubjectsByActiveOrderByIdAsc();
}
