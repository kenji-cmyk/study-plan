package com.kna.sp.service.impl;

import com.kna.sp.entity.Subject;
import com.kna.sp.repository.SubjectRepository;
import com.kna.sp.service.SubjectService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService {

    @Autowired
    SubjectRepository subjectRepository;

    @Override
    public Subject createSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    @Override
    public List<Subject> retrieveSubjects() {
        return subjectRepository.findAll();
    }

    @Override
    public Subject updateSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    @Override
    public boolean deleteSubject(Long id) {
        subjectRepository.deleteById(id);
        return true;
    }
}
