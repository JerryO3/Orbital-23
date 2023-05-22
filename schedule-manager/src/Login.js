import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './Login.css';

function Login() { 
  return (
    <body>
      <h1 class = "welcomeMessage">
        Welcome to Schedule Manger. 
        <br></br>
        Please Login to continue.
      </h1>
      <div class = "loginBox">
        Username
        <div class = "inputUsernameBox"></div>
        Password
        <div class = "inputPasswordBox"></div>
        <li class = "loginButton">
            <Link to="/Landing">Login</Link>
        </li>
        <li class = "regButton">
            <Link to="/register">Register</Link>
        </li>
      </div>
    </body>
  );
}

export default Login;
