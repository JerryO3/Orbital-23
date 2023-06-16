import { app } from './Firebase';
import { getDatabase, ref, set, remove, get, update, onValue, query, orderByChild, equalTo, child } from "firebase/database";
import * as authpkg from "firebase/auth";
import * as time from "./time.js";
import { once } from 'events';
import * as cc from './checkClash'

const { v4: uuidv4 } = require('uuid');

export var loggedIn = !(authpkg.getAuth(app).currentUser === null);

class EventNew {
    constructor(start,end,name) {
        this.startDateTime = start;
        this.endDateTime = end;
        this.name = name;
    }
}

export const printOne = () => {
    console.log(1);
}

export const getUserId = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user.uid;
}

// function filterByUser(db, userId) {
//     const dataRef = ref(db, "project")
//     // console.log(userId);
//     const filteredDataQuery = query(dataRef, orderByChild("userID"), equalTo(userId, "userID"));
//     return filteredDataQuery;
// }

export const writeData = (data) => {
    if (loggedIn) {
        const uniqueId = authpkg.getAuth(app).currentUser.uid;
        const db = getDatabase();
        set(ref(db, "/users/" + uniqueId), {
            Data : data
        });
    } else {
        console.log("Not Logged In");
    }
}

const initializeData = (userEmail, userName) => {
    const uniqueId = authpkg.getAuth(app).currentUser.uid;
    const db = getDatabase();
    update(ref(db, "/users/" + uniqueId), {
        email : userEmail,
        username : userName
    })
    window.location.href = "/submit";
}

export const queryByValue = (dbRef, field, queryId) => {
    const db = getDatabase();
    const itemsRef = ref(db, dbRef);
    const itemsQuery = query(itemsRef, orderByChild(field), equalTo(queryId));
    return get(itemsQuery).then((snapshot) => {
        // console.log(snapshot.exists());
        // console.log(1);

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
    });
}

export const readProjectsData = () => {
    const db = getDatabase();
    const user = JSON.parse(localStorage.getItem('user'));
    const uniqueId = user.uid;
    const dbRef = ref(db, "/projects/" + uniqueId)

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

export const readEventsData = () => {
    const db = getDatabase();
    const user = JSON.parse(localStorage.getItem('user'));
    const uniqueId = user.uid;
    const dbRef = ref(db, "/events/" + uniqueId)

    // return objArr(dbRef);

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

export const registerWithEmailandPw = (username, email, password) => {
    authpkg.createUserWithEmailAndPassword(authpkg.getAuth(app), email, password)
    .then(() => initializeData(email, username))
    .catch((error) => {console.log(error)});
}

export async function login(email, password) {
    const creds = await authpkg.signInWithEmailAndPassword(authpkg.getAuth(app), email, password)
    .then(() => window.location.href = '/dashboard')
    .catch((error) => {console.log(error)});
    // console.log(creds.user !== null);

    const user = authpkg.getAuth(app).currentUser;
    localStorage.setItem('user', JSON.stringify(user));
}



export async function loginWithCreds(credential) {
    const creds = await authpkg.signInWithCredential(authpkg.getAuth(app), credential)
    .then(() => authpkg.getAuth(app).onAuthStateChanged((user) => {
          const email = user.email;
          const username = user.displayName;
          initializeData(email, username);
    }))
    .then(() => window.location.href = '/dashboard')
    .catch((error) => {console.log(error)});
    // console.log(creds.user !== null);
    
    const user = authpkg.getAuth(app).currentUser;
    localStorage.setItem('user', JSON.stringify(user));
}

export async function logout() {
    authpkg.getAuth(app).signOut()
    .then(() => window.location.href = '/')
    .catch((error) => {console.log(error)});

    localStorage.removeItem('user');
}

export function getField(field) {
    const user = JSON.parse(localStorage.getItem('user'));
    const db = getDatabase();
    const uniqueId = user.uid;
    const fieldRef = ref(db, "/users/" + uniqueId + "/" + [field]);
    var item;

    onValue(fieldRef, (snapshot) => {
        if (snapshot.exists()) {
        item = snapshot.val();
        // console.log(item); 
        // Do something with the username value
        } else {
        item = null;
        // console.log("Username field does not exist in the database.");
        }
    },
    (error) => {
        console.error("Error retrieving username:", error);
    });

    return item;
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

export async function loginWGoogle() {
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

export const resetPw = () => {
    let password = prompt("new password");
    authpkg.updatePassword(authpkg.getAuth(app).currentUser, password);
}

export const updateEmailAdd = (email) => {
    let password = prompt("new email");
    authpkg.updateEmail(authpkg.getAuth(app).currentUser, email);
}

export const loadData = () => {
    if (loggedIn) {
        const user = JSON.parse(localStorage.getItem('user'));
        const uniqueId = user.uid;
        const dbRef = ref(getDatabase(), "/users/" + uniqueId);
        get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
            console.log(snapshot.val());
            } else {
            console.log("no records found")
            }
        })
        .then(() => {})
        .catch((error) => {
            console.log(error)
        });
    } else {
        console.log("Not Logged In");
    }
}

export async function sendPasswordResetEmail(email) {
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

export const newProject = (projectName) => {
    const db = getDatabase();
    const uniqueId = uuidv4();
    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user.uid;
    update(ref(db, "/projects/" + uniqueId), {
        name : projectName,
        userId : userId
    })
    
    window.location.href='/projectCreated';
}

export const newEventByDuration = (projectName, eventName, startDate, startTime, durationDays, durationHours, durationNearestFiveMin) => {
    const db = getDatabase();
    const uniqueId = authpkg.getAuth(app).currentUser.uid;
    update(ref(db, "/users/" + uniqueId + "/projects/" + projectName + "/" + eventName), {

    })
}

export async function newEventByStartEnd(projectId, eventName, startDate, startTime, endDate, endTime) {
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

    const uniqueId = uuidv4();

    const eventArr = queryByValue("events", "user", userId);

    const clash = await cc.checkClash(eventArr, startDateTime, endDateTime)
    
    if (!clash.clash) {
        console.log(uniqueId);
        update(ref(db, "/events/" + uniqueId), {
            name: eventName,
            user: userId,
            startDateTime: startDateTime.toMillis(),
            endDateTime: endDateTime.toMillis(),
            projectId : projectId,
        });
        return true
    } else {
        return false;
    }
}

export const newBlockoutByStartEnd = (blockoutName, startDate, startTime, endDate, endTime) => {
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
    const endDateTime = time.moment(endYear, endMonth, endDay, endHour, endMin);

    const uniqueId = uuidv4();

    update(ref(db, "/blockout/" + userId + "/" + uniqueId), {
        name: blockoutName,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
    });

    window.location.href='/blockoutCreated';
}  

export const removeEvent = () => {
    const db = getDatabase();
    const itemRef = ref(db, '/events/' + localStorage.getItem('eventId'));
    remove(itemRef)
    .then(() => {
        console.log("Item deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting item:", error);
    });

    window.location.href='/eventCreated'
}

const removeEventHelper = (eventId) => {
    const db = getDatabase();
    const itemRef = ref(db, '/events/' + eventId);
    remove(itemRef)
    .then(() => {
        console.log("Event deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting event:", error);
    });
}

const removeProjectHelper = (projectId) => {
    const db = getDatabase();
    const itemRef = ref(db, '/projects/' + projectId);
    remove(itemRef)
    .then(() => {
        console.log("Project deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting project:", error);
    });
}

export const removeProject = () => {
    const db = getDatabase();
    const projectId = localStorage.getItem('projectId');
    const reference = ref(db, "events");
    // console.log(reference);
    const que = query(reference, orderByChild("projectId"), equalTo(projectId));
    // console.log(que);
    onValue(que, (snapshot) => snapshot.exists() ? Object.keys(snapshot.val()).map(x =>removeEventHelper(x)) : null)
    removeProjectHelper(projectId);
    window.location.href='/projectCreated'
}

export function updateProfile(username, notificationDuration, telegramHandle) {
    const db = getDatabase();
    const user = JSON.parse(localStorage.getItem('user'));
    const uniqueId = user.uid;
    const profile = ref(db, "/users/" + uniqueId);
    update(profile, {
        username : username,
        notificationDuration : notificationDuration,
        telegramHandle : telegramHandle
    })

    // const storage = getStorage();
    // const storageRef = ref(storage, 'profile-photos/' + profilePhoto);
    // uploadBytesResumable(storageRef, profilePhoto)
    
    alert('Profile Updated!')
}