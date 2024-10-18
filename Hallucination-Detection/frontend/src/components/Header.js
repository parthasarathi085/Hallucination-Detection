import React from 'react';

const styles = {
  headerContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1f1f1f',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.5)',
    color: '#e0e0e0',
    zIndex: 1000, 
    margin: '10px'
  },
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
  },
  signInMessage: {
    color: '#ffffff',
    marginRight: '10px',
    fontSize: '14px',
  },
  button: {
    backgroundColor: '#00bca5',
    color: '#ffffff',
    padding: '8px 12px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    marginLeft: '10px',
    transition: 'background-color 0.3s',
  },
  buttonHover: {
    backgroundColor: '#009b85',
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

const Header = ({ user, onSignIn, onSignOut, onViewHistory }) => {
  return (
    <header style={styles.headerContainer}>
      <h1 style={styles.title}>Hallucination Detector</h1>
      <div>
        {user ? (
          <>
            <span>{user.displayName}</span>
            <button style={styles.button} onClick={onViewHistory}>
              View History
            </button>
            <button style={styles.button} onClick={onSignOut}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <span style={styles.signInMessage}>Sign in to save the history</span>
            <button style={styles.button} onClick={onSignIn}>
              Sign In with Google
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
