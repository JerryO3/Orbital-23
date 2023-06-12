import React from "react";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function UpdateProject() { 
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    // Fetch the projects data when the component mounts
    fn.readProjectsData()
      .then((items) => {
        setProjects(items);
      })
      .catch((error) => {
        console.error("Error retrieving projects:", error);
      });
  }, []);

  return (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
        Choose an existing project.
      </h1>
      <div className="loginBox">
          {projects.length > 0 ? (
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              {projects.map((project) => (
                <Link to='/updateEvent'>
                  <button key={project.id} onClick={() => localStorage.setItem('projectName', project.name)}>
                    {project.name}
                  </button>
                </Link>
              ))}
              <Link to='/newProject'>
                  <button>
                    Create New Project
                  </button>
                </Link>
            </form>
            ) : (
              <form className="form" onSubmit={(e) => e.preventDefault()}>
                <p className='warning'>No Projects Found</p>
                <Link to='/newProject'>
                  <button>
                    Create New Project
                  </button>
                </Link>
                </form>
                
             )}
      </div>
    </div>
  );
}

export default UpdateProject;