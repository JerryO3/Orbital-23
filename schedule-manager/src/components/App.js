import logo from '../assets/logo.png';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import ResetPw from '../pages/ResetPw';
import Submit from '../pages/Submit';
import Dashboard from '../pages/Dashboard';
import NewPw from '../pages/NewPw';
import * as fn from "../backend/functions";


function App() {
  const storedUser = localStorage.getItem('user');

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
            {!storedUser ?
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
              <Link to="/dashboard">
                <button>
                  Home
                </button>
              </Link>

              <button>
                Settings
              </button>
              
              <button
                type="logout"
                onClick={() => {fn.logout()}}
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
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/resetPw" element={<ResetPw />} />
        <Route path="/newPw" element={<NewPw />} />
      </Routes>
    </Router>
  );
}

export default App;
