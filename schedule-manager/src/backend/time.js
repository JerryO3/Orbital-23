import { child } from "firebase/database";
import * as lux from "luxon";

export const now = () => {
    return lux.DateTime.now();
}

export const moment = ( // rounds timings to a resolution of 5 mins (rounds downward)
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

export const clash = (interval1, interval2) => { // simple check clash between 2 intervals
    return interval1.overlaps(interval2);
}

const minsTo = (moment) => {
    return lux.Interval.fromDateTimes(now(), moment).length('minutes');
}

export function fromString(str) {
    return lux.DateTime.fromISO(str);
}

class Node {
    start;
    end;
    maxEnd;
    eventName;
    left;
    right;
    parent;
    height;
    project;

    constructor(eventObj, project=null) {
        this.start = eventObj.startDateTime;
        this.end = eventObj.endDateTime;
        this.maxEnd = this.end;
        this.height = 0;
        this.project = project;
        this.eventName = eventObj.name
    }

    clearProperties = () => {
        this.left = undefined;
        this.right = undefined;
        this.parent = undefined;
        this.height = 0;
    }

    equals = (node) => {
        return this.start == node.start
            && this.end == node.end
            && this.event == node.event;
    }
}

export function newNode(eventObj) {
    return new Node(eventObj);
}

export function addNodeWithClashes(node1, node2) { // adds Nodes even with clashes, except same timings which are merged
    if (node2) {
        var currNode = node1;
        while (currNode) {
            if (currNode === node2) { // checks if they are identical
                break;
            } else if (currNode.start === node2.start && currNode.end === node2.end) { // checks if they have same timings then merge
                console.log(node2);
                currNode.event = [
                    node1.event,
                    node2.event
                ];
            } else if (node2.start > currNode.start) { // traverse right
                if (currNode.right) {
                    currNode.right.parent = currNode;
                    currNode = currNode.right;
                } else { // set right child as node2
                    currNode.right = node2;
                    currNode.right.parent = currNode;
                    break;
                }
            } else { // traverse left
                if (currNode.left) {
                    currNode.right.parent = currNode;
                    currNode = currNode.left;
                } else { // set left node as node2
                    currNode.left = node2;
                    currNode.left.parent = currNode;
                    break;
                }
            }
        }
        updateMax(node2); // update all the maxes from leaf to root
    }
    return node1;
}

export function addNode(node1, node2) { // adds Nodes if they do not clash
    // console.log(node1);
    if (!intervalQuery(node1,node2)) { // checks for clashes
        console.log(node2);
    } else 
    if (node2) {
        var currNode = node1;
        while (currNode) {
            if (currNode === node2) { // catches infinite loop; shouldnt happen because of clash check
                console.log("illegally adding identical node, but cleared checks");
            } else if (node2.start > currNode.start) {
                if (currNode.right) { // traverse right
                    currNode.right.parent = currNode;
                    currNode = currNode.right;
                } else { // set right node as node2
                    currNode.right = node2;
                    currNode.right.parent = currNode;
                    break;
                }
            } else {
                if (currNode.left) { // traverse left
                    currNode.left.parent = currNode;
                    currNode = currNode.left;
                } else { // set left node as node2
                    currNode.left = node2;
                    currNode.left.parent = currNode;
                    break;
                }
            }
        }
        updateHeights(node2); // increments heights for tree balancing
        if (node2.parent.parent) { balanceTree(node2.parent.parent);}
        updateMax(node2,node2.maxEnd); // update all the maxes from leaf to root
    }
    return node1;
}

function isInInterval(query, node) { // helper function for timeQuery
    if (node !== null) {
        return query <= node.end && query >= node.start;
    }
}

function updateMax(node) { // helper function to update the maxEnd of each node
    var currNode = node;
    while (currNode) {
        if (!currNode.left && ! currNode.right) {
            currNode.maxEnd = currNode.end;
        } else {
            if (currNode.left && currNode.right) {
                const dt1 = currNode.left.maxEnd;
                const dt2 = currNode.end;
                const dt3 = currNode.right.maxEnd;

                const dtArr = [dt1,dt2,dt3];
                const maxDt = dtArr.reduce((max, current) => {return current > max ? current : max});
                currNode.maxEnd = maxDt;
            } else if (currNode.left) {
                if (currNode.left.maxEnd > currNode.end) {
                    currNode.maxEnd = currNode.left.maxEnd;
                } else {
                    currNode.maxEnd = currNode.end;
                }
            } else {
                if (currNode.right.maxEnd > currNode.end) {
                    currNode.maxEnd = currNode.right.maxEnd;
                } else {
                    currNode.maxEnd = currNode.end;
                }
            }
        }
        currNode = currNode.parent;
    }
}

function updateHeights(node) {
    var currNode = node;
    while (currNode) {
        if (!currNode.left && ! currNode.right) {
            currNode.height = 0;
        } else {
            if (currNode.left && currNode.right) {
                currNode.height = Math.max(currNode.left.height, 
                                           currNode.right.height) + 1;
            } else if (currNode.left) {
                currNode.height = currNode.left.height + 1;
            } else {
                currNode.height = currNode.right.height + 1;
            }
        }
        currNode = currNode.parent;
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

function keySearch(rootNode, key) { // returns predecessor or successor or queryNode
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

function getSuccessor(rootNode, query) {
    // var query = queryNode.start;
    var successor = keySearch(rootNode,query);
    // if (successor == queryNode) {
    //     // means that the query node exists in the tree
    //     // should be caught by timeQuery during interval query
    // } else 
    if (successor.start === query) {
        // means that the tree has a node start with the same time as the query
        // should be caught by timeQuery during interval query
    } else if (successor.start < query){
        successor = getSuccessorFromPred(successor);
    } 
    return successor;
}

export function intervalQuery(rootNode, queryNode) { // checks if there are clashes
    if (timeQuery(rootNode, queryNode.start) && timeQuery(rootNode, queryNode.end)) {
        var successor = getSuccessor(rootNode, queryNode.start);
        if (!successor) {
            return true;
        }
        // console.log(queryNode.end);
        // console.log(successor.start);
        return queryNode.end < successor.start
    } 
    return false;
}

export function buildTree(nodes) { // builds trees using the addNodes function for every node passed
    var accumulator = nodes[0];
    var currNodes = nodes.slice(1);
    while (currNodes.length > 0) {
        currNodes[0].clearProperties(); //important to reset the tree!
        accumulator = addNode(accumulator, currNodes[0]);
        currNodes = currNodes.slice(1);
    }
    return accumulator;
}

export function deleteNode(rootNode, queryNode) {
    var nearestNode = keySearch(rootNode, queryNode.start);
    if (nearestNode.equals(queryNode)) {
        if (nearestNode.left && nearestNode.right) {
            var successor = searchMin(nearestNode.right);
            if (successor == nearestNode.right) {
                successor.parent.right = null;
            } else {
                successor.parent.left = null;
            }
            successor.clearProperties();
            // nearestNode has 2 children
            if (nearestNode.parent) {
                if (nearestNode.parent.right == nearestNode) {
                    // if nearestNode is a right child
                    nearestNode.parent.right = successor;
                } else {
                    // else nearestNode is a left child 
                    nearestNode.parent.left = successor;
                }
            } else {
                // nearestNode is the root
                rootNode = successor;
            }
            successor.left = nearestNode.left;
            successor.right = nearestNode.right;
            updateMax(successor);
        } else if (nearestNode.left) {
            // nearestNode has only 1 left child
            if (nearestNode.parent) {
                if (nearestNode.parent.right  == nearestNode) {
                    // if nearestNode is a right child and has a left child
                    nearestNode.parent.right = nearestNode.left;
                } else {
                    // else nearestNode is a left child and has a left child
                    nearestNode.parent.left = nearestNode.left;
                }
                nearestNode.left.parent = nearestNode.parent;
            } else {
                // nearestNode is the root with only one child
                nearestNode.left.parent = null;
                rootNode = nearestNode.left;
            }
            updateMax(nearestNode.left);
        } else if (nearestNode.right) {
            // nearestNode has only 1 right child
            if (nearestNode.parent) {
                if (nearestNode.parent.right  == nearestNode) {
                    // if nearestNode is a right child and has a right child
                    nearestNode.parent.right = nearestNode.right;
                } else {
                    // else nearestNode is a left child and has a right child
                    nearestNode.parent.left = nearestNode.right;
                }
                nearestNode.right.parent = nearestNode.parent;
            } else {
                // nearestNode is the root with only one child
                nearestNode.right.parent = null;
                rootNode = nearestNode.right;
            }
            updateMax(nearestNode.right);
        } else {
            // nearestNode is a leaf
            if (nearestNode.parent) {
                if (nearestNode.parent.right  == nearestNode) {
                    // if nearestNode is a right child
                    nearestNode.parent.right = null;
                } else {
                    // else nearestNode is a left child
                    nearestNode.parent.left = null;
                }
                updateMax(nearestNode.parent);
            } else {
                // is both leaf and root, then tree is 1 node that is deleted
                return null;
            }            
        }
        updateHeights(nearestNode.parent);
        nearestNode.clearProperties();
    }
    return rootNode;
}

export function nodesFromNowTill(rootNode, key) {
    var currNode = rootNode;
    const nodeArr = [];
    while (currNode) {
        if (key < currNode.start) {
            currNode = currNode.left;
        } else {
            nodeArr.push(currNode);
            currNode = currNode.right;
        }
    }
    return nodeArr.flatMap(x => [x.event, DFS(x.left).map(x => x.event)])
                  .flatMap(x => x);
}

function DFS(rootNode) {
    const stack = [];
    const nodeArr = [];
    var currNode = rootNode;
    while (currNode) {
        if (currNode.right) { stack.push(currNode.right); }
        if (currNode.left) { stack.push(currNode.left); }
        nodeArr.push(currNode);
        currNode = stack.pop();
    }
    console.log(nodeArr);
    return nodeArr;
}

function rotateLeft(rootNode) {
    var child = rootNode.right;

    child.parent = rootNode.parent;

    if (rootNode.parent) {
        if (rootNode.parent.left && rootNode.parent.left === rootNode) {rootNode.parent.left = child}
        else {rootNode.parent.right = child};
    }

    rootNode.right = child.left;
    rootNode.parent = child;

    child.left = rootNode;
    child.left.parent = rootNode;
}

function rotateRight(rootNode) {
    var child = rootNode.left;

    child.parent = rootNode.parent;

    if (rootNode.parent) {
        if (rootNode.parent.left === rootNode) {rootNode.parent.left = child}
        else {rootNode.parent.right = child};
    }

    rootNode.left = child.right;
    child.right.parent = rootNode;

    child.right = rootNode;
    rootNode.parent = child; 
}


export function balanceTree(rootNode) {
    var child;
    console.log(rootNode.left);
    console.log(rootNode.right);
    console.log(rootNode.right.height);
    if ((rootNode.left && !rootNode.right && rootNode.left.height >= 1) || 
        (rootNode.left && rootNode.right && rootNode.left.height - rootNode.right.height > 1)) {
        child = rootNode.left;
        if ((child.right && !child.left && child.right.height >= 1) ||
            (child.left && child.right && child.left.height - child.right.height < -1)) { // left-right
            rotateLeft(child);
        } 
        rotateRight(rootNode);
        console.log(1)
    } else if ((rootNode.right && !rootNode.left && rootNode.right.height >= 1) ||
               (rootNode.left && rootNode.right && rootNode.left.height - rootNode.right.height < -1)) {
        child = rootNode.right;
        if ((child.left && !child.right && child.left.height >= 1) ||
            (child.left && child.right && child.left.height - child.right.height > 1)) { // right-left
            rotateRight(child);
        } 
        rotateLeft(rootNode);
        console.log(2);
    }
}