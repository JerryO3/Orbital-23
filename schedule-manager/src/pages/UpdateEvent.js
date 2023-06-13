import React from "react";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function UpdateEvent() { 
  const [events, setEvents] = useState([]);
  const thisProject = localStorage.getItem('projectName');
  

  useEffect(() => {
    // Fetch the projects data when the component mounts
    fn.readEventsData()
      .then((items) => {
        setEvents(items);
      })
      .catch((error) => {
        console.error("Error retrieving projects:", error);
      });
  }, []);

  // localStorage.removeItem('projectName')

  if (thisProject === null) { 
    window.location.href = '/updateProject'
  } else {
    return (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
        Choose an existing event for project '{thisProject}'.
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
