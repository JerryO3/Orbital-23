import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { getDatabase, ref, set, onValue } from "firebase/database";
import * as authpkg from "firebase/auth";
import { app } from '../backend/Firebase';
import { useState } from 'react';
import logo from '../assets/logo.png';
import ReactDOM from 'react-dom/client';
import * as fn from '../backend/functions';
import * as bl from '../backend/blockoutFunctions';

function NewBlockout() { 
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");  

  const handleStartDateChange = (e) => {
    setStartDate((e.target.value));
  };

  const handleEndDateChange = (e) => {
    setEndDate((e.target.value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (startDate.trim() === '' || endDate.trim() === '') {
      alert('Please fill in all fields.');
      return; // Stop the submission
    }

    if (startDate > endDate) {
      alert('Start Date cannot be after End Date.');
      return; // Stop the submission
    }

    const result = await bl.newBlockout(name, startDate, endDate)
    .then(() => window.location.href='/blockoutCreated');
  }

    return  (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
          Enter Your Blockout Name
      </h1>
      <div className="loginBox">
        <form className="form" onSubmit={(e) => e.preventDefault()}>

          <input
            type="name"
            placeholder="Blockout Name"
            name="name" value={name}
            onChange={(e) => {
              setName(e.target.value);
              }
            } />

            <div>
              <label>
              Start of Blockout:
                    <input type="date" value={startDate} onChange={handleStartDateChange} />
              </label>
            </div>
            
            <div>
              <label>
              End of Blockout:
                    <input type="date" value={endDate} onChange={handleEndDateChange} />
              </label>
            </div>
          
          <button
            type="submit"
            onClick = {handleSubmit}>
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewBlockout;
