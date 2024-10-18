package com.matops.hallucination_deductor.services;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PythonScriptRunner {

    private static final String FLASK_API_URL = "http://localhost:5000/api/hallucination/detect"; // Flask API endpoint

    // Send request to the Flask API
    public void sendRequest(String conversation, String summary, ResponseCallback callback) {
        try {
            // Create a RestTemplate instance
            RestTemplate restTemplate = new RestTemplate();

            // Set headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Build request body as a JSON string
            String requestBody = String.format("{\"conversation\": \"%s\", \"summary\": \"%s\"}", conversation, summary);

            // Create HttpEntity with request body and headers
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            // Make the API call
            ResponseEntity<String> response = restTemplate.exchange(FLASK_API_URL, HttpMethod.POST, entity, String.class);

            System.out.println("Sent to Flask: " + requestBody);
            System.out.println("Received from Flask: " + response.getBody());

            // Callback with result from Flask API
            callback.onResponse(response.getBody());

        } catch (Exception e) {
            e.printStackTrace();
            callback.onResponse("Error occurred: " + e.getMessage());  // Handle error
        }
    }
}
