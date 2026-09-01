CREATE UNIQUE INDEX uq_session_plan_date_slot
  ON study_sessions(study_plan_id, study_date, slot);
  