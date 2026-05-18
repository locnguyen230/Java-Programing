package com.careermate.controller;

import com.careermate.dto.ai.AnalyzeCvResponseDto;
import com.careermate.dto.ai.ChatResponseDto;
import com.careermate.dto.career.SearchDirectionRequestDto;
import com.careermate.dto.career.SearchDirectionResponseDto;
import com.careermate.model.ApiResponse;
import com.careermate.service.AiService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * AI endpoints.
 */
@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/ai/analyze-cv")
    public ResponseEntity<ApiResponse<AnalyzeCvResponseDto>> analyzeCv(@RequestBody Object payload) {
        // Frontend sends { text }
        String text = payload instanceof java.util.Map<?, ?> m
                ? (m.get("text") != null ? m.get("text").toString() : null)
                : null;
        return ResponseEntity.ok(ApiResponse.ok("success", aiService.analyzeCv(text)));
    }

    @PostMapping("/ai/chat")
    public ResponseEntity<ApiResponse<ChatResponseDto>> chat(@RequestBody Object payload) {
        String message = payload instanceof java.util.Map<?, ?> m
                ? (m.get("message") != null ? m.get("message").toString() : null)
                : null;
        return ResponseEntity.ok(ApiResponse.ok("success", aiService.chat(message)));
    }

    @PostMapping("/career/search-direction")
    public ResponseEntity<ApiResponse<SearchDirectionResponseDto>> searchDirection(
            @RequestBody @Valid SearchDirectionRequestDto request) {
        return ResponseEntity.ok(ApiResponse.ok("success", aiService.searchDirection(request)));
    }
}
