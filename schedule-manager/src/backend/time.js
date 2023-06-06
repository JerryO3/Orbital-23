import * as lux from "luxon";

export const now = () => {
    return lux.DateTime.now();
}

export const moment = (
    year = lux.DateTime.now().year,
    month = lux.DateTime.now().month,
    day,
    hour,
    min ) => {
    return lux.DateTime.local(
        year,
        month,
        day,
        hour,
        min - (min % 5)
    ).toJSON;
}

export const daysTo = (moment) => {
    return lux.Interval.fromDateTimes(now(), moment).length('days');
}

export const clash = (interval1, interval2) => {
    return interval1.overlaps(interval2);
}

const minsTo = (moment) => {
    return lux.Interval.fromDateTimes(now(), moment).length('minutes');
}

class Node {
    start;
    end;
    maxEnd;
    left;
    right;
    event;

    constructor(eventObj) {
        this.start = minsTo(eventObj.startDateTime);
        this.end = minsTo(eventObj.endDateTime);
        this.maxEnd = this.end;
        this.event = eventObj;
    }
}

function addNode(node1, node2) {
    if (node1.start < node2.start) {
        if (node1.right) {
            return addNode(node1.right, node2);
        } else {
            node1.right = node2;
            node1.maxEnd = node2.end;
        }
    } else {
        if (node1.left) {
            return addNode(node1.left, node2);
        } else {
            node1.left = node2;
        }
    }
    return node1;
}

export function buildTree(nodes) {
    var tree = nodes.reduce(addNode);
    console.log(tree);
    return tree;
}



