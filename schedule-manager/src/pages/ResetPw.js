import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useState } from 'react';
import logo from '../assets/logo.png';
import ReactDOM from 'react-dom/client';
import * as fn from '../backend/functions';

const ResetPw = () => {
    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(true);

    const checkEmail = (email) => {
        const db = getDatabase();
        const usersRef = ref(db, 'users');       
        
        onValue(usersRef, (snapshot) => {
          const users = snapshot.val();
          Object.values(users).some(user => user.email === email)
          ?  fn.sendPasswordResetEmail(email)
          :  setValidEmail(false);
        });
    }

  //   return  (
  //   <div className="container">
  //     <div className="logo">
  //         <img src={logo} alt="Schedule Manager" />
  //     </div>
  //     <h1 className="welcomeMessage">
  //         Email Authentication
  //     </h1>
  //     <div className="loginBox">
  //       <form className="form" onSubmit={(e) => e.preventDefault()}>
  //         <input
  //           type="emailAddress"
  //           placeholder="Email"
  //           name="email" value={email}
  //           onChange={(e) => {
  //             setEmail(e.target.value);
  //             }
  //           } />

  //         <div className="warningBox">
  //           {!validEmail && <p className="warning">No such email found!</p>}
  //         </div>

  //         <button
  //           type="submit"
  //           onClick = {() => {checkEmail(email)}}>
  //           Submit
  //         </button>
  //       </form>
  //     </div>
  //   </div>
  // );

  return (
    <div class="flex justify-center items-center h-screen">
   
      <div class="w-fit ">
      <div class="text-9xl text-center p-10">
          🗒️
          <div class="text-2xl font-semibold pt-10">ScheduleManager</div>
          </div>
        <hr></hr>
          <form onSubmit={(e) => e.preventDefault()}>
            <div class="flex justify-between">
              <div class="py-2 pr-4">Email Authentication:</div>
                <input data-testid="nameForm" type="emailAddress" value={email} 
                onChange={(e) => {
                  setEmail(e.target.value);
                  }} 
                />
            </div>

        <hr></hr>

        <div className="warningBox" class="py-5">
          {!validEmail && <p className="warning">No such email found!</p>}         
        </div>
        
        <button 
        class="w-full bg-teal-700 text-white rounded-xl"
        data-testid="submitButton"
        type='submit' 
        onClick={() => {checkEmail(email)}}>Submit
        </button>
      </form>
    </div>
    </div>
  );
}

export default ResetPw;
