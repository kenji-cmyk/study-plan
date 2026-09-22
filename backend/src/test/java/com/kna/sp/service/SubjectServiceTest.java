package com.kna.sp.service;

import com.kna.sp.dto.request.CreateSubjectRequest;
import com.kna.sp.dto.request.UpdateSubjectRequest;
import com.kna.sp.entity.Subject;
import com.kna.sp.handler.exception.ConflictException;
import com.kna.sp.mapper.SubjectMapper;
import com.kna.sp.repository.SubjectRepository;
import com.kna.sp.service.impl.SubjectServiceImpl;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SubjectServiceTest {
    private final SubjectRepository repository = mock(SubjectRepository.class);
    private final SubjectServiceImpl service = new SubjectServiceImpl(repository, new SubjectMapper());

    @Test
    void createsAndNormalizesSubject() {
        when(repository.save(any())).thenAnswer(invocation -> {
            Subject subject = invocation.getArgument(0);
            subject.setId(1L);
            return subject;
        });

        var response = service.createSubject(
                new CreateSubjectRequest(" CS101 ", " Programming ", new BigDecimal("2.50"), null));

        assertEquals(1L, response.id());
        assertEquals("CS101", response.code());
        assertEquals("Programming", response.name());
        assertTrue(response.active());
    }

    @Test
    void rejectsDuplicateCode() {
        when(repository.existsByCodeIgnoreCase("CS101")).thenReturn(true);

        assertThrows(ConflictException.class, () -> service.createSubject(
                new CreateSubjectRequest("CS101", "Programming", BigDecimal.ONE, true)));
    }

    @Test
    void updatesUsingRequestedCodeAndSoftDeletesThroughRepository() {
        Subject subject = subject(3L, "CS101");
        when(repository.findById(3L)).thenReturn(Optional.of(subject));

        var response = service.updateSubject(3L,
                new UpdateSubjectRequest("CS102", "Algorithms", new BigDecimal("3.00"), false));
        service.deleteSubject(3L);

        assertEquals("CS102", response.code());
        assertFalse(response.active());
        verify(repository).existsByCodeIgnoreCaseAndIdNot("CS102", 3L);
        verify(repository).delete(subject);
    }

    private Subject subject(Long id, String code) {
        Subject subject = new Subject();
        subject.setId(id);
        subject.setCode(code);
        subject.setName("Programming");
        subject.setWeight(BigDecimal.ONE);
        subject.setActive(true);
        return subject;
    }
}
