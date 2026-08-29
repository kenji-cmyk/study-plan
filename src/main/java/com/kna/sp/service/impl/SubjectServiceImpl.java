package com.kna.sp.service.impl;

import com.kna.sp.dto.request.CreateSubjectRequest;
import com.kna.sp.dto.request.UpdateSubjectRequest;
import com.kna.sp.dto.response.SubjectResponse;
import com.kna.sp.entity.Subject;
import com.kna.sp.handler.exception.ConflictException;
import com.kna.sp.handler.exception.ResourceNotFoundException;
import com.kna.sp.mapper.SubjectMapper;
import com.kna.sp.repository.SubjectRepository;
import com.kna.sp.service.SubjectService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService {

    @Autowired
    SubjectRepository subjectRepository;

    @Autowired
    SubjectMapper subjectMapper;

    @Override
    @Transactional
    public SubjectResponse createSubject(CreateSubjectRequest request) {

        String code = request.code().trim();

        if(subjectRepository.existsByCodeIgnoreCase(code)){
            throw new ConflictException("Subject code already exist: " + code);
        }

        return subjectMapper.toResponse(subjectRepository.save(subjectMapper.toSubject(request)));
    }

    @Override
    public SubjectResponse updateSubject(Long id, UpdateSubjectRequest request) {
        Subject subject = getEntity(id);
        String code = subject.getCode();
        if(subjectRepository.exitsByCodeIgnoreCaseAndIdNot(code, id)){
            throw new ConflictException("Subject code already exists: " + code);
        }
        return subjectMapper.toResponse(subject);
    }

    @Override
    public void deleteSubject(Long id) {
        subjectRepository.delete(getEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubjectResponse> findAll(Pageable pageable) {
        return subjectRepository.findAll(pageable).map(subjectMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public SubjectResponse findById(Long id) {
        Subject subject = getEntity(id);
        return subjectMapper.toResponse(subject);
    }

    @Override
    public List<Subject> findActiveSubjectsForSchedule() {
        return subjectRepository.findByActiveTrueOrderByIdAsc();
    }

    private Subject getEntity(Long id){
        return subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subject", id
                ));
    }
}
