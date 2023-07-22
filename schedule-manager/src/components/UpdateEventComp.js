import React from "react";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import * as lux from "luxon";
import * as col from '../backend/collaboration';
import { sTTester } from "../backend/checkClash";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import * as time from "../backend/time.js";

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
  const [searchDate, setSearchDate] = useState("");
  const [searchTime, setSearchTime] = useState("");
  const [hours, setHours] = useState("");
  const [minutes, setMinutes] = useState("");

  const [available, setAvailable] = useState(true);
  const [updated, setUpdated] = useState(false);

  // console.log(selectedMembers)

  // fn.getItem('events/', thisEventId)
  // .then(x => eventData === null
  //   ? setStartDate(fn.getDate(x.startDateTime))
  //   : null)
  // .then(() => fn.getItem('events/', thisEventId)
  //   .then(x => eventData === null
  //     ? setStartTime(fn.getTime(x.startDateTime))
  //     : null))
  // .then(() => fn.getItem('events/', thisEventId)
  //   .then(x => eventData === null
  //     ? setEndDate(fn.getDate(x.endDateTime))
  //     : null))
  // .then(() => fn.getItem('events/', thisEventId)
  //   .then(x => eventData === null
  //     ? setEndTime(fn.getTime(x.endDateTime))
  //     : null))
  // .then(() => col.getMembers("projects/", projectId)
  //     .then(x => eventData === null
  //       ? setMembers(x)
  //       : null))
  // .then(col.getMembers("events/", thisEventId)
  //   .then((x) => {
  //     if (eventData === null) {
  //       const itemIds = x.map((item) => item.itemId);
  //       setSelectedMembers(itemIds);
  //     }
  //   }))
  // .then(() => fn.getItem('events/', thisEventId)
  //   .then(x => setEventData(x)))
  
  async function search(e) {
    e.preventDefault();

    // Validate the form fields
    if (searchDate.trim() === '' || searchTime.trim() === '' 
    || hours.trim() === '' || minutes.trim() === '' ) {
      alert('Please fill in all fields.');
      return; // Stop the submission
    }

    if (selectedMembers.length === 0) {
      alert('There must be at least 1 member in this event.');
      return; // Stop the submission
    }    

    const startDateInput = searchDate;
    const startYear = parseInt(startDateInput.substr(0,4), 10);
    const startMonth = parseInt(startDateInput.substr(5,2), 10);
    const startDay = parseInt(startDateInput.substr(8,2), 10);

    const startTimeInput = searchTime;
    const startHour = parseInt(startTimeInput.substr(0,2), 10);
    const startMin = parseInt(startTimeInput.substr(3,2), 10);

    const searchDateTime = time.moment(startYear, startMonth, startDay, startHour, startMin);
    const duration = hours * 3600000 + minutes * 60000
    // console.log(searchDateTime);
    // console.log(duration);
    const result = await sTTester(selectedMembers, searchDateTime, duration, null)
    .then(x => {setStartTime(x[0]); setStartDate(x[1]); setEndTime(x[2]); setEndDate(x[3])})
  }

  fn.getItem('events/', thisEventId)
  .then(x => {
    if(eventData === null) {
      setStartDate(fn.getDate(x.startDateTime));
      setStartTime(fn.getTime(x.startDateTime));
      setEndDate(fn.getDate(x.endDateTime));
      setEndTime(fn.getTime(x.endDateTime));
    }
  })  
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

    if (selectedMembers.length === 0) {
      alert('There must be at least 1 member in this event.');
      return; // Stop the submission
    }

    const result = await fn.newEventByStartEnd(projectId, thisEventId, thisEvent, startDate, startTime, endDate, endTime, selectedMembers)
    .then(x => {setAvailable(x); setUpdated(x); return x}).then(x => console.log(x));
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
        {updated && <div class="text-center font-semibold p-2 text-white bg-teal-500">Event Created!</div>}
        {!available && <p className="warning">Event Creation Failed. One or more team members are unavailable at this timing.</p>}
        
        <div class="sm:flex justify-between text-sm py-4 items-center">
          <div class="font-semibold">
            <div>Suggest a Timing</div>
            <div>(Select Members Below:)</div>
          </div>
          <div>
            <div class="sm:flex justify-between pb-2">
            <div class="sm:px-4">Search From:</div>
              <input
                type="date"
                placeholder="Start Date"
                name="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)} />
              <input
                type="time"
                placeholder="Start Time"
                name="time"
                value={searchTime}
                onChange={(e) => setSearchTime(e.target.value)} />
            </div>
            <div class="sm:flex justify-end">
            <div class="sm:px-4">Duration:</div>
              <div class="sm:px-4">Hours:</div>
              <input
                onKeyDown={(e) => {if (window.innerWidth > 400) {e.preventDefault()} else {}}}
                class="w-10"
                type="number"
                min="0"
                name="hours"
                value={hours}
                onChange={(e) => setHours(e.target.value)} />
              <div class="sm:px-4">Minutes:</div>
              <input
                onKeyDown={(e) => {if (window.innerWidth > 400) {e.preventDefault()} else {}}}
                class="w-10"
                type="number"
                max="60"
                min="0"
                step="5"
                name="minutes"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)} />
            </div>
          </div>
          <button
                  class="font-semibold hover:bg-teal-500 px-2 rounded-xl"
                  type="submit"
                  onClick={
                    (e) => {
                            search(e);
                          }
                    }
                >
                Search!
          </button>
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
