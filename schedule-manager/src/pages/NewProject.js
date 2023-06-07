import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useState } from 'react';
import logo from '../assets/logo.png';
import ReactDOM from 'react-dom/client';
import * as fn from '../backend/functions';

function NewProject() { 
  const [name, setName] = useState("");

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

          <button
            type="submit"
            onClick = {() => {fn.newProject(name)}}>
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default NewProject;
