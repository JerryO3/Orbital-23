import React, { useState, useEffect, PureComponent} from "react";
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import * as fn from '../backend/functions'
import { Container } from "postcss";
import { LabelList, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import UpdateEventComp from "./UpdateEventComp";
import NewEventComp from "./NewEventComp";
import * as col from '../backend/collaboration';
import * as t from "../backend/time";
import * as lux from "luxon";

export default function ProjectButtons({dataProp}) {
  // console.log(dataProp)
  const [name, setName] = useState("");
  const [mode, setMode] = useState(dataProp);
  const [newProj, setNewProj] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [projects, setProjects] = useState([]);
  const [state, updateState] = useState(0);
  const [fetch, callFetch] = useState(0);

  var projectList = projects;

  useEffect(() => {
    const updater = () => {
      delay(1000).then(() => updateState(1));
    }
    updater()
  },[state])

  useEffect(() => {
    const updateWidth = () => {
        if (window.innerWidth < 1280) {setWidth(window.innerWidth * 3)}
        else {setWidth(window.innerWidth)}
    }
    window.addEventListener('resize', updateWidth);


    return(() => {
        window.removeEventListener('resize', updateWidth);
    })
  }, [width, state])

  useEffect(() => {
    const fetchData = async () => {

        const userId = await fn.getUserId()
        const member = await col.memberQuery(userId, "/projects/");
        const proj = member
          .map(x => {fn.queryByValue("events", "projectId", x.itemId)
            .then(y => {x.events = y; return x;})
            .then(x => {x.numEvents = x.events.length; return x;})
            .then(x => {x.eventsDone = x.events.filter(e => e.endDateTime < t.nowMillis()); x.numEventsDone = x.eventsDone.length; return x;})
            .then(x => {localStorage[x.itemId] = JSON.stringify(x); return x}) 
            // .then(x => {localStorage["projectName"] = x.name})
          return x;});
          // console.log(localStorage);
        setProjects(proj);
        

    };
    fetchData();
  },[mode, newProj, fetch]);


  function ButtonAndChart({dataProp}) {
    // console.log(dataProp.name)
    return (
      <>
      <div class="flex justify-end">
      <button 
        type="button" 
        class="max-h-20 flex"
        onClick={() => { localStorage['projectId'] = dataProp.itemId; localStorage['projectName'] = dataProp.name; setMode(1);}}> 
      <div class=" text-base max-h-20 font-semibold">
      {dataProp.name}
      </div>
      <div key={state} class="ml-auto">
      <BarChart width={width * 0.2} height={60} data={[dataProp]} layout="vertical">
        <XAxis type="number" domain={[0, dataProp.numEvents]}/>
        <YAxis type='category' dataKey='numEventsDone' />
        <Tooltip />
        <Bar barSize={15} 
            layout="vertical" 
            dataKey="numEventsDone" 
            fill="#82ca9d">
            <LabelList dataKey="v" />
            </Bar>
      </BarChart>
      </div>
      </button>
      </div>
      <hr></hr>
      </>
    ) 
  }

  function ManageMembers() {
    const [email, setEmail] = useState("");
    const [members, setMembers] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
  
    const thisProject = localStorage.getItem('projectId');
  
    const handleMemberSelection = (memberId) => {
      setSelectedMembers((prevSelectedMembers) => {
        // Check if the member is already selected
        const isSelected = prevSelectedMembers.includes(memberId);
  
        // Update the selected members array based on selection
        if (isSelected) {
          return prevSelectedMembers.filter((selectedId) => selectedId !== memberId);
        } else {
          return [...prevSelectedMembers, memberId];
        }
      });
    };
  
    const handleAddMember = async () => {
      await col.addUser(email)
      .then(updateState(Math.random()))
      // .then(window.location.href = "/userAdded");
    };
  
    const handleRemoveMember = async () => {
      await fn.removeFromProject(selectedMembers, thisProject)
      .then(updateState(Math.random()))
      // .then(window.location.href = "/userAdded");
    };
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const result = await col.getMembers("projects/", thisProject);
          setMembers(result);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, [thisProject]);
  
    return (
      <div>
        <form onSubmit={(e) => e.preventDefault()}>
          <div class="pb-4 font-semibold">{localStorage.getItem("projectName")} Members:</div>
          <hr></hr>
          <div key={state} class="flex py-4 justify-between">
            <ul>
              {members.map((member) => (
                <li key={member.itemId}>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.itemId)}
                    onChange={() => handleMemberSelection(member.itemId)}
                  />
                  {member.username}
                </li>
              ))}
            </ul>
            <button type="button" onClick={handleRemoveMember}>
            <div class=" hover:bg-red-500 text-base text-center px-4 font-semibold rounded-2xl">
            Remove Member
            </div>
            </button>
          </div>
          <hr></hr>
          <div class="flex justify-between pt-4">
          <input
            type="email"
            placeholder="Email Address"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="button" onClick={handleAddMember}>
            <div class=" hover:bg-teal-500 text-base text-center px-4 font-semibold rounded-2xl">
            Add Member
            </div>
          </button>
          </div>
        </form>
      </div>
    );
  }

  // console.log(localStorage)

  function EventButton({dataProp}) {
    const[names, setNames] = useState([]);

    Object.keys(dataProp.members).map(x => col.getName(x))
    .reduce((x,y) => (x.then(a => y.then(b => Array.isArray(a[0]) ? a.concat([b]) : [a,b]))))
    .then(x => setNames(x))
    
    return (
      <div key={state} class="flex py-1 px-4">
      <button 
        class="w-full"
        type="button" 
        onClick={() => {localStorage['eventId'] = dataProp.itemId; 
                        localStorage['eventName'] = dataProp.name;
                        setMode(2);}}>
      <div class="grid grid-cols-2 p-2 hover:opacity-80 bg-slate-200 rounded-2xl text-sm">
      <div class="font-bold">
        <div>{dataProp.name}</div>
        <div>{lux.DateTime.fromMillis(dataProp.startDateTime).toLocaleString(lux.DateTime.DATETIME_SHORT)+"-"}</div>
        <div>{lux.DateTime.fromMillis(dataProp.endDateTime).toLocaleString(lux.DateTime.DATETIME_SHORT)}</div>
      </div>
      <div class="overflow-auto flex-col">
      {Array.isArray(names) ? names.map(x => (<div>{x}</div>)) : names}
      </div>
      </div>
      </button>
      <button        
        type="button" 
        onClick={() => {
          localStorage['eventId'] = dataProp.itemId; 
          localStorage['eventName'] = dataProp.name;
          // console.log(localStorage['eventId']); 
          // console.log(localStorage['eventName']);
          fn.removeEvent().then(() => setMode(0))
        }}
        > 
        {/* delete event function above^ */}
      <div class="hover:bg-red-500 h-full text-center font-semibold rounded-xl">
      Delete Event
      </div>
      </button>
      </div>
    )
  }
  // ^ use above to map the event array into components

  function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
  }

  // delay(1000).then(() => updateState(1))

  async function delayedStateChange() {
    return delay(1000).then(() => updateState(Math.random()));
  }

  if (mode ==5) {
    delay(1000).then(() => setMode(1));
    return (
    <div class="text-center font-semibold p-2 text-white bg-teal-500">Event Created!</div>
    )
  } else if (mode == 4) {
    return (
      <div>
      <ManageMembers />
      <button 
      type="button" 
      class="w-full pt-4"
      onClick={() => setMode(1)}>
      <div class="bg-teal-500 hover:opacity-90 text-base text-center px-4 text-white font-semibold rounded-2xl">
      Back to Events
      </div>
      </button>
      </div>
    )
  } else if (mode == 3) {
    return (
    <div>
      <div class="py-4">
      <NewEventComp />
      </div>
      <button 
        type="registrationButton" 
        class="w-full "
        onClick={() => setMode(1)}>
        <div class="bg-teal-500 hover:opacity-90 text-base text-center px-4 text-white font-semibold rounded-2xl">
        Back to Events
        </div>
      </button>
    </div>
    )
  } else if (mode == 2) {
    return (
    <div>
      <div class="py-4">
      <UpdateEventComp />
      </div>
      <button 
        type="registrationButton" 
        class="w-full "
        onClick={() => setMode(1)}
        >
        <div class="bg-teal-500 hover:opacity-90 text-base text-center px-4 text-white font-semibold rounded-2xl">
        Back to Events
        </div>
      </button>
    </div>
    )
  } else if (mode == 1) {
    return (
      <div key={state}>
      <div class="font-semibold px-4 pb-4 flex justify-between">
        <div class="bg-teal-500 py-2 px-4 rounded-xl w-full flex justify-between">
          <div class="text-white font-bold text-lg">{localStorage.getItem('projectName')}</div>
          <button 
            type="registrationButton" 
            class="w-fit max-w-9 px-2"
            onClick={() => {
              localStorage.removeItem(localStorage["projectId"]);
              delayedStateChange(); 
              fn.removeProject().then(() => setMode(0))}}>
            <div class=" hover:bg-red-500 text-base text-center px-4  font-semibold rounded-2xl">
            Delete Project
            </div>
          </button>
        </div>
      </div>
      <div class="max-h-96 overflow-auto">
      {JSON.parse(localStorage.getItem(localStorage.getItem('projectId'))) 
        ? JSON.parse(localStorage.getItem(localStorage.getItem('projectId'))).events.map(x => (<EventButton dataProp={x}/>))
        : null} 
      </div>
      <div class="flex justify-evenly pt-4">
      <button type="registrationButton" 
      class="w-fit max-w-9 "
      onClick={() => {setMode(3)}}>
        <div class="bg-teal-500 hover:opacity-90 text-base text-center px-4 text-white font-semibold rounded-2xl">
        New Event
        </div>
      </button>
      <button 
        type="registrationButton" 
        class="w-fit max-w-9 px-2"
        onClick={() => {setMode(4)}}>
        <div class="bg-teal-500 hover:opacity-90 text-base text-center px-4 text-white font-semibold rounded-2xl">
        Members
        </div>
      </button>
      <button 
        type="registrationButton" 
        class="w-fit max-w-9 h-12 hover:opacity-90"
        onClick={() => {
          setMode(0); 
          localStorage['projectId'] = null;
          localStorage['projectName'] = null;
          updateState(Math.random());
        }}>
        <div class="bg-teal-500 text-base text-center px-4 text-white font-semibold rounded-2xl">
        Back to Projects
        </div>
      </button>
      </div>
      </div> 
      )
  } else {
    return (
      <div class="flex-col">
          {newProj && 
                <div class="flex justify-between text-sm py-4">
                <div class="font-semibold pr-4">
                  New Project Name
                </div>
                <input
                  class="w-full p-4"
                  type="name"
                  placeholder="New Project Name"
                  name="name"
                  onChange={(e) => { setName(e.target.value)}}
                  value={name} />
                <button 
                  key={state}
                  type="registrationButton" 
                  class="pb-4"
                  onClick={() => {
                    fn.newProject(name).then(() => setNewProj(false)).then(() => updateState(Math.random()));
                  }}>
                  <div class="pl-4">
                    <div class="w-full hover:opacity-70 text-base font-semibold text-center px-4 h-full rounded-2xl">
                    Create Project
                    </div>
                  </div>
                </button>
              </div>
        }
        <button 
          type="registrationButton" 
          class="w-full pb-4"
          onClick={() => {updateState(Math.random()); newProj ? setNewProj(false) : setNewProj(true)}}>
          <div class="bg-teal-500 w-full hover:opacity-90 text-base text-center px-4 text-white font-semibold rounded-2xl">
          {newProj ? "Back":"New Project"}
          </div>
        </button>
        <div class="overflow-y-auto scroll-px-0.5 h-72">
        {projectList.map(x => (< ButtonAndChart dataProp={x} />))}
        </div>
        {/* <button onClick={() => localStorage.clear()}>Debug Button to Clear Local Storage (log in again)</button> */}
      </div>
      )
  }



}