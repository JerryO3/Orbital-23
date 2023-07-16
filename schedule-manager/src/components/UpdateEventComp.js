import React from "react";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import * as lux from "luxon";
import * as col from '../backend/collaboration';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function UpdateEventComp() { 
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

    const result = await fn.newEventByStartEnd(projectId, thisEventId, thisEvent, startDate, startTime, endDate, endTime, selectedMembers)
    .then(x => x === false ? setAvailable(false) : window.location.href='/eventCreated');
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
    <div className="">
        <form onSubmit={(e) =>e.preventDefault()}>
        <div class="flex justify-between text-sm py-4">
          <div class="font-semibold">
            Event Name
          </div>
          <input
            class="w-full"
            type="name"
            placeholder="Event Name"
            name="name"
            value={thisEvent} />
        </div>
        <hr></hr>
        <div class="flex justify-between text-sm py-4">
          <div class="w-20 font-semibold">Start Date and Time</div>
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
        </div>
        <hr></hr>
        <div class="flex justify-between text-sm py-4">
          <div class="w-20 font-semibold">End Date and Time</div>
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
        </div>
        <hr></hr>
        <div class="flex justify-between pt-4">
          <div class="flex">
          <div class="font-semibold flex items-center">Event Members:</div>
          <div class="text-sm px-4 overflow-auto max-h-28">
            {members.map((member) => (
              <form class="form">
                  <button
                  type="button"
                  key={member.id}
                  className={`toggle ${selectedMembers.includes(member.itemId) ? 'selected' : ''}`}
                  onClick={() => toggleMemberSelection(member.itemId)}
                >
                <div class="font-serif text-xs">
                  {member.username}
                  </div>
                </button>
              </form>
              ))}
  
            {!available && <p className="warning">This clashes with a pre-existing event. Please choose a different timing.</p>}
          </div>
          </div>

          <div class="flex content-end font-semibold hover:opacity-70">
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
          </div>
        </div>
      </form>
      <hr></hr>
    </div>
  );
} 

export default UpdateEventComp;
