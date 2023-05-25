import { getDatabase, ref, set, child, get } from "firebase/database";

const readData = (username, password) => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `users/${username}`)).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val().password == password);
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
}

export default readData;