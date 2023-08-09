import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './Register.css';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useState } from 'react';
import logo from '../assets/logo.png';
import ReactDOM from 'react-dom/client';

function NewPw() {
  return (
    <div class="flex items-center bg-slate-50 w-screen h-screen">
    <form class="mx-auto w-96 bg-slate-200 p-4 rounded-2xl" onSubmit={(e) => e.preventDefault()}>
      <div class="text-9xl text-center p-10">
      🗒️
      <div class="text-2xl font-semibold pt-10">ScheduleManager</div>
      <div class="text-xl font-semibold pt-10">A link has been sent to your email!</div>
      </div>
    </form>
</div>
  );
}

export default NewPw;