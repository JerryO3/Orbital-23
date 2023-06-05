import logo from './logo.png';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from '../Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ResetPw from '../ResetPw';
import Gmail from '../Gmail';
import Submit from '../Submit';
import Landing from '../Landing';
import NewPw from '../NewPw'
import goTo from "../goTo";
import { isLoggedIn } from '../pages/Login';
import { useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");
  const [userForReset, setUserForReset] = useState(localStorage.getItem("user") === "");

  const handleLogout = () => {
    // Perform logout logic here
    // For example, clear the user session and update the logged-in state
    localStorage.setItem("isLoggedIn", "false");
    setLoggedIn(false);
    window.location.href = '/'
  };

  const clearUser = () => {
    localStorage.setItem("user", "");
    setUserForReset("");
  }

  return (
    <Router>
      <nav className='navigationBar'>
        <ul className='ul'>
          <ul className='leftItems'>
          <button class="split" type="home">
            <Link to="/"><img src={logo} alt="Schedule Manager" className='logo'/></Link>
          </button>
          <text class="split">Schedule Manager</text>
          </ul>
          </ul>

          <ul className='rightItems'>
            {!loggedIn ?
            (<ul className='rightItems'>
              <button
                type="login"
                onClick={() => goTo("/login")}
              >
                Login
              </button>

              <button
                type="register"
                onClick={() => goTo("/register")}
              >
                Register
              </button>
            </ul>
            )
            : 
            (<ul className='rightItems'>
              <button
                type="logout"
                onClick={() => {handleLogout()}}
              >
                Logout
              </button>
            </ul>
            )
            }
            </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gmail" element={<Gmail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/resetPw" element={<ResetPw />} />
        <Route path="/newPw" element={<NewPw />} />
      </Routes>
    </Router>
  );
}

export default App;
