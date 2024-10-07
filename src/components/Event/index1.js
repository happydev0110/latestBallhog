import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Filter from '../../layouts/Filter';

import { URL, SPORTS_CATEGORY, INTERVAL_TIME, DATASET_TYPE_CATEGORY, TEAM_LIST } from '../../const.js';
import { changeTeamIdx, handleScore, handleSoccerScore, reverseTime, getDuraton } from '../../func.js';

import ScoreBoardComp from './scoreBoard.js';

function EventComponent() {
    const [events, setEvents] = useState([]);
    const [playList, setPlayList] = useState([]);
    const [intervalTime, setIntervalTime] = useState(3);

    const [eventId, setEventId] = useState(-1);
    const [gameId, setGameId] = useState('');
    const [sportCategory, setSportCategory] = useState('NBA');

    const [time, setTime] = useState();
    const [team1Idx, setTeam1Idx] = useState(-1);
    const [team2Name, setTeam2Name] = useState('');
    const [selTeamIdx, setSelTeamIdx] = useState(-1);

    const [increaseAmt, setIncreaseAmt] = useState(false);
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);

    const [selTextIdx, setSelTextIdx] = useState(-1);
    const [selTblIdx, setSelTblIdx] = useState(-1);
    const [description, setDescription] = useState('');

    const [historyList, setHistoryList] = useState([[], [], [], []]);
    const [timeList, setTimeList] = useState([[], [], [], []]);

    const [selectedTeamTime, setSelectedTeamTime] = useState(0);
    const [startTime, setStartTime] = useState(-1);

    const [tableScore, setTableScore] = useState([0, 0, 0, 0]);

    // Tab Index
    const [tabStatus, setTabStatus] = useState(true);

    // Get Total Event
    useEffect(() => {
        let apiUrl = URL[sportCategory + '_TODAY_EVENT'];

        axios.get(apiUrl,
        ).then((response) => {
            setEvents(response.data.events);
        }).catch((err) => {
            console.log(err);
        });
    }, [sportCategory])

    // Get Event List
    useEffect(() => {
        if (eventId != -1) {
            if (startTime != -1) {
                goToPlay()
            } else {
                const interval = setInterval(() => {
                    fetchEventPlay();
                }, intervalTime * 1000);
                return () => clearInterval(interval);
            }
        } else {
            setPlayList([])
        }
    }, [eventId, intervalTime, team1Idx, sportCategory, startTime])

    const goToPlay = async () => {
        // getDuraton(resList.plays[0].wallclock, resList.plays[1].wallclock);
        // for (let i = 0; i < 10; i++) {
        //     await new Promise(resolve => setTimeout(resolve, i * 1000)); // Delay each iteration
        //     // console.log(i); // Output the current iteration value after delay
        // }

        let dataSetType, resList;

        resList = playList;
        dataSetType = DATASET_TYPE_CATEGORY[sportCategory];

        var result;
        // var team1Id,team2Id,team1Name,team2Name;
        // console.log(resList.boxscore.teams[team1Idx],"team ID")

        if (resList.boxscore.teams[team1Idx]) {
            var team1Id = resList.boxscore.teams[team1Idx].team.id;                                     //team1 ID
            var team2Id = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.id;                 //team2 ID
            var team1Name = resList.boxscore.teams[team1Idx].team.name;                                 //team1 Name
            var team2Name = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.name;
        }

        var matchEvtList = [];
        var selectedTeamIdx = 0;

        var score = [0, 0, 0, 0], tableIndex = 0, textIndex = 0, increaseAmount;

        if (team1Idx != -1 && resList.plays) {
            let hisList = [];
            let timerList = [[], [], [], []];
            let sepcialSeq = { id: 502, seq: 0, teamId: 0 };

            console.log('Loop', resList.plays.length)
            console.log(startTime, 'start Time')
            // console.log(hisList, 'hislist in event loop')
            for (let i = 0; i < resList.plays.length; i++) {
                // console.log(i,'Events List')
                var currentPlayItem = resList.plays[i];
                var prevPlayItem = resList.plays[i - 1];
                if (startTime != -1) {
                    if (parseInt(currentPlayItem.sequenceNumber) < parseInt(startTime)) {
                        continue;
                    }
                }
                for (let j = 0; j < dataSetType.length; j++) {
                    // console.log(j,'Datatype')
                    var team1Id = resList.boxscore.teams[team1Idx].team.id;
                    var team2Id = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.id;
                    var team1Name = resList.boxscore.teams[team1Idx].team.name;
                    var team2Name = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.name;
                    // var prevEventItem;

                    var dataTypeItem = dataSetType[j];
                    var matchTeamId = team1Id;

                    // teamId
                    if (dataTypeItem.teamId !== -1) {
                        if (currentPlayItem.team === undefined) {
                            continue;
                        }

                        if (dataTypeItem.teamId) {
                            matchTeamId = team2Id
                        }

                        if (currentPlayItem.team && (currentPlayItem.team.id != matchTeamId)) {
                            continue;
                        }
                    }

                    // typeId
                    if (dataTypeItem.typeId) {
                        if (currentPlayItem.type.id == 502) {
                            sepcialSeq = {
                                id: 502,
                                seq: currentPlayItem.sequenceNumber,
                                teamId: currentPlayItem.team.id
                            }
                        }

                        if (currentPlayItem.type.id != dataTypeItem.typeId) continue;
                    }

                    // scoreValue
                    if (dataTypeItem.scoreValue != -1) {
                        if (currentPlayItem.scoreValue === undefined) continue;
                        if (currentPlayItem.scoreValue != dataTypeItem.scoreValue) continue;
                    }

                    // scoringPlay
                    if (dataTypeItem.scoringPlayStatus) {
                        if (currentPlayItem.scoringPlay != dataTypeItem.scoringPlay) {
                            continue;
                        }
                    }

                    // Special DS
                    // DS2-NCAA
                    if (dataTypeItem.no === 'NCAA-DS2') {
                        if (prevPlayItem === undefined || prevPlayItem.scoreValue === undefined || prevPlayItem.scoreValue != 0) continue;
                        if (currentPlayItem.text.includes('made Dunk')) continue;
                    }

                    // DS3-NCAA
                    if (dataTypeItem.no === 'NCAA-DS3') {
                        if (prevPlayItem === undefined || prevPlayItem.scoreValue === undefined || prevPlayItem.scoreValue != 0) continue;
                    }

                    // DS9-NCAA
                    if (dataTypeItem.no === 'NCAA-DS9') {
                        if (prevPlayItem === undefined || currentPlayItem.clock === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoreValue === undefined) continue;
                        if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.type.id == 574 || prevPlayItem.scoreValue != 2) {
                            continue;
                        }
                    }

                    // NCAA-DS12
                    if (dataTypeItem.no === 'NCAA-DS12') {
                        if (prevPlayItem === undefined || prevPlayItem.clock === undefined) continue;
                        if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.type.id != 574) {
                            continue;
                        }
                    }

                    // NCAA-DS13
                    if (dataTypeItem.no === 'NCAA-DS13') {
                        if (prevPlayItem === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoringPlay === undefined) continue;
                        if (!prevPlayItem.scoringPlay || currentPlayItem.clock.displayValue === prevPlayItem.clock.displayValue) {
                            continue;
                        }
                    }

                    // DS30-NBA
                    if (dataTypeItem.no === 'NBA-DS30') {
                        if (prevPlayItem === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoringPlay === undefined || prevPlayItem.team === undefined) continue;
                        if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.scoreValue != 2 || prevPlayItem.team.id == matchTeamId || dataTypeItem.noMatchList.indexOf(prevPlayItem.type.id) !== -1) {
                            continue;
                        }
                    }

                    // DS48-NBA
                    if (dataTypeItem.no === 'NBA-DS48') {
                        if (prevPlayItem === undefined || prevPlayItem.clock === undefined) continue;
                        if (currentPlayItem.clock.displayValue === prevPlayItem.clock.displayValue) {
                            continue;
                        }
                    }

                    // NHL-DS2
                    if (dataTypeItem.no === 'NHL-DS2') {
                        if (currentPlayItem.text.includes('Timeout') || currentPlayItem.text.includes('official') || currentPlayItem.text.includes('Challenge') || currentPlayItem.text.includes('review')) {
                            continue;
                        }
                    }

                    // NHL-DS4
                    if (dataTypeItem.no === 'NHL-DS4') {
                        if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || !currentPlayItem.text.includes('Fighting') || !prevPlayItem.text.includes('Fighting') || currentPlayItem.team.id !== prevPlayItem.team.id) {
                            continue;
                        }
                    }

                    // NHL-DS5, NHL-DS6 
                    if (dataTypeItem.no === 'NHL-DS5' || dataTypeItem.no === 'NHL-DS6') {
                        if (currentPlayItem.text.includes('Fighting')) {
                            continue;
                        }
                    }

                    // NHL2-DS2
                    if (dataTypeItem.no === 'NHL2-DS2') {
                        if (sepcialSeq.teamId != team1Id) {
                            continue;
                        }
                    }

                    // NHL2-DS2-2
                    if (dataTypeItem.no === 'NHL2-DS2-2') {
                        if (sepcialSeq.teamId != team2Id) {
                            continue;
                        }
                    }

                    // NHL2-DS2-3
                    if (dataTypeItem.no === 'NHL2-DS2-3') {
                        if (sepcialSeq.teamId != team1Id) {
                            continue;
                        }
                    }

                    // NHL2-DS2-4
                    if (dataTypeItem.no === 'NHL2-DS2-4') {
                        if (sepcialSeq.teamId != team2Id) {
                            continue;
                        }
                    }

                    // NBA2-DS1-2
                    if (dataTypeItem.no === 'NBA2-DS1-2') {
                        if (!currentPlayItem.text.includes('three point')) {
                            continue;
                        }
                    }

                    // NBA2-DS1-3
                    if (dataTypeItem.no === 'NBA2-DS1-3') {
                        if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 22-foot')) {
                            continue;
                        }
                    }

                    // NBA2-DS1-4
                    if (dataTypeItem.no === 'NBA2-DS1-4') {
                        if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 23-foot')) {
                            continue;
                        }
                    }

                    // NBA2-DS1-5
                    if (dataTypeItem.no === 'NBA2-DS1-5') {
                        if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 24-foot')) {
                            continue;
                        }
                    }

                    // NBA2-DS1-6
                    if (dataTypeItem.no === 'NBA2-DS1-6') {
                        if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 25-foot')) {
                            continue;
                        }
                    }

                    // NBA2-DS1-7
                    if (dataTypeItem.no === 'NBA2-DS1-7') {
                        if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 26-foot')) {
                            continue;
                        }
                    }

                    // NBA2-DS1-8
                    if (dataTypeItem.no === 'NBA2-DS1-8') {
                        if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 27-foot')) {
                            continue;
                        }
                    }

                    // NBA2-DS7
                    if (dataTypeItem.no === 'NBA2-DS7') {
                        if (!currentPlayItem.type.text.includes('Dunk Shot') || dataTypeItem.noMatchList.indexOf(prevPlayItem.type.id) !== -1) {
                            continue;
                        }
                    }

                    // NBA2-DS7-2
                    if (dataTypeItem.no === 'NBA2-DS7-2') {
                        if (!currentPlayItem.type.text.includes('Dunk Shot')) {
                            continue;
                        }
                    }

                    // NBA2-DS20
                    if (dataTypeItem.no === 'NBA2-DS20') {
                        if (currentPlayItem.type.id == 84 || !currentPlayItem.type.text.includes('Turnover')) {
                            continue;
                        }
                    }

                    // NBA2-DS30
                    if (dataTypeItem.no === 'NBA2-DS30') {
                        if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.scoreValue != 2 || prevPlayItem.team.id == matchTeamId || dataTypeItem.noMatchList.indexOf(prevPlayItem.type.id) !== -1 || prevPlayItem.type.text.includes('Dunk Shot')) {
                            continue;
                        }
                    }

                    // NBA2-DS30-2
                    if (dataTypeItem.no === 'NBA2-DS30-2') {
                        if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || !prevPlayItem.type.text.includes('Dunk Shot')) {
                            continue;
                        }
                    }

                    // NBA2-DS48
                    if (dataTypeItem.no === 'NBA2-DS48') {
                        if (currentPlayItem.clock.displayValue === prevPlayItem.clock.displayValue) {
                            continue;
                        }
                    }

                    // NBA2-DS72
                    if (dataTypeItem.no === 'NBA2-DS72') {
                        if (!currentPlayItem.text.includes('blocks')) {
                            continue;
                        }
                    }
                    // Special DS

                    matchEvtList.push(currentPlayItem);
                    result = handleScore(currentPlayItem, dataTypeItem, score, tableIndex, prevPlayItem, team1Name, team2Name, sportCategory);
                    hisList = historyList;
                    // console.log(hisList,"history List");

                    if (dataTypeItem.rotation) {
                        let time = currentPlayItem.period.displayValue + ' ' + currentPlayItem.clock.displayValue;
                        let sequence = currentPlayItem.sequenceNumber;
                        timerList[result.textIndex].push({
                            label: time,
                            value: sequence
                        })
                        // console.log(timerList,'timerList')
                    }

                    // For Logos
                    selectedTeamIdx = team1Idx;
                    if (team1Id != matchTeamId) {
                        selectedTeamIdx = (parseInt(team1Idx) + 1) % 2;
                    }

                    // If don't team check, set default team logo
                    if (dataTypeItem.teamId === -1) {
                        selectedTeamIdx = -1
                    }

                    if (tableIndex != result.tableIndex) {
                        hisList[result.tableIndex] = [];
                    }

                    let hisItem = {
                        no: dataTypeItem.no,
                        seq: currentPlayItem.sequenceNumber,
                        // teamId: currentPlayItem.team.id,
                        teamIdx: selectedTeamIdx,
                        score: result.score[result.textIndex],
                        description: result.description,
                        increase: result.increaseMount,
                        time: currentPlayItem.clock.displayValue
                    }

                    if (dataTypeItem.logoReverse) {
                        hisItem.teamIdx = changeTeamIdx(selectedTeamIdx);
                    }

                    if (sportCategory == 'NHL' || sportCategory == 'NHL2') {
                        hisItem.time = reverseTime(currentPlayItem.clock.displayValue);
                    }

                    // console.log(reverseTime(currentPlayItem.clock.displayValue), 'reverse time')
                    hisList[result.textIndex].push(hisItem);

                    increaseAmount = result.increaseMount;
                    textIndex = result.textIndex;
                    tableIndex = result.tableIndex;
                    // prevEventItem = currentPlayItem;

                    if (currentPlayItem.team) {
                        console.log(
                            'DS_NO:', dataTypeItem.no,
                            'sequence:', currentPlayItem.sequenceNumber,
                            'team1Id:', team1Id,
                            'teamId:', currentPlayItem.team.id,
                            'typeId:', currentPlayItem.type.id,
                            "scoreValue:", currentPlayItem.scoreValue,
                            'scoringPlay', currentPlayItem.scoringPlay,
                            'selectedTeamIdx:', selectedTeamIdx,
                            "rotation:", dataTypeItem.rotation,
                            'textIdx:', textIndex,
                            'tableIdx:', tableIndex,
                            'teamIndex:', tableIndex,
                            'increase:', increaseAmount,
                            'description:', result.description,
                            'homeScore:', currentPlayItem.homeScore,
                            'awayScore', currentPlayItem.awayScore,
                            'Period:', currentPlayItem.period.displayValue,
                            'Clock:', currentPlayItem.clock.displayValue,
                        )
                    } else {
                        console.log(
                            'DS_NO:', dataTypeItem.no,
                            'sequence:', currentPlayItem.sequenceNumber,
                            'team1Id:', team1Id,
                            'teamId:', 'No team',
                            'typeId:', currentPlayItem.type.id,
                            "scoreValue:", currentPlayItem.scoreValue,
                            'scoringPlay', currentPlayItem.scoringPlay,
                            'selectedTeamIdx:', selectedTeamIdx,
                            "rotation:", dataTypeItem.rotation,
                            'textIdx:', textIndex,
                            'tableIdx:', tableIndex,
                            'teamIndex:', tableIndex,
                            'increase:', increaseAmount,
                            'description:', result.description,
                            'homeScore:', currentPlayItem.homeScore,
                            'awayScore', currentPlayItem.awayScore,
                            'Period:', currentPlayItem.period.displayValue,
                            'Clock:', currentPlayItem.clock.displayValue,
                        )
                    }
                }
            }

            if (result) {
                // console.log(hisList, 'history list')
                setSelTeamIdx(selectedTeamIdx)
                setTableScore(result.score);
                setSelTextIdx(textIndex);
                setSelTblIdx(tableIndex);
                setIncreaseAmt(increaseAmount);
                setDescription(result.description);
                setTime(result.sequenceTime);
                setHomeScore(result.homeScore);
                setAwayScore(result.awayScore);
                setHistoryList(hisList);
                if (startTime == -1) {
                    setTimeList(timerList);
                }
            }
        }

    }

    const fetchEventPlay = async () => {
        let dataSetType, apiUrl, resList;

        dataSetType = DATASET_TYPE_CATEGORY[sportCategory];
        apiUrl = URL[sportCategory];

        // console.log(dataSetType,'dataType')
        // console.log(apiUrl,'api url')

        axios.get(apiUrl,
            {
                params: {
                    event: eventId
                }
            }
        ).then((response) => {
            setPlayList(response.data);
            resList = response.data;

            var result;
            // var team1Id,team2Id,team1Name,team2Name;
            // console.log(resList.boxscore.teams[team1Idx],"team ID")

            if (resList.boxscore.teams[team1Idx]) {
                var team1Id = resList.boxscore.teams[team1Idx].team.id;                                     //team1 ID
                var team2Id = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.id;                 //team2 ID
                var team1Name = resList.boxscore.teams[team1Idx].team.name;                                 //team1 Name
                var team2Name = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.name;
            }

            var matchEvtList = [];
            var selectedTeamIdx = 0;

            var score = [0, 0, 0, 0], tableIndex = 0, textIndex = 0, increaseAmount;

            if (sportCategory == 'SOCCER') {
                console.log('SOCCER DS START')
                let hisList = [];
                var team1Score, team2Score = 0;

                for (let i = 0; i < resList.commentary.length; i++) {
                    // console.log(i, 'soccer item')
                    for (let j = 0; j < dataSetType.length; j++) {
                        var team1Id = resList.boxscore.teams[team1Idx].team.id;
                        var team2Id = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.id;
                        var team1Name = resList.boxscore.teams[team1Idx].team.name;
                        var team2Name = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.name;

                        var currentPlayItem = resList.commentary[i];
                        var prevPlayItem = resList.commentary[i - 1];

                        var prevEventItem;

                        var dataTypeItem = dataSetType[j];
                        var matchTeamId = team1Id;

                        // SOCCER-DS7
                        if (dataTypeItem.no === 'SOCCER-DS7') {
                            if (currentPlayItem.text.indexOf('Foul by') === -1) {
                                continue;
                            }
                        }

                        // SOCCER-DS8
                        if (dataTypeItem.no === 'SOCCER-DS8') {
                            if (currentPlayItem.text.indexOf('Foul by') === -1) {
                                continue;
                            }
                        }

                        // SOCCER-DS9
                        if (dataTypeItem.no === 'SOCCER-DS9') {
                            if (currentPlayItem.text.indexOf('Goal!') === -1) {
                                continue;
                            } else {
                                let team1NameIdx = currentPlayItem.text.indexOf(team1Name);
                                let team2NameIdx = currentPlayItem.text.indexOf(team2Name);
                                if (team1NameIdx !== -1 && team2NameIdx !== -1) {
                                    // console.log(parseInt(currentPlayItem.text.slice(team1NameIdx + team1Name.length + 1, team1NameIdx + team1Name.length + 3).trim()), 'team1Score')
                                    // console.log(parseInt(currentPlayItem.text.slice(team2NameIdx + team2Name.length + 1, team2NameIdx + team2Name.length + 3).trim()), 'team2Score')
                                    team1Score = parseInt(currentPlayItem.text.slice(team1NameIdx + team1Name.length + 1, team1NameIdx + team1Name.length + 3).trim());
                                    team2Score = parseInt(currentPlayItem.text.slice(team2NameIdx + team2Name.length + 1, team2NameIdx + team2Name.length + 3).trim())

                                    // console.log(team1Score, team2Score, 'team score')
                                }
                            }

                            if (currentPlayItem.text.indexOf('OVERTURNED') !== -1) {
                                continue;
                            }
                        }

                        // SOCCER-DS10
                        if (dataTypeItem.no === 'SOCCER-DS10') {
                            if (currentPlayItem.text.indexOf('Goal!') === -1) {
                                continue;
                            }

                            if (currentPlayItem.text.indexOf('OVERTURNED') !== -1) {
                                continue;
                            }
                        }

                        // SOCCER-DS11
                        if (dataTypeItem.no === 'SOCCER-DS11') {
                            if (currentPlayItem.text.indexOf('Attempt saved') === -1 || currentPlayItem.text.indexOf(team1Name) === -1) {
                                continue;
                            }
                        }

                        // SOCCER-DS12
                        if (dataTypeItem.no === 'SOCCER-DS12') {
                            if (currentPlayItem.text.indexOf('Attempt saved') === -1 || currentPlayItem.text.indexOf(team2Name) === -1) {
                                continue;
                            }
                        }

                        // SOCCER-DS14
                        if (dataTypeItem.no === 'SOCCER-DS14') {
                            // console.log(i, currentPlayItem.text.indexOf('Corner,'),'Corner check',
                            //             currentPlayItem.text.indexOf(team1Name),'team1Name check')
                            if (currentPlayItem.text.indexOf('Corner,') === -1 || currentPlayItem.text.indexOf(team1Name) === -1) {
                                continue;
                            }
                        }

                        // SOCCER-DS15
                        if (dataTypeItem.no === 'SOCCER-DS15') {
                            if (currentPlayItem.text.indexOf('Corner,') === -1 || currentPlayItem.text.indexOf(team2Name) === -1) {
                                continue;
                            }
                        }

                        // SOCCER-DS17
                        if (dataTypeItem.no === 'SOCCER-DS17') {
                            if (currentPlayItem.text.indexOf('OVERTURNED') === -1) {
                                continue;
                            }
                        }

                        // SOCCER-DS24
                        if (dataTypeItem.no === 'SOCCER-DS24') {
                            if (currentPlayItem.text.indexOf('Own Goal') === -1) {
                                continue;
                            }
                        }

                        // SOCCER-DS25
                        if (dataTypeItem.no === 'SOCCER-DS25') {
                            if (currentPlayItem.text.indexOf('Own Goal') === -1 || currentPlayItem.text.indexOf('OVERTURNED') !== -1) {
                                continue;
                            }
                        }

                        // Compare TeamId
                        if (dataTypeItem.teamId !== -1) {
                            if (!currentPlayItem.play) {
                                continue;
                            }

                            if (currentPlayItem.play.team) {
                                if (dataTypeItem.teamId) {
                                    if (currentPlayItem.play.team.displayName != team2Name) {
                                        continue;
                                    }
                                } else {
                                    if (currentPlayItem.play.team.displayName != team1Name) {
                                        continue;
                                    }
                                }
                            }
                        }

                        // Compare TypeId
                        if (dataTypeItem.typeId) {
                            if (!currentPlayItem.play) {
                                continue;
                            }

                            if (dataTypeItem.typeId != currentPlayItem.play.type.id) {
                                continue;
                            }
                        }

                        if (dataTypeItem.scoreValue !== -1) {
                            // if(dataTypeItem.scoreValue != currentPlayItem.play.score){
                            //     continue;
                            // }
                        }

                        result = handleSoccerScore(currentPlayItem, dataTypeItem, score, tableIndex, prevPlayItem, team1Name, team2Name);
                        hisList = historyList;

                        // For Logos
                        if (currentPlayItem.play) {
                            if (currentPlayItem.play.team.displayName === team1Name) {
                                selectedTeamIdx = team1Idx;
                            } else {
                                selectedTeamIdx = (parseInt(team1Idx) + 1) % 2;
                            }
                        }

                        // if don't have team check, set default default log
                        // if (dataTypeItem.teamId === -1) {
                        //     selectedTeamIdx = -1
                        // }

                        // console.log(i, 'result')
                        if (tableIndex != result.tableIndex) {
                            hisList[result.tableIndex] = [];
                        }

                        hisList[result.textIndex].push({
                            no: dataTypeItem.no,
                            seq: currentPlayItem.sequence,
                            teamIdx: selectedTeamIdx,
                            score: result.score[result.textIndex],
                            description: result.description,
                            increase: result.increaseMount,
                            time: currentPlayItem.time.displayValue
                        });

                        increaseAmount = result.increaseMount;
                        textIndex = result.textIndex;
                        tableIndex = result.tableIndex;
                        prevEventItem = currentPlayItem;

                        console.log(
                            'DS_NO:', dataTypeItem.no,
                            'sequence:', currentPlayItem.sequence,
                            'team1Name:', team1Name,
                            // 'currentTeam:', currentPlayItem.play.team.displayName,
                            // 'typeId:', currentPlayItem.play.type.id,
                            'description:', result.description,
                            'increase:', dataTypeItem.Increase,
                            'rotation:', dataTypeItem.rotation,
                            // 'historyList:', hisList
                        )
                        console.log(
                            'teamIndex0:', result.score[0],
                            'teamIndex1:', result.score[1],
                            'teamIndex2:', result.score[2],
                            'teamIndex3:', result.score[3]
                        )
                    }
                }

                if (result) {
                    setSelTeamIdx(selectedTeamIdx)
                    setTableScore(result.score);
                    setSelTextIdx(textIndex);
                    setSelTblIdx(tableIndex);
                    setIncreaseAmt(increaseAmount);
                    setDescription(result.description);
                    setTime(result.sequenceTime);
                    setHistoryList(hisList);
                }

                // console.log(team1Score, team2Score, 'score')
                if (team1Idx === 1) {
                    setHomeScore(team1Score);
                    setAwayScore(team2Score);
                } else {
                    setHomeScore(team2Score);
                    setAwayScore(team1Score);
                }
            } else {
                if (team1Idx != -1 && resList.plays) {
                    let hisList = [];
                    let timerList = [[], [], [], []];
                    let sepcialSeq = { id: 502, seq: 0, teamId: 0 };

                    console.log('Loop', resList.plays.length)
                    console.log(startTime, 'start Time')
                    // console.log(hisList, 'hislist in event loop')
                    for (let i = 0; i < resList.plays.length; i++) {
                        // console.log(i,'Events List')
                        var currentPlayItem = resList.plays[i];
                        var prevPlayItem = resList.plays[i - 1];
                        if (startTime != -1) {
                            if (parseInt(currentPlayItem.sequenceNumber) < parseInt(startTime)) {
                                continue;
                            }
                        }
                        for (let j = 0; j < dataSetType.length; j++) {
                            // console.log(j,'Datatype')
                            var team1Id = resList.boxscore.teams[team1Idx].team.id;
                            var team2Id = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.id;
                            var team1Name = resList.boxscore.teams[team1Idx].team.name;
                            var team2Name = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.name;
                            // var prevEventItem;

                            var dataTypeItem = dataSetType[j];
                            var matchTeamId = team1Id;

                            // teamId
                            if (dataTypeItem.teamId !== -1) {
                                if (currentPlayItem.team === undefined) {
                                    continue;
                                }

                                if (dataTypeItem.teamId) {
                                    matchTeamId = team2Id
                                }

                                if (currentPlayItem.team && (currentPlayItem.team.id != matchTeamId)) {
                                    continue;
                                }
                            }

                            // typeId
                            if (dataTypeItem.typeId) {
                                if (currentPlayItem.type.id == 502) {
                                    sepcialSeq = {
                                        id: 502,
                                        seq: currentPlayItem.sequenceNumber,
                                        teamId: currentPlayItem.team.id
                                    }
                                }

                                if (currentPlayItem.type.id != dataTypeItem.typeId) continue;
                            }

                            // scoreValue
                            if (dataTypeItem.scoreValue != -1) {
                                if (currentPlayItem.scoreValue === undefined) continue;
                                if (currentPlayItem.scoreValue != dataTypeItem.scoreValue) continue;
                            }

                            // scoringPlay
                            if (dataTypeItem.scoringPlayStatus) {
                                if (currentPlayItem.scoringPlay != dataTypeItem.scoringPlay) {
                                    continue;
                                }
                            }

                            // Special DS
                            // DS2-NCAA
                            if (dataTypeItem.no === 'NCAA-DS2') {
                                if (prevPlayItem === undefined || prevPlayItem.scoreValue === undefined || prevPlayItem.scoreValue != 0) continue;
                                if (currentPlayItem.text.includes('made Dunk')) continue;
                            }

                            // DS3-NCAA
                            if (dataTypeItem.no === 'NCAA-DS3') {
                                if (prevPlayItem === undefined || prevPlayItem.scoreValue === undefined || prevPlayItem.scoreValue != 0) continue;
                            }

                            // DS9-NCAA
                            if (dataTypeItem.no === 'NCAA-DS9') {
                                if (prevPlayItem === undefined || currentPlayItem.clock === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoreValue === undefined) continue;
                                if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.type.id == 574 || prevPlayItem.scoreValue != 2) {
                                    continue;
                                }
                            }

                            // NCAA-DS12
                            if (dataTypeItem.no === 'NCAA-DS12') {
                                if (prevPlayItem === undefined || prevPlayItem.clock === undefined) continue;
                                if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.type.id != 574) {
                                    continue;
                                }
                            }

                            // NCAA-DS13
                            if (dataTypeItem.no === 'NCAA-DS13') {
                                if (prevPlayItem === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoringPlay === undefined) continue;
                                if (!prevPlayItem.scoringPlay || currentPlayItem.clock.displayValue === prevPlayItem.clock.displayValue) {
                                    continue;
                                }
                            }

                            // DS30-NBA
                            if (dataTypeItem.no === 'NBA-DS30') {
                                if (prevPlayItem === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoringPlay === undefined || prevPlayItem.team === undefined) continue;
                                if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.scoreValue != 2 || prevPlayItem.team.id == matchTeamId || dataTypeItem.noMatchList.indexOf(prevPlayItem.type.id) !== -1) {
                                    continue;
                                }
                            }

                            // DS48-NBA
                            if (dataTypeItem.no === 'NBA-DS48') {
                                if (prevPlayItem === undefined || prevPlayItem.clock === undefined) continue;
                                if (currentPlayItem.clock.displayValue === prevPlayItem.clock.displayValue) {
                                    continue;
                                }
                            }

                            // NHL-DS2
                            if (dataTypeItem.no === 'NHL-DS2') {
                                if (currentPlayItem.text.includes('Timeout') || currentPlayItem.text.includes('official') || currentPlayItem.text.includes('Challenge') || currentPlayItem.text.includes('review')) {
                                    continue;
                                }
                            }

                            // NHL-DS4
                            if (dataTypeItem.no === 'NHL-DS4') {
                                if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || !currentPlayItem.text.includes('Fighting') || !prevPlayItem.text.includes('Fighting') || currentPlayItem.team.id !== prevPlayItem.team.id) {
                                    continue;
                                }
                            }

                            // NHL-DS5, NHL-DS6 
                            if (dataTypeItem.no === 'NHL-DS5' || dataTypeItem.no === 'NHL-DS6') {
                                if (currentPlayItem.text.includes('Fighting')) {
                                    continue;
                                }
                            }

                            // NHL2-DS2
                            if (dataTypeItem.no === 'NHL2-DS2') {
                                if (sepcialSeq.teamId != team1Id) {
                                    continue;
                                }
                            }

                            // NHL2-DS2-2
                            if (dataTypeItem.no === 'NHL2-DS2-2') {
                                if (sepcialSeq.teamId != team2Id) {
                                    continue;
                                }
                            }

                            // NHL2-DS2-3
                            if (dataTypeItem.no === 'NHL2-DS2-3') {
                                if (sepcialSeq.teamId != team1Id) {
                                    continue;
                                }
                            }

                            // NHL2-DS2-4
                            if (dataTypeItem.no === 'NHL2-DS2-4') {
                                if (sepcialSeq.teamId != team2Id) {
                                    continue;
                                }
                            }

                            // NBA2-DS1-2
                            if (dataTypeItem.no === 'NBA2-DS1-2') {
                                if (!currentPlayItem.text.includes('three point')) {
                                    continue;
                                }
                            }

                            // NBA2-DS1-3
                            if (dataTypeItem.no === 'NBA2-DS1-3') {
                                if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 22-foot')) {
                                    continue;
                                }
                            }

                            // NBA2-DS1-4
                            if (dataTypeItem.no === 'NBA2-DS1-4') {
                                if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 23-foot')) {
                                    continue;
                                }
                            }

                            // NBA2-DS1-5
                            if (dataTypeItem.no === 'NBA2-DS1-5') {
                                if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 24-foot')) {
                                    continue;
                                }
                            }

                            // NBA2-DS1-6
                            if (dataTypeItem.no === 'NBA2-DS1-6') {
                                if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 25-foot')) {
                                    continue;
                                }
                            }

                            // NBA2-DS1-7
                            if (dataTypeItem.no === 'NBA2-DS1-7') {
                                if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 26-foot')) {
                                    continue;
                                }
                            }

                            // NBA2-DS1-8
                            if (dataTypeItem.no === 'NBA2-DS1-8') {
                                if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 27-foot')) {
                                    continue;
                                }
                            }

                            // NBA2-DS7
                            if (dataTypeItem.no === 'NBA2-DS7') {
                                if (!currentPlayItem.type.text.includes('Dunk Shot') || dataTypeItem.noMatchList.indexOf(prevPlayItem.type.id) !== -1) {
                                    continue;
                                }
                            }

                            // NBA2-DS7-2
                            if (dataTypeItem.no === 'NBA2-DS7-2') {
                                if (!currentPlayItem.type.text.includes('Dunk Shot')) {
                                    continue;
                                }
                            }

                            // NBA2-DS20
                            if (dataTypeItem.no === 'NBA2-DS20') {
                                if (currentPlayItem.type.id == 84 || !currentPlayItem.type.text.includes('Turnover')) {
                                    continue;
                                }
                            }

                            // NBA2-DS30
                            if (dataTypeItem.no === 'NBA2-DS30') {
                                if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.scoreValue != 2 || prevPlayItem.team.id == matchTeamId || dataTypeItem.noMatchList.indexOf(prevPlayItem.type.id) !== -1 || prevPlayItem.type.text.includes('Dunk Shot')) {
                                    continue;
                                }
                            }

                            // NBA2-DS30-2
                            if (dataTypeItem.no === 'NBA2-DS30-2') {
                                if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || !prevPlayItem.type.text.includes('Dunk Shot')) {
                                    continue;
                                }
                            }

                            // NBA2-DS48
                            if (dataTypeItem.no === 'NBA2-DS48') {
                                if (currentPlayItem.clock.displayValue === prevPlayItem.clock.displayValue) {
                                    continue;
                                }
                            }

                            // NBA2-DS72
                            if (dataTypeItem.no === 'NBA2-DS72') {
                                if (!currentPlayItem.text.includes('blocks')) {
                                    continue;
                                }
                            }
                            // Special DS

                            matchEvtList.push(currentPlayItem);
                            result = handleScore(currentPlayItem, dataTypeItem, score, tableIndex, prevPlayItem, team1Name, team2Name, sportCategory);
                            hisList = historyList;
                            // console.log(hisList,"history List");

                            if (dataTypeItem.rotation) {
                                let time = currentPlayItem.period.displayValue + ' ' + currentPlayItem.clock.displayValue;
                                let sequence = currentPlayItem.sequenceNumber;
                                timerList[result.textIndex].push({
                                    label: time,
                                    value: sequence
                                })
                                // console.log(timerList,'timerList')
                            }

                            // For Logos
                            selectedTeamIdx = team1Idx;
                            if (team1Id != matchTeamId) {
                                selectedTeamIdx = (parseInt(team1Idx) + 1) % 2;
                            }

                            // If don't team check, set default team logo
                            if (dataTypeItem.teamId === -1) {
                                selectedTeamIdx = -1
                            }

                            if (tableIndex != result.tableIndex) {
                                hisList[result.tableIndex] = [];
                            }

                            let hisItem = {
                                no: dataTypeItem.no,
                                seq: currentPlayItem.sequenceNumber,
                                // teamId: currentPlayItem.team.id,
                                teamIdx: selectedTeamIdx,
                                score: result.score[result.textIndex],
                                description: result.description,
                                increase: result.increaseMount,
                                time: currentPlayItem.clock.displayValue
                            }

                            if (dataTypeItem.logoReverse) {
                                hisItem.teamIdx = changeTeamIdx(selectedTeamIdx);
                            }

                            if (sportCategory == 'NHL' || sportCategory == 'NHL2') {
                                hisItem.time = reverseTime(currentPlayItem.clock.displayValue);
                            }

                            // console.log(reverseTime(currentPlayItem.clock.displayValue), 'reverse time')
                            hisList[result.textIndex].push(hisItem);

                            increaseAmount = result.increaseMount;
                            textIndex = result.textIndex;
                            tableIndex = result.tableIndex;
                            prevEventItem = currentPlayItem;

                            if (currentPlayItem.team) {
                                console.log(
                                    'DS_NO:', dataTypeItem.no,
                                    'sequence:', currentPlayItem.sequenceNumber,
                                    'team1Id:', team1Id,
                                    'teamId:', currentPlayItem.team.id,
                                    'typeId:', currentPlayItem.type.id,
                                    "scoreValue:", currentPlayItem.scoreValue,
                                    'scoringPlay', currentPlayItem.scoringPlay,
                                    'selectedTeamIdx:', selectedTeamIdx,
                                    "rotation:", dataTypeItem.rotation,
                                    'textIdx:', textIndex,
                                    'tableIdx:', tableIndex,
                                    'teamIndex:', tableIndex,
                                    'increase:', increaseAmount,
                                    'description:', result.description,
                                    'homeScore:', currentPlayItem.homeScore,
                                    'awayScore', currentPlayItem.awayScore,
                                    'Period:', currentPlayItem.period.displayValue,
                                    'Clock:', currentPlayItem.clock.displayValue,
                                )
                            } else {
                                console.log(
                                    'DS_NO:', dataTypeItem.no,
                                    'sequence:', currentPlayItem.sequenceNumber,
                                    'team1Id:', team1Id,
                                    'teamId:', 'No team',
                                    'typeId:', currentPlayItem.type.id,
                                    "scoreValue:", currentPlayItem.scoreValue,
                                    'scoringPlay', currentPlayItem.scoringPlay,
                                    'selectedTeamIdx:', selectedTeamIdx,
                                    "rotation:", dataTypeItem.rotation,
                                    'textIdx:', textIndex,
                                    'tableIdx:', tableIndex,
                                    'teamIndex:', tableIndex,
                                    'increase:', increaseAmount,
                                    'description:', result.description,
                                    'homeScore:', currentPlayItem.homeScore,
                                    'awayScore', currentPlayItem.awayScore,
                                    'Period:', currentPlayItem.period.displayValue,
                                    'Clock:', currentPlayItem.clock.displayValue,
                                )
                            }
                        }
                    }

                    if (result) {
                        // console.log(hisList, 'history list')
                        setSelTeamIdx(selectedTeamIdx)
                        setTableScore(result.score);
                        setSelTextIdx(textIndex);
                        setSelTblIdx(tableIndex);
                        setIncreaseAmt(increaseAmount);
                        setDescription(result.description);
                        setTime(result.sequenceTime);
                        setHomeScore(result.homeScore);
                        setAwayScore(result.awayScore);
                        setHistoryList(hisList);
                        if (startTime == -1) {
                            setTimeList(timerList);
                        }
                    }
                }
            }

        }).catch((err) => {
            console.log(err)
        });
    }

    const handleEvent = () => {
        if (eventId == -1) {
            setEventId(gameId)
        } else {
            alert("please set 'Choose One' in Today Event and then start again.");
        }
    }

    const handleTab = () => {
        setTabStatus(!tabStatus);
    }

    const setInitial = () => {
        setSelTeamIdx(0)
        setTableScore([0, 0, 0, 0]);
        setSelTextIdx(0);
        setSelTblIdx(0);
        setIncreaseAmt(0);
        setDescription('');
        setTime(0);
        setHomeScore(0);
        setAwayScore(0);
        setHistoryList([[], [], [], []]);
    }

    // console.log(selTeamIdx,'render Team Idx')
    return (
        <>
            {
                tabStatus && <>
                    <div className='row'>
                        <div className='col-md-2'>
                            <label className="form-label" style={{ float: "left" }}>Sports Category</label>
                            <select className="form-select form-select-sm"
                                value={sportCategory}
                                onChange={evt => {
                                    setSportCategory(evt.target.value);

                                }}
                            >
                                {
                                    SPORTS_CATEGORY.map((item, index) => {
                                        return (
                                            <option key={index} value={item.value}>{item.label}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className='row my-3'>
                        <div className='col-md-3'>
                            <Filter
                                label='Today Event'
                                columns={{ label: "name", value: "id" }}
                                list={events ? events : []}
                                value={eventId}
                                // disabled={sportCategory !== 'NBA'}
                                handleChange={(id) => {
                                    setEventId(id);
                                    // setTeam1Idx(-1);
                                    // setTeam2Name('');
                                    // setPlayList([])
                                }}
                            />
                        </div>
                        <div className='col-md-3'>
                            <label className="form-label">Random GameId</label><br />
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm" placeholder="Game Id"
                                    value={gameId}
                                    onChange={(evt) => { setGameId(evt.target.value) }}
                                />
                                <button className="btn btn-success btn-sm" onClick={handleEvent}>Start</button>
                            </div>
                        </div>
                    </div>
                    <div className='row mt-3'>
                        <div className='col-md-2'>
                            <label className="form-label" style={{ float: "left" }}>Team1</label>
                            <select className="form-select form-select-sm"
                                value={team1Idx}
                                onChange={evt => {
                                    setTeam1Idx(evt.target.value)
                                    setTeam2Name(evt.target.value != -1 && playList.boxscore.teams[(parseInt(evt.target.value) + 1) % 2].team.name)
                                }}
                            >
                                <option value={-1}>Choose One</option>
                                {
                                    playList.boxscore && playList.boxscore.teams.map((item, index) => {
                                        return (
                                            <option key={index} value={index}>{item.team.name}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-md-2'>
                            <label className="form-label">Team2</label>
                            <input type="text" value={team2Name} className="form-control form-control-sm" disabled />
                        </div>
                        <div className='col-md-2'>
                            <Filter
                                label='Interval Rate'
                                columns={{ label: "label", value: "value" }}
                                list={INTERVAL_TIME}
                                handleChange={(time) => { setIntervalTime(time) }}
                            />
                        </div>
                    </div>
                </>
            }
            <div className='text-center mt-3'>
                <button className='btn btn-primary' onClick={handleTab}>{tabStatus ? 'Go To Game' : 'Go To Dashboard'}</button>
            </div>
            {
                !tabStatus && <div className='row'>
                    <div className='col-6'>
                        <label className="form-label" style={{ float: "left" }}>Team</label>
                        <select className="form-select form-select-sm"
                            value={selectedTeamTime}
                            onChange={evt => {
                                // console.log(evt.target.value, 'start time')
                                setSelectedTeamTime(evt.target.value);
                            }}
                        >
                            {
                                TEAM_LIST.map((item, index) => {
                                    return (
                                        <option key={index} value={item.value}>{item.label}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                    <div className='col-6'>
                        <label className="form-label" style={{ float: "left" }}>Time</label>
                        <select className="form-select form-select-sm"
                            value={startTime}
                            onChange={evt => {
                                // console.log(evt.target.value, 'start time')
                                setStartTime(evt.target.value);
                                if(evt.target.value != -1){
                                    setInitial();
                                }
                            }}
                        >
                            <option value={-1}>Choose One</option>
                            {
                                timeList[selectedTeamTime].map((item, index) => {
                                    return (
                                        <option key={index} value={item.value}>{item.label}</option>
                                    )
                                })
                            }
                        </select>
                    </div>
                </div>
            }
            <ScoreBoardComp
                tabStatus={tabStatus}
                eventId={eventId}
                team1Idx={team1Idx}
                playList={playList}
                awayScore={awayScore}
                homeScore={homeScore}
                time={time}
                tableScore={tableScore}
                selTblIdx={selTblIdx}
                description={description}
                increaseAmt={increaseAmt}
                selTeamIdx={selTeamIdx}
                selTextIdx={selTextIdx}
                historyList={historyList}
                timeList={timeList}
            />
        </>
    );
}

export default EventComponent;


