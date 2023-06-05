import { firebase, app } from './Firebase';
import { getDatabase, ref, set, child, get } from "firebase/database";
import * as authpkg from "firebase/auth";

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

export const initializeData = () => {
    if (loggedIn) {
        const uniqueId = authpkg.getAuth(app).currentUser.uid;
        const db = getDatabase();
        set(ref(db, "/users/" + uniqueId), {
            projects : 1,
            blockouts : 1,
            settings : 1 // can be initialized to default
        });
    } else {
        console.log("Not Logged In");
    }
}

export const readData = () => {
    const dbRef = ref(getDatabase());
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
}

export const registerWithEmailandPw = (email, password) => {
    authpkg.createUserWithEmailAndPassword(authpkg.getAuth(app), email, password)
    .then((value) => {console.log(value)})
    .catch((error) => {console.log(error)});
}

export async function login(email, password) {
    const creds = await authpkg.signInWithEmailAndPassword(authpkg.getAuth(app), email, password)
    .then(() => window.location.href = '/landing')
    .catch((error) => {console.log(error)});
    // console.log(creds.user !== null);
    loggedIn = true;
}

export var loggedIn = false;

export async function loginWithCreds(credential) {
    const creds = await authpkg.signInWithCredential(authpkg.getAuth(app), credential)
    .catch((error) => {console.log(error)});
    // console.log(creds.user !== null);
    loggedIn = true;
}

export async function logout() {
    authpkg.getAuth(app).signOut()
    .catch((error) => {console.log(error)});
    loggedIn = false;
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