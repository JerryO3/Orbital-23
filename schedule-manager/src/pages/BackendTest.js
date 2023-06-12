import React from "react";
import { useState } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import ClickDebug from "../deprecated/ClickDebug";
import * as time from '../backend/time';
import * as lux from 'luxon';
import { update } from "firebase/database";
import * as tc from '../backend/testcases';


const timesFrom = [
    8,5,1,15,12,18,21
]
const durations = [
    10,10,10,10,10,10,10
]

function eventGenerator(startTime, durations) {
    var i = -1;
    var j = -1;

    const startTimes = startTime.map(x => x*5)
    .map(x =>
        lux.DateTime.now()
    .plus({minutes : x})
    );

    const endTimes = startTime.map(x => x*5)
    .map(e => {i++; return e + durations[i]})
    .map(x =>
        lux.DateTime.now()
    .plus({minutes : x})
    );

    return startTimes.map(x => {j++; return new EventNew(x, endTimes[j]) });
}

class EventNew {
    constructor(start,end) {
        this.startDateTime = start;
        this.endDateTime = end;
    }
}

function makeTest(events) {
    const testNodes = [];
    for (let i = 0; i < events.length; i ++) {
        testNodes[i] = new time.newNode(events[i]);
    }
    return testNodes
}

var nodesArr = makeTest(eventGenerator(timesFrom,durations));
var tree = time.buildTree(nodesArr);

function BackendTest() {
    return (
        <>
        <ClickDebug func={
            () => console.log(time.buildTree(
                makeTest(eventGenerator(timesFrom,durations))))} 
            buttonText="Build Tree" />
        <ClickDebug func={
            () => console.log(time.deleteNode(tree, nodesArr[0]))} 
            buttonText="Delete Node" />
        </>
    );
}

export default BackendTest;
