import { app } from './Firebase';
import { getDatabase, ref, set, remove, get, update, onValue, query, orderByChild, equalTo, child } from "firebase/database";
import * as authpkg from "firebase/auth";
import * as time from "./time.js";
import { once, on} from 'events';
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

        update(ref(db, "/projects/" + thisProjectId + "/members"), {
            [userId] : true
        })

        update(ref(db, "/membership/" + userId), {
            [thisProjectId] : true
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

export async function memberQuery(field) {
    const db = getDatabase();
    const userId = fn.getUserId();
    console.log(userId);

    // Query member's projects
    const memberProjectsRef = ref(db, "membership/" + userId);
    const memberProjectsSnapshot = await get(memberProjectsRef);

    // Array to store the project details
    const items = [];

    if (memberProjectsSnapshot.exists()) {
    const itemIds = Object.keys(memberItemsSnapshot.val());
    
    // Fetch project details for each project ID
    for (const itemId of itemIds) {
        const itemRef = ref(db, [field] + itemId);
        const itemSnapshot = await get(itemRef);
        
        if (itemSnapshot.exists()) {
        const itemId = itemSnapshot.key;
        const item = itemSnapshot.val();
        items.push({itemId, ...item});
        }
    }
    }

    return items;
}

export async function getMembers() {
    const db = getDatabase();
    const projectId = localStorage.getItem("projectId");

    // Create a reference to the project's members node
    const projectMembersRef = ref(db, "projects/" + projectId + "/members");
    const projectMembersSnapshot = await get(projectMembersRef);

    // Array to store the member details
    const members = [];

    if (projectMembersSnapshot.exists()) {
    const memberIds = Object.keys(projectMembersSnapshot.val());

    // Fetch member details for each member ID
    for (const memberId of memberIds) {
        const memberRef = ref(db, "users/" + memberId);
        const memberSnapshot = await get(memberRef);

        if (memberSnapshot.exists()) {
        const itemId = memberSnapshot.key;
        const member = memberSnapshot.val();
        members.push({itemId, ...member});
        }
    }
    }

    return members;
}