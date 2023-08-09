import React from "react";
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import * as p from '../pages/pages'
import * as fn from "../backend/functions";
import LoginBox from "./LoginBox";


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<p.Home />} />
        <Route path="/login" element={<p.Login />} />
        <Route path="/loginBox" element={<LoginBox />} />
        <Route path="/register" element={<p.Register />} />
        <Route path="/submit" element={<p.Submit />} />
        <Route path="/dashboard" element={<p.Dashboard />} />
        <Route path="/resetPw" element={<p.ResetPw />} />
        <Route path="/newPw" element={<p.NewPw />} />
        <Route path='/settings' element={<p.Settings />} />
      </Routes>
    </Router>
  );
}

function Header() {
  return (
    <div>
    <header class="bg-teal-700 text-white sticky top-0 z-10">
        <section class="max-w-7xl mx-auto p-4 lg:flex justify-between items-center">
            <h1 class="text-xl lg:text-3xl font-medium">
            <Link to="/">
              <a data-testid="navLanding" href="/">🗒️ScheduleManager</a>
            </Link>
            </h1>
            <NavBar />
        </section>
    </header>
    </div>
  )
}

function NavBar() {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    return (<LoggedInNav />)
  } else {
    return (<LoggedOutNav />)
  }
}

function LoggedOutNav() {
    return (
      <div>
      {/* <button class="text-5xl sm:hidden focus:outline-none"> &#9776; </button> */}
      <nav class="space-x-8 text-sm lg:text-xl font-semibold" aria-label="main">
        <Link to="/login">
          <a data-testid="navLogin" href="/login" class="hover:opacity-90 p-3">Login</a>
        </Link>            
        <Link to="/register">
          <a data-testid="navRegister" href="/register" class="hover:opacity-90 p-3">Register</a>
        </Link>
      </nav>
      </div>
    )
}

function LoggedInNav() {
  return (
    <div>
    {/* <button class="text-5xl sm:hidden focus:outline-none"> &#9776; </button> */}
    <nav class="space-x-8 text-sm lg:text-xl font-semibold" aria-label="main">
      <Link to="/dashboard">
        <a data-testid="navHome" href="/dashboard" class="hover:opacity-90 p-3">Home</a>
      </Link>  
      <Link to="/settings">
        <a data-testid="navSettings" href="/settings" class="hover:opacity-90 p-3">Settings</a>
      </Link>
        <button data-testid="navLogout" onClick={() => fn.logout()} class="hover:opacity-90 p-3">Log Out</button>
    </nav>
    </div>
  )
}

export default App;

