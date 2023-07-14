import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import * as fn from "../backend/functions";

function LoginBox() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);

  return (
      <div class="flex items-center bg-slate-50 w-screen h-screen">
            <form class="mx-auto w-96 bg-slate-200 p-4 rounded-2xl" onsubmit={(e) => e.preventDefault()}>
            <div class="text-9xl text-center p-10">
            🗒️
            <div class="text-2xl font-semibold pt-10">ScheduleManager</div>
            </div>
            <div class="py-1">
            <div class="text-xl text-black font-semibold p-1">
              <input class="rounded-2xl px-3 py-1 w-full"
                data-testid="emailForm"
                type="email"
                placeholder="Email"
                name="email"
                value={email}
              onChange={(e) => setEmail(e.target.value)} />
            </div>
            </div>

            <div class="py-1">
            <div class="text-xl text-black font-semibold p-1">
              <input class="rounded-2xl px-3 py-1 w-full"
                type="password"
                placeholder="Password"
                name="password"
                value={password}
                onChange={(e) => {console.log(e); setPassword(e.target.value)}} />
              {hasAttempted && <p>Invalid Login Credentials.</p>}
            </div>
            </div>

              <button type="button" class=" w-full bg-teal-700 text-xl text-center text-white font-semibold p-1 rounded-2xl"
                  onClick={
                      () => {
                        fn.login(email, password);
                        setHasAttempted(true);
                      }
                  }
                >
                Sign In
              </button>

              <Link to="/register">
                <button type="registrationButton" class="w-full pb-1 pt-2">
                  <div class="bg-teal-700 text-xl text-center text-white font-semibold p-1 rounded-2xl">
                  Register
                  </div>
                </button>
              </Link>

              <Link to="/resetPw">
                <button class="w-full py-1">
                  <div class="bg-teal-700 text-xl text-center text-white font-semibold p-1 rounded-2xl">
                  Forgot Your Password?
                  </div>
                </button>
              </Link>

              <button type="button" class="w-full py-1" onClick={() => fn.loginWGoogle()}>
                <div class="bg-teal-700 text-xl text-center text-white font-semibold p-1 rounded-2xl">
                Sign in with Google
                </div>
              </button>
        </form>
    </div>
  );
}

export default LoginBox;