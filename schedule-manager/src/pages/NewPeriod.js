import React from "react";
import { useState, useEffect } from 'react';
import * as authpkg from "firebase/auth";
import { app } from '../backend/Firebase';
import { getDatabase, ref, set, onValue } from "firebase/database";
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import * as col from '../backend/collaboration';
import * as bl from '../backend/blockoutFunctions';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function NewEvent() { 
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.uid;

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [cycle, setCycle] = useState(0);
  const thisBlockout = localStorage.getItem('blockoutId');
  const [checked, setChecked] = useState(false);

  const handleToggle = () => {
    setChecked(!checked);
  };

  const [available, setAvailable] = useState(true);

  async function handleSubmit(e){
    e.preventDefault();

    // Validate the form fields
    if (startDate.trim() === '' || startTime.trim() === '' 
    || endDate.trim() === '' || endTime.trim() === '') {
      alert('Please fill in all fields.');
      return; // Stop the submission
    }

    if (startDate > endDate) {
      alert('Start Date cannot be after End Date.');
      return; // Stop the submission
    } else if (startTime > endTime) {
      alert('Start Time cannot be after End Time.');
      return; // Stop the submission
    }
    
    if (checked && cycle <= 0) {
      alert('Invalid cycle date!');
      return;
    }

    const result = await bl.newBlockoutPeriod(thisBlockout, name, startDate, startTime, endDate, endTime, checked, cycle, []);
    console.log(result)
    const isClash = result[0].clash;
    console.log(isClash);
    setAvailable(isClash);
    if (!isClash) {
      window.location.href='/periodCreated';
    }
  }

  return (
      <div className="container">
        <div className="logo">
            <img src={logo} alt="Schedule Manager" />
        </div>
        <h1 className="welcomeMessage">
          Create a new period.
        </h1>
        <div className="loginBox">
          <form className="form" onSubmit={handleSubmit}>
          <label>
            Recurring Event
            <input
              type="checkbox"
              checked={checked}
              onChange={handleToggle}
            />
          </label>
            

            <input
              type="name"
              placeholder="Period Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)} />
  
            <input
              type="date"
              placeholder="Start Date"
              name="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)} />
  
            <input
              type="time"
              placeholder="Start Time"
              name="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)} />
  
            <input
              type="date"
              placeholder="End Date"
              name="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)} />
  
            <input
              type="time"
              placeholder="End Time"
              name="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)} />

            
          {checked && (
            <input
              type="number"
              placeholder="Repeat Cycle"
              name="days"
              value={cycle}
              onChange={(e) => setCycle(Number(e.target.value))}
            />
          )}
            
            {!available && <p className="warning">This clashes with a pre-existing event/period. Please choose a different timing.</p>}

            <button
                type="submit"
                onClick={(e) => handleSubmit(e)}
              >
              Create
            </button>
            </form>
        </div>
      </div>
    );
  // } 
}

export default NewEvent;
