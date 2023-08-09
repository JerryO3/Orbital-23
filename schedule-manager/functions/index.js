const admin = require('firebase-admin');

const firebaseConfig = {
    credential: admin.credential.cert(
      {
        "type": "service_account",
        "project_id": "schedule-manager-94579",
        "private_key_id": "8ced395d08e2f4f4d1e894f01ddcf5565d880d8d",
        "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDMrxzHwLJe1F8y\nSXDrH199loQTokH1JzzYYYUugd03xqyO0YFsFvXOGldAP6ceeEJr0IWzbR/pOiJ1\no4zZpnOGpXo3Em3slTI9c5494Wlto+ym7O9OsrMv3Lmg46+SNrvWft3Fx3vTdMqF\nu0YWwMPflapGVLLmOxQtZ0/XBCwMvfc2TgghH0lyPca06jMnyItF+ajVhl7nU+im\n2vVD7rPZHOo4pSqmNpio/zzd4Fk+4uCpdhkFOwRUgA+v/WF602vI+kiOd3mR2Vk8\nhln5LPR6znQht2aecVr104eSnfitzV/cxqdnQ0aJMq5CN1gGXrk+KnuQSt7YVKMe\nvjEz8QczAgMBAAECggEAE0ntTGW8aXNaBUMmgQHT3eHxUGhaDuBDu6B1DIzwa/Et\nEchsieMgBuw0jLly5kwu9joQX3hJKZFw7eUbwOcOvAGcItR5x3HH6kKbBvnXFZ39\nDz4Ez0XH3RrP43mRchX2XaBXBexmnubCrxeW404HJ2rTQQ16TngCzsSNoZWjERAq\nfFjj0WQf7RHWPF7bJWzd8Q4fhL4vq6egBzMVexBiBaarkC28/3NOIEouqmhbhSIX\nRuh5ELwbxixA5cRlxPy3JYDDjxVbLnjKQ4lPoBl7JnAEq36lID1VLJOFi5be165F\nwSRoQjaCn3QQvnqxre2KblbiHzSvfIIVEN/H06WyAQKBgQD9vnfTpC9Sz3LaLXqX\navjGFoib2ED9tmrMmqB6G28CNXyGK3Xv0HMU0Na9OZLyvc7ZPknGQ5/naI7ji/5B\nPqyRnuEhR8yMd2SKGuCnodR3mDYNW22GgeEtVVRfL348J4Acs0l43MpwZNy+iXsW\n71HAeiU0sJPsrcqEIAz3AKLNaQKBgQDOgPtWjIZ1Qo3FeUwlgh3jx3r5oytU2Gai\nuoY5k7I4BWvyW7ihv917Etb3fjVHb+8Jss95gQ9R4lMI6BaF+w3Pdgov53Vxlk/4\nZyLpqTTfC0BlolZzZBaWAPccfHmAO3p3lIIZCy+uw+SE1sTek8RVyUWW3sTteWWU\nQs1ig6gwOwKBgALySD/r4yTKBeJkrsy9UEA0mMd+flqz2I+hqAVi9ioHZvfD3222\ndO+j8SpnVb59174MDB1CQcQVIbugr4YgbS6PsruJMuXaqQ81erBXn7j3yoDjM+Vg\n8rVtDTrBuWyHZORwbIT7w1oEwc9wlz5P7xoWEQKInl8cMYLRQHVJy5opAoGBAIPa\ny6EpvTjmNAvhNYPFnzwvxQ/c5fAY9P/2xXnCGsu2eoSXmD5/efX5w5Tn2zEwAZtZ\ntyxIAfYw4wAO4ULPWLQdFMgdrFnItmtPv3Ue+4lnb8j1bOnlAJ7rIt3nhNUiJUJx\nath+0gVvQ1ymnbHY/EYia/K3b1qKZxfRx76dfii9AoGBANMGXgvvuDqwqeehIk8h\nXcl6VQ6/uwKGF4m+A/gVWfdpuE2DEUuARM7h0g/3LoefbiHdnGtWcIaOXLQhWEQ7\n3DxjxyHXbxa8wyuqoWO1/CpbpAjrE0USfQ5ukwbcaRwCkknW7SunN8plNvf7NyFO\njpFNumVGDN4TAKpg2Tf4hMLj\n-----END PRIVATE KEY-----\n",
        "client_email": "firebase-adminsdk-fthrd@schedule-manager-94579.iam.gserviceaccount.com",
        "client_id": "112432047566554275804",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fthrd%40schedule-manager-94579.iam.gserviceaccount.com",
        "universe_domain": "googleapis.com"
      }
      ),
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