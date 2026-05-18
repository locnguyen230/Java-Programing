package com.careermate.dto.application;

/** Notification detail payload. */
public record NotificationDetailDto(
                String notificationId,
                String type,
                String status,
                String createdAt,
                String title,
                String message,
                ApplicationDetailDto application) {
}
