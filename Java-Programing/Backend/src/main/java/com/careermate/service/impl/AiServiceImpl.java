package com.careermate.service.impl;

import com.careermate.dto.ai.AnalyzeCvResponseDto;
import com.careermate.dto.ai.ChatResponseDto;
import com.careermate.dto.career.SearchDirectionRequestDto;
import com.careermate.dto.career.SearchDirectionResponseDto;
import com.careermate.service.AiService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

/**
 * Stub AI implementation to satisfy frontend contracts.
 */
@Slf4j
@Service
public class AiServiceImpl implements AiService {

    @Override
    public AnalyzeCvResponseDto analyzeCv(String text) {
        log.info("analyzeCv called (stub) textLength={}", text != null ? text.length() : 0);

        return new AnalyzeCvResponseDto(
                "This is a scaffold AI analysis of your CV. Upgrade this with real LLM integration.",
                88,
                List.of("Java", "Spring Boot", "SQL", "JWT", "React"),
                List.of("Clear problem solving", "Strong backend engineering", "Good communication"),
                List.of("Add measurable achievements", "Highlight architecture decisions", "Include project impact"));
    }

    @Override
    public ChatResponseDto chat(String message) {
        log.info("chat called (stub) messageLength={}", message != null ? message.length() : 0);

        return new ChatResponseDto("Stub reply: I will help you plan the next steps for your target career.");
    }

    @Override
    public SearchDirectionResponseDto searchDirection(SearchDirectionRequestDto request) {
        log.info("searchDirection called (stub) targetCareer={}", request != null ? request.targetCareer() : null);

        return new SearchDirectionResponseDto(
                "Stub summary for your career direction.",
                List.of("Pick a role", "Build portfolio", "Apply with tailored resume"),
                List.of("Backend Engineer", "Spring Boot", "Microservices", "System Design"),
                Map.of(
                        "location", request != null ? request.location() : null,
                        "experienceLevel", request != null ? request.experienceLevel() : null,
                        "remote", Boolean.TRUE));
    }
}
