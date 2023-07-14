import React, { useState, useEffect, PureComponent} from "react";
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import * as fn from '../backend/functions'
import { Container } from "postcss";
import * as bl from '../backend/blockoutFunctions';
import { LabelList, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const mock = [
    {
        prop1 : "Medical Appointment",
        prop2 : "1",
        prop3 : "1"
    },
    {
        prop1 : "CS1101S Class",
        prop2 : "1",
        prop3 : "1"
    },
    {
        prop1 : "Tuition",
        prop2 : "1",
        prop3 : "1"
    },
    {
        prop1 : "Training Schedule",
        prop2 : "1",
        prop3 : "1"
    }
]



export default function BlockoutButtons(BOList) {
    const [mode, setMode] = useState(0);

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
          <div>
            <h1 class="pb-4 text-sm">
              Choose an existing period for blockout '{thisBlockoutName}' from {startDate} to {endDate}.
            </h1>
            <div>
                {periods.length > 0 ? (
                  <form onSubmit={(e) => e.preventDefault()}>
                      <div class="pb-4">
                        <hr></hr>
                        <div class="flex justify-between">
                          <div>
                            Start of Blockout:
                          </div>
                          <input type="date" value={startDate} onChange={handleStartDateChange} />
                        </div>
                        <div class="flex justify-between">
                          <div>
                            End of Blockout:
                          </div>
                          <input type="date" value={endDate} onChange={handleEndDateChange} />
                        </div>
                        <hr></hr>
                      </div> 
                      {periods.map((period) => (
                        <button 
                          type="button"
                          class="w-full flex justify-between"
                          key={period.id} 
                          onClick={() =>
                          {localStorage.setItem('periodName', period.name);
                          localStorage.setItem('periodId', period.itemId);
                          setMode(3)}}>
                          <div>{period.name}</div>
                          <div>
                            <button        
                            type="button" 
                            onClick={() => null}> 
                            {/* 
                            onClick={
                              () => {
                                      bl.removePeriod()
                                      .then(() => window.location.href='/periodCreated');
                                    }
                              }                              
                            */}
                            <div class="opacity-80 hover:opacity-70 bg-sky-700 text-white text-sm font-semibold rounded-xl px-4">
                            Delete Period
                            </div>
                            </button>
                          </div>
                        </button>
                      ))}
                    <div class="flex justify-between py-4 overflow-auto">
                        <button onClick={handleDateChange}>
                        <div class="px-2">
                        <div class="bg-sky-700 w-24 hover:opacity-70 opacity-80 text-sm text-center px-4 text-white font-semibold rounded-2xl">
                            Update Blockout
                        </div>
                        </div>
                        </button>

                        <button
                        onClick={() => {setMode(2)}}>
                        <div class="px-2">
                        <div class="bg-sky-700 w-24 hover:opacity-70 opacity-80 text-sm text-center px-4 text-white font-semibold rounded-2xl">
                            Create Period
                        </div>
                        </div>
                        </button>
                        
                        <button
                        type="submit"
                        onClick={
                            () => {
                                bl.removeBlockout()
                                .then(() => window.location.href='/blockoutCreated');
                                }
                            }
                        >
                        <div class="px-2">
                        <div class="bg-sky-700 w-24 hover:opacity-70 opacity-80 text-sm text-center px-4 text-white font-semibold rounded-2xl">
                            Delete Blockout
                        </div>
                        </div>
                        </button>

                        <button
                        onClick={() => {setMode(0)}}>
                        <div class="px-2">
                        <div class="bg-sky-700 hover:opacity-70 opacity-80 w-24 text-sm text-center px-2 text-white font-semibold rounded-2xl">
                            Back to Blockouts
                        </div>
                        </div>
                        </button>
                    </div>
                  </form>
                  ) : (
                    <form onSubmit={(e) => e.preventDefault()}>
                      <div class="pb-4">
                        <hr></hr>
                        <div class="flex justify-between">
                          <div>
                            Start of Blockout:
                          </div>
                          <input type="date" value={startDate} onChange={handleStartDateChange} />
                        </div>
                        <div class="flex justify-between">
                          <div>
                            End of Blockout:
                          </div>
                          <input type="date" value={endDate} onChange={handleEndDateChange} />
                        </div>
                        <hr></hr>
                      </div> 
                      <p class="pb-4">No Periods Found</p>
                    <hr></hr>
                    <div class="flex justify-between py-4 overflow-auto">
                        <button onClick={handleDateChange}>
                        <div class="px-2">
                        <div class="bg-sky-700 w-24 hover:opacity-70 opacity-80 text-sm text-center px-4 text-white font-semibold rounded-2xl">
                            Update Blockout
                        </div>
                        </div>
                        </button>

                        <button
                        onClick={() => {setMode(2)}}>
                        <div class="px-2">
                        <div class="bg-sky-700 w-24 hover:opacity-70 opacity-80 text-sm text-center px-4 text-white font-semibold rounded-2xl">
                            Create Period
                        </div>
                        </div>
                        </button>
                        
                        <button
                        type="submit"
                        onClick={
                            () => {
                                bl.removeBlockout()
                                .then(() => window.location.href='/blockoutCreated');
                                }
                            }
                        >
                        <div class="px-2">
                        <div class="bg-sky-700 w-24 hover:opacity-70 opacity-80 text-sm text-center px-4 text-white font-semibold rounded-2xl">
                            Delete Blockout
                        </div>
                        </div>
                        </button>

                        <button
                        onClick={() => {setMode(0)}}>
                        <div class="px-2">
                        <div class="bg-sky-700 hover:opacity-70 opacity-80 w-24 text-sm text-center px-2 text-white font-semibold rounded-2xl">
                            Back to Blockouts
                        </div>
                        </div>
                        </button>
                    </div>
                    
                  </form>
                   )}
            </div>
          </div>
        );
        }
      }

    function BlockoutButton({dataProp}) {    
        return(
        <button
        type="button"
        onClick={() => {setMode(1)}}>
        <div class="px-2 ">
            <div class="bg-sky-700 text-sm w-28 text-white font-semibold hover:opacity-70 flex opacity-80 items-center p-4 h-20 rounded-3xl text-center ">
                <div class="text-center w-full">{dataProp.prop1}</div>
            </div>
        </div>
        </button>
        )
    }

    function UpdatePeriod() {
      const thisPeriod = localStorage.getItem('periodName');
      const thisPeriodId = localStorage.getItem('periodId')
      const thisBlockoutId = localStorage.getItem('blockoutId');
    
      const [available, setAvailable] = useState(true);
      const [periodData, setPeriodData] = useState(null);
    
      const [name, setName] = useState("");
      const [startDate, setStartDate] = useState("");
      const [startTime, setStartTime] = useState("");
      const [endDate, setEndDate] = useState("");
      const [endTime, setEndTime] = useState(""); 
      const [checked, setChecked] = useState(false);
      const [cycle, setCycle] = useState(0);
    
      const handleToggle = () => {
        setChecked(!checked);
      };
    
      fn.getItem('periods/', thisPeriodId)
      .then(x => periodData === null
        ? setName(x.name)
        : null)
      .then(() => fn.getItem('periods/', thisPeriodId)
        .then(x => periodData === null
          ? setStartDate(fn.getDate(x.startDateTime))
          : null))
      .then(() => fn.getItem('periods/', thisPeriodId)
        .then(x => periodData === null
          ? setStartTime(fn.getTime(x.startDateTime))
          : null))
      .then(() => fn.getItem('periods/', thisPeriodId)
        .then(x => periodData === null
          ? setEndDate(fn.getDate(x.endDateTime))
          : null))
      .then(() => fn.getItem('periods/', thisPeriodId)
        .then(x => periodData === null
          ? setEndTime(fn.getTime(x.endDateTime))
          : null))
      .then(() => fn.getItem('periods/', thisPeriodId)
        .then(x => setPeriodData(x)))
    
      // console.log(periodData);
    
      const handleSubmit = async () => {
        // Validate the form fields
        if (startDate.trim() === '' || startTime.trim() === '' 
        || endDate.trim() === '' || endTime.trim() === '' ) {
          alert('Please fill in all fields.');
          return; // Stop the submission
        }
    
        if (startDate > endDate) {
          alert('Start Date cannot be after End Date.');
          return; // Stop the submission
        } else if (startTime > endTime) {
          alert('Start Time cannot be after End Time.');
          return; // Stop the submission
        }
    
        const result = await bl.updateBlockoutPeriod(thisBlockoutId, thisPeriodId, name, startDate, startTime, endDate, endTime)
        const isClash = result.clash;
        console.log(!isClash);
        setAvailable(!isClash);
        if (!isClash) {
          window.location.href='/periodCreated';
        }
      };
    
        return (
          <div>
              <form onSubmit={(e) =>e.preventDefault()}>
              
              <div class="flex justify-between text-sm py-4">
                <div class="font-semibold">
                Period Name
                </div>
                <input
                  class="w-full"
                  type="name"
                  placeholder="Period Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)} />
                </div>
                <hr></hr>

                <div class="flex justify-between text-sm py-4">
                <div class="w-20 font-semibold">Start Date and Time</div>
                <input
                  type="date"
                  placeholder="Start Date"
                  name="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)} />
                <input
                  type="time"
                  placeholder="Start Time"
                  name="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)} />
                </div>

                <div class="flex justify-between text-sm py-4">
                <div class="w-20 font-semibold">End Date and Time</div>
                <input
                  type="date"
                  placeholder="End Date"
                  name="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)} />
                <input
                  type="time"
                  placeholder="End Time"
                  name="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)} />
                </div>
                <hr></hr>
      
                <div class="flex justify-between">
                  <div class="flex justify-between text-sm py-4">
                    <div class="flex items-center">
                      <div class="w-20 font-semibold">Recurring Event</div>
                      <div class="pr-4">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={handleToggle}
                        />
                      </div>
                    </div>
                  {checked && (
                    <div class="flex">
                    <div class="pr-4">
                      Number of Days Before Next Event
                    </div>
                    <input
                    class="px-4"
                      type="number"
                      placeholder="Repeat Cycle"
                      name="days"
                      value={cycle}
                      onChange={(e) => setCycle(Number(e.target.value))}
                    />
                    </div>
                  )}
                  </div>

      {!available && <p className="warning">This clashes with a pre-existing event/period. Please choose a different timing.</p>}
    
                <button
                    type="submit"
                    onClick={
                      () => {
                              handleSubmit();
                            }
                      }
                  >
                  Update Period
                </button>
    
                {/* <button
                    type="submit"
                    onClick={
                      () => {
                              bl.removePeriod()
                              .then(() => window.location.href='/periodCreated');
                            }
                      }
                  >
                  Delete Period
                </button> */}
                </div>
              </form>
          </div>
        );
    }

    function CreatePeriod() {
      const user = JSON.parse(localStorage.getItem('user'));
      const userId = user.uid;
    
      const [name, setName] = useState("");
      const [startDate, setStartDate] = useState("");
      const [startTime, setStartTime] = useState("");
      const [endDate, setEndDate] = useState("");
      const [endTime, setEndTime] = useState("");
      const [cycle, setCycle] = useState(0);
      const thisBlockout = localStorage.getItem('blockoutId');
      const [checked, setChecked] = useState(false);
    
      const handleToggle = () => {
        setChecked(!checked);
      };
    
      const [available, setAvailable] = useState(true);
    
      async function handleSubmit(e){
        e.preventDefault();
    
        // Validate the form fields
        if (startDate.trim() === '' || startTime.trim() === '' 
        || endDate.trim() === '' || endTime.trim() === '') {
          alert('Please fill in all fields.');
          return; // Stop the submission
        }
    
        if (startDate > endDate) {
          alert('Start Date cannot be after End Date.');
          return; // Stop the submission
        } else if (startTime > endTime) {
          alert('Start Time cannot be after End Time.');
          return; // Stop the submission
        }
        
        if (checked && cycle <= 0) {
          alert('Invalid cycle date!');
          return;
        }
    
        const result = await bl.newBlockoutPeriod(thisBlockout, name, startDate, startTime, endDate, endTime, checked, cycle, []);
        console.log(result)
        const isClash = result[0].clash;
        console.log(isClash);
        setAvailable(!isClash);
        if (!isClash) {
          window.location.href='/periodCreated';
        }
      }
    
      return (
          <div>
              <form onSubmit={handleSubmit}>
                <div class="flex justify-between text-sm py-4">
                <div class="font-semibold">
                Period Name
                </div>
                <input
                  class="w-full"
                  type="name"
                  placeholder="Period Name"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)} />
                </div>
                <hr></hr>
                <div class="flex justify-between text-sm py-4">
                <div class="w-20 font-semibold">Start Date and Time</div>
                <input
                  type="date"
                  placeholder="Start Date"
                  name="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)} />
                <input
                  type="time"
                  placeholder="Start Time"
                  name="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)} />
                </div>

                <div class="flex justify-between text-sm py-4">
                <div class="w-20 font-semibold">End Date and Time</div>
                <input
                  type="date"
                  placeholder="End Date"
                  name="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)} />
                <input
                  type="time"
                  placeholder="End Time"
                  name="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)} />
                </div>
                <hr></hr>
                <div class="flex justify-between">
                  <div class="flex justify-between text-sm py-4">
                    <div class="flex items-center">
                      <div class="w-20 font-semibold">Recurring Event</div>
                      <div class="pr-4">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={handleToggle}
                        />
                      </div>
                    </div>
                  {checked && (
                    <div class="flex">
                    <div class="pr-4">
                      Number of Days Before Next Event
                    </div>
                    <input
                    class="px-4"
                      type="number"
                      placeholder="Repeat Cycle"
                      name="days"
                      value={cycle}
                      onChange={(e) => setCycle(Number(e.target.value))}
                    />
                    </div>
                  )}
                  </div>
                
                  {!available && <p className="warning">This clashes with a pre-existing event/period. Please choose a different timing.</p>}
    
                  <button
                    class="hover:opacity-70 font-semibold pl-4"
                    type="submit"
                    onClick={(e) => handleSubmit(e)}
                    >
                    Create Period
                  </button>
                </div>
            </form>
          </div>
        );
    }

    function NewBlockout() { 
      const [name, setName] = useState("");
      const [startDate, setStartDate] = useState("");
      const [endDate, setEndDate] = useState("");  
    
      const handleStartDateChange = (e) => {
        setStartDate((e.target.value));
      };
    
      const handleEndDateChange = (e) => {
        setEndDate((e.target.value));
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (startDate.trim() === '' || endDate.trim() === '') {
          alert('Please fill in all fields.');
          return; // Stop the submission
        }
    
        if (startDate > endDate) {
          alert('Start Date cannot be after End Date.');
          return; // Stop the submission
        }
    
        const result = await bl.newBlockout(name, startDate, endDate)
        .then(() => window.location.href='/blockoutCreated');
      }
    
        return  (
        <div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div class="flex justify-between pb-4">
              <div>Blockout Name:</div>
              <input
                type="name"
                placeholder="Blockout Name"
                name="name" value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  }
                } />
              </div>
              <hr></hr>
              
              <div class="py-4">
              <div class="flex justify-between">
                <div>Start of Blockout:</div>
                <input type="date" value={startDate} onChange={handleStartDateChange} />
              </div>
              <div class="flex justify-between">
                <div>End of Blockout:</div>
                <input type="date" value={endDate} onChange={handleEndDateChange} />
              </div>
              </div>
              <hr></hr>

              <div class="flex justify-between pt-4">
              <button
                class="bg-sky-700 opacity-80 rounded-xl px-4 text-white font-semibold hover:opacity-70"
                type="submit"
                onClick = {handleSubmit}>
                Create
              </button>
              <button
                class="bg-sky-700 opacity-80 rounded-xl px-4 text-white font-semibold hover:opacity-70"
                type="submit"
                onClick = {() => {setMode(0)}}>
                Back
              </button>
              </div>
            </form>
        </div>
      );
    }

    BOList = mock;
    if (mode == 4) {
      return <NewBlockout />
    }
    if (mode == 3) {
      return (
        <div>
        <UpdatePeriod />
        <button 
        type="registrationButton" 
        class="w-full h-12 hover:opacity-90"
        onClick={() => {setMode(0)}}>
        {/* use onclick to clear the local storage project and 
            depopulate the event array */}
        <div class="bg-sky-700 opacity-80 text-base text-center px-4 text-white font-semibold rounded-2xl">
        Back to Blockouts
        </div>
        </button>
      </div>
      )
    } else if (mode == 2) {
      return (
        <div>
        <CreatePeriod />
        <button 
        type="registrationButton" 
        class="w-full h-12 hover:opacity-90"
        onClick={() => {setMode(0)}}>
        {/* use onclick to clear the local storage project and 
            depopulate the event array */}
        <div class="bg-sky-700 opacity-80 text-base text-center px-4 text-white font-semibold rounded-2xl">
        Back to Projects
        </div>
        </button>
        </div>
      )
    } else if (mode == 1) {
      return (
        <UpdateBlockout />
      )
    } else {
        return (
        <div class="flex">
        <div class="pr-4">
          <button
            onClick={() => {setMode(4)}}>
            <div class="bg-sky-200 text-sm w-28  font-semibold hover:opacity-70 flex opacity-80 items-center p-4 h-20 rounded-3xl text-center ">
                <div class="text-center w-full">New Block Out</div>
            </div>
          </button>
        </div>
        <div class="flex justify-left overflow-auto">
        {BOList.map(x => (<BlockoutButton dataProp={x}/>))}
        </div>
        </div>
        )
    }
}