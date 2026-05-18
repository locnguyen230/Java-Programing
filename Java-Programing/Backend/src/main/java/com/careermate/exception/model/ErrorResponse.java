package com.careermate.exception.model;

/**
 * Standard error response wrapper.
 *
 * @param success indicates request success
 * @param message human-readable message
 * @param data    optional data
 */
public record ErrorResponse(boolean success, String message, Object data) {

    public static ErrorResponse of(boolean success, String message, Object data) {
        return new ErrorResponse(success, message, data);
    }
}
