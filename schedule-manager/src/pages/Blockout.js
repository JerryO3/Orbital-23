import React from "react";
import { useState } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import './Blockout.css'
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function Blockout() { 
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  // const [hasAttempted, setHasAttempted] = useState(false);

  return (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
        Set a Blockout Period.
      </h1>
      {successfulCreation && <p className="successful">Blockout Created Successfully!</p>}
      <div className="loginBox">
        <form className="form" onSubmit={(e) => e.preventDefault()}>

          <input
            type="name"
            placeholder="Blockout Name"
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

          <button
              type="submit"
              onClick={
                () => {
                        fn.newBlockoutByStartEnd(name, startDate, startTime, endDate, endTime);
                        setSuccessfulCreation(true);
                      }
                }
            >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default Blockout;
