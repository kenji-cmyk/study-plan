package com.kna.sp.service;

import com.kna.sp.entity.StudySession;

import java.util.List;

public interface StudySessionService {

    StudySession createStudySession(StudySession studySession);

    List<StudySession> retrieveStudySession();

    StudySession updateStudySession(StudySession studySession);

    boolean deleteStudySession(Long id);


}
