package com.kna.sp.mapper;

import com.kna.sp.entity.StudyPlan;
import com.kna.sp.entity.StudySession;
import com.kna.sp.entity.Subject;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public final class SessionMapper {

    private SessionMapper() {
    }

    public static List<StudySession> toSessions(
            StudyPlan plan,
            Map<LocalDate, List<Subject>> generated
    ) {
        List<StudySession> sessions = new ArrayList<>();

        for (Map.Entry<LocalDate, List<Subject>> entry : generated.entrySet()) {
            LocalDate studyDate = entry.getKey();
            List<Subject> subjects = entry.getValue();

            for (int i = 0; i < subjects.size(); i++) {
                StudySession session = new StudySession();

                session.setStudyPlan(plan);
                session.setStudyDate(studyDate);
                session.setSlot(i + 1);
                session.setCompleted(false);
                session.setSubject(subjects.get(i));

                sessions.add(session);
            }
        }

        return sessions;
    }
}
