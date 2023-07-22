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

bot.on('callback_query', query => {
        handlers.handleCallback(query)
})

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

// Create command handler
bot.command('create', async (ctx) => {
    const chatType = ctx.message.chat.type;
    if (chatType === 'group' || chatType === 'supergroup') {
        handlers.handleCreate(ctx)
    }
});
  

bot.launch().then(() => {
    console.log('Bot is running!');
});

module.exports = {
    bot,
}