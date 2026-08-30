package com.kna.sp.handler;

import com.kna.sp.handler.model.FieldErrorDetail;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.kna.sp.handler.model.ApiError;

import java.time.Instant;
import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BindException.class)
    public ResponseEntity<ApiError> handleQueryValidation(
            BindException ex,
            HttpServletRequest request
    ) {
        List<FieldErrorDetail> errors = ex.getBindingResult().getFieldErrors().stream()
                .map(error -> new FieldErrorDetail(error.getField(), error.getDefaultMessage()))
                .toList();



        return response(HttpStatus.BAD_REQUEST, "VALIDATION_FAILED", "Request validation failed", errors, request);
    }

    private ResponseEntity<ApiError> response (HttpStatus status, String code, String message, List<FieldErrorDetail> errors, HttpServletRequest request){
        return ResponseEntity.status(status).body(new ApiError(code, message, errors, status.value(), request.getRequestURI(), Instant.now()));
    }
}
