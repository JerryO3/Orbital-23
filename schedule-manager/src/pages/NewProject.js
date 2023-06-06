import React from "react";
import * as fn from "../backend/functions";


function NewProject() { 
  return (
    <h1>
      Welcome to the NewProject Page!
      <button onClick={() => fn.newProject("test22")}>
      </button>
    </h1>
  );
}

export default NewProject;
