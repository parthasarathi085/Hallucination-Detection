package com.matops.hallucination_deductor.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.matops.hallucination_deductor.models.DetectionRequest;
import com.matops.hallucination_deductor.services.HallucinationService;

import java.util.concurrent.CountDownLatch;

@RestController
@RequestMapping("/api/hallucination")
public class HallucinationController {

    private final HallucinationService hallucinationService;

    @Autowired
    public HallucinationController(HallucinationService hallucinationService) {
        this.hallucinationService = hallucinationService;
    }

    // Endpoint to trigger hallucination detection
    @PostMapping("/detect")
    public ResponseEntity<String> detectHallucination(@RequestBody DetectionRequest request) {
        StringBuilder responseBuilder = new StringBuilder();
        CountDownLatch latch = new CountDownLatch(1);  // Initialize CountDownLatch

        // Send the request to the hallucination detection service asynchronously
        hallucinationService.detectHallucination(request.getConversation(), request.getSummary(), result -> {
            responseBuilder.append(result);
            latch.countDown();  // Signal that processing is complete
        });

        // Wait for the result to be ready
        try {
            latch.await();  // Block until count reaches zero
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();  // Restore interrupted status
            return ResponseEntity.status(500).body("Error occurred while processing the request.");
        }

        // Return the result received from the hallucination detection service
        return ResponseEntity.ok(responseBuilder.toString());
    }
}
