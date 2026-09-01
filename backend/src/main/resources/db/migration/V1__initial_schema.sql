CREATE TABLE subjects (
    id BIGINT IDENTITY(1,1) NOT NULL,
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    weight DECIMAL(5,2) NOT NULL CONSTRAINT df_subjects_weight DEFAULT 1.0,
    active BIT NOT NULL CONSTRAINT df_subjects_active DEFAULT 1,
    CONSTRAINT pk_subjects PRIMARY KEY (id)
);

CREATE TABLE study_plans (
    id BIGINT IDENTITY(1,1) NOT NULL,
    [year] INT NOT NULL,
    [month] INT NOT NULL,
    created_at DATETIME2 NOT NULL CONSTRAINT df_study_plans_created_at DEFAULT SYSDATETIME(),
    CONSTRAINT pk_study_plans PRIMARY KEY (id)
);

CREATE TABLE study_sessions (
    id BIGINT IDENTITY(1,1) NOT NULL,
    study_plan_id BIGINT NOT NULL,
    study_date DATE NOT NULL,
    slot INT NOT NULL,
    completed BIT NOT NULL CONSTRAINT df_study_sessions_completed DEFAULT 0,
    CONSTRAINT pk_study_sessions PRIMARY KEY (id),
    CONSTRAINT fk_study_sessions_study_plan
        FOREIGN KEY (study_plan_id) REFERENCES study_plans(id) ON DELETE CASCADE
);
