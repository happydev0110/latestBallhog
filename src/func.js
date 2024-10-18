export const isValidDate = (dateString) => {
    const dateObject = new Date(dateString);
    return !isNaN(dateObject) && dateString.trim() !== '';
}

export const isEmptyValue = () => {

}

export const changeTeamIdx = (index) => {
    let idx = index;
    idx = (index + 1) % 2;

    return idx;
}

export const getDuraton = (start, end) => {
    return new Date(end) - new Date(start)
}

export const delayTimer = (duration) => {
    const timer = new Promise(resolve => setTimeout(resolve, duration));
    // clearTimeout(timer);
}

export const formatDate = (date) => {
    var year, month, day = '';
    // if (isValidDate(date)) {
    //     return 'Valid Date.'
    // } else {
    year = date.getFullYear();
    month = date.getMonth() + 1;
    day = date.getDate();

    if (month < 10) {
        // console.log(year.toString() + '0' + month.toString() + day.toString(), 'date format')
        return (year.toString() + '0' + month.toString() + day.toString());
    } else {
        // console.log(year.toString() + month.toString() + day.toString(), 'date format')
        return (year.toString() + month.toString() + day.toString())
    }
    // }
}

export const findSeqIndex = (list, seq) => {
    return list.findIndex(obj => obj.sequenceNumber === seq);
}

export const findSoccerSeqIndex = (list, seq) => {
    return list.findIndex(obj => obj.sequence == seq);
}

export const reverseTime = (time, limitMinutes = 20) => {
    let minutes = parseInt(time.split(':')[0]);
    let seconds = parseInt(time.split(':')[1]);
    let result = [0, 0]
    if (seconds > 0) {
        result[0] = limitMinutes - minutes - 1;
        result[1] = 60 - seconds;

        if (result[1] < 10) {
            result[1] = '0' + result[1];
        }
    } else {
        result[0] = limitMinutes - minutes;
        result[1] = '00';
    }

    return result.join(':')
}

export const mergeArrays = (...arrays) => {
    return arrays
        .filter(Array.isArray) // Only keep elements that are arrays
        .flat(); // Merge the arrays into one
}

export const getAthleteName = (data, id = -1) => {
    let playList = mergeArrays(data.players[0].statistics[0].athletes, data.players[1].statistics[0].athletes)
    let athlete = '';

    if (id != -1) {
        athlete = playList.find(item => { return item.athlete.id == id });
    }
    return athlete.athlete.displayName
}

export function findBetweenTwoStrings(text, startString, endString, second = false, secondEnd) {
    const startIndex = text.indexOf(startString);
    const endIndex = text.indexOf(endString, startIndex + startString.length);

    if (startIndex === -1 || endIndex === -1) {
        return "Not found";
    }

    const start = startIndex + startString.length;
    let end = endIndex;
    if (second) {
        end = text.indexOf(secondEnd, endIndex + startString.length);
    }

    return text.substring(start, end).trim();
}

export function findNameFromText(text, second = false, secondEnd) {
    let startIndex = text.indexOf('(');
    let endIndex = text.indexOf(' ');
    let end = endIndex;
    if (startIndex != -1 && startIndex < 3) {
        if (second) {
            return findBetweenTwoStrings(text, ") ", " ", true, secondEnd);
        } else {
            return findBetweenTwoStrings(text, ") ", " ");
        }
    } else {
        if (second) {
            end = text.indexOf(secondEnd, endIndex + 1)
        }

        return text.substring(0, end);
    }
}

export const findNameToEnd = (text, startText = 'at ') => {
    let startIndex = text.indexOf(startText);
    let endIndex = text.length;
    return text.substring(startIndex, endIndex);
}

export const handleScore = (sportCategory, playItem, dataTypeItem, score, tableIndex, prevPlayItem, team1Name, team2Name, boxScore) => {

    let description, sequenceTime, homeScore, awayScore, textIndex = tableIndex;
    let increaseMount = dataTypeItem.Increase;

    if (dataTypeItem.Increase == -1) {
        increaseMount = prevPlayItem.scoreValue
    }

    if (dataTypeItem.Increase) {
        score[tableIndex] = score[tableIndex] + increaseMount;
    } else {
        increaseMount = 0;
    }

    if (dataTypeItem.rotation) {
        tableIndex = tableIndex + 1;
        tableIndex = tableIndex % 4;
    } else {

    }

    description = playItem.text;

    switch (dataTypeItem.no) {
        case 'NBA-DS1':
            description = 'Three!!! '
            break;
        case 'NCAA-DS1':
            description = 'Three Point Basket!'
            break;
        // case 'NCAA-DS2':
        //     description = 'Foul. Rotate Turns'
        //     break;
        // case 'NCAA-DS3':
        //     description = 'Foul. Rotate Turns'
        //     break;
        // case 'NCAA-DS3-2':
        //     description = 'Foul. Rotate Turns'
        //     break;
        case 'NCAA-DS4':
            description = 'Dunk!!!'
            break;
        case 'NCAA-DS5':
            description = 'Turnover'
            break;
        case 'NCAA-DS6':
            description = 'Made Free Throw'
            break;
        case 'NCAA-DS7':
            description = 'Missed Free Throw'
            break;
        case 'NCAA-DS8':
            description = 'Missed Free Throw'
            break;
        case 'NCAA-DS9':
            description = 'And 1 Basket!'
            break;
        case 'NCAA-DS10-2':
            description = 'Three Point Miss'
            break;
        case 'NCAA-DS11':
            description = 'Made Free Throw'
            break;
        case 'NCAA-DS12':
            description = 'And 1 Basket!'
            break;
        case 'NCAA-DS15':
            description = 'Dunk!! End Turn'
            break;

        // NHL
        case 'NHL-DS1':
            description = playItem.participants
            [0].athlete.shortName + ' wins faceoff'
            break;
        case 'NHL-DS2':
            description = playItem.text + ' Ends Turn'
            break;
        case 'NHL-DS2-1':
            description = playItem.text + ' Under 30 Seconds'
            break;
        case 'NHL-DS3':
            if (playItem.participants) {
                description = 'Shot by ' + playItem.participants[0].athlete.shortName
            } else {
                description = 'Shot by '
            }
            break;
        case 'NHL-DS3-1':
            if (playItem.participants) {
                description = 'Shot by ' + playItem.participants[0].athlete.shortName
            } else {
                description = 'Shot by '
            }
            break;
        case 'NHL-DS3-2':
            if (playItem.participants) {
                description = 'Shot by ' + playItem.participants[0].athlete.shortName
            } else {
                description = 'Shot by '
            }
            break;
        case 'NHL-DS5':
            if (playItem.participants) {
                description = 'Penalty. ' + playItem.participants[0].athlete.shortName
            } else {
                description = 'Penalty. '
            }
            break;
        case 'NHL-DS6':
            if (playItem.participants) {
                description = 'Penalty. ' + playItem.participants[0].athlete.shortName
            } else {
                description = 'Penalty. '
            }
            break;
        case 'NHL-DS7':
            if (playItem.participants) {
                description = playItem.participants[0].athlete.displayName + ' Goal'
            } else {
                description = 'Goal!!!'
            }
            break;
        case 'NHL-DS8':
            if (playItem.participants) {
                description = playItem.participants[0].athlete.displayName + ' Goal'
            } else {
                description = 'Goal!!!'
            }
            break;
        case 'NHL-DS10':
            if (playItem.participants) {
                description = playItem.participants[0].athlete.shortName + ' wins faceoff'
            } else {
                description = 'wins faceoff'
            }
            break;
        case 'NHL-DS11':
            if (playItem.participants) {
                description = 'Hit. ' + playItem.participants[0].athlete.displayName
            } else {
                description = 'Hit. '
            }
            break;
        // NHL-DS16
        case 'NHL-DS16':
            if (playItem.participants) {
                description = 'Blocked shot by ' + playItem.participants[1].athlete.displayName
            } else {
                description = 'Blocked shot by '
            }
            break;
        case 'NHL-DS17':
            if (playItem.participants) {
                description = 'Penalty. ' + playItem.participants[0].athlete.shortName
            } else {
                description = 'Penalty. '
            }
            break;
        case 'NHL-DS17-1':
            if (playItem.participants) {
                description = 'Penalty. ' + playItem.participants[0].athlete.shortName
            } else {
                description = 'Penalty. '
            }
            break;
        case 'NHL-DS17-2':
            description = 'Stoppage. Penalties on both teams.'
            break;
        case 'NHL-DS17-3':
            description = 'Stoppage. Penalties on both teams'
            break;

        // NHL2 
        case 'NHL2-DS1':
            if (playItem.participants) {
                description = playItem.participants[0].athlete.shortName + ' wins faceoff'
            } else {
                description = 'wins faceoff'
            }
            break;
        case 'NHL2-DS1-2':
            if (playItem.participants) {
                description = playItem.participants[0].athlete.shortName + ' wins faceoff'
            } else {
                description = 'wins faceoff'
            }
            break;
        case 'NHL2-DS2':
            description = 'Stoppage. Faceoff'
            break;
        case 'NHL2-DS2-2':
            description = 'Lost Faceoff. Rotate'
            break;
        case 'NHL2-DS2-3':
            description = 'End of Period'
            break;
        case 'NHL2-DS2-4':
            description = 'Lost Faceoff. Rotate'
            break;
        case 'NHL2-DS3':
            if (playItem.participants) {
                description = 'Shot!! ' + playItem.participants[0].athlete.shortName
            } else {
                description = 'Shot!!'
            }
            break;
        case 'NHL2-DS5':
            if (playItem.participants) {
                description = playItem.type.text + " " + playItem.participants[0].athlete.shortName
            } else {
                description = playItem.type.text
            }
            break;
        case 'NHL2-DS7':
            if (playItem.participants) {
                description = "Goal!!! " + playItem.participants[0].athlete.shortName
            } else {
                description = "Goal!!!"
            }
            break;
        case 'NHL2-DS8':
            if (playItem.participants) {
                description = "Goal!!! " + playItem.participants[0].athlete.shortName
            } else {
                description = "Goal!!!"
            }
            break;
        case 'NHL2-DS9':
            description = "End of Period"
            break;
        case 'NHL2-DS11':
            description = "Game Over. Thanks For Playing"
            break;

        // NBA2
        case 'NBA2-DS1':
            description = '3pt Make. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS1-2':
            description = '3pt Miss. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS1-3':
            description = '3pt Miss. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS4':
            description = '3pt Make. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;

        case 'NBA2-DS7':
            description = playItem.type.text
            break;
        case 'NBA2-DS7-2':
            description = playItem.type.text
            break;
        case 'NBA2-DS8':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS9':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS10':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS11':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS12':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS13':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS14':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS15':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS16':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS17':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS18':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS19':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS19-2':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS26':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS27':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS28':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS29':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS30':
            description = 'And 1 Basket!!!'
            break;
        case 'NBA2-DS30-2':
            description = 'And 1 Foul!'
            break;
        case 'NBA2-DS30-3':
            description = 'And 1 Basket!'
            break;
        case 'NBA2-DS31':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS33':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS34':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS45':
            description = 'Offensive Foul'
            break;
        case 'NBA2-DS51':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS52':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS53':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS54':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS55':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS56':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS57':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS58':
            description = 'Missed FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS61':
            description = playItem.text
            break;
        case 'NBA2-DS62':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS63':
            description = playItem.text
            break;
        case 'NBA2-DS65':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS66':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS67':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS68':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS70':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS71':
            description = 'Made FT. ' + getAthleteName(boxScore, playItem.participants[0].athlete.id)
            break;
        case 'NBA2-DS73-1':
            description = 'Start of game'
            break;
        case 'NBA2-DS73-2':
            description = 'Jumpball'
            break;
        case 'MLB-DS1':
            description = playItem.type.alternativeText + ", " + getAthleteName(boxScore, playItem.participants[1].athlete.id)
            break;
        case 'MLB-DS1-2':
            description = playItem.type.alternativeText + ", " + getAthleteName(boxScore, playItem.participants[1].athlete.id)
            break;
        case 'MLB-DS33':
            description = 'Caught stealing'
            break;

        // NFL DS Description
        case 'NFL-DS1':
            description = 'Kickoff';
            break;
        case 'NFL-DS1-1':
            description = 'Fumble Recovery';
            break;
        case 'NFL-DS1-2':
            description = 'Kickoff Fumble Recovery';
            break;
        case 'NFL-DS1-3':
            description = 'Kickoff';
            break;
        case 'NFL-DS1-4':
            description = 'Kickoff Return TD!';
            break;
        case 'NFL-DS1-5':
            description = 'Kickoff Return TD!';
            break;
        case 'NFL-DS1-6':
            description = 'Kickoff Return TD!';
            break;
        case 'NFL-DS1-7':
            description = 'Kickoff Return Bonus!';
            break;
        case 'NFL-DS1-8':
            description = 'Special Teams Touchdown!';
            break;
        case 'NFL-DS1-9':
            description = 'Special Teams Touchdown! XP No Good';
            break;
        case 'NFL-DS1-9-9':
            description = 'Touchdown';
            break;
        case 'NFL-DS2-1':
            description = 'First Down Pass! ' + findBetweenTwoStrings(playItem.text, " to ", " "); //add name from DS text
            break;
        case 'NFL-DS2-2':
            description = 'First Down Run! ' + findNameFromText(playItem.text); //add name from DS text
            break;
        case 'NFL-DS3-1':
            description = 'First Down Pass + Bonus! ' + findBetweenTwoStrings(playItem.text, " to ", " "); //add name from DS text
            break;
        case 'NFL-DS3-2-2':
            description = 'First Down Run!'; //add name from DS text
            break;
        case 'NFL-DS3-1':
            description = 'First Down Yardage Bonus! ' + findBetweenTwoStrings(playItem.text, " to ", " "); //add name from DS text
            break;
        case 'NFL-DS3-2':
            description = 'First Down Run + Bonus! ' + findNameFromText(playItem.text); //add name from DS text
            break;
        case 'NFL-DS3-2-2':
            description = 'First Down Run!'; //add name from DS text
            break;
        case 'NFL-DS3-2-4':
            description = 'First Down Run!'; //add name from DS text
            break;
        case 'NFL-DS3-6-6':
            description = '1st Down Pass! + Yardage Bonus. ' + findBetweenTwoStrings(playItem.text, " to ", " ");
            break;
        case 'NFL-DS3-6-7':
            description = '1st Down Pass! ' + findBetweenTwoStrings(playItem.text, " to ", " ");
            break;
        case 'NFL-DS3-6-8':
            description = '1st Down Pass! + Yardage Bonus. ' + findNameFromText(playItem.text);
            break;
        case 'NFL-DS3-6-9':
            description = '1st Down Run! ' + findNameFromText(playItem.text);
            break;
        case 'NFL-DS4':
            description = '25 yard play bonus';
            break;
        case 'NFL-DS4-1':
            description = '25 yard play bonus';
            break;
        case 'NFL-DS5':
            description = 'Timeout';
            break;
        case 'NFL-DS6-1':
            description = 'Touchdown! ' + findNameFromText(playItem.text); //add name from DS text
            break;
        case 'NFL-DS6-2':
            description = 'Touchdown! ' + findNameFromText(playItem.text) + ".XP No Good."; //add name from DS text
            break;
        case 'NFL-DS7-1':
            description = 'Touchdown! ' + findBetweenTwoStrings(playItem.text, " to ", " "); //add name from DS text
            break;
        case 'NFL-DS7-2':
            description = 'Touchdown! Extra Point No Good'; //add name from DS text
            break;
        case 'NFL-DS8':
            description = '50 yard + Field Goal!';
            break;
        case 'NFL-DS8-1':
            description = 'Short Field Goal!';
            break;
        case 'NFL-DS10':
            description = 'Punt. Down ' + findNameToEnd(playItem.end.downDistanceText);
            break;
        case 'NFL-DS10-1':
            description = 'Special Teams TouchDown!';
            break;
        case 'NFL-DS10-1-1':
            description = 'Touchback';
            break;
        case 'NFL-DS10-2':
            description = 'Special Teams TouchDown!';
            break;
        case 'NFL-DS10-6':
            description = 'Special Teams Forces Turnover!';
            break;
        case 'NFL-DS11':
            description = 'Punt Bonus! Down ' + findNameToEnd(playItem.end.downDistanceText);
            break;
        case 'NFL-DS11-1':
            description = 'Punt Bonus! Down ' + findNameToEnd(playItem.end.downDistanceText);
            break;
        case 'NFL-DS12':
            description = 'Turn Over';
            break;
        case 'NFL-DS12-1':
            description = 'Touchdown';
            break;
        case 'NFL-DS12-2':
            description = 'Defense Forces Turnover!';
            break;
        case 'NFL-DS12-3':
            description = 'Turnover';
            break;
        case 'NFL-DS13':
            description = 'Sack by ' + findBetweenTwoStrings(playItem.text, " (", ")");
            break;
        case 'NFL-DS13-1':
            description = 'Strip Sack! ' + findBetweenTwoStrings(playItem.text, " (", ")");
            break;
        case 'NFL-DS13-1-1':
            description = 'Tackle For Loss!';
            break;
        case 'NFL-DS13-2':
            description = 'Tackle For Loss!';
            break;
        case 'NFL-DS13-3':
            description = 'Tackle For Loss!';
            break;
        case 'NFL-DS14':
            description = 'Punt. Down ' + findNameToEnd(playItem.end.downDistanceText);
            break;
        case 'NFL-DS14-1':
            description = 'Three and Out Punt Bonus!';
            break;
        case 'NFL-DS14-1-1':
            description = 'Punt. Touchback';
            break;
        case 'NFL-DS14-2':
            description = 'Punt Return Bonus!';
            break;
        case 'NFL-DS15':
            description = 'Defense forces turn over';
            break;
        case 'NFL-DS16':
            description = 'Defensive TouchDown! XP Good.';
            break;
        case 'NFL-DS16-1':
            description = 'Defensive Touchdown!';
            break;
        case 'NFL-DS17-1':
            description = 'Defensive TD!';
            break;
        case 'NFL-DS18':
            description = 'Field Goal Missed';
            break;
        case 'NFL-DS19-1':
            description = 'Def Holds to Short FG!';
            break;
        case 'NFL-DS20':
            description = 'Touchdown';
            break;
        case 'NFL-DS21-1':
            description = 'First Down ' + findNameFromText(playItem.text);
            break;
        case 'NFL-DS21-1-1':
            description = '1st Down Run. ' + findNameFromText(playItem.text);
            break;
        case 'NFL-DS21-2':
            description = 'First Down. ' + findBetweenTwoStrings(playItem.text, " to ", " ");
            break;
        case 'NFL-DS21-2-2':
            description = '1st Down Pass. ' + findBetweenTwoStrings(playItem.text, " to ", " ");
            break;
        case 'NFL-DS21-3':
            description = 'First Down!';
            break;
        case 'NFL-DS21-4':
            description = 'First Down, Defensive Penalty!';
            break;
        case 'NFL-DS21-5':
            description = 'First Down, Def Penalty!';
            break;
        case 'NFL-DS21-6':
            description = 'First Down, Def Penalty!';
            break;
        // findNameFromText
        case 'NFL-DS22':
            description = 'Field Goal Missed';
            break;
        case 'NFL-DS24-1-1':
            description = 'Turn Over on Downs!';
            break;
        case 'NFL-DS24-1-2':
            description = 'Turn on Downs!';
            break;
        case 'NFL-DS24-1-1-1':
            description = 'Turn Over on Downs!';
            break;
        case 'NFL-DS24-1':
            description = 'Turn Over on Downs!';
            break;
        case 'NFL-DS24-2':
            description = 'Defensive Touchdown!';
            break;
        case 'NFL-DS25':
            description = 'Safety';
            break;
        case 'NFL-DS26':
            description = 'Safety';
            break;
        case 'NFL-DS27':
            description = 'Strip Sack Turnover';
            break;
        case 'NFL-DS29':
            description = 'Game Over';
            break;
        case 'NFL-DS32':
            description = '1st Down Densive Penalty!';
            break;
        case 'NFL-DS32-1':
            description = '1st Down Defensive Penalty!';
            break;
        case 'NFL-DS33':
            description = '1st Down Pass + Yardage Bonus! ' + findBetweenTwoStrings(playItem.text, " to ", " ");
            break;
        case 'NFL-DS33-1':
            description = '1st Down Pass! ' + findBetweenTwoStrings(playItem.text, " to ", " ");
            break;
        case 'NFL-DS34':
            description = '1st Down Run + Yardage Bonus! ' + findNameFromText(playItem.text);
            break;
        case 'NFL-DS34-1':
            description = '1st Down Run! ' + findNameFromText(playItem.text);
            break;
        case 'NFL-DS40':
            description = '1st Down Densive Penalty!';
            break;
        case 'NFL-DS40-1':
            description = '1st Down Defensive Penalty!';
            break;

        // NCAAFB
        case 'NCAAFB-DS1':
            description = 'Kickoff';
            break;
        case 'NCAAFB-DS1-1':
            description = 'Fumble Recovery';
            break;
        case 'NCAAFB-DS1-2':
            description = 'Fumble Recovery';
            break;
        case 'NCAAFB-DS1-3':
            description = 'Kickoff';
            break;
        case 'NCAAFB-DS1-4':
            description = 'Kickoff Return TD!';
            break;
        case 'NCAAFB-DS1-5':
            description = 'Kickoff Return TD!';
            break;
        case 'NCAAFB-DS1-6':
            description = 'Kickoff Return TD!';
            break;
        case 'NCAAFB-DS1-7':
            description = 'Kickoff Return Bonus!';
            break;
        case 'NCAAFB-DS1-8':
            description = 'Special Teams Touchdown!';
            break;
        case 'NCAAFB-DS1-9':
            description = 'Special Teams Touchdown! XP No Good';
            break;
        case 'NCAAFB-DS2':
            description = 'First Down. ' + playItem.text;
            break;
        case 'NCAAFB-DS2-1':
            description = 'First Down! ' + findBetweenTwoStrings(playItem.text, " to ", " "); //add name from DS text
            break;
        case 'NCAAFB-DS2-1-1':
            description = '1st Down Pass! ' + findBetweenTwoStrings(playItem.text, " to ", " ", true, " "); //add name from DS text
            break;
        case 'NCAAFB-DS2-2':
            description = 'First Down! ' + findNameFromText(playItem.text); //add name from DS text
            break;
        case 'NCAAFB-DS2-2-2':
            description = '1st Down Run! ' + findNameFromText(playItem.text, true, " "); //add name from DS text
            break;
        case 'NCAAFB-DS2-3-2003':
            description = '1st Down! Def Penalty'; //add name from DS text
            break;
        case 'NCAAFB-DS3':
            description = 'First on First. ' + playItem.text;
            break;
        case 'NCAAFB-DS3-1':
            description = '1st Down on 1st Down! ' + findBetweenTwoStrings(playItem.text, " to ", " "); //add name from DS text
            break;
        case 'NCAAFB-DS3-1-1':
            description = '1st Down Pass Bonus! ' + findBetweenTwoStrings(playItem.text, " to ", " ", true, " "); //add name from DS text
            break;
        case 'NCAAFB-DS3-2':
            description = '1st Down on 1st Down! ' + findNameFromText(playItem.text); //add name from DS text
            break;
        case 'NCAAFB-DS3-2-2':
            description = '1st Down Run Bonus! ' + findNameFromText(playItem.text, true, " "); //add name from DS text
            break;
        case 'NCAAFB-DS3-3-3':
            description = '1st Down! Defensive Penalty'; //add name from DS text
            break;
        case 'NCAAFB-DS3-4':
            description = '1st Down Yardage Bonus! Defensive Penalty';
            break;
        case 'NCAAFB-DS4':
            description = '25 yard play bonus';
            break;
        case 'NCAAFB-DS4-1':
            description = '25 yard play bonus';
            break;
        case 'NCAAFB-DS6':
            description = 'Touchdown!' + findNameFromText(playItem.text, true, " ");
            break;
        case 'NCAAFB-DS6-1':
            description = 'Touchdown! ' + findNameFromText(playItem.text, true, " "); //add name from DS text
            break;
        case 'NCAAFB-DS6-2':
            description = 'Touchdown! Extra Point No Good.'; //add name from DS text
            break;
        case 'NCAAFB-DS7':
            description = 'Touchdown! ' + findNameFromText(playItem.text); //add name from DS text
            break;
        case 'NCAAFB-DS7-1':
            description = 'Touchdown! ' + findBetweenTwoStrings(playItem.text, " to ", " ", true, " "); //add name from DS text
            break;
        case 'NCAAFB-DS7-2':
            description = 'Touchdown! Extra Point No Good.'; //add name from DS text
            break;
        case 'NCAAFB-DS8':
            description = '45+ Yard Field Goal!'; //add name from DS text
            break;
        case 'NCAAFB-DS10':
            description = 'Punt. Down ' + findNameToEnd(playItem.end.downDistanceText);
            break;
        case 'NCAAFB-DS10-1':
            description = 'Special Teams TouchDown!';
            break;
        case 'NCAAFB-DS10-2':
            description = 'Special Teams TouchDown! XP Fail.';
            break;
        case 'NCAAFB-DS10-4':
            description = 'Special Teams TouchDown! XP Fail.';
            break;
        case 'NCAAFB-DS10-5':
            description = 'Punt Return Fumble';
            break;
        case 'NCAAFB-DS10-7':
            description = 'Punt Return Bonus!';
            break;
        case 'NCAAFB-DS11':
            description = 'Punt Bonus! Down ' + findNameToEnd(playItem.end.downDistanceText);
            break;
        case 'NCAAFB-DS11-1':
            description = 'Punt Bonus! Down ' + findNameToEnd(playItem.end.downDistanceText);
            break;
        case 'NCAAFB-DS12':
            description = 'Turn Over';
            break;
        case 'NCAAFB-DS12-1':
            description = 'Touchdown';
            break;
        case 'NCAAFB-DS13':
            description = 'Sacked by ' + findBetweenTwoStrings(playItem.text, " by ", " ", true, " ");
            break;
        case 'NCAAFB-DS13-1':
            description = 'Tackle For Loss!';
            break;
        case 'NCAAFB-DS13-1-1':
            description = 'Tackle For Loss!';
            break;
        case 'NCAAFB-DS13-2':
            description = 'Tackle For Loss!';
            break;
        case 'NCAAFB-DS14':
            description = 'Punt. Down ' + findNameToEnd(playItem.end.downDistanceText);
            break;
        case 'NCAAFB-DS14-1':
            description = 'Punt Bonus! 3 and Out!';
            break;
        case 'NCAAFB-DS14-2':
            description = 'Punt Return Bonus!';
            break;
        case 'NCAAFB-DS15':
            description = 'Defense forces turn over';
            break;
        case 'NCAAFB-DS16':
            description = 'Defensive TouchDown! XP Good.';
            break;
        case 'NCAAFB-DS16-1':
            description = 'Defensive TD!';
            break;
        case 'NCAAFB-DS17-1':
            description = 'Defensive TD! XP Fail.';
            break;
        case 'NCAAFB-DS18':
            description = 'Field Goal Missed';
            break;
        case 'NCAAFB-DS19-1':
            description = 'Short Field Goal';
            break;
        case 'NCAAFB-DS20':
            description = 'Touchdown';
            break;
        case 'NCAAFB-DS21':
            description = 'First Down';
            break;
        case 'NCAAFB-DS21-1':
            description = 'First Down ' + findNameFromText(playItem.text, true, " ");
            break;
        case 'NCAAFB-DS21-2':
            description = 'First Down. ' + findBetweenTwoStrings(playItem.text, " to ", " ", true, " ");
            break;
        case 'NCAAFB-DS21-3':
            description = '1st Down. Def Penalty';
            break;
        // findNameFromText
        case 'NCAAFB-DS22':
            description = 'Field Goal Missed';
            break;
        case 'NCAAFB-DS24-2':
            description = 'Turn Over on Downs!';
            break;
        case 'NCAAFB-DS24-3':
            description = 'Turn Over on Downs!';
            break;
        case 'NCAAFB-DS25':
            description = 'Safety';
            break;
        case 'NCAAFB-DS26':
            description = 'Safety';
            break;
        case 'NCAAFB-DS27':
            description = 'Strip Sack Turnover';
            break;

        case 'NCAAFB-DS29':
            description = 'Game Over';
            break;
        case 'NCAAFB-DS30':
            description = 'Two Minute Warning';
            break;
        case 'NCAAFB-DS31':
            description = 'End of Quater';
            break;
        default:
            break;
    }

    // Previous Text
    if (dataTypeItem.description) {
        description = prevPlayItem.text;
    }

    // console.log(description,'Func')
    let timeDisplay;
    if (sportCategory === 'MLB') {
        timeDisplay = playItem.period.displayValue
    } else {
        if (sportCategory == 'NHL' || sportCategory == 'NHL2') {
            timeDisplay = reverseTime(playItem.clock.displayValue);
        } else {
            timeDisplay = playItem.clock.displayValue;
        }
    }


    if (sportCategory === 'MLB') {
        sequenceTime = timeDisplay
    } else {
        sequenceTime = playItem.period.displayValue + '(' + timeDisplay + ')';
    }

    homeScore = playItem.homeScore;
    awayScore = playItem.awayScore;

    // console.log(score,'handleScore')
    return {
        textIndex,
        tableIndex,
        increaseMount,
        sequenceTime,
        score,
        description,
        homeScore,
        awayScore
    }
}

export const handleSoccerScore = (playItem, dataTypeItem, score, tableIndex, prevPlayItem, team1Name, team2Name) => {
    let description, sequenceTime, homeScore, awayScore, textIndex = tableIndex;
    let increaseMount = dataTypeItem.Increase;

    if (dataTypeItem.Increase == -1) {
        increaseMount = prevPlayItem.scoreValue
    }

    if (dataTypeItem.Increase) {
        score[tableIndex] = score[tableIndex] + increaseMount;
    } else {
        increaseMount = 0;
    }

    if (dataTypeItem.rotation) {
        tableIndex = tableIndex + 1;
        tableIndex = tableIndex % 4;
    }

    description = playItem.text;

    switch (dataTypeItem.no) {
        case 'SOCCER-DS7':
            description = 'Foul by ' + team1Name + " " + playItem.play.participants[0].athlete.displayName
            break;
        case 'SOCCER-DS8':
            description = 'Foul by ' + team2Name + " " + playItem.play.participants[0].athlete.displayName
            break;
        case 'SOCCER-DS9':
            description = 'Goal! ' + playItem.play.participants[0].athlete.displayName
            break;
        case 'SOCCER-DS10':
            description = 'Goal! ' + playItem.play.participants[0].athlete.displayName
            break;
        case 'SOCCER-DS11':
            // description = 'Shot on target ' + playItem.play.participants[0].athlete.displayName
            break;
        case 'SOCCER-DS12':
            // description = 'Shot on target ' + playItem.play.participants[0].athlete.displayName
            break;
        case 'SOCCER-DS14':
            description = team1Name + ' earns a coner'
            break;
        case 'SOCCER-DS15':
            description = team2Name + ' earns a coner'
            break;
        case 'SOCCER-DS21':
            description = playItem.play.shortText
            break;
        case 'SOCCER-DS24':
            description = 'Own Goal ' + playItem.play.participants[0].athlete.displayName
            break;
        case 'SOCCER-DS25':
            description = 'Own Goal ' + playItem.play.participants[0].athlete.displayName
            break;
        default:
            break;
    }

    if (dataTypeItem.description) {
        description = prevPlayItem.text;
    }

    sequenceTime = playItem.time.displayValue;

    return {
        textIndex,
        tableIndex,
        increaseMount,
        sequenceTime,
        score,
        description,
        homeScore,
        awayScore
    }
}
