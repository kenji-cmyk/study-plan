IF COL_LENGTH('study_sessions', 'subject_id') IS NULL
BEGIN
    IF EXISTS (SELECT 1 FROM study_sessions)
        THROW 50001, 'Cannot add required subject_id while study_sessions contains legacy rows', 1;

    ALTER TABLE study_sessions ADD subject_id BIGINT NOT NULL;
END;

IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'fk_study_sessions_subject')
BEGIN
    ALTER TABLE study_sessions ADD CONSTRAINT fk_study_sessions_subject
        FOREIGN KEY (subject_id) REFERENCES subjects(id);
END;

IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'ix_study_sessions_subject_id')
    CREATE INDEX ix_study_sessions_subject_id ON study_sessions(subject_id);
