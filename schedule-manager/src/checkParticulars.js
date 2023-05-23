import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { getDatabase, ref, set, child, get } from "firebase/database";

const checkParticulars = (username, password) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${username}`)).then((snapshot) => {
      if (snapshot.exists()) {
        if (snapshot.val().password == password) {
            window.open("/");
        } else {
            console.log("Wrong Password");
        }
//        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
}

export default checkParticulars;