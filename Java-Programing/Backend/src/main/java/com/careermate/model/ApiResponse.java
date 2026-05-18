package com.careermate.model;

/**
 * Standard API response wrapper.
 *
 * @param success indicates request success
 * @param message human-readable message
 * @param data    response payload
 */
public record ApiResponse<T>(boolean success, String message, T data) {

    public static <T> ApiResponse<T> ok(String message, T data) {
        return new ApiResponse<>(true, message, data);
    }

    public static <T> ApiResponse<T> fail(String message) {
        return new ApiResponse<>(false, message, null);
    }
}
