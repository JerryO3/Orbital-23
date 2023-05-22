import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function Register() { 
  return (
    <body>
      <h1 class = "welcomeMessage">
        Welcome to Schedule Manger. 
        <br></br>
        Please make an account to proceed.
      </h1>
      <div class = "loginBox">
        Username
        <div class = "inputBox"></div>
        Email
        <div class = "inputBox"></div>
        Password
        <div class = "inputBox"></div>
        Confirm Password
        <div class = "inputBox"></div>
        <li class = "loginPageButton">
            Already have an account?
            <Link to="/Login">Login</Link>
        </li>
        <li class = "loginPageButton">
            <Link to="/Submit">Submit</Link>
        </li>
      </div>
    </body>
  );
}

export default Register;
