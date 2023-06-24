import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './Register.css';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useState } from 'react';
import logo from '../assets/logo.png';
import ReactDOM from 'react-dom/client';
import { registerWithEmailandPw } from "../backend/functions";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);

  const [usernameLength, setUsernameLength] = useState(0);
  const [emailChar, setEmailChar] = useState(false);
  const [passwordChar, setPasswordChar] = useState(false);
  const [confirmPasswordMatch, setConfirmPasswordMatch] = useState(false);

  const [usernameAttempt, setUsernameAttempt] = useState(false);
  const [emailAttempt, setEmailAttempt] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState(false);
  const [confirmPasswordAttempt, setConfirmPasswordAttempt] = useState(false);

  const [hasAttempted, setHasAttempted] = useState(false);
  
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
      // User is logged in, redirect to the desired page
      window.location.href = '/landing';
  };

  function checkAvailability(fieldName, value, setAvailability) {
    const db = getDatabase();
    const usersRef = ref(db, 'users');
    
    onValue(usersRef, (snapshot) => {
      const users = snapshot.val();
      if (users !== null) {
        const isTaken = Object.values(users).some(user => user[fieldName] === value);
        setAvailability(!isTaken);
      }
    });
  }

  function checkEmailChar(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(email);
    setEmailChar(isValid);
  }

  function checkPasswordChar(password) {
    const isValid = password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
    setPasswordChar(isValid);
  }

  function checkPasswordMatch(password, confirmPassword) {
    setConfirmPasswordMatch(confirmPassword == password);
  }

  function allChecks() {
    if (usernameAvailable 
      && emailAvailable 
      && usernameLength > 0 
      && emailChar 
      && passwordChar 
      && confirmPasswordMatch) {
        return registerWithEmailandPw(username, email, password);
      } else {
        setHasAttempted(true);
      }
  }

  return (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
        Welcome to Schedule Manager.
        <br></br>
        Please Register for an Account.
      </h1>
      <div className="loginBox">
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="username" 
            placeholder="Username" 
            name="username" 
            value={username} 
            onClick = {() => setUsernameAttempt(true)}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameLength(e.target.value.length)
              }
            } />
            

          <input 
            type="emailAddress" 
            placeholder="Email" 
            name="email" value={email} 
            onClick={() => setEmailAttempt(true)}
            onChange={(e) => {
              setEmail(e.target.value);
              checkAvailability("email", e.target.value, setEmailAvailable);
              checkEmailChar(e.target.value)
              }
            } />
            

          <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            value={password} 
            onClick={() => setPasswordAttempt(true)}
            onChange={(e) => {
              setPassword(e.target.value)
              checkPasswordChar(e.target.value)
              checkPasswordMatch(e.target.value, confirmPassword)
              } 
            }/>

          <input 
            type="password" 
            placeholder="Confirm Password" 
            name="confirmPassword" 
            value={confirmPassword}
            onClick={() => setConfirmPasswordAttempt(true)}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              checkPasswordMatch(password, e.target.value)
              }
            } />

          <div className="warningBox">
            {!usernameAvailable && <p className="warning">This username is already taken. Please choose a different one.</p>}
            {!emailAvailable && emailAttempt && <p className="warning">This email is already in use. Please use a different one.</p>}
            {!emailChar && emailAttempt && <p className="warning">Invalid email.</p>}
            {!passwordChar && passwordAttempt && <p className="warning">Password must be at least 8 characters long and contain both letters and numbers.</p>}
            {!confirmPasswordMatch && confirmPasswordAttempt && <p className="warning">Password does not match.</p>}
            </div>

          <Link to="/login">
          <button type="login" >
            Already Have an Account?
          </button>
          </Link>
          
          <button 
            type="submit" 
            onClick = {() => {allChecks();}}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;