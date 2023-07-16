import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Dashboard.css";
import * as fn from '../backend/functions'
import ProjectButtons from "../components/ProjectButtons";
import BlockoutButtons from "../components/BlockoutButtons";
import * as col from '../backend/collaboration'
import "react-big-calendar/lib/css/react-big-calendar.css";

function Dashboard() {
  const localizer = momentLocalizer(moment);
  const [userName, setUserName] = useState("")
  const promise = fn.getField('username').then(x => setUserName(x));
  const storedUser = localStorage.getItem('user');
  const [projScreenMode, setProjScreenMode] = useState(0);
  const [BOScreenMode, setBOScreenMode] = useState(0);
  const [projState, updateProjState] = useState(0);
  const [BOState, updateBOState] = useState(0);

  function CalendarComp() {
    const storedUser = localStorage.getItem('user');
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
    },[]);
  
    const handleEventClick = (event) => {
      if (event.type === "event") {
        localStorage.setItem('projectId', event.projectId);
        localStorage.setItem('eventId', event.eventId);
        localStorage.setItem('eventName', event.name);
        setProjScreenMode(2);
        updateProjState(Math.random());
      } else {
        localStorage.setItem('blockoutId', event.blockoutId);
        localStorage.setItem('periodName', event.name);
        localStorage.setItem('periodId', event.periodId);
        setBOScreenMode(3);
        updateBOState(Math.random());
      }
      console.log(1)
    };
  
    const eventWrapperComponent = ({ event, children }) => {
      return (
        <button onClick={() => handleEventClick(event)}>
          {children}
        </button>
      );
    };
  
    const EventComponent = ({ event }) => (
      <div>
        <strong>{event.name}</strong>
      </div>
    );

    return (
        <div class="max-h-screen overflow-scroll">
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
            />
        </div>
    )
  }

  if (!storedUser) {
      // User is not logged in, redirect to the desired page
      window.location.href = '/';
    };

  return (
    <div>
      <div class="bg-slate-200 sm:flex sm:px-5 h-fit">

        <div class=" bg-slate-200 sm:w-2/5 outline-1 py-10 sm:px-5 h-fit items-center">
          <div class="pb-5">
            <div class="col-start-1 bg-slate-100 h-fit p-5 text-2xl text-center font-medium items-center rounded-2xl">
              <p>What's Up {userName}?</p>
              <p class="text-lg">Next Meeting:</p>
            </div>
          </div>

          <div class="pb-5">
          <p class="font-medium text-2xl">Projects</p>
            <div key={projState} class="col-start-1 w-fit min-w-full bg-slate-100 h-fit px-10 py-4 items-center rounded-2xl">
            <ProjectButtons dataProp={projScreenMode}/>
            </div>
          </div>

          <div class="pb-5">
          <p class="font-medium text-2xl">Block Outs</p>
            <div key={BOState} class="col-start-1 bg-slate-100 h-fit px-10 py-4 items-center rounded-2xl">
            <BlockoutButtons dataProp={BOScreenMode}/>
            </div>
          </div>
        </div>
        
        <div class="bg-slate-200 sm:w-3/5 h-full sm:py-10 sm:px-5 items-center">
          <div class="col-start-1 bg-slate-100 h-full px-10 pb-20 pt-10 items-center rounded-2xl">
          <p class="font-medium text-2xl pb-4">Calendar</p>
            <CalendarComp />
          </div>
        </div>
        </div>
    </div>
  );
}

export default Dashboard;
