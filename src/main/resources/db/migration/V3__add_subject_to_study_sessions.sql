ALTER TABLE study_sessions ADD subject_id BIGINT NOT NULL;
ALTER TABLE study_sessions
  ADD CONSTRAINT fk_study_sessions_subject FOREIGN KEY (subject_id) REFERENCES subjects(id);
CREATE UNIQUE INDEX uq_session_plan_date_slot
  ON study_sessions(study_plan_id, study_date, slot);
