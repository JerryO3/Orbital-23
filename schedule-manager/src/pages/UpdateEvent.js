import React from "react";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import * as lux from "luxon";
import * as col from '../backend/collaboration';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function UpdateEvent() { 
  const thisEvent = localStorage.getItem('eventName');
  const thisProject = localStorage.getItem('projectName');
  const thisEventId = localStorage.getItem('eventId');
  const projectId = localStorage.getItem('projectId');

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState(""); 
  const [members, setMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);
  const [eventData, setEventData] = useState(null);

  const [available, setAvailable] = useState(true);

  // fn.getItem('events/', thisEventId)
  // .then(x => Promise.all([
  //   x,
  //   setStartDate(fn.getDate(x.startDateTime)),
  //   setStartTime(fn.getTime(x.startDateTime)),
  //   setEndDate(fn.getDate(x.endDateTime)),
  //   setEndTime(fn.getTime(x.endDateTime))
  // ]))
  // .then(([eventData, startDate, startTime, endDate, endTime]) => {
  //   if (eventData === null) {
  //     setStartDate(startDate);
  //     setStartTime(startTime);
  //     setEndDate(endDate);
  //     setEndTime(endTime);
  //   }
  //   setEventData(eventData);
  // })
  // .catch(error => {
  //   // Handle any errors that occurred during the asynchronous operation
  //   console.error(error);
  // });

  fn.getItem('events/', thisEventId)
  .then(x => eventData === null
    ? setStartDate(fn.getDate(x.startDateTime))
    : null)
  .then(() => fn.getItem('events/', thisEventId)
    .then(x => eventData === null
      ? setStartTime(fn.getTime(x.startDateTime))
      : null))
  .then(() => fn.getItem('events/', thisEventId)
    .then(x => eventData === null
      ? setEndDate(fn.getDate(x.endDateTime))
      : null))
  .then(() => fn.getItem('events/', thisEventId)
    .then(x => eventData === null
      ? setEndTime(fn.getTime(x.endDateTime))
      : null))
  .then(() => col.getMembers("projects/", projectId)
      .then(x => eventData === null
        ? setMembers(x)
        : null))
  .then(col.getMembers("events/", thisEventId)
    .then((x) => {
      if (eventData === null) {
        const itemIds = x.map((item) => item.itemId);
        setSelectedMembers(itemIds);
      }
    }))
  .then(() => fn.getItem('events/', thisEventId)
    .then(x => setEventData(x)))

  // col.getMembers("projects/", projectId)
  // .then(x => setMembers(x))
  
  // col.getMembers("events/", thisEventId)
  // // .map(x => x.itemId)
  // .then(x => x.map(item => item.itemId))

  // // .then(x => console.log(x))
  // .then(x => setSelectedMembers(x))



  if (projectId === null || thisEventId === null) { 
      window.location.href = '/updateProject'
    } else {

  const handleSubmit = async () => {
    // Validate the form fields
    if (startDate.trim() === '' || startTime.trim() === '' 
    || endDate.trim() === '' || endTime.trim() === '' ) {
      alert('Please fill in all fields.');
      return; // Stop the submission
    }

    if (members.length === 0) {
      alert('There must be at least 1 member in this event.');
      return; // Stop the submission
    }

    const result = await fn.newEventByStartEnd(projectId, thisEventId, thisEvent, startDate, startTime, endDate, endTime, members)
    // .then(() => window.location.href='/eventCreated');

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

    return (
      <div className="container">
        <div className="logo">
            <img src={logo} alt="Schedule Manager" />
        </div>
        <h1 className="welcomeMessage">
          Update Event '{thisEvent}'.
        </h1>
        <div className="loginBox">
          <form className="form" onSubmit={(e) =>e.preventDefault()}>
  
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
                          fn.removeEvent().then(() => window.location.href='/eventCreated');
                        }
                  }
              >
              Delete Event
            </button>
          </form>
        </div>
      </div>
    );
  } 
}

export default UpdateEvent;
