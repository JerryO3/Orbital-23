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
    // console.log(now());
    // console.log(moment);
    // console.log(lux.Interval.fromDateTimes(now(), moment).length('minutes'));
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

    clearProperties = () => {
        this.left = undefined;
        this.right = undefined;
        this.parent = undefined;
    }
}

export function newNode(eventObj) {
    return new Node(eventObj);
}

export function addNodeWithClashes(node1, node2) {
    if (node1.start === node2.start && node1.end === node2.end) {
        console.log(node2);
    } else 
    if (node2) {
        var currNode = node1;
        while (currNode) {
            if (currNode === node2) {
                break;
            } else if (node2.start > currNode.start) {
                if (currNode.right) {
                    currNode.right.parent = currNode;
                    currNode = currNode.right;
                } else {
                    currNode.right = node2;
                    currNode.right.parent = currNode;
                    break;
                }
            } else {
                if (currNode.left) {
                    currNode.right.parent = currNode;
                    currNode = currNode.left;
                } else {
                    currNode.left = node2;
                    currNode.left.parent = currNode;
                    break;
                }
            }
        }
        updateMax(node2,node2.maxEnd);
    }
    return node1;
}

export function addNode(node1, node2) {
    if (!intervalQuery(node1,node2)) {
        console.log(node2);
    } else 
    if (node2) {
        var currNode = node1;
        while (currNode) {
            if (currNode === node2) {
                break;
            } else if (node2.start > currNode.start) {
                if (currNode.right) {
                    currNode.right.parent = currNode;
                    currNode = currNode.right;
                } else {
                    currNode.right = node2;
                    currNode.right.parent = currNode;
                    break;
                }
            } else {
                if (currNode.left) {
                    currNode.right.parent = currNode;
                    currNode = currNode.left;
                } else {
                    currNode.left = node2;
                    currNode.left.parent = currNode;
                    break;
                }
            }
        }
        updateMax(node2,node2.maxEnd);
    }
    return node1;
}

function isInInterval(query, node) {
    if (node !== null) {
        return query <= node.end && query >= node.start;
    }
}

export function updateMax(node, max) {
    var currNode = node;
    if (max) {
        while (currNode) {
            if (max > currNode.maxEnd) {
                currNode.maxEnd = max;
            }
            currNode = currNode.parent;
        }
    }
}

function timeQuery(rootNode, query) { //to Fix
    var root = rootNode;
    while (root && !isInInterval(query,root)) {
        if (!root.left) {
            root = root.right;
        } else if (query > root.left.maxEnd) {
            root = root.right;
        } else {
            root = root.left;
        }
    }
    return root === undefined;
}

function searchMin(rootNode) { // returns the smallest node in the subtree
    let currNode = rootNode;
    while (currNode && currNode.left) {
        currNode = currNode.left
    }
    return currNode;
}

function getSuccessorFromPred(rootNode) { // returns successor or null when given predecessor
    if (rootNode.right) {
        return searchMin(rootNode.right);
    }
    var currNode = rootNode;
    while (currNode.parent && currNode == currNode.parent.right) {
        currNode = currNode.parent;
    }
    return currNode.parent;
}

function keySearch(rootNode, key) { // returns predecessor or successor
    var parent;
    var currNode = rootNode;
    while (currNode && currNode.start !== key) {
        parent = currNode;
        if (key < currNode.start) {
            currNode = currNode.left;
        } else {
            currNode = currNode.right;
        }
    }
    return currNode 
            ? currNode 
            : parent;
}

function getSuccessor(rootNode, queryNode) {
    var query = queryNode.start;
    var successor = keySearch(rootNode,query);
    if (successor == queryNode) {
        console.log("failed to detect clash"); // shouldnt happen
    } else if (successor.start <= query){
        successor = getSuccessorFromPred(successor);
    } 
    return successor;
}

export function intervalQuery(rootNode, queryNode) {
    var successor = getSuccessor(rootNode, queryNode);
    // console.log(successor);
    if (timeQuery(rootNode, queryNode.start) && timeQuery(rootNode, queryNode.end)) {
        if (!successor) {
            return true;
        }
        // console.log(queryNode.end);
        // console.log(successor.start);
        return queryNode.end < successor.start
    } 
    return false;
}

export function buildTree(nodes) {
    var accumulator = nodes[0];
    var currNodes = nodes.slice(1);
    while (currNodes.length > 0) {
        currNodes[0].clearProperties(); //important to reset the tree!
        accumulator = addNode(currNodes[0], accumulator);
        currNodes = currNodes.slice(1);
    }
    return accumulator;
}




