package com.careermate.dto.job;

import java.util.List;

/** Generic pageable response payload. */
public record PageResponseDto<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean hasNext,
        boolean hasPrevious) {
}
