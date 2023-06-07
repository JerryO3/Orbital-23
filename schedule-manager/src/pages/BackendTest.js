import React from "react";
import { useState } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import ClickDebug from "../deprecated/ClickDebug";
import * as time from '../backend/time';
import * as lux from 'luxon';

const testNodes = [];
const timesFrom = [
    1,5,8,12,15
]
const durations = [
    10,10,10,10,10
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
    for (let i = 0; i < 5; i ++) {
        testNodes[i] = new time.newNode(events[i]);
    }
    return testNodes
}

const nodesArr = makeTest(eventGenerator(timesFrom,durations));

function BackendTest() {
    return (
        <>
        <ClickDebug func={() => console.log(time.buildTree(nodesArr))} buttonText="Test" />
        <ClickDebug func={() => console.log(time.fastIntervalQuery(nodesArr[0], nodesArr[1]))} buttonText="Test2" />
        </>
    );
}

export default BackendTest;

