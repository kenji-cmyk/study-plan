package com.kna.sp.service.impl;

import com.kna.sp.entity.StudySession;
import com.kna.sp.repository.StudySessionRepository;
import com.kna.sp.service.StudySessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudySessionServiceImpl implements StudySessionService {

    @Autowired
    StudySessionRepository studySessionRepository;

    @Override
    public StudySession createStudySession(StudySession studySession) {
        return studySessionRepository.save(studySession);
    }

    @Override
    public List<StudySession> retrieveStudySession() {
        return studySessionRepository.findAll();
    }

    @Override
    public StudySession updateStudySession(StudySession studySession) {
        return studySessionRepository.save(studySession);
    }

    @Override
    public boolean deleteStudySession(Long id) {
        studySessionRepository.deleteById(id);
        return true;
    }
}
