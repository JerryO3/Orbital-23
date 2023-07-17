import React, { useState, useRef } from 'react';
import './Settings.css';
import logo from '../assets/logo.png';
import * as fn from '../backend/functions'

function Settings() { // to fix using the new getField

  // const [darkMode, setDarkMode] = useState(false);
  // const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [retrievedSettings, setRetrievedSettings] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [telegramHandle, setTelegramHandle] = useState("@");
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

  // const [profilePhoto, setProfilePhoto] = useState(null);
  // const fileInputRef = useRef(null);

  // const handleProfilePhotoChange = (e) => {
  //   const file = e.target.files[0];
  //   setProfilePhoto(file);
  // };

  // const handleProfileImageClick = () => {
  //   fileInputRef.current.click();
  // };

  // const handleDarkModeToggle = () => {
  //   setDarkMode(!darkMode);
  // };

  const handleTelegramHandleChange = (e) => {
    setTelegramHandle(e.target.value);
  };

  const handleNotificationDurationChange = (e) => {
    setNotificationDuration(Number(e.target.value));
  };

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  return (
    <div class="flex justify-center items-center h-screen">
   
      <div class="w-fit ">
        <div class="text-xl text-center pb-10">Settings</div>
        <hr></hr>
      <form onSubmit={(e) => e.preventDefault()}>
        <div class="flex justify-between">
          <div class="py-2 pr-4">Display Name:</div>
            <input type="text" value={displayName} 
            onChange={handleDisplayNameChange} 
            />
        </div>

        <div class="flex justify-between">
          <div class="py-2 pr-4">Notification Duration:</div>
            <input type="number" value={notificationDuration} 
            onChange={handleNotificationDurationChange} 
            />
        </div>

        <div class="flex justify-between">
          <div class="py-2 pr-4">Telegram Handle:</div>
            <input type="text" value={telegramHandle} 
            onChange={handleTelegramHandleChange} 
            />
        </div>

        {/* <div>
          <label className='toggle'>
            Dark Mode:
            <button className={`toggle-button ${darkMode ? 'active' : ''}`} onClick={handleDarkModeToggle}>
              <span className="toggle-button-inner" />
              <span className="toggle-button-switch" />
            </button>
          </label>
        </div>
        <div>
          <label className='toggle'>
            Enable Notifications:
            <button className={`toggle-button ${notificationEnabled ? 'active' : ''}`} onClick={handleNotificationToggle}>
              <span className="toggle-button-inner" />
              <span className="toggle-button-switch" />
            </button>
          </label>
          {notificationEnabled && (
            <div>
              <label>
                Notification Duration:
                <input type="number" value={notificationDuration} onChange={handleNotificationDurationChange} />
              </label>
            </div>
          )}
        </div> */}
        <hr></hr>
        <div class="pt-10">
        <button 
        class="w-full bg-teal-700 text-white rounded-xl"
        type='submit' 
        onClick={() => 
        {fn.updateProfile(displayName, notificationDuration, telegramHandle);
        console.log('Settings saved!');}}>Save Changes
        </button>
        </div>
      </form>
    </div>
    </div>
  );
}

export default Settings;
