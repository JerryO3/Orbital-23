import * as lux from "luxon";
import { getDatabase, ref, set, remove, get, update, onValue, query, orderByChild } from "firebase/database";

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
    for (var key in jsonObject) {
        intervalArr.push([lux.DateTime.fromMillis(jsonObject[key].startDateTime), lux.DateTime.fromMillis(jsonObject[key].endDateTime), key, jsonObject[key]])
    }
    return intervalArr.map(x => new IntervalEvent(lux.Interval.fromDateTimes(x[0],x[1]), x[2], x[3]))
}

function binarySearch(arr, interval) {
    if (arr.length === 0) {
        return new ClashWindow(false);
    }
    var leftAdj;
    var rightAdj;
    var low = 0;
    const key = interval.start
    var high = arr.length - 1;
    while (low < high) {
        var mid = low + Math.floor((high-low)/2);
        if (arr[mid].interval.contains(key)) {
            return new ClashWindow(true);
        } else if (arr[mid][0].isAfter(key)) {
            low = mid + 1;
            rightAdj = arr[mid];
        } else {
            high = mid;
            leftAdj = arr[mid];
        }
    }

    if (arr[low][0].contains(key)) {
        return new ClashWindow(true);
    } else if (arr[low][0].isAfter(key)) {
        rightAdj = arr[low];
    } else {
        leftAdj = arr[low];
    }

    if (interval.end < rightAdj[0].start) {
        var windowStart;
        var windowEnd;
        if (leftAdj) {windowStart = leftAdj[0].end};
        if (rightAdj) {windowEnd = rightAdj[0].end};
        return new ClashWindow(false, windowStart, windowEnd);
    }

    return new ClashWindow(true);
}

export async function checkClash(promise, startDateTime, endDateTime) {
    var jsonObject = await promise;
    var interval = lux.Interval.fromDateTimes(startDateTime,endDateTime);
    return binarySearch(unpackFromStartEnd(jsonObject), interval);
}



