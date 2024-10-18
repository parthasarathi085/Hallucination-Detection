from flask import Flask, request, jsonify
import spacy
from transformers import pipeline
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:3000", "http://localhost:8000"]}})

# Load spaCy model for Named Entity Recognition (NER)
try:
    nlp = spacy.load("en_core_web_lg")
except:
    import subprocess
    subprocess.run(["python", "-m", "spacy", "download", "en_core_web_lg"])
    nlp = spacy.load("en_core_web_lg")

# Load the RoBERTa model for NLI task
nli_classifier = pipeline("text-classification", model="roberta-large-mnli")

# Label mapping for NLI results
label_mapping = {
    "ENTAILMENT": "Consistent",
    "CONTRADICTION": "Hallucinated",
    "NEUTRAL": "Hallucinated"  # Treat 'Neutral' as partial hallucination
}

def extract_facts(text):
    """Extract named entities from the text using spaCy."""
    doc = nlp(text)
    facts = set()
    for ent in doc.ents:
        if ent.label_ in ['DATE', 'TIME', 'MONEY', 'QUANTITY', 'GPE', 'PERSON', 'ORG', 'EVENT']:
            facts.add(ent.text.lower())
    return facts

def extract_speaker_actions(conversation):
    """Extract speaker actions from a conversation."""
    speaker_actions = {}
    turns = conversation.split(". ")
    for turn in turns:
        if ": " in turn:
            speaker, action = turn.split(": ", 1)
            speaker_actions[speaker.strip()] = action.strip()
    return speaker_actions

def create_correct_summary(speaker_actions):
    """Create a correct summary based on the speaker actions."""
    summaries = [f"{speaker} said: {action}" for speaker, action in speaker_actions.items()]
    return " ".join(summaries)

def highlight_inconsistent_facts(summary, correct_summary):
    """Highlight inconsistent (hallucinated) parts of the summary."""
    highlighted_tokens = []
    summary_entities = extract_facts(summary)
    correct_entities = extract_facts(correct_summary)

    for token in summary.split():
        if token.lower() in correct_entities:
            highlighted_tokens.append(token)
        elif token.lower() in summary_entities:
            highlighted_tokens.append(f"**{token}**")
        else:
            highlighted_tokens.append(f"**{token}**")

    return " ".join(highlighted_tokens)

def detect_hallucination(conversation, summary):
    """Detect hallucination in the summary compared to the conversation."""
    # Perform NLI (Natural Language Inference)
    result = nli_classifier(f"premise: {conversation} hypothesis: {summary}")[0]
    label = result['label']
    
    # Map the NLI result to human-readable label
    label_mapped = label_mapping.get(label, "Unknown")

    # Extract correct summary from the conversation
    speaker_actions = extract_speaker_actions(conversation)
    correct_summary = create_correct_summary(speaker_actions)

    # Highlight inconsistent facts if hallucinated
    if label_mapped == "Hallucinated":
        highlighted_summary = highlight_inconsistent_facts(summary, correct_summary)
        return {"summary": highlighted_summary, "result": result, "label_mapped": label_mapped}
    else:
        return {"summary": summary, "result": result, "label_mapped": label_mapped}

# Flask API endpoint
@app.route('/api/hallucination/detect', methods=['POST'])
def detect_hallucination_api():
    data = request.json
    conversation = data.get('conversation')
    summary = data.get('summary')

    if not conversation or not summary:
        return jsonify({"error": "Invalid input"}), 400
    
    result = detect_hallucination(conversation, summary)
    
    return jsonify(result)

if __name__ == '__main__':
    app.run(port=5000)
