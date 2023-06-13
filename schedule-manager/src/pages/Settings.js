import React, { useState, useRef } from 'react';
import './Settings.css';
import logo from '../assets/logo.png';
import * as fn from '../backend/functions'

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const [notificationDuration, setNotificationDuration] = useState(0);
  const [displayName, setDisplayName] = useState(fn.getUsername());
  const [profilePhoto, setProfilePhoto] = useState(null);
  const fileInputRef = useRef(null);

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    setProfilePhoto(file);
  };

  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleNotificationToggle = () => {
    setNotificationEnabled(!notificationEnabled);
  };

  const handleNotificationDurationChange = (e) => {
    setNotificationDuration(Number(e.target.value));
  };

  const handleDisplayNameChange = (e) => {
    setDisplayName(e.target.value);
  };

  return (
    <div className="container">
      {/* <div>
      <div className="logo" onClick={handleProfileImageClick}>
        {profilePhoto ? (
          <img src={URL.createObjectURL(profilePhoto)} alt="Profile" />
        ) : (
          <img src={logo} alt="Profile" />
        )}
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePhotoChange}
            style={{ display: 'none' }}
            ref={fileInputRef}
            />
      </div>
      </div> */}

      <h1 className="welcomeMessage">
          Settings
      </h1>

      
      <div className="loginBox">
      <form className='form' onSubmit={(e) => e.preventDefault()}>
        <div>
          <label>
            Display Name:
            <input type="text" value={displayName} onChange={handleDisplayNameChange} />
          </label>
        </div>

        <div>
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
        </div>
        
        <div>
          <button type="submit">Telegram</button>
        </div>

        <button type='submit' onClick={() => 
        {fn.updateProfile(displayName, profilePhoto, darkMode, notificationEnabled, notificationDuration);
        console.log('Settings saved!');}}>Save Changes</button>
      </form>
    </div>
    </div>
  );
}

export default Settings;
