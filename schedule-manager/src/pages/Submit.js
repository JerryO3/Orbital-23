import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import logo from '../assets/logo.png';

function Submit() { 
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
      // User is logged in, redirect to the desired page
      window.location.href = '/dashboard';
  };
  
  return (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 class = "welcomeMessage">
        An account has been created successfully!
        <br></br>
        Please login to continue.
      </h1>
      <form className="form" onSubmit={(e) => e.preventDefault()}>
      <div className="loginBox">
          <Link to="/login">
            <button>
                Login
            </button>
          </Link>
      </div>
      </form>
    </div>
  );
}

export default Submit;
