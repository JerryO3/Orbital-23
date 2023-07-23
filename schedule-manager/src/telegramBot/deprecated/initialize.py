# initialize.py

import telebot
import firebase_admin
from firebase_admin import credentials

bot_token = '5830359943:AAFZrRToBTuipxAwQtzien82xZ7uJk7MdCc'
web_app_url = 'http://localhost:3000'  # Replace with your web app's URL

cred = credentials.Certificate('../backend/schedule-manager-94579-firebase-adminsdk-fthrd-8ced395d08.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://schedule-manager-94579-default-rtdb.asia-southeast1.firebasedatabase.app'
})

bot = telebot.TeleBot(bot_token)
