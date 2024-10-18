package com.matops.hallucination_deductor.models;

public class DetectionRequest {
    private String conversation;
    private String summary;

    // Getters and Setters
    public String getConversation() {
        return conversation;
    }

    public void setConversation(String conversation) {
        this.conversation = conversation;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }
}
