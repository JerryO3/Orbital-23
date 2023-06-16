import { app } from './Firebase';
import { getDatabase, ref, set, remove, get, update, onValue, query, orderByChild, equalTo, child } from "firebase/database";
import * as authpkg from "firebase/auth";
import * as time from "./time.js";
import { once } from 'events';
import * as cc from './checkClash'
import * as fn from './functions'

export async function addUser(telegramHandle) {
    const userId = await getUserId(telegramHandle);
    if (userId === null) {
        alert('Telegram Handle does not exist');
    }
    else {
        const db = getDatabase();
        const thisProjectId = localStorage.getItem("projectId");
        update(ref(db, "/projects/" +  thisProjectId + "/members"), {
            [userId] : true
        })

        window.location.href = "/userAdded"
    }
}

async function getUserId(telegramHandle){
    const arr = await fn.queryByValue("users", "telegramHandle", telegramHandle)
    if (arr.length > 0) {
        return arr[0].itemId;
    }
    else {
        return null;
    }
}