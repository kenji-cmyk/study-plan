package com.kna.sp.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(
        name = "study_plans",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_study_plans_year_month",
                columnNames = {"year", "month"}
        )
)
public class StudyPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @Column(name = "\"year\"", nullable = false)
    private Integer year;

    @NotNull
    @Column(name = "\"month\"", nullable = false)
    private Integer month;

    @NotNull
    @ColumnDefault("sysdatetime()")
    @Column(name = "created_at", nullable = false)
    private Instant createdAt;


}
