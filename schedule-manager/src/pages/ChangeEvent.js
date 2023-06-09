import React from "react";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import * as lux from "luxon";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function ChangeEvent() { 
  const thisEvent = localStorage.getItem('eventName');
  const thisProject = localStorage.getItem('projectName');

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState(""); 

  // if (projectName === null || eventName === null) { 
  //     window.location.href = '/updateProject'
  //   } else {
    return (
      <div className="container">
        <div className="logo">
            <img src={logo} alt="Schedule Manager" />
        </div>
        <h1 className="welcomeMessage">
          Update Event '{thisEvent}'.
        </h1>
        <div className="loginBox">
          <form className="form" onSubmit={(e) => e.preventDefault()}>
  
            <input
              type="name"
              placeholder="Event Name"
              name="name"
              value={thisEvent} />
  
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
                          fn.newEventByStartEnd(thisProject, thisEvent, startDate, startTime, endDate, endTime);
                        }
                  }
              >
              Update Event
            </button>

            <button
                type="submit"
                onClick={
                  () => {
                          fn.removeEvent();
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

export default ChangeEvent;
