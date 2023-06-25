import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './backend/reportWebVitals';
// Import the functions you need from the SDKs you need

let db;
const openOrCreateDB = window.indexedDB.open('todo_db', 1);

openOrCreateDB.addEventListener('error', () => console.error('Error opening DB'));

openOrCreateDB.addEventListener('success', () => {
  console.log('Successfully opened DB');
  db = openOrCreateDB.result;
});

openOrCreateDB.addEventListener('upgradeneeded', init => {
  db = init.target.result;

  db.onerror = () => {
    console.error('Error loading database.');
  };

  const table = db.createObjectStore('todo_tb', { keyPath: 'id', autoIncrement:true });

  table.createIndex('title', 'title', { unique: false });
  table.createIndex('desc', 'desc', { unique: false });
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
