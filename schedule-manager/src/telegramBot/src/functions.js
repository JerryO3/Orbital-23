const { getDatabase, ref, set, remove, get, update, onValue, query, orderByChild, equalTo, child } = require("firebase/database");
const schedule = require('node-schedule');
const admin = require('firebase-admin');
const {checkClash} = require('./checkClash')
const { Scenes, Markup } = require('telegraf');
const { v4: uuidv4 } = require('uuid');

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
  console.log(members)
  if (startDateTime > endDateTime) {
      ctx.reply('Start Date/Time cannot be after End Date/Time')
      return;
  }

  const uniqueId = eventId === null ? uuidv4() : eventId;

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
      return memberPromises[0]
      .then(x => !x[1].clash ? updater(x[0]) : ctx.reply('Unable to create event due to clash')) // works for single-user projects! 
      .then(x => {
          return x;});
    
  } else {
  return memberPromises
  .reduce((x,y) => (x.then(a => y.then(b => Array.isArray(a[0]) ? a.concat([b]) : [a,b])))) 
  // ^ reduces array of promises into a promise that returns an array
  .then(x => x.reduce((a,b) => Array.isArray(a) ? !a[1].clash && !b[1].clash : a && !b[1].clash) // checks all members if clear
      ? x.map(y => {ctx.reply("Event created successfully!"); updater(y[0]);}) // applies updater using map 
      : ctx.reply('Unable to create event due to clash') // filters out clashing people to be printed out
      );
  }  

  function updater(uid) {
      db.ref("/events/" + uniqueId).update({// helps to update while within promise wrapper
        name: eventName,
        startDateTime: startDateTime.toMillis(),
        endDateTime: endDateTime.toMillis(),
        projectId : projectId,
      });
      db.ref("/events/" + uniqueId + '/members').update({
        [uid] : true,
      });
      db.ref("/membership/" + uid + "/events").update({
        [uniqueId] : true
      });
  }

}

module.exports = {
  userIdFromTele,
  getItem,
  memberQuery,
  compareArrays,
  newEvent,
};
