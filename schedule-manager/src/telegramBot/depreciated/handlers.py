# handlers.py

import telebot
from initialize import bot
from functions import get_unique_id_by_telegram_handle, dt, remove_event, member_query, to_millis
from firebase_admin import db
from telebot import types
from telebot.types import ReplyKeyboardMarkup, KeyboardButton, ReplyKeyboardRemove
import time
from datetime import datetime, timedelta
import schedule
import threading
from checkClash import check_clash
import uuid

user_id = None
chat_id = None
scheduled_reminders = {}
is_bot_started = False

# Handle the /start command
@bot.message_handler(commands=['start'])
def handle_start(message):
    global is_bot_started
    is_bot_started = True
    global user_id
    global chat_id
    telegram_handle = message.from_user.username
    user_id = get_unique_id_by_telegram_handle(telegram_handle)
    chat_id = message.chat.id
    bot.reply_to(message, "Hello! Welcome to your Telegram bot.")

# Handle the /help command
@bot.message_handler(commands=['help'])
def handle_help(message):
    bot.reply_to(message, "This is a sample bot. Available commands:\n/start - Start the bot\n/help - Display help message")

# Handler for the /projects command
@bot.message_handler(commands=['projects'])
def handle_projects_command(message):
    global is_bot_started
    if not is_bot_started:
        bot.reply_to(message, "Please start the bot by typing /start.")
        return
    
    unique_id = user_id

    membership = db.reference(f'membership/{unique_id}/projects')
    items = membership.get()

    if items:
        keyboard = types.InlineKeyboardMarkup()
        for item_id in items:
            project_ref = db.reference(f'/projects/{item_id}')
            project = project_ref.get()
            if project is not None and 'name' in project:
                project_name = project['name']
                button = types.InlineKeyboardButton(text=project_name, callback_data=f"project_{item_id}")
                keyboard.add(button)

        if keyboard.keyboard:
            reply_message = "Select a project:"
            bot.send_message(message.chat.id, reply_message, reply_markup=keyboard)
        else:
            bot.send_message(message.chat.id, "You have no projects.")
    else:
        bot.send_message(message.chat.id, "You have no projects.")

# On choosing a project, displays all events.
@bot.callback_query_handler(func=lambda call: call.data.startswith("project_"))
def handle_project_selection(call):
    project_id = call.data.split("_")[1]
    project_ref = db.reference(f'/projects/{project_id}')
    project = project_ref.get()

    if project is not None and 'name' in project:
        project_name = project['name']
        events_ref = db.reference('events')
        events = events_ref.order_by_child('projectId').equal_to(project_id).get()

        if events:
            reply_message = f"Events for Project: {project_name}\n"
            keyboard = types.InlineKeyboardMarkup()
            for event_id, event_data in events.items():
                event_name = event_data['name']
                event_callback_data = f"event_{event_id}"  # Add a prefix to differentiate event callbacks
                button = types.InlineKeyboardButton(text=event_name, callback_data=event_callback_data)
                keyboard.add(button)
                reply_message += f"- {event_name}\n"

            # # Add "Create Event" button
            # create_event_callback_data = f"create_event_{project_id}"  # Unique callback for "Create Event" button
            # create_event_button = types.InlineKeyboardButton(text="Create Event", callback_data=create_event_callback_data)
            # keyboard.add(create_event_button)

            reply_message += "\nSelect an event:"
            bot.send_message(call.message.chat.id, reply_message, reply_markup=keyboard)
            
            
        else:
            reply_message = "No events found for the selected project."
            bot.send_message(call.message.chat.id, reply_message)

            # # Add "Create Event" button
            # create_event_callback_data = f"create_event_{project_id}"  # Unique callback for "Create Event" button
            # create_event_button = types.InlineKeyboardButton(text="Create Event", callback_data=create_event_callback_data)
            # keyboard.add(create_event_button)
    

    else:
        reply_message = "Project not found."
        bot.send_message(call.message.chat.id, reply_message)

# New function to handle "Create Event" button callback
@bot.callback_query_handler(func=lambda call: call.data.startswith("create_event_"))
async def handle_create_event(call):
    chat_id = call.message.chat.id
    event_data = {}

    # Function to request input for event name
    async def request_event_name(message):
        event_name = message.text
        event_data['name'] = event_name
        # Request input for start date
        await bot.send_message(chat_id, "Please enter the start date (YYYY-MM-DD HH:MM):", reply_markup=ReplyKeyboardRemove())
        await bot.register_next_step_handler(message, request_start_date)

    # Function to request input for start date
    async def request_start_date(message):
        start_date = message.text
        # You can add validation logic here to ensure that the provided date is in the correct format
        event_data['start_date'] = to_millis(start_date)
        # Request input for end date
        await bot.send_message(chat_id, "Please enter the end date (YYYY-MM-DD HH:MM):", reply_markup=ReplyKeyboardRemove())
        await bot.register_next_step_handler(message, request_end_date)

    # Function to request input for end date
    async def request_end_date(message):
        end_date = message.text
        # You can add validation logic here to ensure that the provided date is in the correct format
        event_data['end_date'] = to_millis(end_date)
        # Request input for members
        await bot.send_message(chat_id, "Please enter the members' Telegram handles (separated by commas, omit the @):", reply_markup=ReplyKeyboardRemove())
        await bot.register_next_step_handler(message, request_members)

    # Function to request input for members
    async def request_members(message):
        members = message.text
        # You can process the members' input here as needed (e.g., split by commas, remove '@' symbols)
        # Split the input string of members into individual items using a comma as the delimiter
        members_list = members.split(',')

        # Remove any leading or trailing whitespace from each member
        unique_ids = []
        for member in members_list:
            unique_id = await get_unique_id_by_telegram_handle(member.strip())
            unique_ids.append(unique_id)

        # Combine the user_id with the unique_ids list
        members_list = [user_id] + unique_ids

        # Now you have all the required details to create the event in the database
        # You can use the `event_data` dictionary to create the event
        # For example, you can use the project_id, event_data['name'], event_data['start_date'],
        # event_data['end_date'], and event_data['members'] to create the event in the database.
        print(event_data)
        for mem in members_list:
            if (not check_clash(mem, event_data)):
                await bot.send_message(chat_id, f"Event '{event_data['name']}' clashes with an existing event/period!")

        event_id = str(uuid.uuid4())
        event_ref = db.reference(f'/events/{event_id}')
        event_details = {
            'name': event_data['name'],
            'startDateTime' : event_data['start_date'],
            'endDateTime' : event_data['end_date']
        }
        for member_id in members_list:
            if member_id is not None:
                event_details['members/' + member_id] = True
        event_ref.update(event_details)

        # After creating the event, you can send a confirmation message to the user
        await bot.send_message(chat_id, f"Event '{event_data['name']}' has been created!")

    # Request the user to input the event name
    await bot.send_message(chat_id, "Please enter the name of the event:", reply_markup=ReplyKeyboardRemove())
    # Register the `request_event_name` function as the next message handler
    await bot.register_next_step_handler(call.message, request_event_name)

# On choosing an event, displays the details.
@bot.callback_query_handler(func=lambda call: call.data.startswith("event_"))
def handle_event_selection(call):
    event_id = call.data.split("_")[1]
    event_ref = db.reference(f'/events/{event_id}')
    event = event_ref.get()

    if event is not None:
        event_name = event['name']
        event_start = dt(event['startDateTime'])
        event_end = dt(event['endDateTime'])
        
        members_ref = db.reference(f'/events/{event_id}/members')
        members = members_ref.get()

        reply_message = f"Event: {event_name}\nStart: {event_start}\nEnd: {event_end}"
        
        if members:
            reply_message += "\n\nMembers:\n"
            for member_id in members.keys():
                member_ref = db.reference(f'/users/{member_id}')
                member = member_ref.get()
                if member is not None and 'telegramHandle' in member:
                    member_name = member['telegramHandle']
                    reply_message += f"@{member_name}\n"
        else:
            reply_message += "\nNo members found for this event."
        
        # Create InlineKeyboardMarkup for buttons
        keyboard = types.InlineKeyboardMarkup()
        
        # Add Update Event button
        update_button = types.InlineKeyboardButton(text="Update Event", callback_data=f"update_{event_id}")
        keyboard.add(update_button)
        
        # Add Remove Event button
        remove_button = types.InlineKeyboardButton(text="Delete Event", callback_data=f"remove_{event_id}")
        keyboard.add(remove_button)
        
        # Send the event details message with buttons
        bot.send_message(call.message.chat.id, reply_message, reply_markup=keyboard)
    else:
        reply_message = "Event not found."
        bot.send_message(call.message.chat.id, reply_message)

# Handler for the /reminder command
@bot.message_handler(commands=['reminder'])
def handle_projects_command(message):
    global is_bot_started
    if not is_bot_started:
        bot.reply_to(message, "Please start the bot by typing /start.")
        return
    
    global scheduled_reminders
    scheduled_reminders = {}
    bot.send_message(message.chat.id, "Enter the number of days for the reminder:")
    bot.register_next_step_handler(message, lambda message: handle_reminder_input(message))

def handle_reminder_input(message):
    unique_id = user_id

    # Parse the input and validate if it is a valid number
    try:
        days = int(message.text)
        if days <= 0:
            raise ValueError()
    except ValueError:
        bot.send_message(message.chat.id, "Invalid input. Please enter a positive number of days.")
        return
    
    # Set reminder duration
    reminder_duration = {
        'reminderDuration': days
    }

    reminder_ref = db.reference(f'/users/{unique_id}')
    reminder_ref.update(reminder_duration)

    check_reminders()


# Function to send a reminder message
def send_reminder(event_name):
    # Send the reminder message to the chat ID
    bot.send_message(chat_id, f"Reminder: Upcoming event - {event_name}")

    # Remove the event_name from scheduled_reminders
    if event_name in scheduled_reminders:
        del scheduled_reminders[event_name]

def set_reminder(event_name, reminder_date):
    global scheduled_reminders

    # Check if the event name is already in the dictionary
    if event_name in scheduled_reminders:
        # Check if the reminder date is already in the list
        if reminder_date in scheduled_reminders[event_name]:
            print(f"A reminder for the event '{event_name}' on {reminder_date} has already been scheduled.")
            return
        else:
            scheduled_reminders[event_name].append(reminder_date)
    else:
        scheduled_reminders[event_name] = [reminder_date]

    # Get the current date and time
    current_time = datetime.now()
    print(current_time)

    # Calculate the time difference between the current time and the reminder date
    time_difference = (reminder_date - current_time).total_seconds()

    if time_difference <= 0:
        print(f"The reminder date for the event '{event_name}' on {reminder_date} has already passed.")
        return

    # Schedule the reminder message
    schedule.every(time_difference).seconds.do(send_reminder, event_name)

    bot.send_message(chat_id, f"Reminder scheduled for the event '{event_name}' on {reminder_date}.")

    print(f"Reminder scheduled for the event '{event_name}' on {reminder_date}.")

# Function to schedule a reminder
def check_reminders():
    unique_id = user_id

    # Obtain the notification duration
    reminder_ref = db.reference(f'/users/{unique_id}/reminderDuration')
    reminder_duration_data = reminder_ref.get()
    reminder_duration_in_days = int(reminder_duration_data)
    reminder_timedelta = timedelta(days=reminder_duration_in_days)

    # Obtain the events array, then map it to the start date time.
    events_arr = member_query(user_id, 'events')
    events_names = []
    start_date_times = []

    for item in events_arr:
        # Get the first key (event_id) in the item dictionary
        event_id = list(item.keys())[0]

        # Get the event_data corresponding to the event_id
        event_data = item[event_id]

        # Access the value corresponding to the 'name' key in the event_data dictionary
        event_name = event_data['name']
        start_dt = dt(event_data['startDateTime'])

        # Append the event name to the events_names list
        events_names.append(event_name)
        start_date_times.append(start_dt)

    # Obtain an array of reminder dates
    date_format = "%Y-%m-%d %H:%M:%S"
    reminder_dates = [datetime.strptime(start_date, date_format) - reminder_timedelta for start_date in start_date_times]

    # Combine event_names and reminder_dates into an array of tuples
    event_info = list(zip(events_names, reminder_dates))

    # Loop through the event_info and call set_reminder function on each date
    for event_name, reminder_date in event_info:
        # Call the set_reminder function passing event_name and reminder_date as arguments
        set_reminder(event_name, reminder_date)

    # Schedule the check_reminders function to run again after 24 hours
    schedule.every(24).hours.do(check_reminders)

def handle_scheduled_tasks():
    while True:
        schedule.run_pending()
        time.sleep(1)  # Sleep for a short interval (1 second) to avoid high CPU usage

# Start the handle_scheduled_tasks function in a separate thread
task_thread = threading.Thread(target=handle_scheduled_tasks)
task_thread.start()

# Callback query handler for Remove Event button
@bot.callback_query_handler(func=lambda call: call.data.startswith("remove_"))
def handle_remove_event(call):
    event_id = call.data.split("_")[1]
    remove_event(event_id)
    reply_message = "Event deleted successfully."
    bot.send_message(call.message.chat.id, reply_message)

# Handle all other messages
@bot.message_handler(func=lambda message: True)
def handle_message(message):
    bot.reply_to(message, "Sorry, I don't understand. Type /help for available commands.")