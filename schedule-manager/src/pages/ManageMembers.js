import React, { useState, useEffect } from "react";
import { getDatabase, ref, set, onValue } from "firebase/database";
import { app } from '../backend/Firebase';
import * as col from '../backend/collaboration';
import * as fn from '../backend/functions';
import logo from '../assets/logo.png';

function ManageMembers() {
  const [name, setName] = useState("@");
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
    await col.addUser(name)
    .then(window.location.href = "/userAdded");
  };

  const handleRemoveMember = async () => {
    await fn.removeFromProject(selectedMembers, thisProject)
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
    <div className="container">
      <div className="logo">
        <img src={logo} alt="Schedule Manager" />
      </div>
      <h1 className="welcomeMessage">
        Here are the current members of the project.
      </h1>

      <div className="loginBox">
        <form className="form" onSubmit={(e) => e.preventDefault()}>
          <h1 className="welcomeMessage">
            Members:
            <ul>
              {members.map((member) => (
                <li key={member.itemId}>
                  <input
                    type="checkbox"
                    checked={selectedMembers.includes(member.itemId)}
                    onChange={() => handleMemberSelection(member.itemId)}
                  />
                  {member.telegramHandle}
                </li>
              ))}
            </ul>
          </h1>
          <input
            type="name"
            placeholder="Telegram Handle"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button type="button" onClick={handleAddMember}>
            Add Member
          </button>
          <button type="button" onClick={handleRemoveMember}>
            Remove Member
          </button>
        </form>
      </div>
    </div>
  );
}

export default ManageMembers;
