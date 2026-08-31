package com.kna.sp.handler;

import com.kna.sp.handler.exception.BusinessRuleException;
import com.kna.sp.handler.exception.ConflictException;
import com.kna.sp.handler.exception.ResourceNotFoundException;
import com.kna.sp.handler.model.ApiError;
import com.kna.sp.handler.model.FieldErrorDetail;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.List;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BindException.class)
    ResponseEntity<ApiError> handleQueryValidation(
            BindException ex,
            HttpServletRequest request
    ) {
        List<FieldErrorDetail> errors = ex.getFieldErrors().stream()
                .map(error -> new FieldErrorDetail(error.getField(), error.getDefaultMessage()))
                .toList();

        HttpStatus status = HttpStatus.BAD_REQUEST;
        String code = "VALIDATION_FAILED";
        String message = "Request validation failed";

        return response(status, code, message, errors, request);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ApiError> handleBodyValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        List<FieldErrorDetail> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> new FieldErrorDetail(error.getField(), error.getDefaultMessage()))
                .toList();

        HttpStatus status = HttpStatus.BAD_REQUEST;
        String code = "VALIDATION_FAILED";
        String message = "Request validation failed";

        return response(status, code, message, errors, request);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    ResponseEntity<ApiError> handleNotFound(ResourceNotFoundException ex, HttpServletRequest request) {

        HttpStatus status = HttpStatus.NOT_FOUND;
        String code = "RESOURCE_NOT_FOUND";
        String message = ex.getMessage();

        return response(status, code, message, List.of(), request);
    }


    @ExceptionHandler(ConflictException.class)
    ResponseEntity<ApiError> handleConflict(ConflictException ex, HttpServletRequest request) {

        HttpStatus status = HttpStatus.CONFLICT;
        String code = "CONFLICT";
        String message = ex.getMessage();

        return response(status, code, message, List.of(), request);
    }


    @ExceptionHandler(BusinessRuleException.class)
    ResponseEntity<ApiError> handleRule(BusinessRuleException ex, HttpServletRequest request) {

        HttpStatus status = HttpStatus.UNPROCESSABLE_CONTENT;
        String code = "BUSINESS_RULE_VIOLATION";
        String message = ex.getMessage();

        return response(status, code, message, List.of(), request);
    }

    @ExceptionHandler({
            IllegalArgumentException.class,
            HttpMessageNotReadableException.class
    })
    ResponseEntity<ApiError> handleBadRequest(
            Exception ex,
            HttpServletRequest request
    ) {

        HttpStatus status = HttpStatus.BAD_REQUEST;
        String code = "MALFORMED_REQUEST";
        String message = "Request is invalid";

        return response(status, code, message, List.of(), request);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    ResponseEntity<ApiError> handleDataConflict(DataIntegrityViolationException ex, HttpServletRequest request) {

        HttpStatus status = HttpStatus.CONFLICT;
        String code = "CONFLICT";
        String message = "Data conflicts with existing resource";

        log.warn("Data integrity violation: {}", ex.getMessage());

        return response(status, code, message, List.of(), request);
    }

    @ExceptionHandler(Exception.class)
    ResponseEntity<ApiError> handleUnexpected(Exception ex, HttpServletRequest request) {

        HttpStatus status = HttpStatus.INTERNAL_SERVER_ERROR;
        String code = "INTERNAL_SERVER_ERROR";
        String message = "An unexpected error has occurred";

        log.error(
                "Unexpected error on {}",
                request.getRequestURI(),
                ex
        );

        return response(status, code, message, List.of(), request);
    }


    private ResponseEntity<ApiError> response(HttpStatus status, String code, String message, List<FieldErrorDetail> errors, HttpServletRequest request) {
        return ResponseEntity.status(status).body(new ApiError(code, message, errors, status.value(), request.getRequestURI(), Instant.now()));
    }
}
