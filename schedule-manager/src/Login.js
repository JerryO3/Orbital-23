import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './Login.css';
import Gmail from "./Gmail";
import readData from './readData';
import checkParticulars from './checkParticulars';
import App from "./App";
import { useState } from 'react';
import { getDatabase, ref, set, child, get } from "firebase/database";
import Landing from "./Landing";
import logo from './logo.png';

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);

  const navigate = useNavigate();

  // const checkParticulars = (username, password) => {
  //     const dbRef = ref(getDatabase());
  //     get(child(dbRef, `users/${username}`))
  //         .then((snapshot) => snapshot.exists()
  //             ? snapshot.val().password == password
  //               ? isLoggedIn = true
  //               : setHasAttempted(true)
  //             : setHasAttempted(true)
  //         )
  //         .then(isLoggedIn? <Link to={Landing}></Link> : null)
  //         .then(() => null)
  //         .catch((error) => {
  //             console.error(error);
  //         })
  // }

  const checkParticulars = (username, password) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${username}`))
        .then((snapshot) => {
          if(snapshot.exists()) {
            if(snapshot.val().password == password){
              localStorage.setItem("isLoggedIn", "true");
              window.location.href = '/landing';
            }
            setHasAttempted(true)
          }

          setHasAttempted(true)
        })
        .then(() => null)
        .catch((error) => {
            console.error(error);
        })
}

  {readData(username, password)}

  return (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
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
        
          <Link to="/register">
            <button type="registrationButton">
              Register
            </button>
          </Link>

          {/* <Link to="/gmail">
            <button type="gmailLogin" >
            Sign in with Google
            </button>
          </Link> */}
        </form>
      </div>
    </div>
  );
}

export default Login;
