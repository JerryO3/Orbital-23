import logo from '../assets/logo.png';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import * as p from '../pages/pages'
import * as fn from "../backend/functions";
import BackendTest from '../pages/BackendTest';


function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<p.Home />} />
        <Route path="/login" element={<p.Login />} />
        <Route path="/register" element={<p.Register />} />
        <Route path="/submit" element={<p.Submit />} />
        <Route path="/dashboard" element={<p.Dashboard />} />
        <Route path="/resetPw" element={<p.ResetPw />} />
        <Route path="/newPw" element={<p.NewPw />} />
        <Route path='/blockoutCreated' element={<p.BlockoutCreated />} />
        <Route path='/settings' element={<p.Settings />} />
        <Route path='/newProject' element={<p.NewProject />} />
        <Route path='/newEvent' element={<p.NewEvent />} />
        <Route path='/eventCreated' element={<p.EventCreated />} />
        <Route path='/updateProject' element={<p.UpdateProject />} />
        <Route path='/updateEvent' element={<p.UpdateEvent />} />
        <Route path='/projectCreated' element={<p.ProjectCreated />} />
        <Route path='/viewProject' element={<p.ViewProject />} />
        <Route path='/TestingPage' element={<BackendTest />} />
        <Route path='/manageMembers' element={<p.ManageMembers />} />
        <Route path='/userAdded' element={<p.UserAdded />} />
        <Route path='/viewBlockout' element={<p.ViewBlockout />} />
        <Route path='/newBlockout' element={<p.NewBlockout />} />
        <Route path='/newPeriod' element={<p.NewPeriod />} />
        <Route path='/updatePeriod' element={<p.UpdatePeriod />} />
        <Route path='/periodCreated' element={<p.PeriodCreated />} />
        <Route path='/viewEvent' element={<p.ViewEvent />} />
        <Route path='/updateBlockout' element={<p.UpdateBlockout />} />
      </Routes>
    </Router>
  );
}

function Header() {
  return (
    <div>
    <header class="bg-teal-700 text-white sticky top-0 z-10">
        <section class="max-w-7xl mx-auto p-4 flex justify-between items-center">
            <h1 class="text-3xl font-medium">
              <a href="">🗒️ScheduleManager</a>
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
      <button class="text-5xl sm:hidden focus:outline-none"> &#9776; </button>
      <nav class="hidden sm:block space-x-8 text-xl font-semibold" aria-label="main">
          <a href="/login" class="hover:opacity-90 p-4">Login</a>
          <a href="/register" class="hover:opacity-90 p-4">Register</a>
      </nav>
      </div>
    )
}

function LoggedInNav() {
  return (
    <div>
    <button class="text-5xl sm:hidden focus:outline-none"> &#9776; </button>
    <nav class="hidden sm:block space-x-8 text-xl font-semibold" aria-label="main">
        <a href="/dashboard" class="hover:opacity-90 p-4">Home</a>
        <a href="/settings" class="hover:opacity-90 p-4">Settings</a>
        <button onClick={() => fn.logout()} class="hover:opacity-90 p-4">Log Out</button>
    </nav>
    </div>
  )
}

export default App;

