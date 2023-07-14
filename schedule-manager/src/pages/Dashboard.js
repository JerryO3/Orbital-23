import React, { useState, useEffect } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./Dashboard.css";
import * as fn from '../backend/functions'
import CalendarComp from '../components/Calendar';
import ProjectButtons from "../components/ProjectButtons";
import BlockoutButtons from "../components/BlockoutButtons";

function Dashboard() {
  const localizer = momentLocalizer(moment);
  const [userName, setUserName] = useState("")
  const promise = fn.getField('username').then(x => setUserName(x));
  const storedUser = localStorage.getItem('user');

  if (!storedUser) {
      // User is not logged in, redirect to the desired page
      window.location.href = '/';
    };

  return (
    <div>
      <div class="bg-slate-200 sm:flex sm:px-5 h-fit">

        <div class=" bg-slate-200 sm:w-2/5 outline-1 py-10 sm:px-5 h-fit items-center">
          <div class="pb-5">
            <div class="col-start-1 bg-slate-100 h-fit p-5 text-2xl text-center font-medium items-center rounded-2xl">
              <p>What's Up {userName}?</p>
              <p class="text-lg">Next Meeting:</p>
            </div>
          </div>

          <div class="pb-5">
          <p class="font-medium text-2xl">Projects</p>
            <div class="col-start-1 w-fit min-w-full bg-slate-100 h-fit px-10 py-4 items-center rounded-2xl">
            <ProjectButtons />
            </div>
          </div>

          <div class="pb-5">
          <p class="font-medium text-2xl">Block Outs</p>
            <div class="col-start-1 bg-slate-100 h-fit px-10 py-4 items-center rounded-2xl">
            <BlockoutButtons />
            </div>
          </div>
        </div>
        
        <div class="bg-slate-200 sm:w-3/5 h-full sm:py-10 sm:px-5 items-center">
          <div class="col-start-1 bg-slate-100 h-full px-10 pb-20 pt-10 items-center rounded-2xl">
          <p class="font-medium text-2xl pb-4">Calendar</p>
            <CalendarComp />
          </div>
        </div>
        </div>
    </div>
  );
}

export default Dashboard;
