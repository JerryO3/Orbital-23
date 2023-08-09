import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import './Register.css';
import { getDatabase, ref, set, onValue } from "firebase/database";
import { useState } from 'react';
import logo from '../assets/logo.png';
import ReactDOM from 'react-dom/client';
import { registerWithEmailandPw } from "../backend/functions";
import RegisterBox from "../components/RegisterBox";

function Register() {
  return (
    <RegisterBox />
  );
}

export default Register;