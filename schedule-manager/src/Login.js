import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './Login.css';
import readData from './readData';
import checkParticulars from './checkParticulars';
import { useState } from 'react';
import { getDatabase, ref, set, child, get } from "firebase/database";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);

  const checkParticulars = (username, password) => {
      const dbRef = ref(getDatabase());
      get(child(dbRef, `users/${username}`))
          .then((snapshot) => snapshot.exists()
              ? snapshot.val().password == password
                ? window.location = "/landing"
                : setHasAttempted(true)
              : setHasAttempted(true)
          )
          .then(() => null)
          .catch((error) => {
              console.error(error);
          })
  }

  {readData(username, password)}

  return (
    <div className="container">
      <div className="logo">
          <img src="logo.svg" alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
        Welcome to Schedule Manager.
        <br></br>
        Please Login to continue.
      </h1>
      <div className="loginBox">
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="username"
            placeholder="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)} />
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} />
          {hasAttempted && <p>Invalid Login Credentials.</p>}
          <button
              type="submit"
              onClick={
                () => {
                        checkParticulars(username, password);
                      }
                }
            >
            Submit
          </button>
          <button type="registrationButton">
            <Link to="/register">Register</Link>
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
