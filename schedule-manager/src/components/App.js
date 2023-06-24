import logo from '../assets/logo.png';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import * as p from '../pages/pages'
import * as fn from "../backend/functions";
import BackendTest from '../pages/BackendTest';


function App() {
  const storedUser = localStorage.getItem('user');
  return (
    <Router>
      <nav className='navigationBar'>
        <ul className='ul'>
          <ul className='leftItems'>
          <button class="split" type="home">
            <Link to="/"><img src={logo} alt="Schedule Manager" className='navBarLogo'/></Link>
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

              <Link to='/settings'>
              <button>
                Settings
              </button>
              </Link>

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
        <Route path="/" element={<p.Home />} />
        <Route path="/login" element={<p.Login />} />
        <Route path="/register" element={<p.Register />} />
        <Route path="/submit" element={<p.Submit />} />
        <Route path="/dashboard" element={<p.Dashboard />} />
        <Route path="/resetPw" element={<p.ResetPw />} />
        <Route path="/newPw" element={<p.NewPw />} />
        <Route path='/blockout' element={<p.Blockout />} />
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
        <Route path='/addUser' element={<p.AddUser />} />
        <Route path='/userAdded' element={<p.UserAdded />} />
        <Route path='/viewBlockout' element={<p.ViewBlockout />} />
        <Route path='/newBlockout' element={<p.NewBlockout />} />
        <Route path='/newPeriod' element={<p.NewPeriod />} />
        <Route path='/updatePeriod' element={<p.UpdatePeriod />} />
        <Route path='/periodCreated' element={<p.PeriodCreated />} />
        <Route path='/updateBlockout' element={<p.UpdateBlockout />} />
      </Routes>
    </Router>
  );
}

// function NavBar() {
//   const storedUser = localStorage.getItem('user');
//   return (
//     <nav className='navigationBar'>
//     <ul className='ul'>
//       <ul className='leftItems'>
//       <button class="split" type="home" data-testid="homeLogo">
//         <Link to="/"><img src={logo} alt="Schedule Manager" className='logo'/></Link>
//       </button>
//       <text class="split">Schedule Manager</text>
//       </ul>
//       </ul>
//       <ul className='rightItems'>
//         {!storedUser ?
//         (<ul className='rightItems'>
//           <Link to="/login">
//             <button data-testid="loginButton">
//             Login
//             </button>
//           </Link>
          
//           <Link to="/register">
//             <button data-testid="registerButton">
//               Register
//             </button>
//           </Link>
//         </ul>
//         )
//         : 
//         (<ul className='rightItems'>
//           <Link to="/dashboard">
//             <button>
//               Home
//             </button>
//           </Link>

//           <Link to='/settings'>
//           <button>
//             Settings
//           </button>
//           </Link>

//           <button
//             type="logout"
//             onClick={() => {fn.logout()}}
//           >
//             Logout
//           </button>
//         </ul>
//         )
//         }
//         </ul>
//   </nav>
//   )
// }

export default App;

