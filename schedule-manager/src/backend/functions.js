import { app } from './Firebase';
import { getDatabase, ref, set, remove, get, update, onValue, query, orderByChild, equalTo, child } from "firebase/database";
import * as authpkg from "firebase/auth";
import * as time from "./time.js";
import { once } from 'events';
import * as cc from './checkClash'
import { removeItem, getMembers, memberQuery, deleteUser} from './collaboration';

const { v4: uuidv4 } = require('uuid');

export var loggedIn = !(authpkg.getAuth(app).currentUser === null);

class EventNew {
    constructor(start,end,name) {
        this.startDateTime = start;
        this.endDateTime = end;
        this.name = name;
    }
}

export const getUserId = () => {
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        return user.uid;
    } catch(e) {
        if (e instanceof TypeError) {
            throw new Error("Not Logged In");
        } else {
            throw e;
        }
    }
}

const initializeData = async (userEmail, userName) => { // now returns a promise<void> allowing it to be blocking
    const uniqueId = authpkg.getAuth(app).currentUser.uid;
    const db = getDatabase();
    return update(ref(db, "/users/" + uniqueId), {
        email : userEmail,
        username : userName
    })
}

export const queryByValue = (dbRef, field, queryId) => { // returns a promise containing an array
    try {
        const db = getDatabase();
        const itemsRef = ref(db, dbRef);
        const itemsQuery = query(itemsRef, orderByChild(field), equalTo(queryId));
        // console.log(queryId)
        return get(itemsQuery).then((snapshot) => {
            if (snapshot.exists()) {
            const items = [];
            snapshot.forEach((childSnapshot) => {
                const itemId = childSnapshot.key;
                const itemData = childSnapshot.val();
                items.push({ itemId, ...itemData });
            });
            return items;
            } else {
            return [];
            }
        }).catch(e => {});
    } catch(e) {
        if (e instanceof TypeError) {
            return Promise.reject("Non-string db ref");
        } else {
            return Promise.reject(e.toString());
        }
    }
}

export const readProjectsData = () => { // returns a promise containing an array
    return new Promise((resolve, reject) => {
        const db = getDatabase();
        const uniqueId = authpkg.getAuth(app).currentUser.uid;
        const itemsRef = ref(db, "/projects/" + uniqueId);
    
        onValue(itemsRef, (snapshot) => {
          const events = snapshot.val();
          if (events) {
            const items = Object.values(events);
            resolve(items);
          } else {
            resolve([]);
          }
        }, (error) => {
          reject(error);
        });
      });
}

export const readEventsData = () => { // returns a promise containing an array
    return new Promise((resolve, reject) => {
        const db = getDatabase();
        const uniqueId = authpkg.getAuth(app).currentUser.uid;
        const itemsRef = ref(db, "/users/" + uniqueId + "/projects/" + localStorage.getItem('projectName') + '/events/');
        onValue(itemsRef, (snapshot) => {
          const events = snapshot.val();
          if (events) {
            const items = Object.values(events);
            resolve(items);
          } else {
            resolve([]);
          }
        }, (error) => {
          reject(error);
        });
      });
}

export const registerWithEmailandPw = async (username, email, password) => { // changed initializeData to be blocking
    return authpkg.createUserWithEmailAndPassword(authpkg.getAuth(app), email, password)
    .then(() => initializeData(email, username)
        .then(() => window.location.href = "/submit"))
    .catch((error) => {console.log(error)});
}

export async function login(email, password) { // fixed bug regarding redirecting due to local storage
    return authpkg.signInWithEmailAndPassword(authpkg.getAuth(app), email, password)
    .then(x => {
        const user = authpkg.getAuth(app).currentUser;
        localStorage.setItem('user', JSON.stringify(user));
        window.location.href = '/dashboard'; 
    }) 
    // .catch((error) => error);
}

async function loginWithCreds(credential) { // fixed bug that causes emails to not be written to the db due to async
    const creds = authpkg.signInWithCredential(authpkg.getAuth(app), credential)
    .then(() => authpkg.getAuth(app).onAuthStateChanged((user) => {
        localStorage.setItem('user', JSON.stringify(user));
        initializeData(user.email, user.displayName)
        .then(()=> window.location.href = '/dashboard') 
    }))
    .catch((error) => {console.log(error)});
}

export async function logout() {
    authpkg.getAuth(app).signOut()
    .then(() => window.location.href = '/')
    .catch((error) => {console.log(error)});

    localStorage.clear();
}

export function getField(field) { // now returns a promise, allowing the username to load asynchronously
    try {
        const user = JSON.parse(localStorage.getItem('user'));
        const db = getDatabase();
        const uniqueId = user.uid;
        const fieldRef = ref(db, "/users/" + uniqueId + "/" + [field]);
        return get(fieldRef).then(snapshot => snapshot.val());
    } catch {
        return new Promise((resolve) => resolve(""));
    }
}

export const debugAuth = () => {
    console.log(authpkg.getAuth(app).app);
    console.log(authpkg.getAuth(app).config);
    console.log(authpkg.getAuth(app).currentUser);
}

const deconflictSignInMethods = () => {
    let password = prompt("You previously logged in using Email and Password. Please enter your password here:");
    return password;
}

export async function loginWGoogle() { // need to test, not sure if works
    try {
        const provider = new authpkg.GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        const promise = authpkg.signInWithPopup(authpkg.getAuth(app), provider).catch(function(error) {
            if (error.code === 'auth/account-exists-with-different-credential') {
                var pendingCred = error.credential;
                var email = error.email;
                authpkg.fetchSignInMethodsForEmail(email).then(function(methods) {
                    if (methods[0] === 'password') {
                        var password = deconflictSignInMethods();
                        authpkg.signInWithEmailAndPassword(email, password).then(function(result) {
                            return result.user.linkWithCredential(pendingCred);
                        })
                    }
                })
            }
        })

        const result = await promise;
        const user = result.user;
        const credential = authpkg.GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        loginWithCreds(credential);
    } catch (e) {
        console.log(e);
    }
}

export const resetPw = () => { // have not implemented (deprecated)
    let password = prompt("new password");
    authpkg.updatePassword(authpkg.getAuth(app).currentUser, password);
}

export const updateEmailAdd = () => { // have not implemented (deprecated)
    let email = prompt("new email");
    authpkg.updateEmail(authpkg.getAuth(app).currentUser, email);
}

export async function sendPasswordResetEmail(email) { // terminal function, no need to return
    const auth = authpkg.getAuth(app);
    const temp = await authpkg
      .sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent successfully
        console.log("Password reset email sent.");
        // You can display a success message or redirect the user to a confirmation page
        window.location.href = "/newPw";
      })
      .catch((error) => {
        // An error occurred while sending the password reset email
        console.error("Error sending password reset email:", error);
        // You can display an error message to the user
      });
  };

export const newProject = async (projectName) => { // now returns a promise void, pushed redirect side effect to newproject
    const db = getDatabase();
    const uniqueId = uuidv4();
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.uid;
    
    return update(ref(db, "/projects/" + uniqueId), {
        name : projectName,
    }).then(() => update(ref(db, "/membership/" + userId + "/projects"), {
        [uniqueId] : true
    }).then(() => update(ref(db, "/projects/" + uniqueId + '/members'), {
        [userId] : true
    })))
    .then(() => uniqueId);
}

export async function newEventByStartEnd(projectId, eventId, eventName, startDate, startTime, endDate, endTime, members) {
    // console.log(members)
    const db = getDatabase();
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.uid;

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

    if (startDateTime > endDateTime) {
        alert('Start Date/Time cannot be after End Date/Time')
        return;
    }

    const uniqueId = eventId === null ? uuidv4() : eventId;

    // console.log(members)
    const memberPromises = members.map(async member => {
        const events = await memberQuery(member, 'events/')
        .then(items => items.filter(item => item.itemId !== eventId));
        const periods = await memberQuery(member, 'periods/')
        .then(items => items.filter(item => item.itemId !== eventId));
        const allItems = periods.concat(events);
        const clashCheckResult = await cc.checkClash(allItems, startDateTime, endDateTime);
        return [member, clashCheckResult];
      });

    // // console.log(members)
    // const memberPromises = await members
    // .map(member => memberQuery(member.itemId, 'events/')
    //     .then(events => memberQuery(member.itemId, 'periods/')
    //         .then(periods => periods.concat(events)))
    //     // .then(x => console.log(x))
    //     .then(x => cc.checkClash(x, startDateTime, endDateTime) // mapse the profile array into an array of promises
    //         .then(x => [member,x]))) // converts clashWindow and profile into a single promise
    // // console.log(memberPromises);

    if (members.length === 1) {
        // console.log(memberPromises[0]);
        return memberPromises[0]
        .then(x => !x[1].clash ? updater(x[0]) : false) // works for single-user projects! 
        .then(x => {
            console.log(x); 
            return x;});
      
    } else {
    return memberPromises
    .reduce((x,y) => (x.then(a => y.then(b => Array.isArray(a[0]) ? a.concat([b]) : [a,b])))) 
    // ^ reduces array of promises into a promise that returns an array
    .then(x => x.reduce((a,b) => Array.isArray(a) ? !a[1].clash && !b[1].clash : a && !b[1].clash) // checks all members if clear
        ? x.map(y => {console.log(y[0]); return updater(y[0]);}) // applies updater using map 
        : x.map(y => !y[1].clash) 
        )
    .then(x => { return x.reduce((a,b) => a && b)})
    .then(x => { return x})
    ;
    }  

    function updater(uid) {
        console.log(uid)
        update(ref(db, "/events/" + uniqueId), {// helps to update while within promise wrapper
            name: eventName,
            startDateTime: startDateTime.toMillis(),
            endDateTime: endDateTime.toMillis(),
            projectId : projectId,
        });
        update(ref(db, "/events/" + uniqueId + '/members'), {
            [uid] : true,
        });
        update(ref(db, "/membership/" + uid + "/events"), {
            [uniqueId] : true
        });
        return true;
    }

}

export const removeEvent = async () => { // now returns a promise, shifting side effect to change event page
    const db = getDatabase();
    const eventId = localStorage.getItem('eventId');
    const projectId = localStorage.getItem('projectId');
    const itemRef = ref(db, '/events/' + eventId);
    const membersRef = ref(db, "projects/" + projectId + "/members");
    return remove(itemRef)
    .then(() => get(membersRef)
        .then(snapshot => removeItem(Object.keys(snapshot.val()), "events/", eventId)))
    .then(() => {
        console.log("Item deleted successfully");
    })
    .then(() => {
        localStorage.removeItem("eventId");
        localStorage.removeItem("eventName");
    })
    .catch((error) => {
        console.error("Error deleting item:", error);
    });
}

const removeEventHelper = async (eventId) => { // now returns promise, !need to change project structure so that can remove membership
    const db = getDatabase();
    const projectId = localStorage.getItem('projectId');
    const itemRef = ref(db, '/events/' + eventId);
    const membersRef = ref(db, "projects/" + projectId + "/members");
    return remove(itemRef)
    .then(() => get(membersRef)
        .then(snapshot => removeItem(Object.keys(snapshot.val()), "events/", eventId)))
    .then(() => {
        console.log("Event deleted successfully");
    })
    .then(() => {
        localStorage.removeItem("eventId");
        localStorage.removeItem("eventName");
    })
    .catch((error) => {
        console.error("Error deleting event:", error);
    });
}

export const removeProjectHelper = async (projectId) => { // now returns promise, !need to change project structure so that can remove membership
    const db = getDatabase();
    const itemRef = ref(db, '/projects/' + projectId);
    const membersRef = ref(db, "projects/" + projectId + "/members");
    return get(membersRef)
    .then(snapshot => removeItem(Object.keys(snapshot.val()), "projects/", projectId))
    .then(() => remove(itemRef))
    .then(() => {
        console.log("Project deleted successfully");
    })
    .then(() => {
        localStorage.removeItem("projectId");
        localStorage.removeItem("projectName");
    })
    .catch((error) => {
        console.error("Error deleting project:", error);
    });
}

export const removeProject = async () => { // now returns a promise, shifting side effect to update event page
    const db = getDatabase();
    const projectId = localStorage.getItem('projectId');
    const reference = ref(db, "events");
    const que = query(reference, orderByChild("projectId"), equalTo(projectId));
    return get(que)
    .then(snapshot => snapshot.exists() ? Object.keys(snapshot.val()).map(x =>removeEventHelper(x)) : null)
    .then(() => removeProjectHelper(projectId));
}

export const getHandle = async (uid) => { // now returns a promise containing the handle
    const db = getDatabase();
    return get(ref(db, "users/" + uid + "/telegramHandle")).then(snapshot => snapshot.val());
}

export async function updateProfile(username, notificationDuration, telegramHandle) { // now returns a promise<void>, no real issue
    const db = getDatabase();
    const user = JSON.parse(localStorage.getItem('user'));
    const uniqueId = user.uid;
    const profile = ref(db, "/users/" + uniqueId);
    return update(profile, {
        username : username,
        notificationDuration : notificationDuration,
        telegramHandle : telegramHandle
    }).then(() =>  alert('Profile Updated!'))
}

export const getItem = async (dbRef, id) => {
    const db = getDatabase();
    const path = ref(db, dbRef + id)
    const result = await get(path).then(snapshot => snapshot.exists ? snapshot.val() : null)
    return result;
}

export function getDate(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
  
    const formattedDate = `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
    return formattedDate;
}

export function getTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
  
    const formattedTime = `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    return formattedTime;
}

export async function removeFromEvent(userId, itemId) {
    deleteUser(userId, "events/", itemId);
}

export async function removeFromProject(userId, itemId) {
    const db = getDatabase();
    for(var user of userId){
        deleteUser(user, "projects/", itemId);
        const reference = ref(db, "events");
        const que = query(reference, orderByChild("projectId"), equalTo(itemId));
        return get(que)
        .then(snapshot => snapshot.exists() ? Object.keys(snapshot.val()).map(x =>removeFromEvent(user, x)) : null)    
    }
}