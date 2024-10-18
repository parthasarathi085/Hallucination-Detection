import React from 'react';

const styles = {
  resultsContainer: {
    width: '100%',
    marginTop: '40px',
    padding: '20px 30px',
    backgroundColor: '#1f1f1f',
    color: '#e0e0e0',
    borderRadius: '15px',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
    maxWidth: '600px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  sectionHeader: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginTop: '20px',
    marginBottom: '10px',
  },
  highlightedText: {
    color: '#00bca5',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 188, 165, 0.2)',
    padding: '0 5px',
    borderRadius: '3px',
  },
  scoreBarContainer: {
    marginTop: '20px',
    padding: '10px',
    borderRadius: '10px',
    backgroundColor: '#2a2a2a',
    boxShadow: 'inset 4px 4px 8px #0d0d0d, inset -4px -4px 8px #383838',
    width: '100%',
    textAlign: 'center',
  },
  scoreText: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#00bca5',
  },
  scoreBar: {
    margin: '10px',
    height: '20px',
    borderRadius: '10px',
    transition: 'width 0.5s ease',
  },
  indicator: {
    color: '#f44336',
    marginRight: '5px',
  },
};

// Function to determine the progress bar color based on the hallucination score
const getProgressBarColor = (score) => {
//   if (score < 0.5) return '#4caf50'; // Green
//   if (score < 0.75) return '#ffeb3b'; // Yellow
//   return '#f44336'; // Red

  return '#00bca5';
};

function highlightText(summary) {
  const parts = summary.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <span key={index} style={styles.highlightedText}>
          {part.replace(/\*\*/g, '')}
        </span>
      );
    }
    return part; // Return the part as-is
  });
}

function ResultsDisplay({ results }) {
  if (!results) {
    return <p style={{ textAlign: 'center' }}>No results yet. Submit data to detect hallucination.</p>;
  }

  const isHallucinationPresent = results.label_mapped !== 'Consistent';
  const highlightedSummary = highlightText(results.summary);

  const hallucinationScore = results.result ? results.result.score : 0;
  const hallucinationLevel = (hallucinationScore * 100).toFixed(2) + '%';
  const progressBarColor = getProgressBarColor(hallucinationScore);

  return (
    <div style={styles.resultsContainer}>
      <h2 style={styles.title}>Detection Results</h2>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {isHallucinationPresent && <span style={styles.indicator}>⚠️</span>}
        <p><strong>Hallucination Detected:</strong> {isHallucinationPresent ? 'Yes' : 'No'}</p>
      </div>

      {isHallucinationPresent && (
        <>
          <h3 style={styles.sectionHeader}>Highlighted Inconsistency:</h3>
          <p>{highlightedSummary}</p>
          <div style={styles.scoreBarContainer}>
            <p style={styles.scoreText}>Hallucination Level: {hallucinationLevel}</p>
            <div style={{ ...styles.scoreBar, width: hallucinationLevel, backgroundColor: progressBarColor }}></div>
          </div>
        </>
      )}
    </div>
  );
}

export default ResultsDisplay;
