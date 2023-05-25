import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './Register.css';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function Login() {
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
  
  function writeUserData(username, email, password) {
    if (!usernameAvailable || !emailAvailable) {
      return; // Do not submit the form
    }

    const db = getDatabase();
    set(ref(db, 'users/' + username), {
      username: username,
      email: email,
      password : password
    });
  }

  function checkAvailability(fieldName, value, setAvailability) {
    const db = getDatabase();
    const usersRef = ref(db, 'users');
  
    onValue(usersRef, (snapshot) => {
      const users = snapshot.val();
      const isTaken = Object.values(users).some(user => user[fieldName] === value);
      setAvailability(!isTaken);
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
    return usernameAvailable 
      && emailAvailable 
      && usernameLength > 0 
      && emailChar 
      && passwordChar 
      && confirmPasswordMatch;
  }

  return (
    <div className="container">
      <div className="logo">
          <img src="logo.svg" alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
        Welcome to Schedule Manager.
        <br></br>
        Please Login to continue.
      </h1>
      <div className="loginBox">
        <form className="form">
          <input 
            type="username" 
            placeholder="Username" 
            name="username" 
            value={username} 
            onChange={(e) => {
              setUsername(e.target.value);
              checkAvailability("username", e.target.value, setUsernameAvailable);
              setUsernameLength(e.target.value.length)
              }
            } />
            {!usernameAvailable && <p>This username is already taken. Please choose a different one.</p>}

          <input 
            type="email" 
            placeholder="Email" 
            name="email" value={email} 
            onChange={(e) => {
              setEmail(e.target.value);
              checkAvailability("email", e.target.value, setEmailAvailable);
              checkEmailChar(e.target.value)
              }
            } />
            {!emailAvailable && <p>This email is already in use. Please use a different one.</p>}

          <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            value={password} 
            onChange={(e) => {
              setPassword(e.target.value)
              checkPasswordChar(e.target.value)
              checkPasswordMatch(e.target.value, confirmPassword)
              } 
            }/>
            {!passwordChar && <p>Password must be at least 8 characters long and contain both letters and numbers.</p>}

          <input 
            type="password" 
            placeholder="Confirm Password" 
            name="confirmPassword" 
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              checkPasswordMatch(password, e.target.value)
              }
            } />

          <button type="login">
            <Link to="/login">Already Have an Account?</Link>
          </button>
          <button type="submit" onClick = {() => writeUserData(username, email, password)}>
            {allChecks()
              ? (<Link to="/submit">Submit</Link>) 
              : (<button type="submit" disabled>Submit</button>)
            }
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;