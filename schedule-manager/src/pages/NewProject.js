import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { getDatabase, ref, set, onValue } from "firebase/database";
import * as authpkg from "firebase/auth";
import { app } from '../backend/Firebase';
import { useState } from 'react';
import logo from '../assets/logo.png';
import ReactDOM from 'react-dom/client';
import * as fn from '../backend/functions';

function NewProject() { 
  const [name, setName] = useState("");
  const [available, setAvailable] = useState(true);

  function checkAvailability() {
    const db = getDatabase();
    const uniqueId = authpkg.getAuth(app).currentUser.uid;
    const usersRef = ref(db, "/users/" + uniqueId + "/projects/");
  
    onValue(usersRef, (snapshot) => {
      const projects = snapshot.val();
      if (projects !== null) {
        const isTaken = Object.values(projects).some(project => project.name === name);
        if (isTaken) {
          setAvailable(!isTaken);
        } else {
          fn.newProject(name);
        }
      } else {
        fn.newProject(name);
      }
    });
  }

    return  (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
          Enter Your Project Name
      </h1>
      <div className="loginBox">
        <form className="form" onSubmit={(e) => e.preventDefault()}>

          <input
            type="name"
            placeholder="Project Name"
            name="name" value={name}
            onChange={(e) => {
              setName(e.target.value);
              }
            } />
          
            {!available && <p className="warning">This name is already taken. Please choose a different one.</p>}
          <button
            type="submit"
            onClick = {() => {checkAvailability();}}>
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewProject;
