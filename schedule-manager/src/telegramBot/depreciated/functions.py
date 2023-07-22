# functions.py

from firebase_admin import db
from datetime import datetime

# Getting the user's ID from their Telegram Handle
async def get_unique_id_by_telegram_handle(telegram_handle):
    # Construct the Firebase database reference to the users node
    users_ref = db.reference('users')

    # Query the users node to find the matching user by Telegram handle
    query = users_ref.order_by_child('telegramHandle').equal_to(telegram_handle)
    results = query.get()

    # Get the unique ID of the matching user
    unique_id = next(iter(results.keys())) if results else None

    return unique_id

# Converts millis to date and time.
def dt(milliseconds):
    datetime_obj = datetime.fromtimestamp(milliseconds / 1000)
    formatted_datetime = datetime_obj.strftime("%Y-%m-%d %H:%M:%S")
    return formatted_datetime

def remove_event(event_id):
    database = db.reference()
    item_ref = database.child('events').child(event_id)
    members_ref = database.child('events').child(event_id).child('members')
    members_snapshot = members_ref.get()
    if members_snapshot is not None:
        members = list(members_snapshot.keys())
        remove_item(members, 'events', event_id)
    item_ref.delete()
    print("Item deleted successfully")

def remove_item(members_arr, field, item_id):
    database = db.reference()
    for member_id in members_arr:
        item_ref = database.child('membership').child(member_id).child(field).child(item_id)
        item_ref.delete()

def member_query(user_id, field):
    # Get a reference to the database
    database = db.reference()

    # Query member's projects
    member_items_ref = database.child("membership").child(user_id).child(field)
    member_items_snapshot = member_items_ref.get()
    print(member_items_snapshot)

    # List to store the project details
    items = []

    if member_items_snapshot:
        item_ids = list(member_items_snapshot.keys())
        print(item_ids)

        # Fetch project details for each project ID
        for item_id in item_ids:
            item_ref = database.child(field).child(item_id)
            item_snapshot = item_ref.get()

            if item_snapshot:
                item_data = item_snapshot
                items.append({item_id: item_data})
    
    return items


def to_millis(start_date_time_str):
    try:
        # Convert the start date and time string to a datetime object
        start_date_time = datetime.strptime(start_date_time_str, "%Y-%m-%d %H:%M")

        # Get the timestamp of the datetime object in seconds
        timestamp_in_seconds = start_date_time.timestamp()

        # Convert the timestamp to milliseconds
        timestamp_in_millis = int(timestamp_in_seconds * 1000)

        return timestamp_in_millis
    except ValueError:
        # Handle the case where the input format is invalid
        return None




