import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Filter from '../../layouts/Filter';

import { URL, SPORTS_CATEGORY, INTERVAL_TIME, DATASET_TYPE_CATEGORY } from '../../const.js';
import { changeTeamIdx, handleScore, handleSoccerScore, reverseTime, getDuraton, findSeqIndex, findSoccerSeqIndex, mergeArrays } from '../../func.js';

import ScoreBoardComp from './scoreBoard.js';
import { checkFunc, checkSoccerFunc } from './checkFunc.js';

var goToIndex = 0;
var timeOut = null;
var timeIntervalForLatest = null;

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
    const [timeList, setTimeList] = useState([]);
    const [eventList, setEventList] = useState([]);

    // const [selectedTeamTime, setSelectedTeamTime] = useState(0);
    const [startTime, setStartTime] = useState(-1);

    const [tableScore, setTableScore] = useState([0, 0, 0, 0]);

    /* Tab Index */
    const [tabStatus, setTabStatus] = useState(true);
    const [goIndex, setGoIndex] = useState(0);

    const [player1Name, setPlayer1Name] = useState('Player1');
    const [player2Name, setPlayer2Name] = useState('Player2');
    const [player3Name, setPlayer3Name] = useState('Player3');
    const [player4Name, setPlayer4Name] = useState('Player4');

    const [selectedTeam1s, setSelectedTeam1s] = useState([-1, -1, -1, -1])

    useEffect(() => {
        console.log('Run goToPlay function')
        if (startTime != -1 && goIndex >= 0) {
            goToPlay(goIndex)
        }
    }, [goIndex])

    /* Get Total Event */
    useEffect(() => {
        let apiUrl = URL[sportCategory + '_TODAY_EVENT'];

        axios.get(apiUrl,
        ).then((response) => {
            setEvents(response.data.events);
        }).catch((err) => {
            console.log(err);
        });
    }, [sportCategory])

    /* Get Event List */
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

    const getLatestDS = async () => {
        let dataSetType, apiUrl, resList;
        dataSetType = DATASET_TYPE_CATEGORY[sportCategory];
        apiUrl = URL[sportCategory];

        let response = await axios.get(apiUrl,
            {
                params: {
                    event: eventId
                }
            }
        )

        setPlayList(response.data);
        resList = response.data;
        // let result;
        let team1Id, team2Id, team1Name, team2Name, team1Abbre, team2Abbre;
        let PREV_NHL_DS2 = { id: 502, seq: 0, teamId: 0 };
        let PREV_NHL_DS5 = { id: 516, seq: 0, teamId: 0 }
        let matchEvtList = [];

        let NBA2_DS1_CNT = 0;
        let NHL_DS3_CNT = 0;
        let NHL2_DS2_CNT = 0;

        if (resList.boxscore.teams[team1Idx]) {
            team1Id = resList.boxscore.teams[team1Idx].team.id;                                     //team1 ID
            team2Id = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.id;                 //team2 ID
            team1Name = resList.boxscore.teams[team1Idx].team.name;                                 //team1 Name
            team2Name = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.name;
            team1Abbre = resList.boxscore.teams[team1Idx].team.abbreviation;                        //team1 abbreviation
            team2Abbre = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.abbreviation;

            if (team1Name.includes('&')) {
                team1Name = team1Name.replace('&', 'and');
            }

            if (team2Name.includes('&')) {
                team2Name = team2Name.replace('&', 'and');
            }
        }

        var dsList = [];

        if (sportCategory === 'SOCCER') {
            dsList = resList.commentary;
        } else {
            if (sportCategory == 'NFL' || sportCategory == 'NCAAFB') {
                let playsList = Array.isArray(resList?.drives?.previous) ? resList.drives.previous : [];
                for (let index = 0; index < playsList.length; index++) {
                    /* Add offensivePlays to NFL plays list */
                    let updatedList = playsList[index].plays.map(item => ({
                        ...item,
                        offensivePlays: playsList[index].offensivePlays
                    }))
                    resList.plays = mergeArrays(resList.plays, updatedList)
                }

                console.log(resList.plays, 'plays in getLatestDS');
            }

            dsList = resList.plays
        }

        for (let i = 0; i < dsList.length; i++) {
            let selectedDS = false;
            let currentPlayItem = dsList[i];
            let prevPlayItem = dsList[i - 1];

            /* Special DS (NHL) */
            if (sportCategory === 'NHL') {
                if (currentPlayItem.type.id == 502) {
                    PREV_NHL_DS2 = {
                        id: 502,
                        seq: currentPlayItem.sequenceNumber,
                        teamId: currentPlayItem.team.id,
                        ...currentPlayItem
                    }
                }

                if (currentPlayItem.type.id == 516) {
                    PREV_NHL_DS5 = {
                        id: 516,
                        seq: currentPlayItem.sequenceNumber,
                        clock: currentPlayItem.clock,
                    }
                }
            }

            for (let j = 0; j < dataSetType.length; j++) {
                var dataTypeItem = dataSetType[j];
                var matchTeamId = team1Id;

                if (sportCategory === 'SOCCER') {
                    if (checkSoccerFunc(dataTypeItem, currentPlayItem, prevPlayItem, team1Id, team2Id, team1Name, team2Name, team1Abbre, team2Abbre, matchTeamId)) {
                        continue;
                    }
                } else {
                    if (checkFunc(sportCategory, dataTypeItem, currentPlayItem, prevPlayItem, team1Id, team2Id, matchTeamId, PREV_NHL_DS2, PREV_NHL_DS5)) {
                        continue;
                    } else {
                        if (sportCategory === 'NHL') {
                            /* NHL-DS3 and NHL-DS3-1 Logic(more than 2 times) */
                            if (dataTypeItem.rotation) {
                                NHL_DS3_CNT = 0;
                            }

                            if (dataTypeItem.no === "NHL-DS3") {
                                NHL_DS3_CNT++;
                                if (NHL_DS3_CNT > 2) {
                                    continue;
                                }
                            }

                            if (dataTypeItem.no === "NHL-DS3-1") {
                                if (NHL_DS3_CNT <= 2) {
                                    continue;
                                }
                            }
                        }

                        if (sportCategory === 'NBA') {
                            /* NBA2_DS1 and NBA2_DS4 Logic(more than 2 times) */
                            if (dataTypeItem.rotation) {
                                NBA2_DS1_CNT = 0;
                            }

                            if (dataTypeItem.no === "NBA2-DS1") {
                                NBA2_DS1_CNT++;
                                if (NBA2_DS1_CNT > 2) {
                                    continue;
                                }
                            }

                            if (dataTypeItem.no === "NBA2-DS4") {
                                if (NBA2_DS1_CNT <= 2) {
                                    continue;
                                }
                            }
                        }

                        if (sportCategory === 'NHL2') {
                            /* NHL2_DS2 and NBA2_DS2-1 Logic(more than 2 times) */
                            if (dataTypeItem.no === "NHL2_DS2") {
                                NHL2_DS2_CNT++;
                                if (NHL2_DS2_CNT > 2) {
                                    continue;
                                }
                            }

                            if (dataTypeItem.no === "NHL2_DS2-1") {
                                if (NHL2_DS2_CNT <= 2) {
                                    continue;
                                }
                            }
                        }
                    }
                }

                if (!selectedDS) {
                    matchEvtList.push({
                        ...currentPlayItem,
                        prevPlayItem: prevPlayItem
                    });

                    selectedDS = true;
                }
            }
        }

        // console.log(matchEvtList, 'event list')
        return matchEvtList;
    }

    const goToPlay = (selected = -1) => {
        let resList = playList;
        let dataSetType = DATASET_TYPE_CATEGORY[sportCategory];

        let result;
        let selectedTeamIdx = 0;
        let score = [0, 0, 0, 0], tableIndex = 0, textIndex = 0, increaseAmount;
        let team1Id, team2Id, team1Name, team2Name, team1Abbre, team2Abbre;

        let hisList = [];
        let prevHisList = [[], [], [], []];
        let i = 0;
        let selectedSeqIdx = 0;

        let PREV_NHL_DS2 = { id: 502, seq: 0, teamId: 0 };
        let PREV_NHL_DS5 = { id: 516, seq: 0, teamId: 0 }

        let NBA2_DS1_CNT = 0;
        let NHL_DS3_CNT = 0;
        let NHL2_DS2_CNT = 0;

        if (resList.boxscore.teams[team1Idx]) {
            team1Id = resList.boxscore.teams[team1Idx].team.id;                                     //team1 ID
            team2Id = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.id;                 //team2 ID
            team1Name = resList.boxscore.teams[team1Idx].team.name;                                 //team1 Name
            team2Name = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.name;

            if (team1Name.includes('&')) {
                team1Name = team1Name.replace('&', 'and');
            }

            if (team2Name.includes('&')) {
                team2Name = team2Name.replace('&', 'and');
            }
        }

        /* Find Index in Event List with Seq number(StartTime) */
        if (selected === -1) {
            if (startTime != -1) {
                selectedSeqIdx = startTime;
            }
        } else {
            selectedSeqIdx = selected;
        }

        if (sportCategory == 'SOCCER') {
            if (team1Idx != -1 && eventList) {
                console.log('SOCCER DS START')
                let team1Score = 0, team2Score = 0;

                const loop = () => {
                    if (i < eventList.length) {
                        let currentPlayItem = eventList[i];
                        let prevEventItem = eventList[i - 1];
                        let prevPlayItem = eventList[i].prevPlayItem;
                        let duration = 0;

                        if (prevEventItem) {
                            duration = (currentPlayItem.time.value - prevEventItem.time.value) * 1000;

                            if (currentPlayItem.time.value == 2700 || currentPlayItem.time.value == 5400) {
                                if (currentPlayItem.time.displayValue.indexOf('+') != -1) {
                                    let prevSecond = 0;
                                    let currentSecond = parseInt(currentPlayItem.time.displayValue.slice(currentPlayItem.time.displayValue.indexOf('+') + 1, currentPlayItem.time.displayValue.length));

                                    if (currentPlayItem.time.displayValue.indexOf('+') != -1) {
                                        prevSecond = parseInt(prevEventItem.time.displayValue.slice(prevEventItem.time.displayValue.indexOf('+') + 1, prevEventItem.time.displayValue.length));
                                    }
                                    duration = (currentSecond - prevSecond) * 60 * 1000;
                                }
                            }
                        }

                        if (duration <= 0) duration = 1000;
                        if (startTime == -1 || i < selectedSeqIdx) duration = 0;

                        console.log(duration / 1000, i, 'duraion')

                        // console.log(i, 'result')
                        let teamIndex = selectedTeam1s[tableIndex]
                        team1Id = resList.boxscore.teams[teamIndex].team.id;                                     //team1 ID
                        team2Id = resList.boxscore.teams[(parseInt(teamIndex) + 1) % 2].team.id;                 //team2 ID
                        team1Name = resList.boxscore.teams[teamIndex].team.name;                                 //team1 Name
                        team2Name = resList.boxscore.teams[(parseInt(teamIndex) + 1) % 2].team.name;
                        team1Abbre = resList.boxscore.teams[teamIndex].team.abbreviation;                        //team1 abbreviation
                        team2Abbre = resList.boxscore.teams[(parseInt(teamIndex) + 1) % 2].team.abbreviation;

                        const handleGoTo = () => {
                            console.log(i, 'do while')
                            for (let j = 0; j < dataSetType.length; j++) {

                                var dataTypeItem = dataSetType[j];
                                var matchTeamId = team1Id;

                                if (checkSoccerFunc(dataTypeItem, currentPlayItem, prevPlayItem, team1Id, team2Id, team1Name, team2Name, team1Abbre, team2Abbre, matchTeamId)) {
                                    continue;
                                }

                                /* Team Score in Soccer(SOCCER-DS9,SOCCER-DS10) */
                                if (dataTypeItem.no === 'SOCCER-DS9' || dataTypeItem.no === 'SOCCER-DS10') {
                                    if (currentPlayItem.text === undefined) {
                                        continue;
                                    } else {
                                        if (currentPlayItem.text.indexOf('Goal!') === -1) {
                                            continue;
                                        } else {
                                            let team1NameIdx = currentPlayItem.text.indexOf(team1Name);
                                            let team2NameIdx = currentPlayItem.text.indexOf(team2Name);
                                            if (team1NameIdx == -1) team1NameIdx = currentPlayItem.text.indexOf(team1Name);
                                            if (team2NameIdx == -1) team2NameIdx = currentPlayItem.text.indexOf(team2Name);

                                            if (team1NameIdx !== -1 && team2NameIdx !== -1) {
                                                team1Score = parseInt(currentPlayItem.text.slice(team1NameIdx + team1Name.length + 1, team1NameIdx + team1Name.length + 3).trim());
                                                team2Score = parseInt(currentPlayItem.text.slice(team2NameIdx + team2Name.length + 1, team2NameIdx + team2Name.length + 3).trim());
                                            }
                                        }

                                        // console.log(team1Score, team2Score, 'team score in Soccer')
                                        if (currentPlayItem.text.indexOf('OVERTURNED') !== -1) {
                                            continue;
                                        }
                                    }
                                }

                                result = handleSoccerScore(currentPlayItem, dataTypeItem, score, tableIndex, prevPlayItem, team1Name, team2Name);
                                hisList = prevHisList;

                                /* For Logos */
                                if (currentPlayItem.play) {
                                    if (currentPlayItem.play.team === undefined) {
                                        selectedTeamIdx = -1
                                    } else {
                                        if (currentPlayItem.play.team.displayName === team1Name) {
                                            selectedTeamIdx = teamIndex;
                                        } else {
                                            selectedTeamIdx = (parseInt(teamIndex) + 1) % 2;
                                        }
                                    }
                                }

                                /* 
                                   If don't team check, set default team logo
                               */
                                if (dataTypeItem.teamId === -1) {
                                    selectedTeamIdx = -1
                                }

                                if (tableIndex != result.tableIndex) {
                                    hisList[result.tableIndex] = [];
                                }

                                let historyItem = {
                                    no: dataTypeItem.no,
                                    seq: currentPlayItem.sequence,
                                    teamIdx: selectedTeamIdx,
                                    score: result.score[result.textIndex],
                                    description: result.description,
                                    increase: result.increaseMount,
                                    time: currentPlayItem.time.displayValue
                                }

                                if (dataTypeItem.logo) {
                                    historyItem.teamIdx = teamIndex;
                                    if (dataTypeItem.logo == 2) historyItem.teamIdx = (parseInt(teamIndex

                                    ) + 1) % 2;
                                }

                                hisList[result.textIndex].push(historyItem);

                                increaseAmount = result.increaseMount;
                                textIndex = result.textIndex;
                                tableIndex = result.tableIndex;
                                // prevEventItem = currentPlayItem;

                                console.log(
                                    'DS_NO:', dataTypeItem.no,
                                    'sequence:', currentPlayItem.sequence,
                                    'team1Name:', team1Name,
                                    // 'currentTeam:', currentPlayItem.play.team.displayName,
                                    // 'typeId:', currentPlayItem.play.type.id,
                                    'description:', result.description,
                                    'increase:', dataTypeItem.Increase,
                                    'rotation:', dataTypeItem.rotation,
                                    'time value:', currentPlayItem.time.value,
                                    'time displayValue:', currentPlayItem.time.displayValue,
                                    // 'historyList:', hisList
                                )

                                // console.log(
                                //     'teamIndex0:', result.score[0],
                                //     'teamIndex1:', result.score[1],
                                //     'teamIndex2:', result.score[2],
                                //     'teamIndex3:', result.score[3]
                                // )
                                if (result) {
                                    setSelTeamIdx(selectedTeamIdx)
                                    setTableScore(result.score);
                                    setSelTextIdx(textIndex);
                                    setSelTblIdx(tableIndex);
                                    setIncreaseAmt(increaseAmount);
                                    setDescription(result.description);
                                    setTime(result.sequenceTime);
                                    setHistoryList(hisList);
                                    prevHisList = hisList;
                                }

                                if (team1Idx === 1) {
                                    setHomeScore(team1Score);
                                    setAwayScore(team2Score);
                                } else {
                                    setHomeScore(team2Score);
                                    setAwayScore(team1Score);
                                }
                            }

                            i++;
                            goToIndex = i;
                        }

                        if (duration > 0) {
                            timeOut = setTimeout(() => {
                                handleGoTo();
                                clearTimeout(timeOut);
                                timeOut = null;
                                loop(); // Call loop function recursively after delay
                            }, duration);
                        } else {
                            handleGoTo();
                            clearTimeout(timeOut)
                            timeOut = null;
                            loop(); // Call loop function recursively after delay
                        }
                    } else {
                        /* get new DS in GoTo function */
                        if (startTime != -1) {
                            timeIntervalForLatest = setInterval(async () => {
                                // console.log(intervalTime, 'get new DS in GoTo function')
                                let dsList = await getLatestDS(i)

                                console.log(dsList.length, i, 'get Data from API')
                                if (dsList.length > i) {
                                    clearInterval(timeIntervalForLatest);
                                    // setInitial();
                                    setEventList(dsList);
                                    setGoIndex(i);
                                }

                            }, intervalTime * 1000);
                            return () => clearInterval(timeIntervalForLatest);
                        }
                    }
                }
                loop();
            }
        } else {
            if (team1Idx != -1 && eventList) {
                console.log(eventList.length, selectedSeqIdx, 'selectedSeq Index')

                const loop = () => {
                    if (i < eventList.length) {
                        var currentPlayItem = eventList[i];
                        var prevEventItem = eventList[i - 1];
                        var prevPlayItem = eventList[i].prevPlayItem;
                        PREV_NHL_DS2 = eventList[i].PREV_NHL_DS2;
                        PREV_NHL_DS5 = eventList[i].PREV_NHL_DS5;

                        /* Special DS(NHL) */
                        if (currentPlayItem !== undefined || currentPlayItem.type !== undefined) {
                            if (currentPlayItem.type.id == 502) {
                                PREV_NHL_DS2 = {
                                    id: 502,
                                    seq: currentPlayItem.sequenceNumber,
                                    teamId: currentPlayItem.team.id
                                }
                            }

                            if (currentPlayItem.type.id == 516) {
                                PREV_NHL_DS5 = {
                                    id: 516,
                                    seq: currentPlayItem.sequenceNumber,
                                    clock: currentPlayItem.clock,
                                }
                            }
                        }

                        /* Duration */
                        let duration = 0;
                        if (prevEventItem) {
                            duration = getDuraton(prevEventItem.wallclock, currentPlayItem.wallclock);

                            if (duration === 0) duration = 1000;
                        }
                        if (startTime == -1 || i < selectedSeqIdx) duration = 0;

                        console.log(duration / 1000, 'duraion')
                        console.log(eventList.length, i, 'do while')

                        let teamIndex = selectedTeam1s[tableIndex]
                        team1Id = resList.boxscore.teams[teamIndex].team.id;                                     //team1 ID
                        team2Id = resList.boxscore.teams[(parseInt(teamIndex) + 1) % 2].team.id;                 //team2 ID
                        team1Name = resList.boxscore.teams[teamIndex].team.name;                                 //team1 Name
                        team2Name = resList.boxscore.teams[(parseInt(teamIndex) + 1) % 2].team.name;

                        /* Handle Go To Feature */
                        const handleGoTo = async () => {
                            for (let j = 0; j < dataSetType.length; j++) {
                                // console.log(j,'Datatype')
                                // var prevEventItem;

                                var dataTypeItem = dataSetType[j];
                                var matchTeamId = team1Id;

                                if (dataTypeItem.teamId) {
                                    matchTeamId = team2Id;
                                }

                                if (checkFunc(sportCategory, dataTypeItem, currentPlayItem, prevPlayItem, team1Id, team2Id, matchTeamId, PREV_NHL_DS2, PREV_NHL_DS5)) {
                                    continue;
                                } else {
                                    if (sportCategory === 'NHL') {
                                        /* 
                                            NHL-DS3 and NHL-DS3-1 Logic(more than 2 times)
                                        */
                                        if (dataTypeItem.rotation) {
                                            NHL_DS3_CNT = 0;
                                        }

                                        if (dataTypeItem.no === "NHL-DS3") {
                                            NHL_DS3_CNT++;
                                            if (NHL_DS3_CNT > 2) {
                                                continue;
                                            }
                                        }

                                        if (dataTypeItem.no === "NHL-DS3-1") {
                                            if (NHL_DS3_CNT <= 2) {
                                                continue;
                                            }
                                        }
                                    }

                                    if (sportCategory === 'NBA') {
                                        /* 
                                            NBA2_DS1 and NBA2_DS4 Logic(more than 2 times)
                                        */
                                        if (dataTypeItem.rotation) {
                                            NBA2_DS1_CNT = 0;
                                        }

                                        if (dataTypeItem.no === "NBA2-DS1") {
                                            NBA2_DS1_CNT++;
                                            if (NBA2_DS1_CNT > 2) {
                                                continue;
                                            }
                                        }

                                        if (dataTypeItem.no === "NBA2-DS4") {
                                            if (NBA2_DS1_CNT <= 2) {
                                                continue;
                                            }
                                        }
                                    }

                                    if (sportCategory === 'NHL2') {
                                        /* 
                                            NHL2_DS2 and NBA2_DS2-1 Logic(more than 2 times)
                                        */
                                        if (dataTypeItem.no === "NHL2_DS2") {
                                            NHL2_DS2_CNT++;
                                            if (NHL2_DS2_CNT > 2) {
                                                continue;
                                            }
                                        }

                                        if (dataTypeItem.no === "NHL2_DS2-1") {
                                            if (NHL2_DS2_CNT <= 2) {
                                                continue;
                                            }
                                        }
                                    }
                                }


                                /* Special DS */
                                result = handleScore(sportCategory, currentPlayItem, dataTypeItem, score, tableIndex, prevPlayItem, team1Name, team2Name, resList.boxscore);
                                hisList = prevHisList;

                                /* For Logos */
                                selectedTeamIdx = teamIndex;
                                if (team1Id != matchTeamId) {
                                    selectedTeamIdx = (parseInt(teamIndex) + 1) % 2;
                                }

                                /* If don't team check, set default team logo */
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
                                    // time: currentPlayItem.clock.displayValue
                                }

                                if (dataTypeItem.logo) {
                                    hisItem.teamIdx = teamIndex;
                                    if (dataTypeItem.logo == 2) hisItem.teamIdx = (parseInt(teamIndex) + 1) % 2;
                                }

                                if (dataTypeItem.logoReverse) {
                                    hisItem.teamIdx = changeTeamIdx(selectedTeamIdx);
                                }

                                if (sportCategory === 'MLB') {
                                    hisItem.time = currentPlayItem.period.displayValue.replace(new RegExp("\\b" + ' Inning' + "\\b", "gi"), '');
                                } else {
                                    if (sportCategory == 'NHL' || sportCategory == 'NHL2') {
                                        hisItem.time = reverseTime(currentPlayItem.clock.displayValue);
                                    } else {
                                        hisItem.time = currentPlayItem.clock.displayValue;
                                    }
                                }

                                if (sportCategory == 'NHL' || sportCategory == 'NHL2') {
                                    hisItem.time = reverseTime(currentPlayItem.clock.displayValue);
                                }

                                hisList[result.textIndex].push(hisItem);

                                increaseAmount = result.increaseMount;
                                textIndex = result.textIndex;
                                tableIndex = result.tableIndex;

                                if (currentPlayItem.team) {
                                    console.log(
                                        'DS_NO:', dataTypeItem.no,
                                        'Index:', i,
                                        'sequence:', currentPlayItem.sequenceNumber,
                                        'team1Id:', team1Id,
                                        'teamId:', currentPlayItem.team.id,
                                        'typeId:', currentPlayItem.type.id,
                                        // "scoreValue:", currentPlayItem.scoreValue,
                                        // 'scoringPlay', currentPlayItem.scoringPlay,
                                        'Wallclock:', currentPlayItem.wallclock,
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
                                        // 'Clock:', currentPlayItem.clock.displayValue,
                                        'WallClock', currentPlayItem.wallclock
                                    )
                                } else {
                                    console.log(
                                        'DS_NO:', dataTypeItem.no,
                                        'Index:', i,
                                        'sequence:', currentPlayItem.sequenceNumber,
                                        'team1Id:', team1Id,
                                        'teamId:', 'No team',
                                        'typeId:', currentPlayItem.type.id,
                                        // "scoreValue:", currentPlayItem.scoreValue,
                                        // 'scoringPlay', currentPlayItem.scoringPlay,
                                        'Wallclock:', currentPlayItem.wallclock,
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
                                        // 'Clock:', currentPlayItem.clock.displayValue,
                                        'WallClock', currentPlayItem.wallclock
                                    )
                                }

                                if (result) {
                                    // prevEventItem = currentPlayItem;
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
                                    prevHisList = hisList;
                                }
                            }

                            i++;
                            goToIndex = i;
                        }

                        if (duration > 0) {
                            timeOut = setTimeout(() => {
                                handleGoTo();
                                loop(); // Call loop function recursively after delay
                            }, duration);
                            return () => {
                                clearTimeout(timeOut)
                                timeOut = null;
                            }
                        } else {
                            handleGoTo();
                            clearTimeout(timeOut)
                            timeOut = null;
                            loop(); // Call loop function recursively after delay
                        }
                    } else {
                        /* get new DS in GoTo function */
                        if (startTime != -1) {
                            timeIntervalForLatest = setInterval(async () => {
                                // console.log(intervalTime, 'get new DS in GoTo function')
                                let dsList = await getLatestDS(i)

                                console.log(dsList.length, i, 'get Data from API')
                                if (dsList.length > i) {
                                    console.log('set goIndex')
                                    // setInitial();
                                    setEventList(dsList);
                                    setGoIndex(i);
                                    clearInterval(timeIntervalForLatest);
                                }

                            }, intervalTime * 1000);
                            return () => clearInterval(timeIntervalForLatest);
                        }
                    }
                }

                loop(); // Start the loop
            }
        }
    }

    const fetchEventPlay = () => {
        let resList;
        let dataSetType = DATASET_TYPE_CATEGORY[sportCategory];
        let apiUrl = URL[sportCategory];

        axios.get(apiUrl,
            {
                params: {
                    event: eventId
                }
            }
        ).then((response) => {
            setPlayList(response.data);
            // setInitial();

            resList = response.data;
            let result;
            let matchEvtList = [];
            let selectedTeamIdx = 0;
            let score = [0, 0, 0, 0], tableIndex = 0, textIndex = 0, increaseAmount;
            let team1Id, team2Id, team1Name, team2Name, team1Abbre, team2Abbre;

            let hisList = [];
            let prevHisList = [[], [], [], []];
            let timerList = [];
            let quarter = 1;

            let PREV_NHL_DS2 = { id: 502, seq: 0, teamId: 0 };
            let PREV_NHL_DS5 = { id: 516, seq: 0, teamId: 0 }

            let NBA2_DS1_CNT = 0;
            let NHL_DS3_CNT = 0;
            let NHL2_DS2_CNT = 0;

            if (resList.boxscore.teams[team1Idx]) {
                team1Id = resList.boxscore.teams[team1Idx].team.id;                                     //team1 ID
                team2Id = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.id;                 //team2 ID
                team1Name = resList.boxscore.teams[team1Idx].team.name;                                 //team1 Name
                team2Name = resList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.name;

                if (team1Name.includes('&')) {
                    team1Name = team1Name.replace('&', 'and');
                }

                if (team2Name.includes('&')) {
                    team2Name = team2Name.replace('&', 'and');
                }
            }

            if (sportCategory == 'SOCCER') {
                if (team1Idx != -1 && resList.commentary) {
                    let team1Score = 0, team2Score = 0;

                    for (let i = 0; i < resList.commentary.length; i++) {
                        // console.log(i, 'soccer item')
                        let teamIndex = selectedTeam1s[tableIndex]
                        team1Id = resList.boxscore.teams[teamIndex].team.id;                                     //team1 ID
                        team2Id = resList.boxscore.teams[(parseInt(teamIndex) + 1) % 2].team.id;                 //team2 ID
                        team1Name = resList.boxscore.teams[teamIndex].team.name;                                 //team1 Name
                        team2Name = resList.boxscore.teams[(parseInt(teamIndex) + 1) % 2].team.name;
                        team1Abbre = resList.boxscore.teams[teamIndex].team.abbreviation;                        //team1 abbreviation
                        team2Abbre = resList.boxscore.teams[(parseInt(teamIndex) + 1) % 2].team.abbreviation;

                        for (let j = 0; j < dataSetType.length; j++) {
                            var currentPlayItem = resList.commentary[i];
                            var prevPlayItem = resList.commentary[i - 1];
                            var prevEventItem;

                            var dataTypeItem = dataSetType[j];
                            var matchTeamId = team1Id;

                            if (checkSoccerFunc(dataTypeItem, currentPlayItem, prevPlayItem, team1Id, team2Id, team1Name, team2Name, team1Abbre, team2Abbre, matchTeamId)) {
                                continue;
                            }

                            /* Team Score in Soccer(SOCCER-DS9,SOCCER-DS10) */
                            if (dataTypeItem.no === 'SOCCER-DS9' || dataTypeItem.no === 'SOCCER-DS10') {
                                if (currentPlayItem.text === undefined) {
                                    continue;
                                } else {
                                    if (currentPlayItem.text.indexOf('Goal!') === -1 || currentPlayItem.text.indexOf('OVERTURNED') !== -1) {
                                        continue;
                                    } else {
                                        let team1NameIdx = currentPlayItem.text.indexOf(team1Name);
                                        let team2NameIdx = currentPlayItem.text.indexOf(team2Name);

                                        if (team1NameIdx == -1) team1NameIdx = currentPlayItem.text.indexOf(team1Name);
                                        if (team2NameIdx == -1) team2NameIdx = currentPlayItem.text.indexOf(team2Name);

                                        if (team1NameIdx !== -1 && team2NameIdx !== -1) {
                                            team1Score = parseInt(currentPlayItem.text.slice(team1NameIdx + team1Name.length + 1, team1NameIdx + team1Name.length + 3).trim());
                                            team2Score = parseInt(currentPlayItem.text.slice(team2NameIdx + team2Name.length + 1, team2NameIdx + team2Name.length + 3).trim());

                                            console.log(team1Score, team2Score, 'Soccer Score')
                                        }
                                    }
                                }
                            }

                            matchEvtList.push({
                                ...currentPlayItem,
                                prevPlayItem: prevPlayItem
                            });

                            result = handleSoccerScore(currentPlayItem, dataTypeItem, score, tableIndex, prevPlayItem, team1Name, team2Name);
                            hisList = prevHisList;

                            /* For Logos */
                            if (currentPlayItem.play) {
                                if (currentPlayItem.play.team === undefined) {
                                    selectedTeamIdx = -1
                                } else {
                                    if (currentPlayItem.play.team.displayName === team1Name) {
                                        selectedTeamIdx = teamIndex;
                                    } else {
                                        selectedTeamIdx = (parseInt(teamIndex) + 1) % 2;
                                    }
                                }
                            }

                            if (tableIndex != result.tableIndex) {
                                hisList[result.tableIndex] = [];
                            }

                            let historyItem = {
                                no: dataTypeItem.no,
                                seq: currentPlayItem.sequence,
                                teamIdx: selectedTeamIdx,
                                score: result.score[result.textIndex],
                                description: result.description,
                                increase: result.increaseMount,
                                time: currentPlayItem.time.displayValue
                            }

                            if (dataTypeItem.logo) {
                                historyItem.teamIdx = team1Idx;
                                if (dataTypeItem.logo == 2) historyItem.teamIdx = (parseInt(team1Idx) + 1) % 2;
                            }

                            hisList[result.textIndex].push(historyItem);
                            increaseAmount = result.increaseMount;
                            textIndex = result.textIndex;
                            tableIndex = result.tableIndex;
                            prevEventItem = currentPlayItem;

                            /* Add First DS in Quater to timerList */
                            if (quarter < 5) {
                                if (currentPlayItem.play) {
                                    if (currentPlayItem.play.period) {
                                        if (currentPlayItem.play.period.number == quarter) {
                                            timerList.push({
                                                label: quarter + "st (" + currentPlayItem.play.clock.displayValue + ")",
                                                value: matchEvtList.length - 1
                                            })
                                            quarter++;
                                        }
                                    }
                                }
                            }

                            console.log(
                                'DS_NO:', dataTypeItem.no,
                                'sequence:', currentPlayItem.sequence,
                                'team1Name:', team1Name,
                                // 'currentTeam:', currentPlayItem.play.team.displayName,
                                // 'typeId:', currentPlayItem.play.type.id,
                                'description:', result.description,
                                'increase:', dataTypeItem.Increase,
                                'rotation:', dataTypeItem.rotation,
                                'time value:', currentPlayItem.time.value,
                                'time displayValue:', currentPlayItem.time.displayValue,
                                // 'historyList:', hisList
                            )
                            // console.log(
                            //     'teamIndex0:', result.score[0],
                            //     'teamIndex1:', result.score[1],
                            //     'teamIndex2:', result.score[2],
                            //     'teamIndex3:', result.score[3]
                            // )
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
                        prevHisList = hisList;

                        setEventList(matchEvtList)

                        if (startTime == -1) {
                            setTimeList(timerList);
                        }
                    }

                    // console.log(team1Score, team2Score, 'team score')
                    if (team1Idx === 1) {
                        setHomeScore(team1Score);
                        setAwayScore(team2Score);
                    } else {
                        setHomeScore(team2Score);
                        setAwayScore(team1Score);
                    }
                }
            } else {
                // Collect DS in NFL and NCAAFB
                if (sportCategory == 'NFL' || sportCategory == 'NCAAFB') {
                    let playsList = Array.isArray(resList?.drives?.previous) ? resList.drives.previous : [];
                    for (let index = 0; index < playsList.length; index++) {
                        /* Add offensivePlays to NFL plays list */
                        let updatedList = playsList[index].plays.map(item => ({
                            ...item,
                            offensivePlays: playsList[index].offensivePlays
                        }))
                        resList.plays = mergeArrays(resList.plays, updatedList)
                    }
                    console.log(resList.plays, "plays List")
                }

                if (team1Idx != -1 && resList.plays) {
                    console.log('Loop', resList.plays.length)

                    for (let i = 0; i < resList.plays.length; i++) {
                        // console.log(i,'Events List')
                        let selectedDS = false;
                        let currentPlayItem = resList.plays[i];
                        let prevPlayItem = resList.plays[i - 1];

                        /* Special DS (NHL) */
                        if (sportCategory === 'NHL') {
                            if (currentPlayItem.type.id == 502) {
                                PREV_NHL_DS2 = {
                                    id: 502,
                                    seq: currentPlayItem.sequenceNumber,
                                    teamId: currentPlayItem.team.id,
                                    ...currentPlayItem
                                }
                            }

                            if (currentPlayItem.type.id == 516) {
                                PREV_NHL_DS5 = {
                                    id: 516,
                                    seq: currentPlayItem.sequenceNumber,
                                    clock: currentPlayItem.clock,
                                }
                            }
                        }

                        let teamIndex = selectedTeam1s[tableIndex]
                        team1Id = resList.boxscore.teams[teamIndex].team.id;                                     //team1 ID
                        team2Id = resList.boxscore.teams[(parseInt(teamIndex) + 1) % 2].team.id;                 //team2 ID
                        team1Name = resList.boxscore.teams[teamIndex].team.name;                                 //team1 Name
                        team2Name = resList.boxscore.teams[(parseInt(teamIndex) + 1) % 2].team.name;

                        for (let j = 0; j < dataSetType.length; j++) {
                            // console.log(j,'Datatype')
                            var dataTypeItem = dataSetType[j];
                            var matchTeamId = team1Id;

                            /* If selected Team2 in dataTypes, set matchTeamId as team2Id */
                            if (dataTypeItem.teamId) {
                                matchTeamId = team2Id;
                            }

                            if (checkFunc(sportCategory, dataTypeItem, currentPlayItem, prevPlayItem, team1Id, team2Id, matchTeamId, PREV_NHL_DS2, PREV_NHL_DS5)) {
                                continue;
                            } else {
                                if (sportCategory === 'NHL') {
                                    /* 
                                        NHL-DS3 and NHL-DS3-1 Logic(more than 2 times)
                                    */
                                    if (dataTypeItem.rotation) {
                                        NHL_DS3_CNT = 0;
                                    }

                                    if (dataTypeItem.no === "NHL-DS3") {
                                        NHL_DS3_CNT++;
                                        if (NHL_DS3_CNT > 2) {
                                            continue;
                                        }
                                    }

                                    if (dataTypeItem.no === "NHL-DS3-1") {
                                        if (NHL_DS3_CNT <= 2) {
                                            continue;
                                        }
                                    }
                                }

                                if (sportCategory === 'NBA') {
                                    /* 
                                        NBA2_DS1 and NBA2_DS4 Logic(more than 2 times)
                                    */
                                    if (dataTypeItem.rotation) {
                                        NBA2_DS1_CNT = 0;
                                    }

                                    if (dataTypeItem.no === "NBA2-DS1") {
                                        NBA2_DS1_CNT++;
                                        if (NBA2_DS1_CNT > 2) {
                                            continue;
                                        }
                                    }

                                    if (dataTypeItem.no === "NBA2-DS4") {
                                        if (NBA2_DS1_CNT <= 2) {
                                            continue;
                                        }
                                    }
                                }

                                if (sportCategory === 'NHL2') {
                                    /* 
                                        NHL2_DS2 and NBA2_DS2-1 Logic(more than 2 times)
                                    */
                                    // if (dataTypeItem.rotation) {
                                    //     NHL2_DS2_CNT = 0;
                                    // }

                                    if (dataTypeItem.no === "NHL2_DS2") {
                                        NHL2_DS2_CNT++;
                                        if (NHL2_DS2_CNT > 2) {
                                            continue;
                                        }
                                    }

                                    if (dataTypeItem.no === "NHL2_DS2-1") {
                                        if (NHL2_DS2_CNT <= 2) {
                                            continue;
                                        }
                                    }
                                }
                            }

                            if (!selectedDS) {
                                matchEvtList.push({
                                    ...currentPlayItem,
                                    prevPlayItem: prevPlayItem,
                                    PREV_NHL_DS2,
                                    PREV_NHL_DS5,
                                });
                            }

                            result = handleScore(sportCategory, currentPlayItem, dataTypeItem, score, tableIndex, prevPlayItem, team1Name, team2Name, resList.boxscore);
                            hisList = prevHisList;

                            /* For Logos */
                            selectedTeamIdx = teamIndex;
                            if (team1Id != matchTeamId) {
                                selectedTeamIdx = (parseInt(teamIndex) + 1) % 2;
                            }

                            /* If don't team check, set default team logo */
                            if (dataTypeItem.teamId === -1) {
                                selectedTeamIdx = -1
                            }

                            /* New table setting*/
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
                            }

                            /* set reverse teamIdx for logo */
                            if (dataTypeItem.logoReverse) {
                                hisItem.teamIdx = changeTeamIdx(selectedTeamIdx);
                            }

                            /* Set time in history about every sport */
                            if (sportCategory === 'MLB') {
                                hisItem.time = currentPlayItem.period.displayValue.replace(new RegExp("\\b" + ' Inning' + "\\b", "gi"), '');
                            } else {
                                if (sportCategory == 'NHL' || sportCategory == 'NHL2') {
                                    hisItem.time = reverseTime(currentPlayItem.clock.displayValue);
                                } else {
                                    hisItem.time = currentPlayItem.clock.displayValue;
                                }
                            }

                            // console.log(reverseTime(currentPlayItem.clock.displayValue), 'reverse time')

                            hisList[result.textIndex].push(hisItem);
                            increaseAmount = result.increaseMount;
                            textIndex = result.textIndex;
                            tableIndex = result.tableIndex;
                            selectedDS = true;

                            /* Add First DS in Quater to timerList */
                            if (currentPlayItem.period.number == quarter) {
                                let timeItem = {
                                    label: currentPlayItem.period.displayValue,
                                    value: matchEvtList.length - 1
                                }

                                if (sportCategory === "MLB") {
                                    timeItem.label = currentPlayItem.period.displayValue
                                } else {
                                    if (sportCategory == 'NHL' || sportCategory == 'NHL2') {
                                        timeItem.label = currentPlayItem.period.displayValue + ' ' + reverseTime(currentPlayItem.clock.displayValue);
                                    } else {
                                        timeItem.label = currentPlayItem.period.displayValue + ' ' + currentPlayItem.clock.displayValue
                                    }
                                }

                                timerList.push(timeItem)
                                quarter++;
                            }
                            // }

                            if (sportCategory === 'MLB') {
                                console.log(
                                    'DS_NO:', dataTypeItem.no,
                                    'Index:', i,
                                    'sequence:', currentPlayItem.sequenceNumber,
                                    'team1Id:', team1Id,
                                    'teamId:', 'No team',
                                    'typeId:', currentPlayItem.type.id,
                                    "scoreValue:", currentPlayItem.scoreValue,
                                    'scoringPlay', currentPlayItem.scoringPlay,
                                    'selectedTeamIdx:', selectedTeamIdx,
                                    "rotation:", dataTypeItem.rotation,
                                    'textIdx:', textIndex,
                                    'teamIndex:', tableIndex,
                                    'increase:', increaseAmount,
                                    'description:', result.description,
                                    'homeScore:', currentPlayItem.homeScore,
                                    'awayScore', currentPlayItem.awayScore,
                                    'WallClock', currentPlayItem.wallclock,
                                    'Period:', currentPlayItem.period.displayValue,
                                )
                            } else {
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
                                        'teamIndex:', tableIndex,
                                        'increase:', increaseAmount,
                                        'description:', result.description,
                                        'homeScore:', currentPlayItem.homeScore,
                                        'awayScore', currentPlayItem.awayScore,
                                        'Period:', currentPlayItem.period.displayValue,
                                        'Clock:', currentPlayItem.clock.displayValue,
                                        'WallClock', currentPlayItem.wallclock,
                                    )
                                } else {
                                    console.log(
                                        'DS_NO:', dataTypeItem.no,
                                        'no', i,
                                        'sequence:', currentPlayItem.sequenceNumber,
                                        'team1Id:', team1Id,
                                        'team2Id:', team2Id,
                                        'matchTeamId', matchTeamId,
                                        'typeId:', currentPlayItem.type.id,
                                        "scoreValue:", currentPlayItem.scoreValue,
                                        'scoringPlay', currentPlayItem.scoringPlay,
                                        'selectedTeamIdx:', selectedTeamIdx,
                                        "rotation:", dataTypeItem.rotation,
                                        'textIdx:', textIndex,
                                        'teamIndex:', tableIndex,
                                        'increase:', increaseAmount,
                                        'description:', result.description,
                                        'homeScore:', currentPlayItem.homeScore,
                                        'awayScore', currentPlayItem.awayScore,
                                        'Period:', currentPlayItem.period.displayValue,
                                        'Clock:', currentPlayItem.clock.displayValue,
                                        'WallClock', currentPlayItem.wallclock,
                                    )
                                }
                            }
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
                        prevHisList = hisList;
                        setEventList(matchEvtList);

                        setHomeScore(result.homeScore);
                        setAwayScore(result.awayScore);

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
        clearInterval(timeIntervalForLatest);
        timeIntervalForLatest = null;
        clearTimeout(timeOut);
        timeOut = null;
    }

    /* 
        direction 
            -1: Prev DS, 
            0:  No Direction, 
            1:  Next DS
    */
    const handleDS = (direction) => {
        goToIndex = goToIndex + direction;

        console.log(goToIndex, 'index in handle DS')
        if (goToIndex >= 0 && goToIndex <= eventList.length) {
            setInitial();
            setGoIndex(goToIndex);
        }

        if (goToIndex < 0) {
            goToIndex = 0;
        }

        if (goToIndex > eventList.length) {
            goToIndex = eventList.length;
        }
    }

    const handleTeamName = (value, index) => {
        switch (index) {
            case 1:
                setPlayer1Name(value)
                break;
            case 2:
                setPlayer2Name(value)
                break;
            case 3:
                setPlayer3Name(value)
                break;
            case 4:
                setPlayer4Name(value)
                break;
            default:
                break;
        }
    }

    const handlePlayerTeam1s = (evt, index) => {
        console.log(evt.target.value, index)
        var arrayValue = selectedTeam1s;
        arrayValue[index] = evt.target.value;

        setSelectedTeam1s(arrayValue);
        console.log(arrayValue)
    }

    return (
        <>
            {
                tabStatus && <>
                    <div className='row pt-3'>
                        <div className='col-md-12'>
                            <label className="form-label" style={{ float: "left" }}>Sports Category</label>
                            <select className="form-select form-select-sm"
                                value={sportCategory}
                                onChange={evt => {
                                    setSportCategory(evt.target.value);
                                    setInitial();
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
                        <div className='col-md-12 mb-5'>
                            <Filter
                                label='Today Event'
                                columns={{ label: "name", value: "id" }}
                                list={events ? events : []}
                                value={eventId}
                                // disabled={sportCategory !== 'NBA'}
                                handleChange={(id) => {
                                    setEventId(id);
                                    setInitial();
                                }}
                            />
                        </div>
                        <div className='col-md-12 mt-3'>
                            <label className="form-label" style={{ float: "left" }}>Team Your Cheering For</label>
                            <select className="form-select form-select-sm"
                                value={team1Idx}
                                onChange={evt => {
                                    var team1 = evt.target.value;
                                    setTeam1Idx(team1)
                                    setTeam2Name(team1 != -1 && playList.boxscore.teams[(parseInt(team1) + 1) % 2].team.name)
                                    setSelectedTeam1s([team1, team1, team1, team1])
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
                        <div className='row text-center my-3'>
                            <h4>Who Is Playing</h4>
                            <div className='col-6 my-2'>
                                <input
                                    className='w-100'
                                    value={player1Name}
                                    onChange={(evt) => handleTeamName(evt.target.value, 1)}
                                />
                            </div>
                            <div className='col-6 my-2'>
                                {/* <label className="form-label" style={{ float: "left" }}>Team Your Cheering For</label> */}
                                <select className="form-select form-select-sm"
                                    value={selectedTeam1s[0]}
                                    onChange={evt => handlePlayerTeam1s(evt, 0)}
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
                            <div className='col-6 my-2'>
                                <input
                                    className='w-100'
                                    value={player2Name}
                                    onChange={(evt) => handleTeamName(evt.target.value, 2)}
                                />
                            </div>
                            <div className='col-6 my-2'>
                                {/* <label className="form-label" style={{ float: "left" }}>Team Your Cheering For</label> */}
                                <select className="form-select form-select-sm"
                                    value={selectedTeam1s[1]}
                                    onChange={evt => handlePlayerTeam1s(evt, 1)}
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
                            <div className='col-6 my-2'>
                                <input
                                    className='w-100'
                                    value={player3Name}
                                    onChange={(evt) => handleTeamName(evt.target.value, 3)}
                                />
                            </div>
                            <div className='col-6 my-2'>
                                {/* <label className="form-label" style={{ float: "left" }}>Team Your Cheering For</label> */}
                                <select className="form-select form-select-sm"
                                    value={selectedTeam1s[2]}
                                    onChange={evt => handlePlayerTeam1s(evt, 2)}
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
                            <div className='col-6 my-2'>
                                <input
                                    className='w-100'
                                    value={player4Name}
                                    onChange={(evt) => handleTeamName(evt.target.value, 4)}
                                />
                            </div>
                            <div className='col-6 my-2'>
                                {/* <label className="form-label" style={{ float: "left" }}>Team Your Cheering For</label> */}
                                <select className="form-select form-select-sm"
                                    value={selectedTeam1s[3]}
                                    onChange={evt => handlePlayerTeam1s(evt, 3)}
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
                        </div>
                        <div className='text-center mt-3 mb-2'>
                            <button className='btn btn-primary' onClick={handleTab}>Go To Game</button>
                            <div>
                                <label className="form-label" style={{ float: "left" }}>Time</label>
                                <select className="form-select form-select-sm"
                                    value={startTime}
                                    onChange={evt => {
                                        setInitial();
                                        setStartTime(evt.target.value);
                                    }}
                                >
                                    <option value={-1}>Choose One</option>
                                    {
                                        timeList.map((item, index) => {
                                            return (
                                                <option key={index} value={item.value}>{item.label}</option>
                                            )
                                        })
                                    }
                                </select>
                            </div>
                        </div>
                        <div className='col-md-12'>
                            <label className="form-label">Random GameId</label><br />
                            <div className="input-group">
                                <input type="text" className="form-control form-control-sm" placeholder="Game Id"
                                    value={gameId}
                                    onChange={(evt) => {
                                        setGameId(evt.target.value)
                                        setInitial()
                                    }}
                                />
                                <button className="btn btn-success btn-sm" onClick={handleEvent}>Ok</button>
                            </div>
                        </div>
                        <div className='col-md-12'>
                            <Filter
                                label='Interval Rate'
                                columns={{ label: "label", value: "value" }}
                                value={intervalTime}
                                list={INTERVAL_TIME}
                                handleChange={(time) => { setIntervalTime(time) }}
                            />
                        </div>
                    </div>
                </>
            }
            {
                !tabStatus && <>
                    <div className='row'>
                        <div className='text-center mt-3'>
                            <button className='btn btn-primary text-uppercase' onClick={handleTab}>Dashboard</button>
                        </div>

                        <div className='col-6 text-center'>
                            <label className="form-label" style={{ float: "left" }}>Time</label>
                            <select className="form-select form-select-sm"
                                value={startTime}
                                onChange={evt => {
                                    setInitial();
                                    setStartTime(evt.target.value);
                                }}
                            >
                                <option value={-1}>Choose One</option>
                                {
                                    timeList.map((item, index) => {
                                        return (
                                            <option key={index} value={item.value}>{item.label}</option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className='col-6 mt-4 pt-2 text-center'>
                            <button className='btn btn-primary btn-sm' onClick={() => { setStartTime(-1) }}>Go To Real Time</button>
                        </div>
                    </div>
                    <div className='row py-2'>
                        <div className='col-md-2 col-lg-12'>
                            {
                                eventId != -1 && team1Idx != -1 &&
                                <>
                                    <div className='d-inline-block'>
                                        <img src={team1Idx != -1 ? playList.boxscore.teams[team1Idx].team.logo : undefined} style={{ width: 40, height: 40 }} />
                                        <p className='px-2 d-inline-block'><b>{(team1Idx != -1 && team1Idx == 0) ? awayScore : homeScore}</b></p>
                                    </div>
                                    <div className='d-inline-block'>
                                        <img src={team1Idx != -1 ? playList.boxscore.teams[(parseInt(team1Idx) + 1) % 2].team.logo : undefined} style={{ width: 40, height: 40 }} />
                                        <p className='px-2 d-inline-block'><b>{(team1Idx != -1 && team1Idx == 0) ? homeScore : awayScore}</b></p>
                                    </div>
                                    <div className='d-inline-block'>
                                        <p className='d-inline-block px-5'>{time}</p>
                                    </div>
                                </>
                            }
                        </div>
                    </div>
                    <div className='row pb-2'>
                        <div className='col-6 mt-2 pt-2 text-center'>
                            <button className='btn btn-primary btn-sm' onClick={() => handleDS(-1)} disabled={goIndex <= 0}>Previous</button>
                        </div>
                        <div className='col-6 mt-2 pt-2 text-center'>
                            <button className='btn btn-primary btn-sm' onClick={() => handleDS(1)}>Next</button>
                        </div>
                    </div>
                </>
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
                sportCategory={sportCategory}

                player1Name={player1Name}
                player2Name={player2Name}
                player3Name={player3Name}
                player4Name={player4Name}

                selectedTeam1s={selectedTeam1s}
                handlePlayName={handleTeamName}
                handlePlayerTeam1s={handlePlayerTeam1s}
            />
        </>
    );
}

export default EventComponent;


