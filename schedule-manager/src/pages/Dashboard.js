import React, { useState } from "react";
import { firebase, app } from '../backend/Firebase';
import * as authpkg from "firebase/auth";
import './Dashboard.css'

function Dashboard() {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
      // User is not logged in, redirect to the desired page
      window.location.href = '/';
    };

  return (
    <h1 className="dashboard">
      Welcome back!
      <button>
        Create New Project
      </button>
      <button>
        Update A Project
      </button>
      <button>
        Set Blockout Period
      </button>
    </h1>
  ); // or render any loading message or component here
}

export default Dashboard;
