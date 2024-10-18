package com.matops.hallucination_deductor.services;

// Import the ResponseCallback interface
import org.springframework.stereotype.Service;
import javax.annotation.PreDestroy;

@Service
public class HallucinationService {

    private final PythonScriptRunner pythonScriptRunner;

    // Constructor to initialize the Python script runner
    public HallucinationService() {
        this.pythonScriptRunner = new PythonScriptRunner();
    }

    // Method to handle the hallucination detection request
    public void detectHallucination(String conversation, String summary, ResponseCallback callback) {
        // Send the conversation and summary to the Python process asynchronously
        pythonScriptRunner.sendRequest(conversation, summary, callback);
    }

    // Gracefully shut down the Python process when the service is destroyed
    // @PreDestroy
    // public void onDestroy() {
    //     pythonScriptRunner.stopPythonProcess();
    // }
}
