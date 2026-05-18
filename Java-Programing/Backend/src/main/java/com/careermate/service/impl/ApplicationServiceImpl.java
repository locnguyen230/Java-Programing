package com.careermate.service.impl;

import com.careermate.dto.application.ApplicationDetailDto;
import com.careermate.dto.application.ApplicationSubmissionRequest;
import com.careermate.dto.application.NotificationDetailDto;
import com.careermate.entity.ApplicationEntity;
import com.careermate.entity.NotificationEntity;
import com.careermate.entity.UserEntity;
import com.careermate.repository.ApplicationRepository;
import com.careermate.repository.NotificationRepository;
import com.careermate.repository.UserRepository;
import com.careermate.dto.application.ApplicationDetailDto;
import com.careermate.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Candidate applications/notifications implementation.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ApplicationServiceImpl implements ApplicationService {

    private final NotificationRepository notificationRepository;
    private final ApplicationRepository applicationRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<NotificationDetailDto> getMyNotifications(int page, int size) {
        String candidateId = currentUserId();
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));
        Page<NotificationEntity> result = notificationRepository.findAllByCandidate_Id(candidateId, pageable);

        return result.getContent().stream().map(this::toDto).toList();
    }

    @Override
    @Transactional(readOnly = true)
    public NotificationDetailDto getNotificationDetail(String notificationId) {
        NotificationEntity entity = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found: " + notificationId));
        return toDto(entity);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ApplicationDetailDto> getMyApplications(int page, int size) {
        String candidateId = currentUserId();
        Pageable pageable = PageRequest.of(Math.max(page, 0), Math.max(size, 1));
        Page<ApplicationEntity> result = applicationRepository.findAllByCandidate_Id(candidateId, pageable);
        return result.getContent().stream().map(this::toApplicationDto).toList();
    }

    private String currentUserId() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null)
            throw new IllegalStateException("No authentication");
        Object principal = auth.getPrincipal();
        if (principal instanceof com.careermate.security.SecurityUserDetails sud) {
            return sud.id();
        }
        return auth.getName();
    }

    private NotificationDetailDto toDto(NotificationEntity n) {
        ApplicationEntity app = n.getApplication();
        return new NotificationDetailDto(
                n.getId(),
                n.getType(),
                n.getStatus(),
                n.getCreatedAt() != null ? n.getCreatedAt().toString() : null,
                n.getTitle(),
                n.getMessage(),
                app != null ? toApplicationDto(app) : null);
    }

    private ApplicationDetailDto toApplicationDto(ApplicationEntity a) {
        // job/candidate fields are left as generic objects for now (frontend only reads
        // nested properties)
        Object jobObj = a.getJob();
        Object candidateObj = a.getCandidate();

        return new ApplicationDetailDto(
                a.getId(),
                a.getStatus().name(),
                a.getCreatedAt() != null ? a.getCreatedAt().toString() : null,
                a.getCvUrl(),
                a.getCoverLetter(),
                jobObj,
                candidateObj);
    }
}
