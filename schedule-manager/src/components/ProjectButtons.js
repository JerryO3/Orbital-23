import React, { useState, useEffect, PureComponent} from "react";
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import * as fn from '../backend/functions'
import { Container } from "postcss";
import { LabelList, BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import UpdateEventComp from "./UpdateEventComp";
import NewEventComp from "./NewEventComp";
import * as col from '../backend/collaboration';

const dataMock = [
    {
      ProjName: "Outdoor Cooking",
      t:"",
      v: "56.66%",
      e: 17,
      te: 30
    },
    {
      ProjName: "Algorithms Class",
      t:"",
      v: "56.66%",
      e: 17,
      te: 30
    },
    {
      ProjName: "Project 3",
      t:"",
      v: "56.66%",
      e: 17,
      te: 30
    },
    {
      ProjName: "Project 4",
      t:"",
      v: "56.66%",
      e: 17,
      te: 30
    },
    {
      ProjName: "Project 4",
      t:"",
      v: "56.66%",
      e: 17,
      te: 30
    },
    {
      ProjName: "Project 4",
      t:"",
      v: "56.66%",
      e: 17,
      te: 30
    }
  ]

  var totalEvents=30;

const eventMock = [
  {
    eventName: 'Event 1',
    eventTime: '1000-1200',
    eventMembers: ["A", "B"]
  },
  {
    eventName: 'Event 2',
    eventTime: '1300-1600',
    eventMembers: ["A", "B"]
  },
  {
    eventName: 'Event 3',
    eventTime: '1300-1600',
    eventMembers: ["A", "B"]
  },
  {
    eventName: 'Event 4',
    eventTime: '1300-1600',
    eventMembers: ["A", "B"]
  }
]

// mock data^

export default function ProjectButtons(projectList) {

  var eventList = eventMock;
  projectList = dataMock;

  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [mode, setMode] = useState(0);
  const [newProj, setNewProj] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const updateWidth = () => {
        setWidth(window.innerWidth)
    }
    window.addEventListener('resize', updateWidth);


    return(() => {
        window.removeEventListener('resize', updateWidth);
    })
  }, [width])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await fn.getUserId()
        const member = await col.memberQuery(userId, "projects/");
        setProjects(member);
        // console.log(member);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (projects.length > 0) {
    projectList = projects
  }

  console.log(projects)

  function ButtonAndChart({dataProp}) {
    return (
      <>
      <div class="flex justify-center">
      <button 
        type="button" 
        class="max-h-20"
        onClick={() => {setMode(1)}}> 
        {/* use onclick to set the local storage project and 
        populate the event array */}
      <div class=" text-base text-center max-h-20 font-semibold">
      {dataProp.ProjName}
      </div>
      </button>
      <div class="ml-auto">
      <BarChart width={width * 0.25} height={60} data={[dataProp]} layout="vertical">
        <XAxis type="number" domain={[0, totalEvents]}/>
        <YAxis type='category' dataKey='t' />
        <Tooltip />
        <Bar barSize={15} 
            layout="vertical" 
            dataKey="e" 
            fill="#82ca9d">
            <LabelList dataKey="v" />
            </Bar>
      </BarChart>
      </div>
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
      .then(window.location.href = "/userAdded");
    };
  
    const handleRemoveMember = async () => {
      await fn.removeFromProject(selectedMembers, thisProject)
      .then(window.location.href = "/userAdded");
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
          <div class="flex py-4 justify-between">
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

  function EventButton({dataProp}) {
    return (
      <div class="py-1 px-4">
      <button 
        class="w-full"
        type="button" 
        onClick={() => {setMode(2)}}>
      <div class="grid grid-cols-3 p-2 hover:opacity-80 bg-slate-200 rounded-2xl text-sm">
      <div class="font-bold">
        <div>{dataProp.eventName}</div>
        <div>{dataProp.eventTime}</div>
      </div>
      <div class="overflow-auto">
      {dataProp.eventMembers.map(x => (<div>{x}</div>))}
      </div>
      <button        
        type="button" 
        onClick={() => null}> 
        {/* delete event function above^ */}
      <div class="hover:opacity-80 bg-teal-500 text-white font-semibold rounded-xl">
      Delete Event
      </div>
      </button>
      </div>
      </button>
      </div>
    )
  }
  // ^ use above to map the event array into components

  if (mode == 4) {
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
      <>
      <div class="font-semibold px-4 pb-4">{localStorage.getItem('projectName')}</div>
      {eventList.map(x => (<EventButton dataProp={x}/>))} 
      {/*^ map the event array to <EventButton /> above  */}
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
        onClick={() => {setMode(0)}}>
        {/* use onclick to clear the local storage project and 
            depopulate the event array */}
        <div class="bg-teal-500 text-base text-center px-4 text-white font-semibold rounded-2xl">
        Back to Projects
        </div>
      </button>
      </div>
      </> 
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
                  onChange={(e) => {console.log(e); setName(e.target.value)}}
                  value={name} />
                <button 
                  type="registrationButton" 
                  class="pb-4"
                  onClick={() => {
                    // create new project
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
          onClick={() => {newProj ? setNewProj(false) : setNewProj(true)}}>
          <div class="bg-teal-500 w-full hover:opacity-90 text-base text-center px-4 text-white font-semibold rounded-2xl">
          {newProj ? "Back":"New Project"}
          </div>
        </button>

        <div class="overflow-y-auto scroll-px-0.5 h-72">
        {projectList.map(x => (< ButtonAndChart dataProp={x} />))}
        </div>
      </div>
      )
  }



}