package com.kna.sp;

import com.kna.sp.entity.Subject;
import com.kna.sp.repository.SubjectRepository;
import com.kna.sp.service.ScheduleGenerator;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;
import java.util.Map;

@SpringBootTest
class ScheduleGeneratorTest {

    @Autowired
    private SubjectRepository subjectRepository;

    @Test
    void shouldGenerateThreeSubjectsPerDay() {

        // Lấy subject từ database
        List<Subject> subjects = subjectRepository.findAll();

        // Generator
        ScheduleGenerator generator = new ScheduleGenerator();

        // Tháng muốn generate
        YearMonth month = YearMonth.of(2026, 9);

        // Generate schedule
        Map<LocalDate, List<Subject>> schedule =
                generator.generate(month, subjects);

        // In kết quả
        schedule.forEach((date, dailySubjects) -> {

            System.out.println(date);

            dailySubjects.forEach(subject ->
                    System.out.println("    " + subject.getCode())
            );
        });
    }
}