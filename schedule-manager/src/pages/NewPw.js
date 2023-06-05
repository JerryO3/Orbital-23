import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './Register.css';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useState } from 'react';
import logo from '../assets/logo.png';
import ReactDOM from 'react-dom/client';

function NewPw() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordChar, setPasswordChar] = useState(false);
  const [confirmPasswordMatch, setConfirmPasswordMatch] = useState(false);

  const [passwordAttempt, setPasswordAttempt] = useState(false);
  const [confirmPasswordAttempt, setConfirmPasswordAttempt] = useState(false);

  const [hasAttempted, setHasAttempted] = useState(false);

  function writeUserData(username, password) {
    const db = getDatabase();
    set(ref(db, 'users/' + username), {
      password : password
    });
    window.location.href = "/landing";
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

  function checkPasswordChar(password) {
    const isValid = password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
    setPasswordChar(isValid);
  }

  function checkPasswordMatch(password, confirmPassword) {
    setConfirmPasswordMatch(confirmPassword == password);
  }

  function allChecks() {
    if ( passwordChar
      && confirmPasswordMatch) {
        return writeUserData(password);
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
          Reset Your Password
      </h1>
      <div className="loginBox">
        <form className="form" onSubmit={(e) => e.preventDefault()}>

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
            {!passwordChar && passwordAttempt && <p className="warning">Password must be at least 8 characters long and contain both letters and numbers.</p>}
            {!confirmPasswordMatch && confirmPasswordAttempt && <p className="warning">Password does not match.</p>}
            </div>

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

export default NewPw;