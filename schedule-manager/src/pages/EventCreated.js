import React from "react";
import { useState } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function EventCreated() { 

  return (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
      Event Updated Successfully!
      </h1>
      <div className="loginBox">
        <form className="form">
        <Link to='/newEvent'>
          <button>
            Create Another Event
          </button>
        </Link>

        <Link to='/updateProject'>
          <button>
            Update An Event
          </button>
        </Link>
        
        <Link to='/dashboard'>
          <button>
            Return to Dashboard
          </button>
        </Link>
        </form>
      </div>
    </div>
  );
}

export default EventCreated;
