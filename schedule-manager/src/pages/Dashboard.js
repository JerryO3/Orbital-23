import React, { useState } from "react";
import { firebase, app } from '../backend/Firebase';
import * as authpkg from "firebase/auth";
import './Dashboard.css'
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import * as p from '../pages/pages'

function Dashboard() {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
      // User is not logged in, redirect to the desired page
      window.location.href = '/';
    };

  return (
    <h1 className="dashboard">
      Welcome back!
      <Link to='/newProject'>
      <button>
        Create New Project
      </button>
      </Link>


      <button>
        Update A Project
      </button>


      <Link to='/blockout'>
      <button>
        Set Blockout Period
      </button>
      </Link>
    </h1>
  ); // or render any loading message or component here
}

export default Dashboard;
