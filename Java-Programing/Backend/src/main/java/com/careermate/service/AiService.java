package com.careermate.service;

import com.careermate.dto.ai.AnalyzeCvResponseDto;
import com.careermate.dto.ai.ChatResponseDto;
import com.careermate.dto.career.SearchDirectionRequestDto;
import com.careermate.dto.career.SearchDirectionResponseDto;

/**
 * AI-related business logic.
 */
public interface AiService {

    AnalyzeCvResponseDto analyzeCv(String text);

    ChatResponseDto chat(String message);

    SearchDirectionResponseDto searchDirection(SearchDirectionRequestDto request);
}
