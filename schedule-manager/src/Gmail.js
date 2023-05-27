import firebase from 'firebase/compat/app';
import "./Gmail.css"
import 'firebase/compat/auth';
import React, { useState } from 'react';

// Initialize Firebase
const firebaseConfig = {
  // Your Firebase project's configuration object
  apiKey: "AIzaSyAt_7XlSnzjPny4ehAjLhFqqIebvAV_v9s",
  authDomain: "schedule-manager-94579.firebaseapp.com",
  databaseURL: "https://schedule-manager-94579-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "schedule-manager-94579",
  storageBucket: "schedule-manager-94579.appspot.com",
  messagingSenderId: "764458942352",
  appId: "1:764458942352:web:a3ab85410368e1248d7d15",
  measurementId: "G-R7DMDK6E0W"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();



function Gmail() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleLogin = () => {
        setErrorMessage(''); // Clear previous error message
    
        auth.signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Handle successful login
            // You can redirect or perform any other actions here
            console.log(userCredential);
          })
          .catch((error) => {
            // Handle login error
            setErrorMessage(error);
          });
      };
  
      return (
        <div className="login-container">
          <form className="login-form" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin} >Login</button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </form>
        </div>
      );
    }
  
  export default Gmail;
  