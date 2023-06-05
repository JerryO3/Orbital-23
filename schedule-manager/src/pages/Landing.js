import React, { useState } from "react";
import { firebase, app } from '../backend/Firebase';
import * as authpkg from "firebase/auth";

function Landing() {
  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
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
