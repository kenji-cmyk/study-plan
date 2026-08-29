package com.kna.sp.service;

import com.kna.sp.entity.Subject;

import java.util.List;

public interface SubjectService {

    Subject createSubject(Subject subject);

    List<Subject> retrieveSubjects();

    Subject updateSubject(Subject subject);

    boolean deleteSubject(Long id);

}
