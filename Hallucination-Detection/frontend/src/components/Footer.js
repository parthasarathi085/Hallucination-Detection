import React from 'react';

const styles = {
  footer: {
    marginTop: '40px',
    padding: '20px',
    backgroundColor: '#1f1f1f',
    color: '#e0e0e0',
    textAlign: 'center',
    fontSize: '14px',
    borderRadius: '10px',
    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.4)', 
  },
  '@media (max-width: 600px)': {
    title: {
      fontSize: '20px',
    },
  },
  '@media (max-width: 400px)': {
    title: {
      fontSize: '18px',
    },
  },
};

function Footer() {
  return (
    <div style={styles.footer}>
      <p>© Matops - Hallucination Detector</p>
    </div>
  );
}

export default Footer;
