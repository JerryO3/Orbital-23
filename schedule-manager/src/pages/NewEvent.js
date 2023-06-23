import React from "react";
import { useState, useEffect } from 'react';
import * as authpkg from "firebase/auth";
import { app } from '../backend/Firebase';
import { getDatabase, ref, set, onValue } from "firebase/database";
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import * as col from '../backend/collaboration';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function NewEvent() { 
  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user.uid;

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const thisProject = localStorage.getItem('projectId');

  const [available, setAvailable] = useState(true);

  async function handleSubmit(e){
    e.preventDefault();

    // Validate the form fields
    if (startDate.trim() === '' || startTime.trim() === '' 
    || endDate.trim() === '' || endTime.trim() === '' ) {
      alert('Please fill in all fields.');
      return; // Stop the submission
    }

    const result = await fn.newEventByStartEnd(thisProject, name, startDate, startTime, endDate, endTime, members)
    .then(() => window.location.href='/eventCreated');

    setAvailable(result);

    if(result) {
      window.location.href='/eventCreated';
    }
  };

  const toggleMemberSelection = (memberId) => {
    if (selectedMembers.includes(memberId)) {
      // If the member is already selected, remove it from the selected members
      setSelectedMembers(selectedMembers.filter((id) => id !== memberId));
    } else {
      // If the member is not selected, add it to the selected members
      setSelectedMembers([...selectedMembers, memberId]);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await col.getMembers();
        setMembers(result);
        // console.log(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  });

  return (
      <div className="container">
        <div className="logo">
            <img src={logo} alt="Schedule Manager" />
        </div>
        <h1 className="welcomeMessage">
          Create a new event.
        </h1>
        <div className="loginBox">
        {members.length > 0 ? (
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
            
            {members.map((member) => (
                  <button
                  key={member.id}
                  className={`toggle ${selectedMembers.includes(member.itemId) ? 'selected' : ''}`}
                  onClick={() => toggleMemberSelection(member.itemId)}
                >
                  {member.telegramHandle}
                </button>
              ))}
  
            {!available && <p className="warning">This clashes with a pre-existing event. Please choose a different timing.</p>}

            <button
                type="submit"
                onClick={(e) => handleSubmit(e)}
              >
              Create
            </button>
          </form>
        ) : (
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
            
            <button
                type="submit"
                onClick={(e) => handleSubmit(e)}
              >
              Create
            </button>
            </form>
        )}
        </div>
      </div>
    );
  // } 
}

export default NewEvent;
