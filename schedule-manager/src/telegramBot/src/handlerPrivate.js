const { getDatabase, ref, set, remove, get, update, onValue, query, orderByChild, equalTo, child } = require("firebase/database");
const bot = require('./app')
const fn = require('./functions')
const admin = require('firebase-admin');
const { DateTime } = require("luxon");
const {checkClash} = require('./checkClash');
const { v4: uuidv4 } = require('uuid');

const db = admin.database();
let userId = null;
let chatId = null;
let projectId = null;
let isStarted = !(userId === null || chatId === null);
let isSetup = projectId !== null;

async function handleStart(ctx) {
    const telegramHandle = ctx.from.username;
    userId = await fn.userIdFromTele(telegramHandle)
    chatId = ctx.chat.id;
    isStarted = true
    ctx.reply('Hello there! Welcome to Schedule Manager.', {
    })
}

async function handleProjects(ctx) {
  if (!isStarted) {
    ctx.reply("Please start the bot by typing /start.");
    return;
  }

  try {
      membership = await (await db.ref('membership/' + userId + '/projects').get()).val()
      if (membership) {
          const keyboard = {
              inline_keyboard : []
          }

          for (const projectId in membership) {
              const project = await (await db.ref('projects/' + projectId).get()).val()
              if (project) {
                const button = {
                  text: project.name,
                  callback_data: `project_${projectId}`
                };
                keyboard.inline_keyboard.push([button]);
              }
          }
          if (keyboard.inline_keyboard.length > 0) {
              const replyMessage = "Select a project:";
              // console.log(keyboard)
              ctx.reply(replyMessage, { reply_markup: keyboard });
          } else {
            ctx.reply("You have no projects.");
          }
      } else {
        ctx.reply("You have no projects. ");
      }
  } catch (error) {
  // Handle any potential errors here
  console.error('Error handling /projects command:', error);
  }
};

async function handleCallback(query) {
  // Callback query handler for "project_" selection
  const data = query.update.callback_query.data
  if (data.startsWith("project_")) {
      const projectId = data.split("_")[1];
      const projectRef = db.ref(`/projects/${projectId}`);
      const projectSnapshot = await projectRef.once('value');
      const project = projectSnapshot.val();
    
      if (project && project.name) {
        const projectName = project.name;
        const eventsRef = db.ref('events');
        const eventsSnapshot = await eventsRef.orderByChild('projectId').equalTo(projectId).once('value');
        const events = eventsSnapshot.val();
    
        if (events) {
          let replyMessage = `Events for Project: ${projectName}\n`;
          const keyboard = {
            inline_keyboard: []
          };
    
          for (const eventId in events) {
            const eventData = events[eventId];
            const eventName = eventData.name;
            const eventCallbackData = `event_${eventId}`;
            const button = {
              text: eventName,
              callback_data: eventCallbackData
            };
            keyboard.inline_keyboard.push([button]);
            replyMessage += `- ${eventName}\n`;
          }
    
          replyMessage += "\nSelect an event:";
          query.reply(replyMessage, { reply_markup: keyboard });
        } else {
          query.reply("No events found for the selected project.");
        }
      } else {
        query.reply("Project not found.");
      }
  }

  if (data.startsWith("event_")) {
    const eventId = data.split("_")[1];
    const eventRef = db.ref(`/events/${eventId}`);
    const eventSnapshot = await eventRef.once('value');
    const event = eventSnapshot.val();

    if (event) {
      const event_name = event.name;
      const event_start =  DateTime.fromMillis(event.startDateTime).toFormat("yyyy-MM-dd HH:mm");
      const event_end = DateTime.fromMillis(event.endDateTime).toFormat("yyyy-MM-dd HH:mm");
  
      let reply_message = `Event: ${event_name}\nStart: ${event_start}\nEnd: ${event_end}\n`;
  
      if (event.members) {
        reply_message += "\nMembers:\n";
        // Loop through the members object and append their details to the reply message
        for (const member_id in event.members) {
          // Implement your logic to get member details from the database using member_id
          // For example, you can use "member_id" to fetch member details from your database.
          // Replace the following dummy data with actual data fetched from the database.
          member_ref = db.ref('users/' + member_id)
          memberSnapshot = await member_ref.get()
          // console.log(memberSnapshot)
          const member = memberSnapshot.val();

          if (member && member.telegramHandle) {
            const memberName = member.telegramHandle;
            reply_message += `@${memberName}\n`;
          }
        }
      } else {
        reply_message += "\nNo members found for this event.";
      }
  
      // Create InlineKeyboardMarkup for buttons (Optional: if you want to add buttons to the message)
      const keyboard = {
        inline_keyboard: [],
      };
  
      // Send the event details message with buttons (Optional: pass the "keyboard" as the second parameter)
      await query.reply(reply_message, keyboard);
    } else {
      const reply_message = "Event not found.";
      query.reply(reply_message);
    }
  }

  if (data.startsWith("setup_")) {
    projectId = data.split("_")[2];
    isSetup = true;

    const reply_message = "Bot now set up.";
    query.reply(reply_message);
  }
};

// Handler for /upcoming command
async function handleUpcoming(ctx) {
  // Your logic for /reminder command
  if (!isStarted) {
    ctx.reply("Please start the bot by typing /start.");
    return;
  }

  const events = await fn.memberQuery(userId, 'events/')

  // Filter upcoming events within the upcoming week
  const now = DateTime.local();
  const upcomingWeek = now.plus({ days: 7 });

  const upcomingEvents = events.filter(event => {
    const eventStart = DateTime.fromMillis(event.startDateTime);
    return eventStart >= now && eventStart <= upcomingWeek;
  });

  if (upcomingEvents.length > 0) {
    // Build the reply message with upcoming events
    let replyMessage = "Upcoming Events in the Upcoming Week:\n";
    const promises = upcomingEvents.map(async event => {
      const projectId = event.projectId;
      const project = await db.ref('projects/' + projectId).get();
      const projectName = project.val().name;
      const eventStart = DateTime.fromMillis(event.startDateTime).toFormat("yyyy-MM-dd HH:mm");
      replyMessage += `- ${event.name} for ${projectName} (${eventStart})\n`;
    });

// Wait for all the asynchronous operations to complete
await Promise.all(promises);
    // Send the reply message
    await ctx.reply(replyMessage);
  } else {
    // If no upcoming events found
    ctx.reply("No upcoming events in the upcoming week.");
  }
}

async function handleSetup(ctx) {
  const groupId = ctx.chat.id; // Group ID of the chat
  const chatMembers = await ctx.getChatAdministrators();
  const usernames = await Promise.all(
    chatMembers
      .filter((member) => member.user.username !== undefined)
      .map((member) => fn.userIdFromTele(member.user.username))
  );

  // Fetch the list of projects from the database
  const projectsRef = db.ref('projects');
  const projectsSnapshot = await projectsRef.once('value');
  const projects = projectsSnapshot.val();

  // Filter the projects based on matching members
  const projectsMatchingMembers = [];
  for (const projectId in projects) {
    const project = projects[projectId];
    const projectMembers = project.members;

    // Check if projectMembers is an array, if it's an object with user IDs as keys, convert it to an array of usernames
    const projectMembersArray = Array.isArray(projectMembers) ? projectMembers : Object.keys(projectMembers);

    // Check if the projectMembers match exactly with the usernames
    const isMatchingMembers = fn.compareArrays(usernames, projectMembersArray);

    // If the members match exactly, add the project to the list
    if (isMatchingMembers) {
      // Create a new object that includes both the project details and the projectId
      const matchingProject = {
        id: projectId,
        ...project, // This will include all the properties of the "project" object
      };
      projectsMatchingMembers.push(matchingProject);
    }
  }

  // Build the reply message with the list of projects and create the inline keyboard markup
  const keyboard = {
    inline_keyboard: []
  };

  let replyMessage = 'Please select a project for this group:\n';
  for (const project of projectsMatchingMembers) {
    const button = {
      text: project.name,
      callback_data: `setup_project_${project.id}`, // Replace "id" with the actual ID of the project
    };
    keyboard.inline_keyboard.push([button]);
  }

  if (keyboard.inline_keyboard.length > 0) {
    // Send the reply message with the list of projects and the inline keyboard
    ctx.reply(replyMessage, { reply_markup: keyboard });
  } else {
    ctx.reply("There are no existing projects with all current members.");
  }
}

async function handleEvent(ctx) {
  if (!isSetup) {
    ctx.reply("Please setup the bot by typing /start.");
    return;
  }

  const projectRef = db.ref(`/projects/${projectId}`);
  const projectSnapshot = await projectRef.once('value');
  const project = projectSnapshot.val();
  const projectName = project.name;
  const eventsRef = db.ref('events');
  const eventsSnapshot = await eventsRef.orderByChild('projectId').equalTo(projectId).once('value');
  const events = eventsSnapshot.val();

  console.log(projectId)

  if (events) {
    let replyMessage = `Events for Project: ${projectName}\n`;
    const keyboard = {
      inline_keyboard: []
    };

    for (const eventId in events) {
      const eventData = events[eventId];
      const eventName = eventData.name;
      const eventCallbackData = `event_${eventId}`;
      const button = {
        text: eventName,
        callback_data: eventCallbackData
      };
      keyboard.inline_keyboard.push([button]);
      replyMessage += `- ${eventName}\n`;
    }

    replyMessage += "\nSelect an event:";
    ctx.reply(replyMessage, { reply_markup: keyboard });
  } else {
    ctx.reply("No events found for the selected project.");
  }
}

// Function to handle the /create command
async function handleCreate(ctx) {
  // Ask the user for the event name
  ctx.reply("Please enter the event name:");

  // Register the next message handler to get the event name
  bot.on(message("text"), async (message) => {
    const eventName = message.text;
    // Now you have the event name, you can prompt for the event start and end date/time

    // Ask the user for the event start date and time
    ctx.reply("Please enter the event start date and time (YYYY-MM-DD HH:mm):");

    // Register the next message handler to get the event start date and time
    bot.on(message("text"), async (message) => {
      const eventStart = message.text;
      // Now you have the event start date and time, you can prompt for the event end date and time

      // Ask the user for the event end date and time
      ctx.reply("Please enter the event end date and time (YYYY-MM-DD HH:mm):");

      // Register the next message handler to get the event end date and time
      bot.on(message("text"), async (message) => {
        const eventEnd = message.text;
        // Now you have all the event details, you can check for event clashes with existing events

        // Fetch the list of group members from the database
        const groupId = ctx.chat.id; // Group ID of the chat
        const chatMembers = await ctx.getChatAdministrators();
        const usernames = await Promise.all(
          chatMembers
            .filter((member) => member.user.username !== undefined)
            .map((member) => fn.userIdFromTele(member.user.username))
        );
        
        const eventId = uuidv4();
        // Query the database to check for event clashes
        fn.newEvent(projectId, eventId, eventName, eventStart, eventEnd, usernames, ctx)

        // Clear the message handlers to prevent multiple event creations
        bot.removeMiddleware();
      })
    })
  })
}

module.exports = {
  handleStart,
  handleProjects,
  handleCallback,
  handleUpcoming,
  handleSetup,
  handleEvent,
  handleCreate,
}