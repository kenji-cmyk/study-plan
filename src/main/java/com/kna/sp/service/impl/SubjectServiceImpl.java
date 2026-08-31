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
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@AllArgsConstructor
public class SubjectServiceImpl implements SubjectService {


    private SubjectRepository subjectRepository;

    private SubjectMapper subjectMapper;

    @Override
    @Transactional
    public SubjectResponse createSubject(CreateSubjectRequest request) {

        String code = request.code().trim();

        log.info("Create subject: code={}", code);

        if (subjectRepository.existsByCodeIgnoreCase(code)) {
            throw new ConflictException("Subject code already exist: " + code);
        }

        Subject subject = subjectRepository.save(subjectMapper.toSubject(request));

        log.info("Subject created: id={}, code={}",
                subject.getId(),
                subject.getCode()
        );

        return SubjectMapper.toResponse(subject);
    }

    @Override
    @Transactional
    public SubjectResponse updateSubject(Long id, UpdateSubjectRequest request) {

        Subject subject = getEntity(id);
        String code = subject.getCode();

        log.info("Update subject: code={}", code);

        if (subjectRepository.existsByCodeIgnoreCaseAndIdNot(code, id)) {
            throw new ConflictException("Subject code already exists: " + code);
        }

        log.info("Update subject: id={}, code={}", id, code);

        return SubjectMapper.toResponse(subjectMapper.updateSubject(subject, request));
    }

    @Override
    public void deleteSubject(Long id) {

        log.info("Delete subject: id={}", id);

        subjectRepository.delete(getEntity(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SubjectResponse> findAll(Pageable pageable) {

        log.info("Find all subjects: pageable={}", pageable);

        return subjectRepository.findAll(pageable).map(SubjectMapper::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public SubjectResponse findById(Long id) {

        Subject subject = getEntity(id);

        log.info("Find subject: id={}", id);

        return SubjectMapper.toResponse(subject);
    }

    @Override
    public List<Subject> findActiveSubjectsForSchedule() {

        log.info("Find active subjects for schedule");

        return subjectRepository.findByActiveTrueOrderByIdAsc();
    }

    private Subject getEntity(Long id) {

        return subjectRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Subject", id
                ));
    }
}
