import React, { useState } from "react";
import { firebase, app } from '../backend/Firebase';
import * as authpkg from "firebase/auth";
// import './Dashboard.css'
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { getDatabase, ref, set, remove, get, update, onValue } from "firebase/database";
import logo from '../assets/logo.png';
import * as fn from '../backend/functions'

function Dashboard() {
  const storedUser = localStorage.getItem('user');
  const username = fn.getUsername();
  console.log(username);

  if (!storedUser) {
      // User is not logged in, redirect to the desired page
      window.location.href = '/';
    };

  return (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
          Welcome Back '{username}'
      </h1>
      <div className="loginBox">
        <form className="form" onSubmit={(e) => e.preventDefault()}>

            <Link to='/newProject'>
          <button>
            Create New Project
          </button>
          </Link>

          <Link to='/updateProject'>
          <button>
            Update A Project
          </button>
          </Link>

          <Link to='/blockout'>
          <button>
            Set Blockout Period
          </button>
          </Link>
        </form>
      </div>
    </div>
  ); // or render any loading message or component here
}

export default Dashboard;
