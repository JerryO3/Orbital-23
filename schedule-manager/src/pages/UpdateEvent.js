import React from "react";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function UpdateEvent() { 
  const [events, setEvents] = useState([]);
  const thisProjectId = localStorage.getItem('projectId');
  const thisProjectName = localStorage.getItem('projectName');
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const promise = fn.queryByField("events", "projectId", thisProjectId);
        const result = await promise;
        setEvents(result);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [thisProjectId]);
  //   setEvents(fn.queryByField("events", "projectId", thisProjectId));
  // })

  // localStorage.removeItem('projectName')
  console.log(events);

  if (thisProjectName === null) { 
    window.location.href = '/updateProject'
  } else {
    return (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
        Choose an existing event for project '{thisProjectName}'.
      </h1>
      <div className="loginBox">
          {events.length > 0 ? (
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              {events.map((event) => (
                <Link to='/changeEvent'>
                  <button key={event.id} onClick={() =>
                  localStorage.setItem('eventName', event.name)}>
                    {event.name}
                  </button>
                </Link>
              ))}

              <Link to='/newEvent'>
                  <button>
                    Create New Event
                  </button>
              </Link>

              <Link to='/updateProject'>
                  <button>
                    Return to Projects
                  </button>
                </Link>
              
              <button
                type="submit"
                onClick={
                  () => {
                          fn.removeProject();
                        }
                  }
              >
                Delete Project
              </button>
            </form>
            ) : (
              <form className="form" onSubmit={(e) => e.preventDefault()}>
                <p className='warning'>No Events Found</p>
                <Link to='/newEvent'>
                  <button>
                    Create New Event
                  </button>
                </Link>

                <Link to='/updateProject'>
                  <button>
                    Return to Projects
                  </button>
                </Link>
                
                <button
                type="submit"
                onClick={
                  () => {
                          fn.removeProject();
                        }
                  }
                >
                  Delete Project
                </button>
                </form>
                
             )}
      </div>
    </div>
  );
  }
}

export default UpdateEvent;
