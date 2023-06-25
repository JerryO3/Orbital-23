import React from "react";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import * as bl from "../backend/blockoutFunctions";
import * as col from '../backend/collaboration';
import * as lux from "luxon";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function UpdatePeriod() { 
  const thisPeriod = localStorage.getItem('periodName');
  const thisPeriodId = localStorage.getItem('periodId')
  const thisBlockoutId = localStorage.getItem('blockoutId');

  const [available, setAvailable] = useState(true);
  const [periodData, setPeriodData] = useState(null);

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState(""); 

  fn.getItem('periods/', thisPeriodId)
  .then(x => periodData === null
    ? setStartDate(fn.getDate(x.startDateTime))
    : null)
  .then(() => fn.getItem('periods/', thisPeriodId)
    .then(x => periodData === null
      ? setStartTime(fn.getTime(x.startDateTime))
      : null))
  .then(() => fn.getItem('periods/', thisPeriodId)
    .then(x => periodData === null
      ? setEndDate(fn.getDate(x.endDateTime))
      : null))
  .then(() => fn.getItem('periods/', thisPeriodId)
    .then(x => periodData === null
      ? setEndTime(fn.getTime(x.endDateTime))
      : null))
  .then(() => fn.getItem('periods/', thisPeriodId)
    .then(x => setPeriodData(x)))

  const handleSubmit = async () => {
    // Validate the form fields
    if (startDate.trim() === '' || startTime.trim() === '' 
    || endDate.trim() === '' || endTime.trim() === '' ) {
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

    const result = await bl.updateBlockoutPeriod(thisBlockoutId, thisPeriodId, thisPeriod, startDate, startTime, endDate, endTime)
    const isClash = result[0].clash;
    console.log(isClash);
    setAvailable(isClash);
    if (!isClash) {
      window.location.href='/periodCreated';
    }
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
          <form className="form" onSubmit={(e) =>e.prperiodDefault()}>
  
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
  
  {!available && <p className="warning">This clashes with a pre-existing event/period. Please choose a different timing.</p>}

            <button
                type="submit"
                onClick={
                  () => {
                          handleSubmit();
                        }
                  }
              >
              Update Period
            </button>

            <button
                type="submit"
                onClick={
                  () => {
                          bl.removePeriod()
                          .then(() => window.location.href='/periodCreated');
                        }
                  }
              >
              Delete Period
            </button>
          </form>
        </div>
      </div>
    );
  // } 
}

export default UpdatePeriod;
