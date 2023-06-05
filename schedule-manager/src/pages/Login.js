import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './Login.css';
import Gmail from "../deprecated/Gmail";
import { useState } from 'react';
import Landing from "./Landing";
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
        Welcome to Schedule Manager.
        <br></br>
        Please Login to continue.
      </h1>
      <div className="loginBox">
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
          {hasAttempted && <p>Invalid Login Credentials.</p>}
          <button
              type="submit"
              onClick={
                () => {
                        fn.login(email, password);
                      }
                }
            >
            Submit
          </button>
        
          <Link to="/register">
            <button type="registrationButton">
              Register
            </button>
          </Link>

          <Link to="/resetPw">
            <button>
              Forgot Your Password?
            </button>
          </Link>

          {/* <Link to="/gmail">
            <button type="gmailLogin" >
            Sign in with Google
            </button>
          </Link> */}
        </form>
      </div>
    </div>
  );
}

export default Login;
