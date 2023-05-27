import React, { useState } from "react";

function Landing() {
  const [loggedIn, setLoggedIn] = useState(localStorage.getItem("isLoggedIn") === "true");

  if (!loggedIn) {
      // User is not logged in, redirect to the desired page
      window.location.href = '/';
    };

  return (
    <h1>
      Welcome back!
    </h1>
  ); // or render any loading message or component here
}

export default Landing;
