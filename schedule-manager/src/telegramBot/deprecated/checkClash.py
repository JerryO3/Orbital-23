from datetime import datetime
from firebase_admin import db
import json
from functions import member_query

class IntervalEvent:
    interval_start: datetime
    interval_end: datetime
    key: str
    event_info: dict

    def __init__(self, interval_start, interval_end, key, event_info):
        self.interval_start = interval_start
        self.interval_end = interval_end
        self.key = key
        self.event_info = event_info

class ClashWindow:
    clash: bool
    window_start: datetime
    window_end: datetime

    def __init__(self, clash, window_start=None, window_end=None):
        self.clash = clash
        self.window_start = window_start
        self.window_end = window_end

def unpack_from_start_end(jsonObject):
    if isinstance(jsonObject, str):
        jsonObject = json.loads(jsonObject)
    interval_arr = []
    for key in jsonObject:
        interval_arr.append([datetime.fromtimestamp(jsonObject[key]['startDateTime'] / 1000),
                             datetime.fromtimestamp(jsonObject[key]['endDateTime'] / 1000), key, jsonObject[key]])
    print([IntervalEvent(x[0], x[1], x[2], x[3]) for x in interval_arr])
    return [IntervalEvent(x[0], x[1], x[2], x[3]) for x in interval_arr]

def binary_search(arr, start, end):
    if not arr:
        return False

    low = 0
    high = len(arr) - 1

    while low < high:
        mid = low + (high - low) // 2
        if arr[mid][0] <= start < arr[mid][1]:
            return True
        elif arr[mid][0] > start:
            high = mid
        else:
            low = mid + 1
    
    if arr[low][0] <= start < arr[low][1]:
        return True
    elif arr[low][0] > start:
        return arr[low][0] > end
    else:
        return arr[low][1] < start

async def check_clash(mem, event_data):
    items = [await member_query(mem, 'events')] + [await member_query(mem, 'periods')]
    item_dates = []

    for item in items:
        date = (item['startDateTime'] + item['endDateTime'])
        item_dates += [date]
    
    item_dates = item_dates.sort

    start = event_data["start_date"]
    end = event_data["end_date"]

    return binary_search(item_dates, start, end)

