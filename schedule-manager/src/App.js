import logo from './logo.png';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Submit from './Submit';
import goTo from "./goTo";

function App() {
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

          <ul className='rightItems'>
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
        </ul>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/submit" element={<Submit />} />
      </Routes>
    </Router>
  );
}

export default App;
