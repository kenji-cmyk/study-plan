package com.kna.sp.service;

import com.kna.sp.dto.request.CreateSubjectRequest;
import com.kna.sp.dto.request.UpdateSubjectRequest;
import com.kna.sp.dto.response.SubjectResponse;
import com.kna.sp.entity.Subject;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SubjectService {

    SubjectResponse createSubject(CreateSubjectRequest request);

    SubjectResponse updateSubject(Long id, UpdateSubjectRequest request);

    void deleteSubject(Long id);

    Page<SubjectResponse> findAll(Pageable pageable);

    SubjectResponse findById(Long id);

    List<Subject> findActiveSubjectsForSchedule();

}
