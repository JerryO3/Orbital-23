import * as lux from "luxon";
import { getDatabase, ref, set, remove, get, update, onValue, query, orderByChild } from "firebase/database";
import { removeItem, getMembers, memberQuery, deleteUser} from './collaboration';

// function getData(ref) {
//     var returnVal;
//     const sortedEvents = query(ref, orderByChild('start'));
//     onValue(sortedEvents, (snapshot) => {returnVal = snapshot.val()});
//     return returnVal;
// }

class IntervalEvent {
    interval;
    key;
    eventInfo;

    constructor(interval, key, eventInfo) {
        this.interval = interval;
        this.key = key;
        this.eventInfo = eventInfo;
    }
}

class ClashWindow {
    clash;
    windowStart;
    windowEnd;

    constructor(clash, windowStart = null, windowEnd = null) {
        this.clash = clash;
        this.windowStart = windowStart;
        this.windowEnd = windowEnd;
    }
}

function unpackFromStartEnd(jsonObject) {
    if (typeof jsonObject === 'string' || jsonObject instanceof String) {
        jsonObject = JSON.parse(jsonObject);
    }
    const intervalArr = [];
    if (Array.isArray(jsonObject)) {
        for (var key in jsonObject) {
            intervalArr.push([lux.DateTime.fromMillis(jsonObject[key].startDateTime), lux.DateTime.fromMillis(jsonObject[key].endDateTime), key, jsonObject[key]])
        }
    } else {
        intervalArr.push([lux.DateTime.fromMillis(jsonObject.startDateTime), lux.DateTime.fromMillis(jsonObject.endDateTime), 0, jsonObject])
    }
    return intervalArr.map(x => new IntervalEvent(lux.Interval.fromDateTimes(x[0],x[1]), x[2], x[3]));
}

function binarySearch(arr, interval) {
    if (arr.length === 0) {
        return new ClashWindow(false);
    }
    arr.sort((a,b) => a.interval.start - b.interval.start);

    var leftAdj;
    var rightAdj;
    var low = 0;
    const key = interval.start
    var high = arr.length - 1;

    // binary search until low == high, that is, until the nearest interval is found

    while (low < high) {
        var mid = low + Math.floor((high-low)/2);
        if (arr[mid].interval.contains(key)) {          // key clashes with middle interval #reject
            return new ClashWindow(true, 0, 0);
        } else if (arr[mid].interval.isAfter(key)) {    // key is before middle interval
            high = mid;
            rightAdj = arr[mid];
        } else {                                        // key is after middle interval
            low = mid + 1;
            leftAdj = arr[mid];
        }
    }
    
    // check relationship between nearest interval and interval

    if (arr[low].interval.contains(key)) {              // nearest interval contains start #reject
        return new ClashWindow(true, 0, 0);
    } else if (arr[low].interval.isAfter(key)) {        // nearest interval is after start
        rightAdj = arr[low];
    } else {                                            // nearest interval is before start
        leftAdj = arr[low];
    }



    if (!rightAdj) {                                    // key has no right adjacent event, then it is the latest
        var windowStart;
        if (leftAdj) {windowStart = leftAdj.interval.end};
        return new ClashWindow(false, windowStart, null);
    }

    if (rightAdj && interval.end < rightAdj.interval.start) { // key end does not clash with right adjacent event
        var windowStart;
        var windowEnd;
        if (leftAdj) {windowStart = leftAdj.interval.end};
        if (rightAdj) {windowEnd = rightAdj.interval.start};
        return new ClashWindow(false, windowStart, windowEnd);
    }

    return new ClashWindow(true, 0, 0);
}

export async function checkClash(promise, startDateTime, endDateTime) {
    var jsonObject = await promise;
    var interval = lux.Interval.fromDateTimes(startDateTime,endDateTime);
    // console.log(jsonObject)
    return binarySearch(unpackFromStartEnd(jsonObject), interval);
}

export async function clashWindow(boo, windowStart = null, windowEnd = null) {
    return new ClashWindow(boo, windowStart, windowEnd);
}

export function sTTester(members, start, duration, eventId) {
    const memberPromises = members
    .map(async member => {
        const events = await memberQuery(member, 'events/')
        .then(items => items.filter(item => item.itemId !== eventId));
        const periods = await memberQuery(member, 'periods/')
        .then(items => items.filter(item => item.itemId !== eventId));
        const allItems = periods.concat(events);
        return allItems;
      })
    .reduce((x,y) => (x
        .then(a => y
            .then(b => Array.isArray(a[0]) ? a.concat([b]) : [a,b])))) 
    
    // console.log(memberPromises)
    return memberPromises.then(x => suggestTime(x, start, duration))
    .then(x => {return intervaltoStrings(x)});
}

function intervaltoStrings(int) {
    return [
        int.start.toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }),
        int.start.toFormat('yyyy-MM-dd'),
        int.end.toLocaleString({ hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }),
        int.end.toFormat('yyyy-MM-dd')
    ]
}

function suggestTime(arrOfArrs, start, duration) { // start: DateTime, duration: Milliseconds
    if (arrOfArrs.length === 0) {
        return;         // empty team?
    }
    
    const sortedArrs = arrOfArrs
        .map(arr => unpackFromStartEnd(arr))
        .map(arr => arr.sort((a,b) => a.interval.start - b.interval.start))
    
    // console.log(sortedArrs);

    var invalidSuggestion = true;
    var interval = lux.Interval.fromDateTimes(start, start.plus(duration));

    function helper(arr) {
        if (arr.length === 0) {
            return new ClashWindow(false, lux.DateTime.fromMillis(0), lux.DateTime.fromMillis(0));
        }

        var leftAdj;
        var rightAdj;
        var low = 0;
        const key = interval.start
        var high = arr.length - 1;

        // binary search until low == high, that is, until the nearest interval is found

        while (low < high) {
            var mid = low + Math.floor((high-low)/2);
            if (arr[mid].interval.contains(key)) {          // key clashes with middle interval #reject
                return new ClashWindow(true, arr[mid].interval.start, arr[mid].interval.end);
            } else if (arr[mid].interval.isAfter(key)) {    // key is before middle interval
                high = mid;
                rightAdj = arr[mid];
            } else {                                        // key is after middle interval
                low = mid + 1;
                leftAdj = arr[mid];
            }
        }
        
        // check relationship between nearest interval and interval

        if (arr[low].interval.contains(key)) {              // nearest interval contains start #reject
            return new ClashWindow(true, arr[low].interval.start, arr[low].interval.end);
        } else if (arr[low].interval.isAfter(key)) {        // nearest interval is after start
            rightAdj = arr[low];
        } else {                                            // nearest interval is before start
            leftAdj = arr[low];
        }

        // check position of interval, including end timing

        if (!rightAdj) {                                    // key has no right adjacent event, then it is the latest
            var windowStart;
            if (leftAdj) {windowStart = leftAdj.interval.end};
            return new ClashWindow(false, windowStart, lux.DateTime.fromMillis(0));
        }

        if (rightAdj && interval.end < rightAdj.interval.start) { // key end does not clash with right adjacent event
            var windowStart;
            if (leftAdj) {windowStart = leftAdj.interval.end};
            return new ClashWindow(false, windowStart, rightAdj.interval.start);
        }

        return new ClashWindow(true, lux.DateTime.fromMillis(0), rightAdj.interval.start); // has rightAdj, end timing clashes with rightAdj
    }

    while(invalidSuggestion) {
        const conflictedScheds = sortedArrs.map(arr => helper(arr)).filter(x => x.clash);
        // console.log(conflictedScheds.map(x => x.windowEnd))
        if (conflictedScheds.length > 0) {
            var newStart = lux.DateTime.max(...conflictedScheds.map(x => x.windowEnd));
            interval = lux.Interval.fromDateTimes(newStart, newStart.plus(duration));
        } else {
            invalidSuggestion = false;
        }
    }

    return interval;
}