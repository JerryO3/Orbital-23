import { app } from './Firebase';
import { getDatabase, ref, set, remove, get, update, onValue, query, orderByChild, equalTo, child } from "firebase/database";
import * as authpkg from "firebase/auth";
import * as time from "./time.js";
import { once, on} from 'events';
import * as cc from './checkClash'
import * as fn from './functions'
import * as col from './collaboration';


const { v4: uuidv4 } = require('uuid');

export const newBlockout = async (blockoutName, startDate, endDate) => { // now returns a promise void, pushed redirect side effect to newproject
    const db = getDatabase();
    const uniqueId = uuidv4();
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.uid;
    
    return update(ref(db, "/blockouts/" + uniqueId), {
        name : blockoutName,
        userId : userId,
        startDate : startDate,
        endDate : endDate,
    }).then(() => update(ref(db, "/membership/" + userId + "/blockouts"), {
        [uniqueId] : true
    }))
}

export const removePeriod = async () => { // now returns a promise, shifting side effect to change event page
    const db = getDatabase();
    const periodId = localStorage.getItem('periodId');
    const blockoutId = localStorage.getItem('blockoutId');
    const itemRef = ref(db, '/periods/' + periodId);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.uid;
    // const membersRef = ref(db, "projects/" + projectId + "/members");
    return remove(itemRef)
    .then(col.removeItem([userId], "periods/", periodId))
}

const removePeriodHelper = async (periodId) => { // now returns promise, !need to change project structure so that can remove membership
    const db = getDatabase();
    const itemRef = ref(db, '/periods/' + periodId);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.uid;
    return col.removeItem([userId], "periods/", periodId)
    .then(() => remove(itemRef))
    .then(() => {
        console.log("Event deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting event:", error);
    });
}

export const removeBlockoutHelper = async (blockoutId) => { // now returns promise, !need to change project structure so that can remove membership
    const db = getDatabase();
    const itemRef = ref(db, '/blockouts/' + blockoutId);
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.uid;
    return col.removeItem([userId], "blockouts/", blockoutId)
    .then(() => remove(itemRef))
    .then(() => {
        console.log("Project deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting project:", error);
    });
}

export const removeBlockout = async () => { // now returns a promise, shifting side effect to update event page
    const db = getDatabase();
    const blockoutId = localStorage.getItem('blockoutId');
    const reference = ref(db, "periods");
    const que = query(reference, orderByChild("blockoutId"), equalTo(blockoutId));
    return get(que)
    .then(snapshot => snapshot.exists() ? Object.keys(snapshot.val()).map(x =>removePeriodHelper(x)) : null)
    .then(() => removeBlockoutHelper(blockoutId));
}

export const getItem = async (field) => {
    const db = getDatabase();
    const blockoutId = localStorage.getItem('blockoutId');
    const item = ref(db, "blockouts/" + blockoutId);
    return get(item)
    .then(snapshot => snapshot.exists() ? snapshot.val()[field] : null)
}

function addDurationToDate(dateString, durationInDays) {
    // Parse the input date string into a Date object
    const date = new Date(dateString);
  
    // Calculate the new date by adding the duration in days
    date.setDate(date.getDate() + durationInDays);
  
    // Convert the new date back to a string in the format "YYYY-MM-DD"
    const newDateString = date.toISOString().split('T')[0];
  
    return newDateString;
}
  

export async function newBlockoutPeriod(thisBlockout, name, startDate, startTime, endDate, endTime, checked, cycle, clash) {
    const db = getDatabase();
    const uniqueId = uuidv4();
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.uid;
    const blockoutStart = await getItem("startDate")
    const blockoutEnd = await getItem("endDate");
    const futureStart = addDurationToDate(startDate, cycle);
    const futureEnd = addDurationToDate(endDate, cycle);

    if (startDate < blockoutStart || endDate > blockoutEnd) {
        alert('Period cannot be outside Blockout window!');
        const result = await cc.clashWindow(false);
        return [result];
    }

    const startDateInput = startDate;
    const startYear = parseInt(startDateInput.substr(0,4), 10);
    const startMonth = parseInt(startDateInput.substr(5,2), 10);
    const startDay = parseInt(startDateInput.substr(8,2), 10);

    const startTimeInput = startTime;
    const startHour = parseInt(startTimeInput.substr(0,2), 10);
    const startMin = parseInt(startTimeInput.substr(3,2), 10);

    const endDateInput = endDate;
    const endYear = parseInt(endDateInput.substr(0,4), 10);
    const endMonth = parseInt(endDateInput.substr(5,2), 10);
    const endDay = parseInt(endDateInput.substr(8,4), 10);

    const endTimeInput = endTime;
    const endHour = parseInt(endTimeInput.substr(0,2), 10);
    const endMin = parseInt(endTimeInput.substr(3,2), 10);

    const startDateTime = time.moment(startYear, startMonth, startDay, startHour, startMin);
    const endDateTime =  time.moment(endYear, endMonth, endDay, endHour, endMin);

    const memberPromises = [userId]
    .map(member => col.memberQuery(member, 'events/')
        .then(events => col.memberQuery(member, 'periods/')
            .then(periods => periods.concat(events)))
        .then(x => cc.checkClash(x, startDateTime, endDateTime) // mapse the profile array into an array of promises
            .then(x => [member,x]))) // converts clashWindow and profile into a single promise

    return memberPromises[0].then(x => {
        if (!x[1].clash) {
            updater()
            if (checked && futureEnd < blockoutEnd) {
                return newBlockoutPeriod(thisBlockout, name, futureStart, startTime, futureEnd, endTime, checked, cycle, clash);
            } else {
                if (clash.length <= 0) {
                    return [...clash, x[1]];
                } else {
                    return clash;
                }
            }
        } else {
            if (checked && futureEnd < blockoutEnd) {
                return newBlockoutPeriod(thisBlockout, name, futureStart, startTime, futureEnd, endTime, checked, cycle, [...clash, x[1]]);
            } else {
                return [...clash, x[1]];
            }
        }
    })

    function updater() {
        update(ref(db, "/periods/" + uniqueId), {
            name : name,
            userId : userId,
            startDateTime : startDateTime.toMillis(),
            endDateTime : endDateTime.toMillis(),
            blockoutId : thisBlockout,
        });
        update(ref(db, "/membership/" + userId + "/periods"), {
            [uniqueId] : true
        });
        return true;
    }
}

export const removed = () => {
    const db = getDatabase();
    remove(ref(db, "/periods/"));
}

export const updateDate = async (start, end) => {
    const db = getDatabase();
    const blockoutId = localStorage.getItem("blockoutId")
    return update(ref(db, "blockouts/" + blockoutId), {
        startDate : start,
        endDate : end,
    })
    // .then(() => {
    //     alert('Window Updated!')
    // })
}

export const updateBlockoutPeriod = async (thisBlockout, thisPeriodId, thisPeriod, startDate, startTime, endDate, endTime) => {
    const db = getDatabase();
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.uid;
    const blockoutStart = await getItem("startDate")
    const blockoutEnd = await getItem("endDate");

    const startDateInput = startDate;
    const startYear = parseInt(startDateInput.substr(0,4), 10);
    const startMonth = parseInt(startDateInput.substr(5,2), 10);
    const startDay = parseInt(startDateInput.substr(8,2), 10);

    const startTimeInput = startTime;
    const startHour = parseInt(startTimeInput.substr(0,2), 10);
    const startMin = parseInt(startTimeInput.substr(3,2), 10);

    const endDateInput = endDate;
    const endYear = parseInt(endDateInput.substr(0,4), 10);
    const endMonth = parseInt(endDateInput.substr(5,2), 10);
    const endDay = parseInt(endDateInput.substr(8,4), 10);

    const endTimeInput = endTime;
    const endHour = parseInt(endTimeInput.substr(0,2), 10);
    const endMin = parseInt(endTimeInput.substr(3,2), 10);

    const startDateTime = time.moment(startYear, startMonth, startDay, startHour, startMin);
    const endDateTime =  time.moment(endYear, endMonth, endDay, endHour, endMin);

    if (startDate < blockoutStart || endDate > blockoutEnd) {
        alert('Period cannot be outside Blockout window!');
        const result = await cc.clashWindow(false);
        return [result];
    }

    const memberPromises = [userId].map(async member => {
        const events = await col.memberQuery(member, 'events/').then(items => items.filter(item => item.itemId !== thisPeriodId));
        const periods = await col.memberQuery(member, 'periods/').then(items => items.filter(item => item.itemId !== thisPeriodId))
        const allItems = periods.concat(events);
        const combinedData = await cc.checkClash(allItems, startDateTime, endDateTime).then(clash => [member, clash]);
        return combinedData;
      });
       // converts clashWindow and profile into a single promise

    return memberPromises[0].then(x => {
        // console.log(x[1])
        if (!x[1].clash) {
            updater()
            return x[1];
        } else {
            return x[1];
        }
    })

    function updater() {
        update(ref(db, "periods/" + thisPeriodId), {
            name : thisPeriod,
            startDateTime : startDateTime.toMillis(),
            endDateTime : endDateTime.toMillis(),
            blockoutId : thisBlockout,
            userId  :  userId,
        })
    }
}