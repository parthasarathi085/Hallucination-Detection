import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputForm from './components/InputForm';
import ResultsDisplay from './components/ResultsDisplay';
import Footer from './components/Footer';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { auth, db } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 

const styles = {
  appContainer: {
    fontFamily: 'Inter, sans-serif',
    backgroundColor: '#121212',
    color: '#e0e0e0',
    padding: '20px',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: '80px 20px 20px',
  },
  loadingIndicator: {
    color: '#00bca5',
    fontSize: '18px',
    textAlign: 'center',
    margin: '20px 0',
  },
};

function App() {
  const [results, setResults] = useState(null);
  const [user, setUser] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        const userHistory = JSON.parse(localStorage.getItem(user.uid)) || [];
        setHistory(userHistory);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setUser(user);
      
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setHistory([]);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleFormSubmit = async (data) => {
    setLoading(true); // Start loading before API call
    const response = await fetch('http://localhost:8080/api/hallucination/detect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const json = await response.json();
    setResults(json);
    setLoading(false); // Stop loading after API call

    // Save result to history if user is signed in
    if (user) {
      const updatedHistory = [...history, json];
      setHistory(updatedHistory);
      localStorage.setItem(user.uid, JSON.stringify(updatedHistory)); // Save to local storage
      
      // Save conversation and summary to Firestore
      const halluRequestRef = doc(db, 'Hallu_Request', user.uid);
      await setDoc(halluRequestRef, {
        conversation: data.conversation,
        summary: data.summary,
      }, { merge: true });
    }
  };

  const handleViewHistory = () => {
    alert(JSON.stringify(history, null, 2)); 
  };

  return (
    <div style={styles.appContainer}>
      <Header user={user} onSignIn={handleSignIn} onSignOut={handleSignOut} onViewHistory={handleViewHistory} />
      
      <InputForm onSubmit={handleFormSubmit} setResults={setResults} />
      
      
      {loading ? (
        <div style={styles.loadingIndicator}>Loading...</div>
      ) : (
        <ResultsDisplay results={results} />
      )}
      
      <Footer />
    </div>
  );
}

export default App;
