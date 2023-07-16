import React from "react";
import { useState, useEffect } from 'react';
import * as authpkg from "firebase/auth";
import { app } from '../backend/Firebase';
import { getDatabase, ref, set, onValue } from "firebase/database";
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import * as col from '../backend/collaboration';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function NewEventComp() { 
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
  const [created, setCreated] = useState(false);

  // console.log(members[0]);
  async function handleSubmit(e){
    e.preventDefault();

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

    const result = await fn.newEventByStartEnd(thisProject, null, name, startDate, startTime, endDate, endTime, selectedMembers)
    .then(x => {setAvailable(x); setCreated(x);})
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

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await col.getMembers("projects/", thisProject);
        setMembers(result);
        // console.log(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  });

  if (thisProject === null) {
    window.location.href = '/viewProjects'
  } else {
  return (
      <div className="">
        {members.length > 0 ? (
        <div>
        <form onSubmit={(e) =>e.preventDefault()}>
        <div class="flex justify-between text-sm pb-4">
          <div class="font-semibold">
            Event Name
          </div>
          <input
            class="w-full"
            type="name"
            placeholder="Event Name"
            name="name"
            value={name}
            onChange={(e) => {console.log(e); setName(e.target.value)}} />
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
        {created && <div class="text-center font-semibold p-2 text-white bg-teal-500">Event Created!</div>}
        {!available && <p className="warning">Event Creation Failed. One or more team members are unavailable at this timing.</p>}
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
                  (e) => {
                          handleSubmit(e);
                        }
                  }
              >
              Create Event
            </button>
          </div>
        </div>
      </form>
      <hr></hr>
      </div>
        ) : (
        <div>
        <form onSubmit={(e) =>e.preventDefault()}>
        <div class="flex justify-between text-sm pb-4">
          <div class="font-semibold">
            Event Name
          </div>
          <input
            class="w-full"
            type="name"
            placeholder="Event Name"
            name="name"
            value={name} />
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
        {created && <div class="text-center font-semibold p-2 text-white bg-teal-500">Event Created!</div>}
        {!available && <p className="warning">Event Creation Failed. One or more team members are unavailable at this timing.</p>}
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
              Create Event
            </button>
          </div>
        </div>
      </form>
      <hr></hr>
      </div>
        )}
      </div>
    );
  } 
}

export default NewEventComp;
