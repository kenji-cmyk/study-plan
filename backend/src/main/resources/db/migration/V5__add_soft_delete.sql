ALTER TABLE subjects ADD deleted BIT NOT NULL CONSTRAINT df_subjects_deleted DEFAULT 0;
ALTER TABLE study_plans ADD deleted BIT NOT NULL CONSTRAINT df_study_plans_deleted DEFAULT 0;
ALTER TABLE study_sessions ADD deleted BIT NOT NULL CONSTRAINT df_study_sessions_deleted DEFAULT 0;

GO

CREATE INDEX ix_subjects_deleted ON subjects (deleted);
CREATE INDEX ix_study_plans_deleted ON study_plans (deleted);
CREATE INDEX ix_study_sessions_deleted ON study_sessions (deleted);

GO

DROP INDEX uq_study_plans_year_month ON study_plans;
CREATE UNIQUE INDEX uq_study_plans_year_month
    ON study_plans([year], [month]) WHERE deleted = 0;
