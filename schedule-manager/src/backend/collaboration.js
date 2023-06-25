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

        updateMembership([userId], thisProjectId);
    }
}

export function updateMembership(membersArr, itemId) {
    const db = getDatabase();
    for (var memberId in membersArr) {
        update(ref(db, "/membership/" + memberId), {
            [itemId] : true
        })
    }
}

export async function removeItem(membersArr, itemId) {
    const db = getDatabase();
    membersArr.map((memberId) => remove(ref(db, "/membership/" + memberId + "/" + itemId)));
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

export async function memberQuery(userId, field) {
    const db = getDatabase();
    
    // Query member's projects
    const memberItemsRef = ref(db, "membership/" + userId);
    const memberItemsSnapshot = await get(memberItemsRef);

    // Array to store the project details
    const items = [];

    if (memberItemsSnapshot.exists()) {
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
    removeItem([userId], itemId);
    remove(ref(db, field + itemId + "/members/" + userId))
    // remove(child(path, userId));
}