import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function Submit() { 
  return (
    <body>
      <h1 class = "welcomeMessage">
        An account has been created successfully!
        <br></br>
        Please login to continue.
      </h1>
      <div class = "loginBox">
        <li class = "loginPageButton">
          <Link to="/login">
            <button>
                Login
            </button>
          </Link>
        </li>
      </div>
    </body>
  );
}

export default Submit;
