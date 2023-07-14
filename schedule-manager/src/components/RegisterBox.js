import React from "react";
import { Link } from 'react-router-dom';
import { getDatabase, ref, onValue } from "firebase/database";
import { useState } from 'react';
import logo from '../assets/logo.png';
import { registerWithEmailandPw } from "../backend/functions";

function RegisterBox() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [usernameAvailable, setUsernameAvailable] = useState(true);
  const [emailAvailable, setEmailAvailable] = useState(true);

  const [usernameLength, setUsernameLength] = useState(0);
  const [emailChar, setEmailChar] = useState(false);
  const [passwordChar, setPasswordChar] = useState(false);
  const [confirmPasswordMatch, setConfirmPasswordMatch] = useState(false);

  const [usernameAttempt, setUsernameAttempt] = useState(false);
  const [emailAttempt, setEmailAttempt] = useState(false);
  const [passwordAttempt, setPasswordAttempt] = useState(false);
  const [confirmPasswordAttempt, setConfirmPasswordAttempt] = useState(false);

  const [hasAttempted, setHasAttempted] = useState(false);

  function checkAvailability(fieldName, value, setAvailability) {
    const db = getDatabase();
    const usersRef = ref(db, 'users');
    
    onValue(usersRef, (snapshot) => {
      const users = snapshot.val();
      if (users !== null) {
        const isTaken = Object.values(users).some(user => user[fieldName] === value);
        setAvailability(!isTaken);
      }
    });
  }

  function checkEmailChar(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailPattern.test(email);
    setEmailChar(isValid);
  }

  function checkPasswordChar(password) {
    const isValid = password.length >= 8 && /\d/.test(password) && /[a-zA-Z]/.test(password);
    setPasswordChar(isValid);
  }

  function checkPasswordMatch(password, confirmPassword) {
    setConfirmPasswordMatch(confirmPassword == password);
  }

  function allChecks() {
    if (usernameAvailable 
      && emailAvailable 
      && usernameLength > 0 
      && emailChar 
      && passwordChar 
      && confirmPasswordMatch) {
        return registerWithEmailandPw(username, email, password);
      } else {
        setHasAttempted(true);
      }
  }

  return (
        <div class="flex items-center bg-slate-50 w-screen h-screen">
        <form class="mx-auto w-96 bg-slate-200 p-4 rounded-2xl" onsubmit={(e) => e.preventDefault()}>
        <div class="text-9xl text-center p-10">
        🗒️
        <div class="text-2xl font-semibold pt-10">ScheduleManager</div>
        </div>
        <div class="py-1">
        <div class="text-xl text-black font-semibold p-1">
        <input class="rounded-2xl px-3 py-1 w-full"
            type="username" 
            placeholder="Username" 
            name="username" 
            value={username}
            onClick = {() => setUsernameAttempt(true)}
            onChange={(e) => {
              setUsername(e.target.value);
              setUsernameLength(e.target.value.length)
              }
            } />
        </div>
        </div>

        <div class="py-1">
        <div class="text-xl text-black font-semibold p-1">
        <input class="rounded-2xl px-3 py-1 w-full"
            type="emailAddress" 
            placeholder="Email" 
            name="email" value={email} 
            onClick={() => setEmailAttempt(true)}
            onChange={(e) => {
              setEmail(e.target.value);
              checkAvailability("email", e.target.value, setEmailAvailable);
              checkEmailChar(e.target.value)
              }
            } />
        </div>
        </div>

        <div class="py-1">
        <div class="text-xl text-black font-semibold p-1">
        <input class="rounded-2xl px-3 py-1 w-full"
            type="password" 
            placeholder="Password" 
            name="password" 
            value={password} 
            onClick={() => setPasswordAttempt(true)}
            onChange={(e) => {
              setPassword(e.target.value)
              checkPasswordChar(e.target.value)
              checkPasswordMatch(e.target.value, confirmPassword)
              } 
            } />
        </div>
        </div>

        <div class="py-1">
        <div class="text-xl text-black font-semibold p-1">
        <input class="rounded-2xl px-3 py-1 w-full"
            type="password" 
            placeholder="Confirm Password" 
            name="confirmPassword" 
            value={confirmPassword}
            onClick={() => setConfirmPasswordAttempt(true)}
            onChange={(e) => {
              setConfirmPassword(e.target.value)
              checkPasswordMatch(password, e.target.value)
              }
            } />
        </div>
        </div>

        <div className="warningBox">
        {!usernameAvailable && <p className="warning">This username is already taken. Please choose a different one.</p>}
        {!emailAvailable && emailAttempt && <p className="warning">This email is already in use. Please use a different one.</p>}
        {!emailChar && emailAttempt && <p className="warning">Invalid email.</p>}
        {!passwordChar && passwordAttempt && <p className="warning">Password must be at least 8 characters long and contain both letters and numbers.</p>}
        {!confirmPasswordMatch && confirmPasswordAttempt && <p className="warning">Password does not match.</p>}
        </div>

        <Link to="/login">
            <button type="login" class="w-full pb-1 pt-2">
            <div class="bg-teal-700 text-xl text-center text-white font-semibold p-1 rounded-2xl">
            Already Have an Account?
            </div>
            </button>
        </Link>

        <button 
            type="button" 
            class=" w-full bg-teal-700 text-xl text-center text-white font-semibold p-1 rounded-2xl"
            onClick = {() => {allChecks();}}>
            Submit
        </button>

    </form>
    </div>
  );
}

export default RegisterBox;