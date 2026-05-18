package com.careermate.service;

import com.careermate.dto.application.ApplicationDetailDto;
import com.careermate.dto.application.NotificationDetailDto;

import java.util.List;

/**
 * Candidate applications & notifications business logic.
 */
public interface ApplicationService {

    List<NotificationDetailDto> getMyNotifications(int page, int size);

    NotificationDetailDto getNotificationDetail(String notificationId);

    List<ApplicationDetailDto> getMyApplications(int page, int size);
}
