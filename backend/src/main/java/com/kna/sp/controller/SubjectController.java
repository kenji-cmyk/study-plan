package com.kna.sp.controller;

import com.kna.sp.dto.request.CreateSubjectRequest;
import com.kna.sp.dto.request.UpdateSubjectRequest;
import com.kna.sp.dto.response.SubjectResponse;
import com.kna.sp.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectService subjectService;

    @PostMapping()
    public ResponseEntity<SubjectResponse> create(@Valid @RequestBody CreateSubjectRequest request) {
        SubjectResponse response = subjectService.createSubject(request);
        URI location = URI.create("/api/v1/subjects/" + response.id());
        return ResponseEntity.created(location).body(response);
    }

    @GetMapping
    public Page<SubjectResponse> findAll(@PageableDefault(size = 20, sort = "id") Pageable pageable) {
        if (pageable.getPageSize() > 100) {
            throw new IllegalArgumentException("size must not exceed 100");
        }
        return subjectService.findAll(pageable);
    }

    @GetMapping("/{id}")
    public SubjectResponse findById(@PathVariable Long id) {
        return subjectService.findById(id);
    }

    @PutMapping("/{id}")
    public SubjectResponse update(@PathVariable Long id, @Valid @RequestBody UpdateSubjectRequest request) {
        return subjectService.updateSubject(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        subjectService.deleteSubject(id);
    }
}
