import React, { useState, useRef } from 'react';
import './Settings.css';
import logo from '../assets/logo.png';
import * as fn from '../backend/functions'

function Settings() { // to fix using the new getField
  const [retrievedSettings, setRetrievedSettings] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("");
  const [notificationDuration, setNotificationDuration] = useState(0);
  fn.getField('notificationDuration')
  .then(x => retrievedSettings 
    ? null 
    : x === null 
      ? setNotificationDuration(0) 
      : setNotificationDuration(x)
  )
  .then(() => fn.getField("username")
    .then(x => retrievedSettings 
      ? null 
      : setDisplayName(x)
    )
  )
  .then(() => fn.getField('telegramHandle')
    .then(x => retrievedSettings 
      ? null 
      : x === null 
        ? null
        : setTelegramHandle(x)
    )
  )
  .then(() => setRetrievedSettings(true));

  const handleTelegramHandleChange = (e) => {
    setTelegramHandle(e.target.value);
  };

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  var trimmedTelegramHandle;

  if (telegramHandle.startsWith("@")) {
    trimmedTelegramHandle = telegramHandle.substring(1)
  } else {
    trimmedTelegramHandle = telegramHandle;
  }

  return (
    <div class="flex justify-center items-center h-screen">
   
      <div class="w-fit ">
        <div class="text-xl text-center pb-10">Settings</div>
        <hr></hr>
      <form onSubmit={(e) => e.preventDefault()}>
        <div class="flex justify-between">
          <div class="py-2 pr-4">Display Name:</div>
            <input data-testid="nameForm" type="text" value={displayName} 
            onChange={handleDisplayNameChange} 
            />
        </div>

        <div class="flex justify-between">
          <div class="py-2 pr-4">Telegram Handle:</div>
            <input data-testid="handleForm" type="text" value={telegramHandle} 
            onChange={handleTelegramHandleChange} 
            />
        </div>

        <hr></hr>
        <div class="pt-10">
        <button 
        class="w-full bg-teal-700 text-white rounded-xl"
        data-testid="submitButton"
        type='submit' 
        onClick={() => 
        {fn.updateProfile(displayName, notificationDuration, trimmedTelegramHandle);
        console.log('Settings saved!');}}>Save Changes
        </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Settings;
