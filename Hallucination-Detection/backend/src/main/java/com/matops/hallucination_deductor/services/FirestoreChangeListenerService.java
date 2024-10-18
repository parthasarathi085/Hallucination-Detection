    package com.matops.hallucination_deductor.services;

    import com.google.api.core.ApiFuture;
    import com.google.cloud.firestore.DocumentReference;
    import com.google.cloud.firestore.DocumentSnapshot;
    import com.google.cloud.firestore.EventListener;
    import com.google.cloud.firestore.Firestore;
    import com.google.cloud.firestore.FirestoreException;
    import com.google.cloud.firestore.ListenerRegistration;
    import com.google.firebase.cloud.FirestoreClient;
    import org.springframework.beans.factory.annotation.Value;
    import org.springframework.http.HttpEntity;
    import org.springframework.http.HttpHeaders;
    import org.springframework.http.HttpMethod;
    import org.springframework.http.ResponseEntity;
    import org.springframework.scheduling.annotation.Scheduled;
    import org.springframework.stereotype.Service;
    import org.springframework.web.client.RestTemplate;

    import javax.annotation.PostConstruct;
    import javax.annotation.PreDestroy;
    import java.util.HashMap;
    import java.util.List;
    import java.util.Map;

    @Service
    public class FirestoreChangeListenerService {

        @Value("${hallucination.api.url}")
        private String apiUrl;
        
        private ListenerRegistration registration;

        @PostConstruct
        public void init() {
            Firestore db = FirestoreClient.getFirestore();

            // Listen for changes in the Hallu_Request collection
            registration = db.collection("Hallu_Request").addSnapshotListener(new EventListener<>() {
                @Override
                public void onEvent(com.google.cloud.firestore.QuerySnapshot snapshots, FirestoreException e) {
                    if (e != null) {
                        System.err.println("Error listening to collection changes: " + e.getMessage());
                        return;
                    }

                    if (snapshots != null) {
                        for (DocumentSnapshot doc : snapshots.getDocuments()) {
                            String uid = doc.getId();
                            Map<String, Object> data = doc.getData();
                            if (data != null && data.containsKey("conversation") && data.containsKey("summary")) {
                                String conversation = data.get("conversation").toString();
                                String summary = data.get("summary").toString();

                                // Call the hallucination detection API
                                String result = callHallucinationDetectionApi(conversation, summary);

                                // Store the result back into Firestore and save to user's history
                                if (result != null) {
                                    storeResultInFirestore(uid, conversation, summary, result);
                                }
                            }
                        }
                    }
                }
            });
        }

        // Method to call the hallucination detection API
        private String callHallucinationDetectionApi(String conversation, String summary) {
            RestTemplate restTemplate = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("conversation", conversation);
            requestBody.put("summary", summary);

            HttpEntity<Map<String, String>> entity = new HttpEntity<>(requestBody, headers);

            try {
                ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.POST, entity, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    return response.getBody(); // Return result from the API
                } else {
                    System.err.println("Error in API call: " + response.getStatusCode());
                }
            } catch (Exception e) {
                System.err.println("Exception during API call: " + e.getMessage());
            }
            return null;
        }

        // Method to store the API result back into Firestore and save history
        private void storeResultInFirestore(String uid, String conversation, String summary, String result) {
            Firestore db = FirestoreClient.getFirestore();

            // Store result in Hallu_Request collection
            ApiFuture<com.google.cloud.firestore.WriteResult> future = db.collection("Hallu_Request").document(uid)
                    .update("result", result);

            future.addListener(() -> {
                try {
                    System.out.println("Result updated in Firestore for UID: " + uid);

                    // Save history to Hallu collection
                    saveToHistory(uid, conversation, summary, result);

                } catch (Exception e) {
                    System.err.println("Error updating result in Firestore: " + e.getMessage());
                }
            }, Runnable::run);
        }

        // Method to save the conversation, summary, result, and timestamp in the user's history
        private void saveToHistory(String uid, String conversation, String summary, String result) {
            Firestore db = FirestoreClient.getFirestore();
            DocumentReference userHistoryRef = db.collection("Users").document(uid);

            // Create a map with the history details
            Map<String, Object> historyEntry = new HashMap<>();
            historyEntry.put("timestamp", System.currentTimeMillis());
            historyEntry.put("conversation", conversation);
            historyEntry.put("summary", summary);
            historyEntry.put("result", result);

            // Add this history entry to the 'history' array in the Hallu collection
            ApiFuture<com.google.cloud.firestore.WriteResult> future = userHistoryRef.update("history", 
                    com.google.cloud.firestore.FieldValue.arrayUnion(historyEntry));

            future.addListener(() -> {
                try {
                    System.out.println("History updated in Firestore for UID: " + uid);
                } catch (Exception e) {
                    System.err.println("Error saving history in Firestore: " + e.getMessage());
                }
            }, Runnable::run);
        }

        @PreDestroy
        public void cleanup() {
            if (registration != null) {
                registration.remove();
            }
        }
    }
