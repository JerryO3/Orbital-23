import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

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
        <div class = "inputBox"></div>
        Password
        <div class = "inputBox"></div>
        <li class = "loginPageButton">
            <Link to="/Landing">Login</Link>
        </li>
        <li class = "loginPageButton">
            <Link to="/register">Register</Link>
        </li>
      </div>
    </body>
  );
}

export default Login;
