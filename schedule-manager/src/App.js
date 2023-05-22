import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import Submit from './Submit';

function App() {
  return (
    <Router>
      <nav className='navigationBar'>
        <ul>
          <button class="split" type="home">
            <Link to="/"><img src={logo} alt="Schedule Manager" /></Link>
          </button>
          <text>Schedule Manager</text>
          <button type="register">
            <Link to="/register">Register</Link>
          </button>
          <button type="login">
            <Link to="/login">Login</Link>
          </button>
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
