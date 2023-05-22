import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './Register.css';
import { getDatabase, ref, set } from "firebase/database";
import { useState } from 'react';
import ReactDOM from 'react-dom/client';

function writeUserData(username, email, password) {
  const db = getDatabase();
  set(ref(db, 'users/' + username), {
    username: username,
    email: email,
    password : password
  });
}

function Login() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
            onChange={(e) => setUsername(e.target.value)} />
          <input 
            type="email" 
            placeholder="Email" 
            name="email" value={email} 
            onChange={(e) => setEmail(e.target.value)} />
          <input 
            type="password" 
            placeholder="Password" 
            name="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} />
          <input 
            type="password" 
            placeholder="Confirm Password" 
            name="confirmPassword" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}/>
          <button type="submit">
            <Link to="/landing">Already Have an Account?</Link>
          </button>
          <button type="registrationButton">
            {writeUserData(username, email, password)}
            <Link to="/submit">Submit</Link>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;