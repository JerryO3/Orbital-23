// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported} from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAt_7XlSnzjPny4ehAjLhFqqIebvAV_v9s",
  authDomain: "schedule-manager-94579.firebaseapp.com",
  databaseURL: "https://schedule-manager-94579-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "schedule-manager-94579",
  storageBucket: "schedule-manager-94579.appspot.com",
  messagingSenderId: "764458942352",
  appId: "1:764458942352:web:a3ab85410368e1248d7d15",
  measurementId: "G-R7DMDK6E0W"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);