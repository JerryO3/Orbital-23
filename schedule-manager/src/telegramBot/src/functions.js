const { getDatabase, ref, set, remove, get, update, onValue, query, orderByChild, equalTo, child } = require("firebase/database");
const schedule = require('node-schedule');
const admin = require('firebase-admin');
const {checkClash} = require('./checkClash')
const { Scenes, Markup } = require('telegraf');

const db = admin.database()

async function userIdFromTele(telegramHandle) {
    try {
        // Construct the Firebase database reference to the users node
        const usersRef = db.ref('users');

        // Query the users node to find the matching user by Telegram handle
        const querySnapshot = await usersRef.orderByChild('telegramHandle').equalTo(telegramHandle).once('value');
        const results = querySnapshot.val();

        // Get the unique ID of the matching user
        const uniqueId = results ? Object.keys(results)[0] : null;

        return uniqueId;
    } catch (error) {
        // Handle any potential errors here
        console.error('Error while querying the database:', error);
        throw error;
    }
}

const getItem = async (dbRef, id) => {
    const path = db.ref(dbRef + id)
    const result = await get(path).then(snapshot => snapshot.exists ? snapshot.val() : null)
    return result;
}

async function memberQuery(userId, field) {
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

function compareArrays(arr1, arr2) {
  // Sort the arrays
  const sortedArray1 = arr1.slice().sort();
  const sortedArray2 = arr2.slice().sort();

  // Compare the sorted arrays
  return (
    sortedArray1.length === sortedArray2.length &&
    sortedArray1.every((value, index) => value === sortedArray2[index])
  );
}

async function newEvent(projectId, eventId, eventName, startDateTime, endDateTime, members, ctx) {
  // console.log(members)
  const db = getDatabase();

  if (startDateTime > endDateTime) {
      ctx.reply('Start Date/Time cannot be after End Date/Time')
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
      const clashCheckResult = await checkClash(allItems, startDateTime, endDateTime);
      return [member, clashCheckResult];
    });

  if (members.length === 1) {
      // console.log(memberPromises[0]);
      return memberPromises[0]
      .then(x => !x[1].clash ? updater(x[0]) : false) // works for single-user projects! 
      .then(x => {
          // console.log(x); 
          return x;});
    
  } else {
  return memberPromises
  .reduce((x,y) => (x.then(a => y.then(b => Array.isArray(a[0]) ? a.concat([b]) : [a,b])))) 
  // ^ reduces array of promises into a promise that returns an array
  .then(x => x.reduce((a,b) => Array.isArray(a) ? !a[1].clash && !b[1].clash : a && !b[1].clash) // checks all members if clear
      ? x.map(y => {console.log(y[0]); updater(y[0]);}) // applies updater using map 
      : x.filter(y => y[1].clash) // filters out clashing people to be printed out
      )
  .then(x => {console.log(x); return false}) // prints out clashing people
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
      ctx.reply("Event created successfully!");
  }

}

module.exports = {
  userIdFromTele,
  getItem,
  memberQuery,
  compareArrays,
  newEvent,
};
