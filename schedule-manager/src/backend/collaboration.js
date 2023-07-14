import { app } from './Firebase';
import { getDatabase, ref, set, remove, get, update, onValue, query, orderByChild, equalTo, child } from "firebase/database";
import * as authpkg from "firebase/auth";
import * as time from "./time.js";
import { once, on} from 'events';
import * as cc from './checkClash'
import * as fn from './functions'

export async function addUser(email) {
    const userId = await getUserId(email);
    if (userId === null) {
        alert('Telegram Handle does not exist');
    }
    else {
        const db = getDatabase();
        const thisProjectId = localStorage.getItem("projectId");

        update(ref(db, "/projects/" + thisProjectId + "/members"), {
            [userId] : true
        })

        updateMembership([userId], "projects", thisProjectId);
    }
}

export function updateMembership(membersArr, field, itemId) {
    const db = getDatabase();
    for (var memberId in membersArr) {
        update(ref(db, "/membership/" + memberId + "/" + field), {
            [itemId] : true
        })
    }
}

export async function removeItem(membersArr, field, itemId) {
    const db = getDatabase();
    membersArr.map((memberId) => remove(ref(db, "/membership/" + memberId + "/" + field + itemId)));
}

async function getUserId(email){
    const arr = await fn.queryByValue("users", "email", email)
    if (arr.length > 0) {
        return arr[0].itemId;
    }
    else {
        return null;
    }
}

export async function memberQuery(userId, field) {
    const db = getDatabase();
    
    // Query member's projects
    const memberItemsRef = ref(db, "membership/" + userId + "/" + field);
    const memberItemsSnapshot = await get(memberItemsRef);
    console.log(memberItemsSnapshot.val())
    // Array to store the project details
    const items = [];

    if (memberItemsSnapshot.exists()) {
    const itemIds = Object.keys(memberItemsSnapshot.val());
    console.log(itemIds);
    // Fetch project details for each project ID
    for (const itemId of itemIds) {
        // console.log(itemId)
        const itemRef = ref(db, [field] + itemId);
        const itemSnapshot = await get(itemRef);
        // console.log(itemSnapshot.exists())

        if (itemSnapshot.exists()) {
        const itemId = itemSnapshot.key;
        const item = itemSnapshot.val();
        items.push({itemId, ...item});
        }
        }
    }
    return items;
}

export async function getMembers(field, itemId) {
    const db = getDatabase();
    // const projectId = localStorage.getItem("projectId");

    // Create a reference to the project's members node
    const projectMembersRef = ref(db, field + itemId + "/members");
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

export const deleteUser = async (userId, field, itemId) => {
    const db = getDatabase();
    removeItem([userId], field, itemId);
    remove(ref(db, field + itemId + "/members/" + userId))
    // remove(child(path, userId));
}

export const getName = async (userId) => {
    const db = getDatabase();
    return get(ref(db, "/users/" + userId + "/username")).then(snapshot => snapshot.val());
}