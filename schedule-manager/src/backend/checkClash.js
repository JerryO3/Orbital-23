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
    return intervalArr.map(x => new IntervalEvent(lux.Interval.fromDateTimes(x[0],x[1]), x[2], x[3]));
}

function binarySearch(arr, interval) {
    if (arr.length === 0) {
        return new ClashWindow(false);
    }
    arr.sort((a,b) => a.interval.start - b.interval.start);
    // console.log(interval.start);
    // console.log(arr.flatMap(x => [x.interval.s, x.interval.e]))
    // console.log(arr.
    //     flatMap(x => [x.interval.contains(interval.start),
    //                   x.interval.contains(interval.end)]));
    var leftAdj;
    var rightAdj;
    var low = 0;
    const key = interval.start
    var high = arr.length - 1;
    while (low < high) {
        // console.log([low,high])
        var mid = low + Math.floor((high-low)/2);
        if (arr[mid].interval.contains(key)) {
            return new ClashWindow(true, 0, 0);
        } else if (arr[mid].interval.isAfter(key)) {
            high = mid;
            rightAdj = arr[mid];
        } else {
            low = mid + 1;
            leftAdj = arr[mid];
        }
    }
    // console.log(low)
    if (arr[low].interval.contains(key)) {
        return new ClashWindow(true, 0, 0);
    } else if (arr[low].interval.isAfter(key)) {
        
        rightAdj = arr[low];
    } else {

        leftAdj = arr[low];
    }

    if (!rightAdj) {
        var windowStart;
        if (leftAdj) {windowStart = leftAdj.interval.end};
        return new ClashWindow(false, windowStart, null);
    }

    if (rightAdj && interval.end < rightAdj.interval.start) {
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
    return binarySearch(unpackFromStartEnd(jsonObject), interval);
}

export async function clashWindow(boo, windowStart = null, windowEnd = null) {
    return new ClashWindow(boo, windowStart, windowEnd);
}