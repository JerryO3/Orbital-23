import React from "react";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import * as lux from "luxon";
import * as col from '../backend/collaboration';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function ViewEvent() { 
  const thisEvent = localStorage.getItem('eventName');
  const thisEventId = localStorage.getItem('eventId');
  const thisProjectId = localStorage.getItem('projectId')
  const thisProject = localStorage.getItem('projectName');

  // console.log(thisEventId)

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState(""); 
  const [members, setMembers] = useState([]);

  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch event data using the getItem function or any other method you have
        const data = await fn.getItem('events/', thisEventId);
        setEventData(data);

        setStartDate(fn.getDate(data.startDateTime));
        setStartTime(fn.getTime(data.startDateTime));

        setEndDate(fn.getDate(data.endDateTime));
        setEndTime(fn.getTime(data.endDateTime));

        const result = await col.getMembers("events/", thisEventId);
        setMembers(result.map(x => x.telegramHandle));
        
      } catch (error) {
        console.error('Error fetching event data:', error);
      }
    };

    fetchData();
  }, []);

  // if (projectName === null || eventName === null) { 
  //     window.location.href = '/updateProject'
  //   } else {

    return (
      <div className="container">
        <div className="logo">
            <img src={logo} alt="Schedule Manager" />
        </div>
        
        <div className="loginBox">
        <h1 className="welcomeMessage">
          Event: {thisEvent}
        </h1>
        <h1 className="welcomeMessage">
          Date: {startDate}, {startTime} to {endDate}, {endTime}
        </h1>
        <h1 className="welcomeMessage">
          Members:
          <ul>
            {members.map((member) => (
              <li key={member ? member.itemId : null}>{member ? member : "missing telegram handle"}</li>
            ))}
          </ul>
        </h1>
          <form className="form" onSubmit={(e) =>e.preventDefault()}>
            <button
                type="submit"
                onClick={
                  () => {
                          window.location.href='/updateEvent'
                        }
                  }
              >
              Update Event
            </button>
          </form>
        </div>
      </div>
    );
  // } 
}

export default ViewEvent;
