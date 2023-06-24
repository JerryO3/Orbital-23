import React from "react";
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import * as bl from '../backend/blockoutFunctions';
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';

function UpdateBlockout() { 
  const [periods, setPeriods] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const thisBlockoutId = localStorage.getItem('blockoutId');
  const thisBlockoutName = localStorage.getItem('blockoutName');
  
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const promise = fn.queryByValue("periods", "blockoutId", thisBlockoutId);
        const result = await promise;
        setPeriods(result);

        const start = await bl.getItem("startDate");
        setStartDate(start);

        const end = await bl.getItem("endDate");
        setEndDate(end);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [thisBlockoutId]);

  const handleStartDateChange = (e) => {
    setStartDate((e.target.value));
  };

  const handleEndDateChange = (e) => {
    setEndDate((e.target.value));
  };

  const handleDateChange = async () => {
    if (startDate > endDate) {
      alert('Start Date cannot be after End Date.');
      return; // Stop the submission
    }
    await bl.updateDate(startDate, endDate);
  };

  // localStorage.removeItem('projectName')

  if (thisBlockoutName === null) { 
    window.location.href = '/viewBlockout'
  } else {
    return (
    <div className="container">
      <div className="logo">
          <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
        Choose an existing period for blockout '{thisBlockoutName}' from {startDate} to {endDate}.
      </h1>
      <div className="loginBox">
          {periods.length > 0 ? (
            <form className="form" onSubmit={(e) => e.preventDefault()}>
              <div>
              <label>
              Start of Blockout:
                    <input type="date" value={startDate} onChange={handleStartDateChange} />
              </label>
              </div>
              <div>
              <label>
              End of Blockout:
                    <input type="date" value={endDate} onChange={handleEndDateChange} />
              </label>
              </div>
              <div>
                  <button onClick={handleDateChange}>
                    Update Blockout Window
                  </button>
                </div>
              {periods.map((period) => (
                <Link to='/updatePeriod'>
                  <button key={period.id} onClick={() =>
                  {localStorage.setItem('periodName', period.name);
                  localStorage.setItem('periodId', period.itemId)}}>
                    {period.name}
                  </button>
                </Link>
              ))}

              <Link to='/newPeriod'>
                  <button>
                    Create New Period
                  </button>
              </Link>

              <Link to='/viewBlockout'>
                  <button>
                    Return to Blockouts
                  </button>
                </Link>
              
              <button
                type="submit"
                onClick={
                  () => {
                        bl.removeBlockout()
                        .then(() => window.location.href='/blockoutCreated');
                        }
                  }
              >
                Delete Blockout
              </button>
            </form>
            ) : (
              <form className="form" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label>
                  Start of Blockout:
                        <input type="date" value={startDate} onChange={handleStartDateChange} />
                  </label>
                  </div>
                  <div>
                  <label>
                  End of Blockout:
                        <input type="date" value={endDate} onChange={handleEndDateChange} />
                  </label>
                  </div>
                  <div>
                  <button onClick={handleDateChange}>
                    Update Blockout Window
                  </button>
                </div>
                <p className='warning'>No Periods Found</p>
                <Link to='/newPeriod'>
                  <button>
                    Create New Period
                  </button>
              </Link>

              <Link to='/viewBlockout'>
                  <button>
                    Return to Blockouts
                  </button>
                </Link>
              
              <button
                type="submit"
                onClick={
                  () => {
                        bl.removeBlockout()
                        .then(() => window.location.href='/blockoutCreated');
                        }
                  }
              >
                Delete Blockout
              </button>
                </form>
                
             )}
      </div>
    </div>
  );
  }
}

export default UpdateBlockout;
