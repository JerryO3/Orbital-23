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
    30,25,
    8,5,1,15,12,18,21
    ,40
    // 1,5,8,12,15,18,21
    // 4,1
]
const durations = [
    10,10,10,10,10,10,10,10
    ,10,10,10

    // 10,10
]

function eventGenerator(startTime, durations) {
    var i = -1;
    var j = -1;

    const startTimes = startTime.map(x => x*5)
    .map(x =>
        lux.DateTime.local(2023,1,1)
    .plus({minutes : x})
    );

    const endTimes = startTime.map(x => x*5)
    .map(e => {i++; return e + durations[i]})
    .map(x =>
        lux.DateTime.local(2023,1,1)
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
            () => console.log(JSON.parse(time.buildTree(
                makeTest(eventGenerator(timesFrom,durations)))))} 
            buttonText="Build Tree" />
        <ClickDebug func={
            () => console.log(tree)} 
            buttonText="Show Tree" />
        <ClickDebug func={
            () => console.log(
                // JSON.stringify(
                    time.deleteNode(tree, nodesArr[0])
                    // )
                    )} 
            buttonText="Delete Node" />
        <ClickDebug func={
            () => console.log(time.nodesFromNowTill(tree,105))} 
            buttonText="Get DFS Array" />
            <ClickDebug func={
            () => console.log('help tap me up')} 
            buttonText="check ur phone plssss" />
        </>  
        
    );
}

export default BackendTest;

