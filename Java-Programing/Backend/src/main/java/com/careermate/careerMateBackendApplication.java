package com.careermate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main entry point for CareerMate backend.
 */
@SpringBootApplication
@EnableJpaAuditing
public class careerMateBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(careerMateBackendApplication.class, args);
    }
}
