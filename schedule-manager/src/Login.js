import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './Login.css';

function Login() { 
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
          <input type="username" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <button type="sumbit">
            <Link to="/landing">Login</Link>
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
