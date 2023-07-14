import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import './Login.css';
import LoginBox from "../components/LoginBox";
import { useState } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";

function Login() {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
      // User is logged in, redirect to the desired page
      window.location.href = '/dashboard';
  };

  return (
    <LoginBox />
  )
}

export default Login;
