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
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
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
