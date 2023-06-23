import React from "react";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import * as bl from "../backend/blockoutFunctions";
import * as lux from "luxon";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function UpdatePeriod() { 
  const thisPeriod = localStorage.getItem('periodName');
  const thisPeriodId = localStorage.getItem('periodId')
  const thisProject = localStorage.getItem('blockoutName');

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState(""); 

  // if (projectName === null || eventName === null) { 
  //     window.location.href = '/updateProject'
  //   } else {

  const handleSubmit = async () => {
    // Validate the form fields
    if (startDate.trim() === '' || startTime.trim() === '' 
    || endDate.trim() === '' || endTime.trim() === '' ) {
      alert('Please fill in all fields.');
      return; // Stop the submission
    }

    const result = await bl.updateBlockoutPeriod(thisPeriodId, thisPeriod, startDate, startTime, endDate, endTime)
    .then(() => window.location.href='/periodCreated');
  };

    return (
      <div className="container">
        <div className="logo">
            <img src={logo} alt="Schedule Manager" />
        </div>
        <h1 className="welcomeMessage">
          Update Period '{thisPeriod}'.
        </h1>
        <div className="loginBox">
          <form className="form" onSubmit={(e) =>e.preventDefault()}>
  
            <input
              type="name"
              placeholder="Period Name"
              name="name"
              value={thisPeriod} />
  
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
  
            <button
                type="submit"
                onClick={
                  () => {
                          handleSubmit();
                        }
                  }
              >
              Update Event
            </button>

            <button
                type="submit"
                onClick={
                  () => {
                          bl.removePeriod();
                        }
                  }
              >
              Delete Event
            </button>
          </form>
        </div>
      </div>
    );
  // } 
}

export default UpdatePeriod;
