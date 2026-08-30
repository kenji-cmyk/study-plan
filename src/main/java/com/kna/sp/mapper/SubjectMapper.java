package com.kna.sp.mapper;

import com.kna.sp.dto.request.CreateSubjectRequest;
import com.kna.sp.dto.request.UpdateSubjectRequest;
import com.kna.sp.dto.response.SubjectResponse;
import com.kna.sp.entity.Subject;
import org.springframework.stereotype.Component;

@Component
public class SubjectMapper {

    public Subject toSubject (CreateSubjectRequest request){

        Subject subject = new Subject();

        subject.setCode(request.code());
        subject.setName(request.name().trim());
        subject.setWeight(request.weight());
        subject.setActive(
                request.active() == null || request.active()
        );

        return subject;
    }

    public SubjectResponse toResponse (Subject subject){
        return new SubjectResponse(
                subject.getId(),
                subject.getCode(),
                subject.getName(),
                subject.getWeight(),
                subject.getActive()
        );
    }

    public Subject updateSubject(Subject subject, UpdateSubjectRequest request) {
        subject.setCode(request.code());
        subject.setName(request.name().trim());
        subject.setWeight(request.weight());

        if (request.active() != null) {
            subject.setActive(request.active());
        }

        return subject;
    }
}
