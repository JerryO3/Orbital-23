import React from "react";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import { getDatabase, ref, set, child, get } from "firebase/database";

const checkParticulars = (username, password) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${username}`))
        .then((snapshot) => snapshot.exists()
            ? snapshot.val().password === password
            : false
        )
        .catch((error) => {
            console.error(error);
        });
}

export default checkParticulars;