const admin = require('firebase-admin');

const firebaseConfig = {
    credential: admin.credential.cert('../../backend/schedule-manager-94579-firebase-adminsdk-fthrd-8ced395d08.json'),
    apiKey: "AIzaSyAt_7XlSnzjPny4ehAjLhFqqIebvAV_v9s",
    authDomain: "schedule-manager-94579.firebaseapp.com",
    databaseURL: "https://schedule-manager-94579-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "schedule-manager-94579",
    storageBucket: "schedule-manager-94579.appspot.com",
    messagingSenderId: "764458942352",
    appId: "1:764458942352:web:a3ab85410368e1248d7d15",
    measurementId: "G-R7DMDK6E0W"
};

const app = admin.initializeApp(firebaseConfig);

const { Telegraf, Markup, session } = require('telegraf');
const { initBot } = require('./functions');
const handlers = require('./handlerPrivate');
const fn = require('./functions')
const { DateTime } = require("luxon");

const bot = new Telegraf('5830359943:AAFZrRToBTuipxAwQtzien82xZ7uJk7MdCc');
// Initialize the session middleware
bot.use(session());

bot.command('start', ctx => {
    const chatType = ctx.message.chat.type;
    if (chatType === 'private') {
        handlers.handleStart(ctx)
    }

    if (chatType === 'group' || chatType === 'supergroup') {
        handlers.handleSetup(ctx)
    }
})

bot.command('projects', ctx => {
    const chatType = ctx.message.chat.type;
    if (chatType === 'private') {
        handlers.handleProjects(ctx)
    }
})

bot.on('callback_query', async (query) => {
    const data = query.update.callback_query.data;
  
    if (data.startsWith('create_')) {
      const projectId = data.split('_')[1];
  
      // Initialize session data
      query.session = query.session || {};
      query.session.createState = 'awaiting_name';
      query.session.projectId = projectId;
  
      // Ask for the event name
      await query.reply('Please enter the event name:');
    } else {
      // Handle other button callbacks here
      handlers.handleCallback(query);
    }
  });

bot.command('upcoming', ctx => {
    const chatType = ctx.message.chat.type;
    if (chatType === 'private') {
        handlers.handleUpcoming(ctx)
    }
})

bot.command('events', ctx => {
    const chatType = ctx.message.chat.type;
    if (chatType === 'group' || chatType === 'supergroup') {
        handlers.handleEvent(ctx)
    }
})

bot.command('create', async (ctx) => {
  const chatType = ctx.message.chat.type;
  const telegramHandle = ctx.from.username;
  const userId = await fn.userIdFromTele(telegramHandle);
  const db = admin.database();


  if (chatType === 'private') {
    const membership = await (await db.ref('membership/' + userId + '/projects').get()).val();

    if (membership) {
      const keyboard = {
        inline_keyboard: [],
      };

      for (const projectId in membership) {
        const project = await (await db.ref('projects/' + projectId).get()).val();

        if (project) {
          const button = {
            text: project.name,
            callback_data: `create_${projectId}`,
          };
          keyboard.inline_keyboard.push([button]);
        }
      }

      if (keyboard.inline_keyboard.length > 0) {
        const replyMessage = 'Select a project:';
        ctx.reply(replyMessage, { reply_markup: keyboard });
        // Don't proceed to the next steps here, as we are waiting for the user to click a button.
      } else {
        ctx.reply('You have no projects.');
      }
    } else {
      ctx.reply('You have no projects.');
    }
  }
});

// Listen for the "text" event globally outside the "callback_query" event
bot.on('message', async (ctx) => {
    const message = ctx.message;
    const query = ctx.callbackQuery;
    const state = ctx.session.createState;
    const telegramHandle = ctx.from.username;
    const userId = await fn.userIdFromTele(telegramHandle);
  
    if (state === 'awaiting_name') {
      // Now you have the event name, you can prompt for the event start and end date/time
      ctx.session.eventName = message.text;
      await ctx.reply('Please enter the event start date and time (YYYY-MM-DD HH:mm):');
      ctx.session.createState = 'awaiting_start';
    } else if (state === 'awaiting_start') {
      // Now you have the event start date and time, you can prompt for the event end date and time
      ctx.session.eventStart = message.text;
      await ctx.reply('Please enter the event end date and time (YYYY-MM-DD HH:mm):');
      ctx.session.createState = 'awaiting_end';
    } else if (state === 'awaiting_end') {
      ctx.session.eventEnd = message.text;
      await ctx.reply("Please enter the members' Telegram handles (separated by commas, omit the @):");
      ctx.session.createState = 'awaiting_members';
    } else if (state === 'awaiting_members') {
      const members = message.text;
      const members_list = members.split(',');
      // Fetch the list of group members from the database
      const otherMembers = await Promise.all(members_list.map((member) => fn.userIdFromTele(member)));
      const usernames = [userId, ...otherMembers]
    //   console.log(usernames)

    //   const eventId = uuidv4();
      // Query the database to check for event clashes
      const projectId = ctx.session.projectId;
      const eventName = ctx.session.eventName;
      const eventStart = DateTime.fromFormat(ctx.session.eventStart, "yyyy-MM-dd HH:mm")
      const eventEnd = DateTime.fromFormat(ctx.session.eventEnd, "yyyy-MM-dd HH:mm")
      fn.newEvent(projectId, null, eventName, eventStart, eventEnd, usernames, ctx);
  
      ctx.session.createState = 'awaiting_name';
  
      // Reset the session properties
      delete ctx.session.projectId;
      delete ctx.session.eventName;
      delete ctx.session.eventStart;
      delete ctx.session.eventEnd;
    }
});

bot.launch().then(() => {
    console.log('Bot is running!');
});

module.exports = bot;