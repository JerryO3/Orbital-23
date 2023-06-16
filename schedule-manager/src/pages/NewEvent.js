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

  const thisProject = localStorage.getItem('projectId');

  const [available, setAvailable] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the form fields
    if (startDate.trim() === '' || startTime.trim() === '' 
    || endDate.trim() === '' || endTime.trim() === '' ) {
      alert('Please fill in all fields.');
      return; // Stop the submission
    }

    setAvailable(fn.newEventByStartEnd(thisProject, name, startDate, startTime, endDate, endTime));

    if(available) {
      window.location.href='/eventCreated';
    }
  };

  // function checkAvailability() {
  //   const db = getDatabase();
  //   const uniqueId = authpkg.getAuth(app).currentUser.uid;
  //   const usersRef = ref(db, "/users/" + uniqueId + "/projects/" + thisProject + "/events/");

  //   onValue(usersRef, (snapshot) => {
  //     const events = snapshot.val();
  //     if (events !== null) {
  //       const isTaken = Object.values(events).some(event => event.name === name);
  //       if (isTaken) {
  //         setAvailable(!isTaken);
  //       } else {
  //         fn.newEventByStartEnd(thisProject, name, startDate, startTime, endDate, endTime);
  //       }
  //     } else {
  //       fn.newEventByStartEnd(thisProject, name, startDate, startTime, endDate, endTime);
  //     }
  //   });
  // }

  console.log(thisProject);
  console.log(1)
  return (
      <div className="container">
        <div className="logo">
            <img src={logo} alt="Schedule Manager" />
        </div>
        <h1 className="welcomeMessage">
          Create a new event.
        </h1>
        <div className="loginBox">
          <form className="form" onSubmit={handleSubmit}>
  
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
  
            {!available && <p className="warning">This clashes with a pre-existing event. Please choose a different timing.</p>}

            <button
                type="submit"
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
