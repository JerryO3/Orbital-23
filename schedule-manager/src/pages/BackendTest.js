import React from "react";
import { useState } from 'react';
import logo from '../assets/logo.png';
import * as fn from "../backend/functions";
import { BrowserRouter as Router, Route, Routes, Link} from 'react-router-dom';
import ClickDebug from "../deprecated/ClickDebug";
import * as time from '../backend/time';
import * as lux from 'luxon';
import { update } from "firebase/database";

const testNodes = [];
const timesFrom = [
    8,5,1,12,15
]
const durations = [
    10,10,10,10,10
]

const timesFrom1 = [ // no clash
    1,5
]
const durations1 = [
    5,5
]

const timesFrom2 = [ // both start and end clash
    1,5
]
const durations2 = [
    30,5
]

const timesFrom3 = [ // start clash
    1,2
]
const durations3 = [
    10,10
]

const timesFrom4 = [ // end clash
    5,1
]
const durations4 = [
    30,30
]

const timesFrom5 = [ // start and end enclosing
    5,1
]
const durations5 = [
    5,50
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
    for (let i = 0; i < events.length; i ++) {
        testNodes[i] = new time.newNode(events[i]);
    }
    return testNodes
}

var nodesArr = makeTest(eventGenerator(timesFrom,durations));

var nodesArr1 = makeTest(eventGenerator(timesFrom1,durations1));
var nodesArr2 = makeTest(eventGenerator(timesFrom2,durations2));
var nodesArr3 = makeTest(eventGenerator(timesFrom3,durations3));
var nodesArr4 = makeTest(eventGenerator(timesFrom4,durations4));
var nodesArr5 = makeTest(eventGenerator(timesFrom5,durations5));

function BackendTest() {
    return (
        <>
        <ClickDebug func={() => console.log(time.buildTree(nodesArr))} buttonText="Test" />
        <div>
        <ClickDebug func={() => { 
                console.log(nodesArr == nodesArr3)
                console.log(nodesArr);
                console.log(nodesArr3);
                // console.log(nodesArr1[1]);
                // console.log(time.intervalQuery(nodesArr1[0],nodesArr1[1]));
                }
            }
            buttonText="Testcase1" />
        <ClickDebug func={() => console.log(
            time.intervalQuery(nodesArr2[0],nodesArr2[1]))} 
            buttonText="Testcase2" />
        <ClickDebug func={() => console.log(
            time.intervalQuery(nodesArr3[0],nodesArr3[1]))} 
            buttonText="Testcase3" />
        <ClickDebug func={() => console.log(
            time.intervalQuery(nodesArr4[0],nodesArr4[1]))} 
            buttonText="Testcase4" />
        <ClickDebug func={() => console.log(
            time.intervalQuery(nodesArr5[0],nodesArr5[1]))} 
            buttonText="Testcase5" />
        </div>
        <ClickDebug func={() => {time.buildTree(nodesArr); time.updateMax(nodesArr[0],0)}} buttonText="TestUpdateMax" />
        </>
    );
}

export default BackendTest;

