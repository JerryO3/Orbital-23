import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "./styles/calendarStyling.css";
import "./Dashboard.css";
import * as fn from '../backend/functions'
import ProjectButtons from "../components/ProjectButtons";
import BlockoutButtons from "../components/BlockoutButtons";
import * as col from '../backend/collaboration'
import { onValue, ref, getDatabase } from "firebase/database";

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
      fetchData();
    },[]);

    useEffect(() => onValue(ref(getDatabase(), "membership/" + fn.getUserId() + "/events"), x => {fetchData(); console.log(items)}),[])

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

    const handleEventClick = (event) => {
      if (event.type === "event") {
        
        localStorage.setItem('projectId', event.projectId);
        localStorage.setItem('projectName', JSON.parse(localStorage[event.projectId]).name)
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
      // console.log(1)
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
          <div class="flex justify-between w-full">
            <p class="font-medium lg:text-2xl pb-4">Calendar</p>
            <button 
              class="pb-4"
              onClick={() => fetchData()}>
              <div class="font-medium lg:text-base rounded-xl px-2 hover:bg-teal-500">Refresh🔄</div>
            </button>
          </div>
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

  function Notifs() {
    const [notifs, setNotifs] = useState([]);

    useEffect(() => {
      async function Notifiables() {
        return [
          fn.getField('telegramHandle').then(x => x ? () => null : 
          () => [
            "Telegram Handle not Updated",
            () => window.location.href="/settings"
            ]
          ),
          fn.getField('username').then(x => x ? () => null : 
            () => [
              "Display Name not Updated",
              () => window.location.href="/settings"
            ]
          ),
          fn.getField('telegramHandle').then(x => x !== "" ? () => null : 
            () => [
              "telegramHandle not Updated",
              () => window.location.href="/settings"
            ]
          ),
          fn.getField('username').then(x => x !== "" ? () => null : 
            () => [
              "Display Name not Updated",
              () => window.location.href="/settings"
            ]
          )
        ]
        .reduce((x,y) => (x.then(a => y.then(b => Array.isArray(a) ? a.concat([b]) : [a,b]))))
        // .then(x => console.log(x))
        .then(x => x.map(y => y()))
        .then(x => x.filter(y => y !== null))
        // .then(x => console.log(x))
        .then(x => setNotifs(x))
      // list of notifiable items that will be mapped to Notifs
      }
      console.log(Notifiables());
    },[])

    return notifs.length > 0 
      ? notifs.map(x => 
          {
            const obj = {}; 
            obj.message = x[0]; 
            obj.action = x[1]; 
            return obj;
          }
        ).map(x => (<Notif dataProp={x}/>))
      : (<div class="text-sm pt-4">No Actions Required. You're all set!</div>)
  }

  function Notif({dataProp}) {
    return (
      <div data-testid="notifs" class="pt-2">
      <div class="flex justify-between text-sm bg-slate-200 rounded-xl">
        <div class="p-2">{dataProp.message}</div>
        <button class="p-2 hover:bg-red-500 rounded-xl" onClick={() => dataProp.action()}>Manage</button>
      </div>
      </div>
    )
  }

  if (!storedUser) {
      // User is not logged in, redirect to the desired page
      window.location.href = '/';
    };

  return (
    <div>
      <div class="bg-slate-200 xl:flex sm:px-5 h-fit">

        <div class=" bg-slate-200 xl:w-2/5 outline-1 py-10 sm:px-5 h-fit items-center">
          <div class="pb-5">
            <div class="col-start-1 bg-slate-100 h-fit p-2 sm:p-5 sm:text-2xl text-center font-medium items-center rounded-2xl">
              <p class="pb-4">What's Up {userName}?</p>
              <div>
              <p data-testid="notifs" class="w-full text-lg flex">Notifications:</p>
              <hr></hr>
              <Notifs />
              </div>
            </div>
          </div>

          <div class="pb-5">
          <p data-testid="projs" class="font-medium lg:text-2xl">Projects</p>
            <div key={projState} class="col-start-1 w-fit min-w-full bg-slate-100 h-fit px-3 sm:px-10 py-4 items-center rounded-2xl">
            <ProjectButtons dataProp={projScreenMode}/>
            </div>
          </div>

          <div data-testid="blockouts" class="pb-5">
          <p class="font-medium lg:text-2xl">Block Outs</p>
            <div key={BOState} class="col-start-1 bg-slate-100 h-fit px-3 sm:px-10 py-4 items-center rounded-2xl">
            <BlockoutButtons dataProp={BOScreenMode}/>
            </div>
          </div>
        </div>
        
        <div class="bg-slate-200 xl:w-3/5 h-full xl:py-10 sm:px-5 items-center">
          <div data-testid="calendar" class="col-start-1 bg-slate-100 h-full sm:px-10 pb-20 sm:pt-10 items-center rounded-2xl">
            <CalendarComp />
          </div>
        </div>
        </div>
    </div>
  );
}

export default Dashboard;
