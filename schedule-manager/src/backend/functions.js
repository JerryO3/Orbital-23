import { app } from './Firebase';
import { getDatabase, ref, set, remove, get, update, onValue } from "firebase/database";
import * as authpkg from "firebase/auth";
import * as time from "./time.js";

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
    update(ref(db, "/users/" + uniqueId + "/profile"), {
        email : userEmail,
        username : userName
    })
    window.location.href = "/submit";
}

export const readProjectsData = () => {
    return new Promise((resolve, reject) => {
        const db = getDatabase();
        const uniqueId = authpkg.getAuth(app).currentUser.uid;
        const itemsRef = ref(db, "/users/" + uniqueId + "/projects/");
    
        onValue(itemsRef, (snapshot) => {
          const projects = snapshot.val();
          if (projects) {
            const items = Object.values(projects);
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

export function getUsername() {
    const user = JSON.parse(localStorage.getItem('user'));
    const db = getDatabase();
    const uniqueId = user.uid;
    const usernameRef = ref(db, "/users/" + uniqueId + "/profile/username");
    var username;

    onValue(usernameRef, (snapshot) => {
        if (snapshot.exists()) {
        username = snapshot.val();
        console.log(username); 
        // Do something with the username value
        } else {
        console.log("Username field does not exist in the database.");
        }
    },
    (error) => {
        console.error("Error retrieving username:", error);
    });

    return username;
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
        const uniqueId = authpkg.getAuth(app).currentUser.uid;
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
    const uniqueId = authpkg.getAuth(app).currentUser.uid;
    update(ref(db, "/users/" + uniqueId + "/projects/" + projectName), {
        name : projectName,
    })
    window.location.href='/projectCreated';
}

export const newEventByDuration = (projectName, eventName, startDate, startTime, durationDays, durationHours, durationNearestFiveMin) => {
    const db = getDatabase();
    const uniqueId = authpkg.getAuth(app).currentUser.uid;
    update(ref(db, "/users/" + uniqueId + "/projects/" + projectName + "/" + eventName), {

    })
}

export const newEventByStartEnd = (projectName, eventName, startDate, startTime, endDate, endTime) => {
    const db = getDatabase();
    const uniqueId = authpkg.getAuth(app).currentUser.uid;

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

    const eventObj = new EventNew(startDateTime, endDateTime, eventName);
    const eventNode = time.newNode(eventObj, projectName);
    const timeTree = ref(db, "/users/" + uniqueId + '/timeTree/')
    onValue(timeTree, (snapshot) =>  {
        if (snapshot.exists()) {
            const root = time.toNode(snapshot.val().eventNode);
            console.log(root)
            if (time.intervalQuery(root, eventNode)) {
                // time tree
                update(timeTree, time.addNode(root, eventNode));

                // project tree
                update(ref(db, "/users/" + uniqueId + "/projects/" + projectName + "/events/" + eventName), {
                    name: eventName,
                    startDateTime: startDateTime,
                    endDateTime: endDateTime
                });

                window.location.href='/eventCreated';

            } else {
                alert('Event Clashing');
            }
        } else {
            // time tree
            update(timeTree, {eventNode});

            // project tree
            update(ref(db, "/users/" + uniqueId + "/projects/" + projectName + "/events/" + eventName), {
                name: eventName,
                startDateTime: startDateTime,
                endDateTime: endDateTime
            });

            window.location.href='/eventCreated';

        }
        }
    )


    
    
}

export const newBlockoutByStartEnd = (blockoutName, startDate, startTime, endDate, endTime) => {
    const db = getDatabase();
    const uniqueId = authpkg.getAuth(app).currentUser.uid;

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

    update(ref(db, "/users/" + uniqueId + "/blockouts/" + blockoutName), {
        name: blockoutName,
        startDateTime: startDateTime,
        endDateTime: endDateTime,
    })

    window.location.href='/blockoutCreated';
}  

export const removeEvent = () => {
    const db = getDatabase();
    const uniqueId = authpkg.getAuth(app).currentUser.uid;
    const itemRef = ref(db, "/users/" + uniqueId + "/projects/" 
    + localStorage.getItem('projectName') + '/events/'
    + localStorage.getItem('eventName'));

    //time tree
    var event;

    onValue(itemRef, (snapshot) => {
        if (snapshot.exists()) {
        event = snapshot.val();
        console.log(event); 
        // Do something with the username value
        } else {
        console.log("Username field does not exist in the database.");
        }
    },
    (error) => {
        console.error("Error retrieving username:", error);
    });

    const eventRef = new EventNew(time.fromString(event.startDateTime), time.fromString(event.endDateTime), event.name);
    console.log(eventRef);
    const queryNode = time.newNode(eventRef);
    console.log(queryNode);

    //project tree
    remove(itemRef)
    .then(() => {
        console.log("Item deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting item:", error);
    });

    window.location.href='/eventCreated'
}

export const removeProject = () => {
    const db = getDatabase();
    const uniqueId = authpkg.getAuth(app).currentUser.uid;
    const itemRef = ref(db, "/users/" + uniqueId + "/projects/" 
    + localStorage.getItem('projectName'));

    remove(itemRef)
    .then(() => {
        console.log("Item deleted successfully");
    })
    .catch((error) => {
        console.error("Error deleting item:", error);
    });

    window.location.href='/projectCreated'
}

export function updateProfile(username, profilePhoto, darkTheme, notification, notificationDuration) {
    const db = getDatabase();
    const uniqueId = authpkg.getAuth(app).currentUser.uid;
    const profile = ref(db, "/users/" + uniqueId + "/profile");
    update(profile, {
        username : username,
        darkTheme : darkTheme,
        notification : notification,
        notificationDuration : notificationDuration
    })

    // const storage = getStorage();
    // const storageRef = ref(storage, 'profile-photos/' + profilePhoto);
    // uploadBytesResumable(storageRef, profilePhoto)
    
    alert('Profile Updated!')
}