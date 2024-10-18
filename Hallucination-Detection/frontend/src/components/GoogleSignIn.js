import React from 'react';
import { auth, provider } from '../firebase';
import { signInWithPopup, signOut } from 'firebase/auth';

const styles = {
  signInContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: '20px auto',
    maxWidth: '400px',
    backgroundColor: '#1f1f1f',
    borderRadius: '15px',
    padding: '20px',
    boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.5)',
  },
  button: {
    backgroundColor: '#00bca5',
    color: '#ffffff',
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    fontSize: '16px',
  },
  buttonHover: {
    backgroundColor: '#009b85',
  },
  signOutButton: {
    marginTop: '10px',
    backgroundColor: '#f44336',
  },
};

function GoogleSignIn({ onSignIn }) {
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      onSignIn(result.user);
    } catch (error) {
      console.error("Error signing in: ", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      onSignIn(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div style={styles.signInContainer}>
      <button style={styles.button} onClick={handleSignIn}>
        Sign in with Google
      </button>
      <button style={{ ...styles.button, ...styles.signOutButton }} onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
}

export default GoogleSignIn;
