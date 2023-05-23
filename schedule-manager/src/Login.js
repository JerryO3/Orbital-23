import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './Login.css';
import readData from './readData';
import checkParticulars from './checkParticulars';
import { useState } from 'react';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

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
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
          <button type="submit"
//            onClick={ readData(username) }
              onClick={ checkParticulars(username, password) }
            >
            Login
          </button>
          <button type="registrationButton">
            <Link to="/register">Register</Link>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
