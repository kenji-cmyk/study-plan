package com.kna.sp;

import com.kna.sp.pkg.algorithm.StudyScheduleGenerator;
import com.kna.sp.entity.Subject;
import com.kna.sp.repository.SubjectRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@SpringBootTest
class ScheduleGeneratorTest {

    @Autowired
    private SubjectRepository subjectRepository;

    @Test
    void shouldGenerateThreeSubjectsPerDay() {

        List<Subject> subjects =
                subjectRepository.findByActiveTrueOrderByIdAsc();

        StudyScheduleGenerator generator =
                new StudyScheduleGenerator();

        Map<LocalDate, List<Subject>> schedule =
                generator.generate(9, 2026, subjects);

        schedule.forEach((date, dailySubjects) -> {

            System.out.println(date);

            dailySubjects.forEach(subject ->
                    System.out.println("    " + subject.getCode())
            );
        });
    }
}