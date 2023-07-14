import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import * as fn from '../backend/functions'
import * as col from '../backend/collaboration'

const localizer = momentLocalizer(moment);

export default function CalendarComp() {
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
  
          const member = null

          // await col.memberQuery(userId, "events/");

          const allEvents = member.map(x => {
            const start = new Date(x.startDateTime); 
            const end = new Date(x.endDateTime);
            const name = x.name;
            const projectId = x.projectId
            const eventId = x.itemId
            const type = "event"
            return { name , start, end, projectId, eventId, type };
          })
  
          const memberPeriod = null;

          // await col.memberQuery(userId, "periods/")
          
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