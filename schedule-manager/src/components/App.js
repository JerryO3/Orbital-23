import logo from '../assets/logo.png';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ResetPw from '../pages/ResetPw';
import Submit from '../pages/Submit';
import Landing from '../pages/Landing';
import NewPw from '../pages/NewPw'
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
              <Link to="/login">
                <button>
                Login
                </button>
              </Link>
              
              <Link to="/register">
                <button>
                  Register
                </button>
              </Link>
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
