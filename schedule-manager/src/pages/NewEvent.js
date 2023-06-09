import React from "react";
import { useState } from 'react';
import * as authpkg from "firebase/auth";
import { app } from '../backend/Firebase';
import { getDatabase, ref, set, onValue } from "firebase/database";
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function NewEvent() { 
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  // const [hasAttempted, setHasAttempted] = useState(false);

  const thisProject = localStorage.getItem('projectName');
  const thisEvent = localStorage.getItem('eventName');

  const [available, setAvailable] = useState(true);

  function checkAvailability() {
    const db = getDatabase();
    const uniqueId = authpkg.getAuth(app).currentUser.uid;
    const usersRef = ref(db, "/users/" + uniqueId + "/projects/" + thisProject + "/events/");
  
    onValue(usersRef, (snapshot) => {
      const events = snapshot.val();
      if (events !== null) {
        const isTaken = Object.values(events).some(event => event.name === name);
        if (isTaken) {
          setAvailable(!isTaken);
        } else {
          fn.newEventByStartEnd(thisProject, name, startDate, startTime, endDate, endTime);
        }
      } else {
        fn.newEventByStartEnd(thisProject, name, startDate, startTime, endDate, endTime);
      }
    });
  }

  return (
      <div className="container">
        <div className="logo">
            <img src={logo} alt="Schedule Manager" />
        </div>
        <h1 className="welcomeMessage">
          Create a new event.
        </h1>
        <div className="loginBox">
          <form className="form" onSubmit={(e) => e.preventDefault()}>
  
            <input
              type="name"
              placeholder="Event Name"
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
  
            {!available && <p className="warning">This name is already taken. Please choose a different one.</p>}

            <button
                type="submit"
                onClick={
                  () => {
                    checkAvailability();
                        }
                  }
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
