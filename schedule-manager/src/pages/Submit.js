import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import logo from '../assets/logo.png';

function Submit() { 
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
      // User is logged in, redirect to the desired page
      window.location.href = '/dashboard';
  };
  
  return (
      <div class="flex items-center bg-slate-50 w-screen h-screen">
        <form class="mx-auto w-96 bg-slate-200 p-4 rounded-2xl" onSubmit={(e) => e.preventDefault()}>
          <div class="text-9xl text-center p-10">
          🗒️
          <div class="text-2xl font-semibold pt-10">ScheduleManager</div>
          <div class="text-xl font-semibold pt-10">Account Created Successfully!</div>
          </div>
          <div class="py-1">

            <Link to="/login">
              <button type="registrationButton" class="w-full pb-1 pt-2">
                <div class="bg-teal-700 text-xl text-center text-white font-semibold p-1 rounded-2xl">
                  Login
                </div>
              </button>
            </Link>
          </div>
        </form>
    </div>
  );
}

export default Submit;
