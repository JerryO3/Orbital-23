import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Dashboard.css";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import logo from '../assets/logo.png';
import * as fn from '../backend/functions'
import * as col from '../backend/collaboration'

const localizer = momentLocalizer(moment);

function Dashboard() {
  const storedUser = localStorage.getItem('user');
  const promise = fn.getField('username').then(x => setUserName(x));
  const [userName, setUserName] = useState("")
  const [items, setItems] = useState([])
  // const [periods, setPeriods] = useState([]);

  if (!storedUser) {
      // User is not logged in, redirect to the desired page
      window.location.href = '/';
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await fn.getUserId()

        const member = await col.memberQuery(userId, "events/");
        const allEvents = member.map(x => {
          const start = new Date(x.startDateTime); 
          const end = new Date(x.endDateTime);
          const name = x.name;
          const projectId = x.projectId
          const eventId = x.itemId
          const type = "event"
          return { name , start, end, projectId, eventId, type };
        })

        const memberPeriod = await col.memberQuery(userId, "periods/")
        // console.log(memberPeriod)
        const allPeriods = memberPeriod.map(x => {
          const start = new Date(x.startDateTime); 
          const end = new Date(x.endDateTime);
          const name = x.name;
          const blockoutId = x.blockoutId
          const periodId = x.itemId
          const type = "period"
          return { name , start, end, blockoutId, periodId, type };
        })
        setItems([...allEvents, ...allPeriods])
        // console.log(periods);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  });

  const handleEventClick = (event) => {
    if (event.type === "event") {
      // console.log(event);
      localStorage.setItem('projectId', event.projectId);
      localStorage.setItem('eventId', event.eventId);
      window.location.href = "./viewEvent"
    } else {
      // console.log(event);
      localStorage.setItem('blockoutId', event.blockoutId);
      localStorage.setItem('periodName', event.name);
      localStorage.setItem('periodId', event.periodId);
      window.location.href = "./updatePeriod"
      }
  };

  const eventWrapperComponent = ({ event, children }) => {
    return (
      <div onClick={() => handleEventClick(event)}>
        {children}
      </div>
    );
  };

  const EventComponent = ({ event }) => (
    <div>
      <strong>{event.name}</strong>
    </div>
  );

  return (
    <div className="containerDashboard">
      <div className="dashboardContent">
        <div className="calendarcontainer">
          <Calendar
            localizer={localizer}
            events={items}
            views={['month', 'week', 'day']}
            defaultView="week"
            components={{
              eventWrapper: eventWrapperComponent,
              event: EventComponent
            }}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 690 }}
          />
        </div>
        <div className="pageRight">
        <div className="logo">
          <img src={logo} alt="Schedule Manager" />
        </div>
        <h1 className="welcomeMessage">
              Welcome Back '{userName}'
        </h1>
        <div className="buttonsContainer">
          <div className="loginBox">
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              <Link to='/viewProject'>
                <button>
                  View Your Projects
                </button>
              </Link>
              <Link to='/viewBlockout'>
                <button>
                  View Your Blockouts
                </button>
              </Link>
            </form>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
