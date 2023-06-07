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
    );
}

export const daysTo = (moment) => {
    return lux.Interval.fromDateTimes(now(), moment).length('days');
}

export const clash = (interval1, interval2) => {
    return interval1.overlaps(interval2);
}

const minsTo = (moment) => {
    console.log(now());
    console.log(moment);
    console.log(lux.Interval.fromDateTimes(now(), moment).length('minutes'));
    return lux.Interval.fromDateTimes(now(), moment).length('minutes');
}

class Node {
    start;
    end;
    maxEnd;
    left;
    right;
    event;
    parent;

    constructor(eventObj) {
        this.start = minsTo(eventObj.startDateTime);
        this.end = minsTo(eventObj.endDateTime);
        this.maxEnd = this.end;
        this.event = eventObj;
    }
}

export function newNode(eventObj) {
    return new Node(eventObj);
}

function addNode(node1, node2) {
    if (node2 === undefined) {
        return node1;
    } else {
        node2.parent = node1;
        if (fastIntervalQuery(node1,node2)) {
            if (node1.start < node2.start) {
                if (node1.right) {
                    return addNode(node1.right, node2);
                } else {
                    node1.right = node2;
                    node1.maxEnd = node2.end;
                    updateMax(node2, node2.maxEnd);
                }
            } else {
                if (node1.left) {
                    return addNode(node1.left, node2);
                } else {
                    node1.left = node2;
                }
            }
        } else {
            console.log("overlapping events");
        }
    }
    return node1;
}

function isInInterval(query, node) {
    if (node !== null) {
        return query < node.end && query > node.start;
    }
}

function updateMax(node, max) {
    var currNode = node;
    while (currNode.parent) {
        currNode.maxEnd = max;
        currNode = currNode.parent;
    }
}

export function fastIntervalQuery(rootNode, queryNode) {
    var parent = rootNode;
    var query = queryNode.start;
    var root = rootNode;
    while (root && !isInInterval(query,root)) {
        if (!root.left) {
            root = root.right;
        } else if (query > root.left.maxEnd) {
            parent = null;
            root = root.right;
        } else {
            parent = root;
            root = root.left;
        }
    }
    return parent == null 
        ? !root && queryNode.end < parent.start
        : true;
}

export function buildTree(nodes) {
    var accumulator = nodes[0];
    var currNodes = nodes.slice(1);
    while (currNodes.length > 0) {
        console.log("1");
        accumulator = addNode(currNodes[0], accumulator);
        currNodes = currNodes.slice(1);
    }
    return accumulator;
}




