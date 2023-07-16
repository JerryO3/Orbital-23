import React from "react";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import * as col from '../backend/collaboration';
import { ref, getDatabase, onValue} from 'firebase/database'


function ViewBlockout() { 
  const [blockouts, setBlockouts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await fn.getUserId()
        const member = await col.memberQuery(userId, "blockouts/");
        setBlockouts(member);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  });

  return (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
        Choose an existing blockout.
      </h1>
      <div className="loginBox">
          {blockouts.length > 0 ? (
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              {blockouts.map((blockout) => (
                <Link to='/updateBlockout'>
                  <button key={blockout.id} onClick={() => {localStorage.setItem('blockoutId', blockout.itemId);
                localStorage.setItem('blockoutName', blockout.name);}}>
                    {blockout.name}
                  </button>
                </Link>
              ))}
              <Link to='/newBlockout'>
                  <button>
                    Create New Blockout
                  </button>
                </Link>
            </form>
            ) : (
              <form className="form" onSubmit={(e) => e.preventDefault()}>
                <p className='warning'>No Blockouts Found</p>
                <Link to='/newBlockout'>
                  <button>
                    Create New Blockout
                  </button>
                </Link>
                </form>
                
             )}
      </div>
    </div>
  );
}

export default ViewBlockout;
