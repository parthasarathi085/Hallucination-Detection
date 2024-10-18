import React, { useState } from 'react';

const styles = {
  formContainer: {
    padding: '30px',
    marginTop: '30px',
    backgroundColor: '#1f1f1f',
    borderRadius: '15px',
    maxWidth: '600px',
    margin: '30px auto',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
  },
  textarea: {
    width: '100%',
    padding: '15px',
    marginBottom: '15px',
    fontSize: '16px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: '#2a2a2a', 
    color: '#e0e0e0',
    boxShadow: 'inset 4px 4px 8px #0d0d0d, inset -4px -4px 8px #383838',
  },
  button: {
    padding: '12px 30px',
    backgroundColor: '#00bca5',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    boxShadow: '4px 4px 10px #0d0d0d, -4px -4px 10px #383838',
    fontSize: '16px',
    transition: 'transform 0.3s ease, background-color 0.3s ease',
  },
  buttonHover: {
    backgroundColor: '#008f84',
    transform: 'translateY(-2px)',
  },
};

function InputForm({ onSubmit, setResults }) {
  const [conversation, setConversation] = useState('');
  const [summary, setSummary] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      conversation,
      summary,
    };

    // Call the onSubmit passed from App.js
    await onSubmit(data);
  };

  return (
    <div style={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <textarea
          value={conversation}
          onChange={(e) => setConversation(e.target.value)}
          rows="4"
          placeholder="Enter the conversation..."
          style={styles.textarea}
        />
        <textarea
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows="2"
          placeholder="Enter the summary..."
          style={styles.textarea}
        />
        <button type="submit" style={styles.button}>Detect Hallucination</button>
      </form>
    </div>
  );
}

export default InputForm;
