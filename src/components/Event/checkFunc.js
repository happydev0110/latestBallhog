import { getDuraton } from "../../func";

export const checkWords = (text, words) => {
    let status = false
    for (let i = 0; i < words.length; i++) {
        const element = words[i];
        if (text.includes(words[i])) {
            status = true;
            break;
        }
    }

    return status;
}

/*
 Status
    false: yes          (continue)
    true: No Check      (no continue)
*/
export const checkFunc = (sportCategory, dataTypeItem, currentPlayItem, prevPlayItem, team1Id, team2Id, matchTeamId, PREV_NHL_DS2, PREV_NHL_DS5, OffensivePlays_NFL) => {
    var status = false;

    // teamId
    if (dataTypeItem.teamId !== -1) {
        if (sportCategory == 'NFL' || sportCategory == 'NCAAFB') {
            if (currentPlayItem.start === undefined || currentPlayItem.start.team === undefined || currentPlayItem.start.team.id === undefined) {
                status = true;
            } else {
                if (currentPlayItem.start.team.id != matchTeamId) {
                    status = true;
                }
            }
        } else {
            if (currentPlayItem.team === undefined) {
                status = true;
            }

            if (currentPlayItem.team && (currentPlayItem.team.id != matchTeamId)) {
                status = true;
            }
        }
    }

    // typeId
    if (dataTypeItem.typeId) {
        if (currentPlayItem.type === undefined) status = true;
        if (currentPlayItem.type.id != dataTypeItem.typeId) status = true;
    }

    // scoreValue
    if (dataTypeItem.scoreValue != -1) {
        if (currentPlayItem.scoreValue === undefined) status = true;
        if (currentPlayItem.scoreValue != dataTypeItem.scoreValue) status = true;
    }

    // scoringPlay
    if (dataTypeItem.scoringPlayStatus) {
        if (currentPlayItem.scoringPlay != dataTypeItem.scoringPlay) {
            status = true;
        }
    }

    // Special DS
    // NCAA-DS3
    if (dataTypeItem.no === 'NCAA-DS3') {
        if (prevPlayItem === undefined || prevPlayItem.scoreValue === undefined || prevPlayItem.scoreValue != 0 || prevPlayItem.clock.displayValue == currentPlayItem.clock.displayValue) status = true;
    }

    // NCAA-DS3-2
    if (dataTypeItem.no === 'NCAA-DS3-2') {
        if (prevPlayItem === undefined) {
            status = true;
        } else {
            if (prevPlayItem.clock.displayValue != currentPlayItem.clock.displayValue || prevPlayItem.scoringPlay === undefined || prevPlayItem.scoringPlay === true) status = true;
        }
    }

    // NCAA-DS9
    if (dataTypeItem.no === 'NCAA-DS9') {
        if (prevPlayItem === undefined || currentPlayItem.clock === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoreValue === undefined) {
            status = true
        } else {
            if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.type.id == 574 || prevPlayItem.scoreValue != 2) {
                status = true;
            }
        };
    }

    // NCAA-DS10
    if (dataTypeItem.no === 'NCAA-DS10') {
        if (prevPlayItem === undefined || currentPlayItem.clock === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoreValue === undefined) {
            status = true;
        } else {
            if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.scoreValue != 3) {
                status = true;
            }
        }
    }

    // NCAA-DS12
    if (dataTypeItem.no === 'NCAA-DS12') {
        if (prevPlayItem === undefined || prevPlayItem.clock === undefined) {
            status = true;
        } else {
            if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.type.id != 574) {
                status = true;
            }
        }
    }

    // NCAA-DS13
    if (dataTypeItem.no === 'NCAA-DS13') {
        if (prevPlayItem === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoringPlay === undefined) {
            status = true;
        } else {
            if (!prevPlayItem.scoringPlay || currentPlayItem.clock.displayValue === prevPlayItem.clock.displayValue) {
                status = true;
            }
        }
    }

    // DS30-NBA
    if (dataTypeItem.no === 'NBA-DS30') {
        if (prevPlayItem === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoringPlay === undefined || prevPlayItem.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.scoreValue != 2 || prevPlayItem.team.id == matchTeamId || dataTypeItem.noMatchList.indexOf(parseInt(prevPlayItem.type.id)) !== -1) {
                status = true;
            }
        }
    }

    // DS48-NBA
    if (dataTypeItem.no === 'NBA-DS48') {
        if (prevPlayItem === undefined || prevPlayItem.clock === undefined) {
            status = true;
        } else {
            if (currentPlayItem.clock.displayValue === prevPlayItem.clock.displayValue) {
                status = true;
            }
        }
    }

    // NHL-DS2
    if (dataTypeItem.no === 'NHL-DS2') {
        // PREV_NHL_DS2
        if (currentPlayItem === undefined || currentPlayItem.text === undefined || currentPlayItem.type === undefined || PREV_NHL_DS2 === undefined || PREV_NHL_DS2.type === undefined || currentPlayItem.wallclock === undefined || PREV_NHL_DS2.wallclock === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('timeout') || currentPlayItem.text.toLowerCase().includes('official') || currentPlayItem.text.toLowerCase().includes('challenge') || currentPlayItem.text.toLowerCase().includes('review') || currentPlayItem.text.toLowerCase().includes('objects') || getDuraton(PREV_NHL_DS2.wallclock, currentPlayItem.wallclock) <= 30000) {
                status = true;
            }
        }
    }
    
    // NHL-DS2-1
    if (dataTypeItem.no === 'NHL-DS2-1') {
        // PREV_NHL_DS2
        if (currentPlayItem === undefined || currentPlayItem.text === undefined || currentPlayItem.type === undefined || PREV_NHL_DS2 === undefined || PREV_NHL_DS2.type === undefined || currentPlayItem.wallclock === undefined || PREV_NHL_DS2.wallclock === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('timeout') || currentPlayItem.text.toLowerCase().includes('official') || currentPlayItem.text.toLowerCase().includes('challenge') || currentPlayItem.text.toLowerCase().includes('review') || currentPlayItem.text.toLowerCase().includes('objects') || getDuraton(PREV_NHL_DS2.wallclock, currentPlayItem.wallclock) >= 30000) {
                status = true;
            }
        }
    }
    

    // NHL-DS4
    if (dataTypeItem.no === 'NHL-DS4') {
        if (prevPlayItem === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoringPlay === undefined || prevPlayItem.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || !currentPlayItem.text.includes('Fighting') || !prevPlayItem.text.includes('Fighting') || currentPlayItem.team.id !== prevPlayItem.team.id) {
                status = true;
            }
        }
    }

    // NHL-DS5
    if (dataTypeItem.no === 'NHL-DS5') {
        if (PREV_NHL_DS5 === undefined || PREV_NHL_DS5.clock === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.includes('served by') || PREV_NHL_DS5.clock.displayValue === currentPlayItem.clock.displayValue) {
                status = true;
            }
        }
    }

    // NHL-DS5-1
    if (dataTypeItem.no === 'NHL-DS5-1') {
        if (PREV_NHL_DS5 === undefined || PREV_NHL_DS5.clock === undefined) {
            status = true;
        } else {
            // console.log(currentPlayItem, PREV_NHL_DS5,'PREV_NHL_DS5')
            if (currentPlayItem.text.includes('served by') || PREV_NHL_DS5.clock.displayValue !== currentPlayItem.clock.displayValue) {
                status = true;
            }
        }
    }

    // NHL-DS6 
    if (dataTypeItem.no === 'NHL-DS6') {
        if (prevPlayItem === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.includes('served by')) {
                status = true;
            }
        }
    }

    // NHL-DS16 
    if (dataTypeItem.no === 'NHL-DS16') {
        if (prevPlayItem === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('blockedx')) {
                status = true;
            }
        }
    }

    // DS17 
    if (dataTypeItem.no === 'NHL-DS17') {
        if (prevPlayItem === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (prevPlayItem.type.id == 509 || prevPlayItem.clock.displayValue >= currentPlayItem.clock.displayValue) {
                status = true;
            }
        }
    }

    // DS17-1 
    if (dataTypeItem.no === 'NHL-DS17-1') {
        if (prevPlayItem === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (prevPlayItem.type.id == 509) {
                status = true;
            }
        }
    }

    // DS17-2 
    if (dataTypeItem.no === 'NHL-DS17-2') {
        if (prevPlayItem === undefined || currentPlayItem.text === undefined || prevPlayItem.team === undefined) {
            status = true;
        } else {
            if (prevPlayItem.type.id != 509 || prevPlayItem.team.id != team2Id) {
                status = true;
            }
        }
    }

    // DS17-3 
    if (dataTypeItem.no === 'NHL-DS17-3') {
        if (prevPlayItem === undefined || currentPlayItem.text === undefined || prevPlayItem.team === undefined) {
            status = true;
        } else {
            if (prevPlayItem.type.id != 509 || prevPlayItem.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NHL2-DS2
    if (dataTypeItem.no === 'NHL2-DS2') {
        if (PREV_NHL_DS2.teamId != team1Id) {
            status = true;
        }
    }

    // NHL2-DS2-1
    if (dataTypeItem.no === 'NHL2-DS2-1') {
        if (PREV_NHL_DS2.teamId != team1Id) {
            status = true;
        }
    }

    // NHL2-DS2-2
    if (dataTypeItem.no === 'NHL2-DS2-2') {
        if (PREV_NHL_DS2.teamId != team2Id) {
            status = true;
        }
    }

    // NHL2-DS2-3
    if (dataTypeItem.no === 'NHL2-DS2-3') {
        if (PREV_NHL_DS2.teamId != team1Id) {
            status = true;
        }
    }

    // NHL2-DS2-4
    if (dataTypeItem.no === 'NHL2-DS2-4') {
        if (PREV_NHL_DS2.teamId != team2Id) {
            status = true;
        }
    }

    // NBA2-DS1-2
    if (dataTypeItem.no === 'NBA2-DS1-2') {
        if (!currentPlayItem.text.includes('three point')) {
            status = true;
        }
    }

    // NBA2-DS1-3
    if (dataTypeItem.no === 'NBA2-DS1-3') {
        if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 22-foot')) {
            status = true;
        }
    }

    // NBA2-DS1-4
    if (dataTypeItem.no === 'NBA2-DS1-4') {
        if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 23-foot')) {
            status = true;
        }
    }

    // NBA2-DS1-5
    if (dataTypeItem.no === 'NBA2-DS1-5') {
        if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 24-foot')) {
            status = true;
        }
    }

    // NBA2-DS1-6
    if (dataTypeItem.no === 'NBA2-DS1-6') {
        if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 25-foot')) {
            status = true;
        }
    }

    // NBA2-DS1-7
    if (dataTypeItem.no === 'NBA2-DS1-7') {
        if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 26-foot')) {
            status = true;
        }
    }

    // NBA2-DS1-8
    if (dataTypeItem.no === 'NBA2-DS1-8') {
        if (currentPlayItem.text.includes('three point') || !currentPlayItem.text.includes('misses 27-foot')) {
            status = true;
        }
    }

    // NBA2-DS7
    if (dataTypeItem.no === 'NBA2-DS7') {
        if (currentPlayItem.type === undefined || prevPlayItem === undefined || prevPlayItem.type === undefined) {
            status = true
        } else {
            if (!currentPlayItem.type.text.includes('Dunk Shot') || dataTypeItem.noMatchList.indexOf(parseInt(prevPlayItem.type.id)) !== -1) {
                status = true;
            }
        }
    }

    // NBA2-DS7-2
    if (dataTypeItem.no === 'NBA2-DS7-2') {
        if (currentPlayItem.type === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.type.text.includes('Dunk Shot')) {
                status = true;
            }
        }
    }

    // NBA2-DS20
    if (dataTypeItem.no === 'NBA2-DS20') {
        if (currentPlayItem.type === undefined) {
            status = true;
        } else {
            if (currentPlayItem.type.id == 84 || !currentPlayItem.type.text.includes('Turnover')) {
                status = true;
            }
        }
    }

    // NBA2-DS30
    if (dataTypeItem.no === 'NBA2-DS30') {
        if (currentPlayItem.clock === undefined || prevPlayItem === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoreValue === undefined || prevPlayItem.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.scoreValue != 2 || prevPlayItem.team.id == matchTeamId || dataTypeItem.noMatchList.indexOf(parseInt(prevPlayItem.type.id)) !== -1 || prevPlayItem.type.text.includes('Dunk Shot')) {
                status = true;
            }
        }
    }

    // NBA2-DS30-2
    if (dataTypeItem.no === 'NBA2-DS30-2') {
        if (prevPlayItem === undefined || prevPlayItem.clock === undefined || prevPlayItem.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || !prevPlayItem.type.text.includes('Dunk Shot')) {
                status = true;
            }
        }

    }

    // NBA2-DS30-3
    if (dataTypeItem.no === 'NBA2-DS30-3') {
        if (prevPlayItem === undefined || prevPlayItem.type === undefined) {
            status = true;
        } else {
            if (prevPlayItem.type.id != 9) {
                status = true;
            }
        }

    }

    // NBA2-DS48
    if (dataTypeItem.no === 'NBA2-DS48') {
        if (prevPlayItem === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoringPlay === undefined || prevPlayItem.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.clock.displayValue === prevPlayItem.clock.displayValue) {
                status = true;
            }
        }
    }

    // NBA2-DS48-2
    if (dataTypeItem.no === 'NBA2-DS48-2') {
        if (prevPlayItem === undefined || prevPlayItem.clock === undefined || prevPlayItem.scoreValue === undefined) {
            status = true;
        } else {
            if (currentPlayItem.clock.displayValue !== prevPlayItem.clock.displayValue || prevPlayItem.scoreValue != 0) {
                status = true;
            }
        }
    }

    // NBA2-DS72
    if (dataTypeItem.no === 'NBA2-DS72') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('blocks')) {
                status = true;
            }
        }
    }

    // NBA2-DS73-1
    if (dataTypeItem.no === 'NBA2-DS73-1') {
        if (currentPlayItem.period === undefined || currentPlayItem.clock === undefined) {
            status = true
        } else {
            if (currentPlayItem.period !== '1st Quarter' || currentPlayItem.clock.displayValue !== '12:00') {
                status = true;
            }
        }
    }

    // NBA2-DS73-2
    if (dataTypeItem.no === 'NBA2-DS73-2') {
        if (currentPlayItem.type === undefined || currentPlayItem.clock === undefined) {
            status = true;
        } else {
            if (currentPlayItem.type.text !== 'Jumpball' || currentPlayItem.clock.displayValue !== '12:00') {
                status = true;
            }
        }
    }

    /* MLB */

    // MLB-DS2
    if (dataTypeItem.no === 'MLB-DS2') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('Top of the')) {
                status = true;
            }
        }
    }

    // MLB-DS2-1
    if (dataTypeItem.no === 'MLB-DS2-1') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.toLowerCase().includes('bottom')) {
                status = true;
            }
        }
    }

    // MLB-DS3
    if (dataTypeItem.no === 'MLB-DS3') {
        if (currentPlayItem.alternativeType === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.alternativeType.text.toLowerCase().includes('out')) {
                status = true;
            }
        }
    }

    // MLB-DS3-2
    if (dataTypeItem.no === 'MLB-DS3-2') {
        if (currentPlayItem.alternativeType === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.toLowerCase().includes('out stretching')) {
                status = true;
            }
        }
    }

    // MLB-DS4
    if (dataTypeItem.no === 'MLB-DS4') {
        if (currentPlayItem.alternativeType === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('interference') || !currentPlayItem.text.includes('struck out')) {
                status = true;
            }
        }
    }

    // MLB-DS6
    if (dataTypeItem.no === 'MLB-DS6') {
        if (currentPlayItem.alternativeType === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            // if ((!currentPlayItem.text.toLowerCase().includes('single') && !currentPlayItem.text.toLowerCase().includes('singled')) || currentPlayItem.text.includes('out stretching')) {
            //     status = true;
            // }
            if (currentPlayItem.alternativeType.id != 2 || currentPlayItem.text.toLowerCase().includes('out stretching')) {
                status = true;
            }
        }
    }

    // MLB-DS7
    if (dataTypeItem.no === 'MLB-DS7') {
        if (currentPlayItem.alternativeType === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.toLowerCase().includes('walked') || currentPlayItem.text.toLowerCase().includes('scored')) {
                status = true;
            }
        }
    }

    // MLB-DS8
    if (dataTypeItem.no === 'MLB-DS8') {
        if (currentPlayItem.alternativeType === undefined) {
            status = true;
        } else {
            if (currentPlayItem.alternativeType.id != 14) {
                status = true;
            }
        }
    }

    // MLB-DS9
    if (dataTypeItem.no === 'MLB-DS9') {
        if (currentPlayItem.alternativeType === undefined) {
            status = true;
        } else {
            if (currentPlayItem.alternativeType.id != 15) {
                status = true;
            }
        }
    }

    // MLB-DS10
    if (dataTypeItem.no === 'MLB-DS10') {
        if (currentPlayItem.alternativeType === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.alternativeType.id != 10) {
                status = true;
            }
        }
    }

    // MLB-DS11
    if (dataTypeItem.no === 'MLB-DS11') {
        if (currentPlayItem.alternativeType === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.alternativeType.id != 3 || currentPlayItem.text.includes('out stretching')) {
                status = true;
            }
        }
    }

    // MLB-DS11-2
    if (dataTypeItem.no === 'MLB-DS11-2') {
        if (currentPlayItem.alternativeType === undefined) {
            status = true;
        } else {
            if (currentPlayItem.alternativeType.id != 60) {
                status = true;
            }
        }
    }

    // MLB-DS12
    if (dataTypeItem.no === 'MLB-DS12') {
        if (currentPlayItem.alternativeType === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.alternativeType.id != 4 || currentPlayItem.text.includes('out stretching')) {
                status = true;
            }
        }
    }

    // MLB-DS13
    if (dataTypeItem.no === 'MLB-DS13') {
        if (currentPlayItem.alternativeType === undefined) {
            status = true;
        } else {
            if (currentPlayItem.alternativeType.id != 28) {
                status = true;
            }
        }
    }

    // MLB-DS14
    if (dataTypeItem.no === 'MLB-DS14') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.toLowerCase().includes('sacrifice') || currentPlayItem.text.toLowerCase().includes('scored')) {
                status = true;
            }
        }
    }

    // MLB-DS15
    if (dataTypeItem.no === 'MLB-DS15') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.toLowerCase().includes('sacrifice') || !currentPlayItem.text.toLowerCase().includes('scored')) {
                status = true;
            }
        }
    }

    // MLB-DS16
    if (dataTypeItem.no === 'MLB-DS16') {
        if (currentPlayItem.alternativeType === undefined) {
            status = true;
        } else {
            if (currentPlayItem.alternativeType.id != 52) {
                status = true;
            }
        }
    }

    // MLB-DS17
    if (dataTypeItem.no === 'MLB-DS17') {
        if (currentPlayItem.alternativeType === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('hit by pitch') || currentPlayItem.text.toLowerCase().includes('scored')) {
                status = true;
            }
        }
    }

    // MLB-DS17-1
    if (dataTypeItem.no === 'MLB-DS17-1') {
        if (currentPlayItem.alternativeType === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('hit by pitch') || !currentPlayItem.text.toLowerCase().includes('scored')) {
                status = true;
            }
        }
    }

    // MLB-DS18
    if (dataTypeItem.no === 'MLB-DS18') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.toLowerCase().includes('interference')) {
                status = true;
            }
        }
    }

    // MLB-DS19
    if (dataTypeItem.no === 'MLB-DS19') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('to first on passed ball')) {
                status = true;
            }
        }
    }

    // MLB-DS19-1
    if (dataTypeItem.no === 'MLB-DS19-1') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('to first on wild')) {
                status = true;
            }
        }
    }

    // MLB-DS4-2
    if (dataTypeItem.no === 'MLB-DS4-2') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('struck out') || currentPlayItem.text.toLowerCase().includes('interference')) {
                status = true;
            }
        }
    }

    // MLB-DS21
    if (dataTypeItem.no === 'MLB-DS21') {
        if (currentPlayItem.alternativeType === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.alternativeType.text.toLowerCase().includes('out') || currentPlayItem.text.toLowerCase().includes('double play') || currentPlayItem.text.toLowerCase().includes('triple play')) {
                status = true;
            }
        }
    }

    // MLB-DS21-1
    if (dataTypeItem.no === 'MLB-DS21-1') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('out stretching')) {
                status = true;
            }
        }
    }

    // MLB-DS22
    if (dataTypeItem.no === 'MLB-DS22') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('double play')) {
                status = true;
            }
        }
    }

    // MLB-DS23
    if (dataTypeItem.no === 'MLB-DS23') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('triple play')) {
                status = true;
            }
        }
    }

    // MLB-DS24
    if (dataTypeItem.no === 'MLB-DS24') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('walked')) {
                status = true;
            }
        }
    }

    // MLB-DS25
    if (dataTypeItem.no === 'MLB-DS25') {
        if (currentPlayItem.alternativeType === undefined) {
            status = true;
        } else {
            if (currentPlayItem.alternativeType.id != 28) {
                status = true;
            }
        }
    }

    // MLB-DS26
    if (dataTypeItem.no === 'MLB-DS26') {
        if (currentPlayItem.alternativeType === undefined) {
            status = true;
        } else {
            if (currentPlayItem.alternativeType.id != 2 || currentPlayItem.text.toLowerCase().includes('out stretching')) {
                status = true;
            }
        }
    }

    // MLB-DS27
    if (dataTypeItem.no === 'MLB-DS27') {
        if (currentPlayItem.alternativeType === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.alternativeType.id != 3 || currentPlayItem.text.includes('out stretching')) {
                status = true;
            }
        }
    }

    // MLB-DS27-2
    if (dataTypeItem.no === 'MLB-DS27-2') {
        if (currentPlayItem.alternativeType === undefined) {
            status = true;
        } else {
            if (currentPlayItem.alternativeType.id != 60) {
                status = true;
            }
        }
    }

    // MLB-DS28
    if (dataTypeItem.no === 'MLB-DS28') {
        if (currentPlayItem.alternativeType === undefined || currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.alternativeType.id != 4 || currentPlayItem.text.includes('out stretching')) {
                status = true;
            }
        }
    }

    // MLB-DS29
    if (dataTypeItem.no === 'MLB-DS29') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('hit by pitch')) {
                status = true;
            }
        }
    }

    // MLB-DS30
    if (dataTypeItem.no === 'MLB-DS30') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('sacrifice') || currentPlayItem.text.includes('scored')) {
                status = true;
            }
        }
    }

    // MLB-DS31
    if (dataTypeItem.no === 'MLB-DS31') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.includes('sacrifice') || !currentPlayItem.text.includes('scored')) {
                status = true;
            }
        }
    }

    // MLB-DS32
    if (dataTypeItem.no === 'MLB-DS32') {
        if (currentPlayItem.text === undefined || currentPlayItem.alternativePlay === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.toLowerCase().includes('safe') || !currentPlayItem.text.toLowerCase().includes('error')) {
                status = true;
            }
        }
    }

    // MLB-DS33
    if (dataTypeItem.no === 'MLB-DS33') {
        if (currentPlayItem.text === undefined || currentPlayItem.alternativePlay === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.toLowerCase().includes('caught stealing')) {
                status = true;
            }
        }
    }

    // NFL-DS1
    if (dataTypeItem.no === 'NFL-DS1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NFL-DS1-1
    if (dataTypeItem.no === 'NFL-DS1-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end == undefined || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NFL-DS1-2
    if (dataTypeItem.no === 'NFL-DS1-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NFL-DS1-3
    if (dataTypeItem.no === 'NFL-DS1-3') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NFL-DS1-4
    if (dataTypeItem.no === 'NFL-DS1-4') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || (pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1 && !currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available'))) {
                status = true;
            }
        }
    }

    // NFL-DS1-5
    if (dataTypeItem.no === 'NFL-DS1-5') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || parseInt(currentPlayItem.pointAfterAttempt.value) != 0 || currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available')) {
                status = true;
            }
        }
    }

    // NFL-DS1-6
    if (dataTypeItem.no === 'NFL-DS1-6') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NFL-DS1-7
    if (dataTypeItem.no === 'NFL-DS1-7') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.yardsToEndzone >= 51) {
                status = true;
            }
        }
    }

    // NFL-DS1-8
    if (dataTypeItem.no === 'NFL-DS1-8') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.scoringPlay != true || (pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1 && !currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available'))) {
                status = true;
            }
        }
    }

    // NFL-DS1-9
    if (dataTypeItem.no === 'NFL-DS1-9') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.scoringPlay != true || parseInt(currentPlayItem.pointAfterAttempt.value) != 0 || currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available')) {
                status = true;
            }
        }
    }

    // NFL-DS1-9-9
    if (dataTypeItem.no === 'NFL-DS1-9-9') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.end.team.id != team2Id || currentPlayItem.scoringPlay != true) {
                status = true;
            }
        }
    }

    // NFL-DS2-1
    if (dataTypeItem.no === 'NFL-DS2-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.start.team === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            if (startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id || currentPlayItem.statYardage >= 20 || currentPlayItem.statYardage < currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NFL-DS2-2
    if (dataTypeItem.no === 'NFL-DS2-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.start.team === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            if (currentPlayItem.text.toLowerCase().includes('no play') || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id || currentPlayItem.statYardage >= 10 || currentPlayItem.statYardage < currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NFL-DS3-1
    if (dataTypeItem.no === 'NFL-DS3-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.scoringPlay != false || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.statYardage <= 19 || currentPlayItem.statYardage < currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NFL-DS3-2
    if (dataTypeItem.no === 'NFL-DS3-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4];
            if (currentPlayItem.scoringPlay != false || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.statYardage < currentPlayItem.start.distance || currentPlayItem.statYardage <= 9) {
                status = true;
            }
        }
    }

    // NFL-DS3-2-2
    if (dataTypeItem.no === 'NFL-DS3-2-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4];
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.scoringPlay != false || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone < currentPlayItem.start.distance || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone <= 9) {
                status = true;
            }
        }
    }

    // NFL-DS3-2-4
    if (dataTypeItem.no === 'NFL-DS3-2-4') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4];
            if (!currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.scoringPlay != false || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.statYardage - currentPlayItem.end.yardsToEndzone >= 10 || currentPlayItem.statYardage - currentPlayItem.end.yardsToEndzone < currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NFL-DS3-6-6
    if (dataTypeItem.no === 'NFL-DS3-6-6') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let startDowns = [1, 2, 3, 4]
            if (!currentPlayItem.text.toLowerCase().includes('lateral') || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.down != 1 || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone <= 19) {
                status = true;
            }
        }
    }

    // NFL-DS3-6-7
    if (dataTypeItem.no === 'NFL-DS3-6-7') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let startDowns = [1, 2, 3, 4]
            if (!currentPlayItem.text.toLowerCase().includes('lateral') || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.down != 1 || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone >= 20) {
                status = true;
            }
        }
    }

    // NFL-DS3-6-8
    if (dataTypeItem.no === 'NFL-DS3-6-8') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let startDowns = [1, 2, 3, 4]
            if (!currentPlayItem.text.toLowerCase().includes('lateral') || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.down != 1 || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone <= 9) {
                status = true;
            }
        }
    }

    // NFL-DS3-6-9
    if (dataTypeItem.no === 'NFL-DS3-6-9') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let startDowns = [1, 2, 3, 4]
            if (!currentPlayItem.text.toLowerCase().includes('lateral') || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.down != 1 || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone >= 10) {
                status = true;
            }
        }
    }

    // NFL-DS4
    if (dataTypeItem.no === 'NFL-DS4') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.start.team.id != team1Id || currentPlayItem.statYardage <= 24) {
                status = true;
            }
        }
    }

    // NFL-DS5
    if (dataTypeItem.no === 'NFL-DS5') {
        if (currentPlayItem.text === undefined || prevPlayItem === undefined || prevPlayItem.type === undefined) {
            status = true;
        } else {
            if (prevPlayItem.type.id == 74 || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1) {
                status = true;
            }
        }
    }

    // NFL-DS6-1
    if (dataTypeItem.no === 'NFL-DS6-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            // console.log(currentPlayItem.pointAfterAttempt.value,'pointAfterAttempt')
            let pointAfterAttempts = [1, 2]
            if (currentPlayItem.scoringPlay != true || (pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1 && !currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available'))) {
                status = true;
            }
        }
    }

    // NFL-DS6-2
    if (dataTypeItem.no === 'NFL-DS6-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            // console.log(currentPlayItem.pointAfterAttempt.value,'pointAfterAttempt')
            if (currentPlayItem.scoringPlay != true || parseInt(currentPlayItem.pointAfterAttempt.value) != 0 || currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available')) {
                status = true;
            }
        }
    }

    // NFL-DS7-1
    if (dataTypeItem.no === 'NFL-DS7-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (currentPlayItem.scoringPlay != true || (pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1 && !currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available'))) {
                status = true;
            }
        }
    }

    // NFL-DS7-2
    if (dataTypeItem.no === 'NFL-DS7-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != true || parseInt(currentPlayItem.pointAfterAttempt.value) != 0 || currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available')) {
                status = true;
            }
        }
    }

    // NFL-DS8
    if (dataTypeItem.no === 'NFL-DS8') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.statYardage <= 49) {
                status = true;
            }
        }
    }

    // NFL-DS8-1
    if (dataTypeItem.no === 'NFL-DS8-1') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || currentPlayItem.statYardage >= 28) {
                status = true;
            }
        }
    }

    // NFL-DS9
    if (dataTypeItem.no === 'NFL-DS9') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.statYardage <= 27 || currentPlayItem.statYardage >= 50) {
                status = true;
            }
        }
    }

    // NFL-DS10
    if (dataTypeItem.no === 'NFL-DS10') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('touchback') || currentPlayItem.end.team.id != team2Id || currentPlayItem.scoringPlay != false || currentPlayItem.end.yardsToEndzone >= 81) {
                status = true;
            }
        }
    }

    // NFL-DS10-1
    if (dataTypeItem.no === 'NFL-DS10-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || (pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1 && !currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available'))) {
                status = true;
            }
        }
    }

    // NFL-DS10-1-1
    if (dataTypeItem.no === 'NFL-DS10-1-1') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.toLowerCase().includes('touchback') || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NFL-DS10-2
    if (dataTypeItem.no === 'NFL-DS10-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || parseInt(currentPlayItem.pointAfterAttempt.value) != 0 || currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available')) {
                status = true;
            }
        }
    }

    // NFL-DS10-3
    if (dataTypeItem.no === 'NFL-DS10-3') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || (pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1 && !currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available'))) {
                status = true;
            }
        }
    }

    // NFL-DS10-4
    if (dataTypeItem.no === 'NFL-DS10-4') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || parseInt(currentPlayItem.pointAfterAttempt.value) != 0 || currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available')) {
                status = true;
            }
        }
    }

    // NFL-DS10-5
    if (dataTypeItem.no === 'NFL-DS10-5') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NFL-DS10-6
    if (dataTypeItem.no === 'NFL-DS10-6') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NFL-DS11
    if (dataTypeItem.no === 'NFL-DS11') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var endYardLine = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90]
            if (currentPlayItem.end.team.id != team2Id || endYardLine.indexOf(parseInt(currentPlayItem.end.yardLine)) == -1) {
                status = true;
            }
        }
    }

    // NFL-DS11-1
    if (dataTypeItem.no === 'NFL-DS11-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var endYardLine = [89, 88, 87, 86, 85, 84, 83, 82, 81]
            if (currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id || endYardLine.indexOf(parseInt(currentPlayItem.end.yardsToEndzone)) == -1) {
                status = true;
            }
        }
    }

    // NFL-DS12
    if (dataTypeItem.no === 'NFL-DS12') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NFL-DS12-1
    if (dataTypeItem.no === 'NFL-DS12-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.scoringType === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) != -1 || currentPlayItem.scoringType.name != 'touchdown' || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NFL-DS12-2
    if (dataTypeItem.no === 'NFL-DS12-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.scoringType === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('opponent') || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) != -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NFL-DS12-3
    if (dataTypeItem.no === 'NFL-DS12-3') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.scoringType === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('opponent') || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) != -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NFL-DS12-4
    if (dataTypeItem.no === 'NFL-DS12-4') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.start === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('fumbles') || currentPlayItem.end.team.id != team2Id || currentPlayItem.start.id != team1Id) {
                status = true;
            }
        }
    }

    // NFL-DS12-5
    if (dataTypeItem.no === 'NFL-DS12-5') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.start === undefined || currentPlayItem.start.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('fumbles') || currentPlayItem.start.team != team2Id || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NFL-DS13
    if (dataTypeItem.no === 'NFL-DS13') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play')) {
                status = true;
            }
        }
    }

    // NFL-DS13-1
    if (dataTypeItem.no === 'NFL-DS13-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || !currentPlayItem.text.toLowerCase().includes('sacked') || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NFL-DS13-2
    if (dataTypeItem.no === 'NFL-DS13-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let startDowns = [1, 2, 3]
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.text.toLowerCase().includes('sacked') || currentPlayItem.text.toLowerCase().includes('kneels') || currentPlayItem.text.toLowerCase().includes('enforced between') || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id || (currentPlayItem.statYardage >= 0 && currentPlayItem.end.yardsToEndzone <= currentPlayItem.start.yardsToEndzone)) {
                status = true;
            }
        }
    }

    // NFL-DS13-3
    if (dataTypeItem.no === 'NFL-DS13-3') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || !currentPlayItem.text.toLowerCase().includes('sacked') || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id || currentPlayItem.statYardage >= 0) {
                status = true;
            }
        }
    }

    // NFL-DS14
    if (dataTypeItem.no === 'NFL-DS14') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('touchback') || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id || currentPlayItem.offensivePlays == 3) {
                status = true;
            }
        }
    }

    // NFL-DS14-1
    if (dataTypeItem.no === 'NFL-DS14-1') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != false || currentPlayItem.offensivePlays != 3) {
                status = true;
            }
        }
    }

    // NFL-DS14-1-1
    if (dataTypeItem.no === 'NFL-DS14-1-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.toLowerCase().includes('touchback') || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id || currentPlayItem.offensivePlays == 3) {
                status = true;
            }
        }
    }

    // NFL-DS14-2
    if (dataTypeItem.no === 'NFL-DS14-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.yardsToEndzone >= 51) {
                status = true;
            }
        }
    }

    // NFL-DS15
    if (dataTypeItem.no === 'NFL-DS15') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false) {
                status = true;
            }
        }
    }

    // NFL-DS16
    if (dataTypeItem.no === 'NFL-DS16') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != true || currentPlayItem.pointAfterAttempt.value != 1 || currentPlayItem.pointAfterAttempt.value != 2) {
                status = true;
            }
        }
    }

    // NFL-DS16-1
    if (dataTypeItem.no === 'NFL-DS16-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) != -1 || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || currentPlayItem.scoringType.name != 'touchdown' || (pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1 && !currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available'))) {
                status = true;
            }
        }
    }

    // NFL-DS17-1
    if (dataTypeItem.no === 'NFL-DS17-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) != -1 || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || currentPlayItem.scoringType.name != 'touchdown' || parseInt(currentPlayItem.pointAfterAttempt.value) != 0 || currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not avaialble')) {
                status = true;
            }
        }
    }

    // NFL-DS18
    if (dataTypeItem.no === 'NFL-DS18') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play')) {
                status = true;
            }
        }
    }

    // NFL-DS18-1
    if (dataTypeItem.no === 'NFL-DS18-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.start === undefined || currentPlayItem.start.team === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.start.team.id != team2Id || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NFL-DS19
    if (dataTypeItem.no === 'NFL-DS19') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team2Id || currentPlayItem.statYardage <= 27) {
                status = true;
            }
        }
    }

    // NFL-DS19-1
    if (dataTypeItem.no === 'NFL-DS19-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team2Id || currentPlayItem.statYardage > 27) {
                status = true;
            }
        }
    }

    // NFL-DS20
    if (dataTypeItem.no === 'NFL-DS20') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1) {
                status = true;
            }
        }
    }

    // NFL-DS21-1
    if (dataTypeItem.no === 'NFL-DS21-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id || currentPlayItem.statYardage < currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NFL-DS21-1-1
    if (dataTypeItem.no === 'NFL-DS21-1-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let startDowns = [1, 2, 3, 4];
            if (!currentPlayItem.text.toLowerCase().includes('lateral') || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id || currentPlayItem.yardsToEndzone - currentPlayItem.end.yardsToEndzone <= currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NFL-DS21-2
    if (dataTypeItem.no === 'NFL-DS21-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let startDowns = [1, 2, 3, 4];
            if (currentPlayItem.text.toLowerCase().includes('no play') || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id || currentPlayItem.statYardage < currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NFL-DS21-2-2
    if (dataTypeItem.no === 'NFL-DS21-2-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let startDowns = [1, 2, 3, 4];
            if (!currentPlayItem.text.toLowerCase().includes('lateral') || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id || currentPlayItem.end.down != 1) {
                status = true;
            }
        }
    }

    // NFL-DS21-3
    if (dataTypeItem.no === 'NFL-DS21-3') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id || currentPlayItem.end.down != 1) {
                status = true;
            }
        }
    }

    // NFL-DS21-4
    if (dataTypeItem.no === 'NFL-DS21-4') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            if (!currentPlayItem.text.toLowerCase().includes('no play') || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id || currentPlayItem.statYardage < currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NFL-DS21-5
    if (dataTypeItem.no === 'NFL-DS21-5') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [2, 3, 4]
            if (!currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.text.toLowerCase().includes('offensive holding') || currentPlayItem.text.toLowerCase().includes('defensive too many') || currentPlayItem.text.toLowerCase().includes('defensive offside') || currentPlayItem.text.toLowerCase().includes('neutral zone') || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id || currentPlayItem.end.down != 1 || currentPlayItem.start.downDistanceText.toLowerCase().includes('goal') || currentPlayItem.statYardage <= 0 || currentPlayItem.statYardage >= currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NFL-DS21-6
    if (dataTypeItem.no === 'NFL-DS21-6') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (!currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.text.toLowerCase().includes('offensive holding') || currentPlayItem.text.toLowerCase().includes('defensive too many') || currentPlayItem.text.toLowerCase().includes('defensive offside') || currentPlayItem.text.toLowerCase().includes('neutral zone') || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.start.down != 1 || currentPlayItem.end.team.id != team2Id || currentPlayItem.start.downDistanceText.toLowerCase().includes('goal') || currentPlayItem.statYardage <= 0 || currentPlayItem.statYardage >= currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NFL-DS21-6
    if (dataTypeItem.no === 'NFL-DS21-6') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play')) {
                status = true;
            }
        }
    }

    // NFL-DS22
    if (dataTypeItem.no === 'NFL-DS22') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1) {
                status = true;
            }
        }
    }

    // NFL-DS24-1-1
    if (dataTypeItem.no === 'NFL-DS24-1-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.start.down != 4 || currentPlayItem.end.down != 1 || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NFL-DS24-1-2
    if (dataTypeItem.no === 'NFL-DS24-1-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let endDowns = [1, 2, 3, 4]
            if (currentPlayItem.text.toLowerCase().includes('no play') || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.start.down != 4 || endDowns.indexOf(parseInt(currentPlayItem.end.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.statYardage >= currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NFL-DS24-1-1-1
    if (dataTypeItem.no === 'NFL-DS24-1-1-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let endDowns = [1, 2, 3, 4]
            if (currentPlayItem.text.toLowerCase().includes('no play') || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || endDowns.indexOf(parseInt(currentPlayItem.end.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.start.down != 4 || currentPlayItem.end.team.id != team2Id || currentPlayItem.statYardage >= currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NFL-DS24-1
    if (dataTypeItem.no === 'NFL-DS24-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) != -1 || currentPlayItem.start.down != 4 || currentPlayItem.end.down != 1 || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NFL-DS24-2
    if (dataTypeItem.no === 'NFL-DS24-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (currentPlayItem.text.toLowerCase().includes('no play') || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != true || currentPlayItem.start.down != 4 || currentPlayItem.end.down != 1 || currentPlayItem.end.team.id != team1Id || (pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1 && !currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available'))) {
                status = true;
            }
        }
    }

    // NFL-DS24-2-3
    if (dataTypeItem.no === 'NFL-DS24-2-3') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (currentPlayItem.text.toLowerCase().includes('no play') || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != true || currentPlayItem.start.down != 4 || currentPlayItem.end.down != 1 || currentPlayItem.end.team.id != team1Id || (parseInt(currentPlayItem.pointAfterAttempt.value) != 0 && !currentPlayItem.pointAfterAttempt.text.toLowerCase().includes('not available'))) {
                status = true;
            }
        }
    }

    // NFL-DS27
    if (dataTypeItem.no === 'NFL-DS27') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3]
            if (currentPlayItem.scoringPlay != false || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NFL-DS32
    if (dataTypeItem.no === 'NFL-DS32') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            var words = ['face mask', 'unnecessary roughness', 'illegal contact', 'illegal use of hands', 'roughing the kicker', 'roughing the passer', 'defensive holding', 'defensive pass interference', 'unsportsmanlike conduct', 'horse collar tackle']
            if (currentPlayItem.text.toLowerCase().includes('offsetting') || !currentPlayItem.text.toLowerCase().includes('no play') || !checkWords(currentPlayItem.text.toLowerCase(), words) || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.statYardage < 0 || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NFL-DS32-1
    if (dataTypeItem.no === 'NFL-DS32-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            var words = ['defensive too many', 'defensive offside', 'neutral zone', 'delay of game', 'running into']
            if (currentPlayItem.text.toLowerCase().includes('offsetting') || !currentPlayItem.text.toLowerCase().includes('no play') || !currentPlayItem.text.toLowerCase().includes('face mask') || !checkWords(currentPlayItem.text.toLowerCase(), words) || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.down != 1 || currentPlayItem.statYardage < currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NFL-DS33
    if (dataTypeItem.no === 'NFL-DS33') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            var words = ['enforced between downs']
            if (currentPlayItem.text.toLowerCase().includes('offsetting') || !checkWords(currentPlayItem.text.toLowerCase(), words) || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.down != 1 || currentPlayItem.statYardage <= 19) {
                status = true;
            }
        }
    }

    // NFL-DS33-1
    if (dataTypeItem.no === 'NFL-DS33-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            var words = ['enforced between downs']
            if (currentPlayItem.text.toLowerCase().includes('offsetting') || !checkWords(currentPlayItem.text.toLowerCase(), words) || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.down != 1 || currentPlayItem.statYardage >= 20) {
                status = true;
            }
        }
    }

    // NFL-DS34
    if (dataTypeItem.no === 'NFL-DS34') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            var words = ['enforced between downs']
            if (currentPlayItem.text.toLowerCase().includes('offsetting') || !checkWords(currentPlayItem.text.toLowerCase(), words) || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.down != 1 || currentPlayItem.statYardage <= 9) {
                status = true;
            }
        }
    }

    // NFL-DS34-1
    if (dataTypeItem.no === 'NFL-DS34-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            var words = ['enforced between downs']
            if (currentPlayItem.text.toLowerCase().includes('offsetting') || !checkWords(currentPlayItem.text.toLowerCase(), words) || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.down != 1 || currentPlayItem.statYardage >= 10) {
                status = true;
            }
        }
    }

    // NFL-DS40
    if (dataTypeItem.no === 'NFL-DS40') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            var words = ['face mask', 'unnecessary roughness', 'illegal contact', 'illegal use of hands', 'roughing the kicker', 'roughing the passer', 'defensive holding', 'defensive pass interference', 'unsportsmanlike conduct', 'horse collar tackle', 'leverage']
            if (currentPlayItem.text.toLowerCase().includes('enforced between downs') || !currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.text.toLowerCase().includes('offsetting') || !checkWords(currentPlayItem.text.toLowerCase(), words) || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || parseInt(currentPlayItem.start.down) != 0 || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NFL-DS40-1
    if (dataTypeItem.no === 'NFL-DS40-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            var words = ['defensive too many', 'defensive offside', 'neutral zone', 'delay of game', 'running into']
            if (currentPlayItem.text.toLowerCase().includes('offsetting') || !currentPlayItem.text.toLowerCase().includes('no play') || !checkWords(currentPlayItem.text.toLowerCase(), words) || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team2Id || currentPlayItem.end.down != 1 || currentPlayItem.statYardage < currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NCAAFB
    // NCAAFB-DS1
    if (dataTypeItem.no === 'NCAAFB-DS1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end == undefined || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS1-1
    if (dataTypeItem.no === 'NCAAFB-DS1-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS1-2
    if (dataTypeItem.no === 'NCAAFB-DS1-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS1-3
    if (dataTypeItem.no === 'NCAAFB-DS1-3') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS1-4
    if (dataTypeItem.no === 'NCAAFB-DS1-4') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1) {
                status = true;
            }
        }
    }

    // NCAAFB-DS1-5
    if (dataTypeItem.no === 'NCAAFB-DS1-5') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (currentPlayItem.end.team.id != team1Id || currentPlayItem.scoringPlay != true || parseInt(currentPlayItem.pointAfterAttempt.value) != 0) {
                status = true;
            }
        }
    }

    // NCAAFB-DS1-6
    if (dataTypeItem.no === 'NCAAFB-DS1-6') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.end.team.id != team2Id || currentPlayItem.scoringPlay != true) {
                status = true;
            }
        }
    }

    // NCAAFB-DS1-7
    if (dataTypeItem.no === 'NCAAFB-DS1-7') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.text.toLowerCase().includes('touchback') || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.yardsToEndzone >= 51) {
                status = true;
            }
        }
    }

    // NCAAFB-DS1-8
    if (dataTypeItem.no === 'NCAAFB-DS1-8') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1) {
                status = true;
            }
        }
    }

    // NCAAFB-DS1-9
    if (dataTypeItem.no === 'NCAAFB-DS1-9') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || parseInt(currentPlayItem.pointAfterAttempt.value) != 0) {
                status = true;
            }
        }
    }

    // NCAAFB-DS1-9-9
    if (dataTypeItem.no === 'NCAAFB-DS1-9-9') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS2
    if (dataTypeItem.no === 'NCAAFB-DS2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [2, 3, 4]
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) != -1 || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.statYardage < currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NCAAFB-DS2-1-1
    if (dataTypeItem.no === 'NCAAFB-DS2-1-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            if ((!currentPlayItem.text.includes('1ST down') && !currentPlayItem.text.includes('1ST DOWN')) || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone >= 20) {
                status = true;
            }
        }
    }

    // NCAAFB-DS2-2-2
    if (dataTypeItem.no === 'NCAAFB-DS2-2-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.start.team === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            if ((!currentPlayItem.text.includes('1ST down') && !currentPlayItem.text.includes('1ST DOWN')) || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone >= 10) {
                status = true;
            }
        }
    }

    // NCAAFB-DS3
    if (dataTypeItem.no === 'NCAAFB-DS3') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) != -1 || currentPlayItem.start.down != 1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.statYardage < currentPlayItem.start.distance) {
                status = true;
            }
        }
    }

    // NCAAFB-DS3-1-1
    if (dataTypeItem.no === 'NCAAFB-DS3-1-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            if ((!currentPlayItem.text.includes('1ST down') && !currentPlayItem.text.includes('1ST DOWN')) || currentPlayItem.scoringPlay != false || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone <= 19) {
                status = true;
            }
        }
    }

    // NCAAFB-DS3-2-2
    if (dataTypeItem.no === 'NCAAFB-DS3-2-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            if ((!currentPlayItem.text.includes('1ST down') && !currentPlayItem.text.includes('1ST DOWN')) || currentPlayItem.scoringPlay != false || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone <= 9) {
                status = true;
            }
        }
    }

    // NCAAFB-DS3-3-3
    if (dataTypeItem.no === 'NCAAFB-DS3-3-3') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || (!currentPlayItem.text.includes('1ST down') && !currentPlayItem.text.includes('1ST DOWN')) || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone >= 15) {
                status = true;
            }
        }
    }

    // NCAAFB-DS3-4
    if (dataTypeItem.no === 'NCAAFB-DS3-4') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || (!currentPlayItem.text.includes('1ST down') && !currentPlayItem.text.includes('1ST DOWN')) || currentPlayItem.scoringPlay != false || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone <= 14) {
                status = true;
            }
        }
    }

    // NCAAFB-DS4-1
    if (dataTypeItem.no === 'NCAAFB-DS4-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone < 25) {
                status = true;
            }
        }
    }

    // NCAAFB-DS5
    if (dataTypeItem.no === 'NCAAFB-DS5') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1) {
                status = true;
            }
        }
    }

    // NCAAFB-DS6
    if (dataTypeItem.no === 'NCAAFB-DS6') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            // console.log(currentPlayItem.pointAfterAttempt.value,'pointAfterAttempt')
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || (currentPlayItem.pointAfterAttempt.value != 1 && currentPlayItem.pointAfterAttempt.value != 2)) {
                status = true;
            }
        }
    }

    // NCAAFB-DS6-1
    if (dataTypeItem.no === 'NCAAFB-DS6-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            // console.log(currentPlayItem.pointAfterAttempt.value,'pointAfterAttempt')
            let pointAfterAttempts = [1, 2]
            if (currentPlayItem.scoringPlay != true || pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1) {
                status = true;
            }
        }
    }

    // NCAAFB-DS6-2
    if (dataTypeItem.no === 'NCAAFB-DS6-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != true || parseInt(currentPlayItem.pointAfterAttempt.value) != 0) {
                status = true;
            }
        }
    }

    // NCAAFB-DS7
    if (dataTypeItem.no === 'NCAAFB-DS7') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || parseInt(currentPlayItem.pointAfterAttempt.value) != 0) {
                status = true;
            }
        }
    }

    // NCAAFB-DS7-1
    if (dataTypeItem.no === 'NCAAFB-DS7-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (currentPlayItem.scoringPlay != true || pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1) {
                status = true;
            }
        }
    }

    // NCAAFB-DS7-2
    if (dataTypeItem.no === 'NCAAFB-DS7-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != true || parseInt(currentPlayItem.pointAfterAttempt.value) != 0) {
                status = true;
            }
        }
    }

    // NCAAFB-DS8
    if (dataTypeItem.no === 'NCAAFB-DS8') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.statYardage <= 44) {
                status = true;
            }
        }
    }

    // NCAAFB-DS8-1
    if (dataTypeItem.no === 'NCAAFB-DS8-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.end.team.id != team1Id || currentPlayItem.scoringPlay != true || currentPlayItem.statYardage >= 28) {
                status = true;
            }
        }
    }

    // NCAAFB-DS9
    if (dataTypeItem.no === 'NCAAFB-DS9') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.statYardage >= 45 || currentPlayItem.statYardage <= 27) {
                status = true;
            }
        }
    }

    // NCAAFB-DS10
    if (dataTypeItem.no === 'NCAAFB-DS10') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != false || currentPlayItem.end.yardsToEndzone >= 80) {
                status = true;
            }
        }
    }

    // NCAAFB-DS10-1
    if (dataTypeItem.no === 'NCAAFB-DS10-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1) {
                status = true;
            }
        }
    }

    // NCAAFB-DS10-2
    if (dataTypeItem.no === 'NCAAFB-DS10-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || parseInt(currentPlayItem.pointAfterAttempt.value) != 0) {
                status = true;
            }
        }
    }

    // NCAAFB-DS10-3
    if (dataTypeItem.no === 'NCAAFB-DS10-3') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1) {
                status = true;
            }
        }
    }

    // NCAAFB-DS10-4
    if (dataTypeItem.no === 'NCAAFB-DS10-4') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || parseInt(currentPlayItem.pointAfterAttempt.value) != 0) {
                status = true;
            }
        }
    }

    // NCAAFB-DS10-5
    if (dataTypeItem.no === 'NCAAFB-DS10-5') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS10-6
    if (dataTypeItem.no === 'NCAAFB-DS10-6') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS10-7
    if (dataTypeItem.no === 'NCAAFB-DS10-7') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('touchback') || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.yardsToEndzone >= 51) {
                status = true;
            }
        }
    }

    // NCAAFB-DS11
    if (dataTypeItem.no === 'NCAAFB-DS11') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var endYardLine = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 99, 98, 97, 96, 95, 94, 93, 92, 91, 90]
            if (currentPlayItem.end.team.id != team2Id || endYardLine.indexOf(parseInt(currentPlayItem.end.yardLine)) == -1) {
                status = true;
            }
        }
    }

    // NCAAFB-DS11-1
    if (dataTypeItem.no === 'NCAAFB-DS11-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var endYardLine = [89, 88, 87, 86, 85, 84, 83, 82, 81, 80]
            if (currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id || endYardLine.indexOf(parseInt(currentPlayItem.end.yardsToEndzone)) == -1) {
                status = true;
            }
        }
    }

    // NCAAFB-DS12
    if (dataTypeItem.no === 'NCAAFB-DS12') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS12-1
    if (dataTypeItem.no === 'NCAAFB-DS12-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.scoringType === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) != -1 || currentPlayItem.scoringType.name != 'touchdown' || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS13
    if (dataTypeItem.no === 'NCAAFB-DS13') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play')) {
                status = true;
            }
        }
    }

    // NCAAFB-DS13-1
    if (dataTypeItem.no === 'NCAAFB-DS13-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let startDowns = [1, 2, 3, 4]
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.text.toLowerCase().includes('sacked') || currentPlayItem.text.toLowerCase().includes('knee') || currentPlayItem.scoringPlay != false || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team2Id || currentPlayItem.statYardage >= 0) {
                status = true;
            }
        }
    }

    // NCAAFB-DS13-1-1
    if (dataTypeItem.no === 'NCAAFB-DS13-1-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let startDowns = [1, 2, 3, 4]
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.text.toLowerCase().includes('sacked') || currentPlayItem.text.toLowerCase().includes('knee') || currentPlayItem.text.toLowerCase().includes('loss') || currentPlayItem.scoringPlay != false || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team2Id || (currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone >= 0 && currentPlayItem.statYardage >= 0)) {
                status = true;
            }
        }
    }

    // NCAAFB-DS13-2
    if (dataTypeItem.no === 'NCAAFB-DS13-2') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.text.toLowerCase().includes('sacked') || currentPlayItem.text.toLowerCase().includes('knee') || currentPlayItem.scoringPlay != false || parseInt(currentPlayItem.start.down) != 4 || currentPlayItem.end.team.id != team1Id || currentPlayItem.statYardage >= 0) {
                status = true;
            }
        }
    }

    // NCAAFB-DS13-2-2
    if (dataTypeItem.no === 'NCAAFB-DS13-2-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            let startDowns = [4]
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.text.toLowerCase().includes('sacked') || currentPlayItem.text.toLowerCase().includes('knee') || currentPlayItem.text.toLowerCase().includes('loss') || currentPlayItem.scoringPlay != false || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id || currentPlayItem.start.yardsToEndzone - currentPlayItem.end.yardsToEndzone >= 0) {
                status = true;
            }
        }
    }

    // NCAAFB-DS14
    if (dataTypeItem.no === 'NCAAFB-DS14') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team1Id || currentPlayItem.offensivePlays == 3) {
                status = true;
            }
        }
    }


    // NCAAFB-DS14-1
    if (dataTypeItem.no === 'NCAAFB-DS14-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.end.team.id != team1Id || currentPlayItem.offensivePlays != 3) {
                status = true;
            }
        }
    }

    // NCAAFB-DS14-2
    if (dataTypeItem.no === 'NCAAFB-DS14-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.text.toLowerCase().includes('touchback') || currentPlayItem.end.team.id != team1Id || currentPlayItem.end.yardsToEndzone >= 51) {
                status = true;
            }
        }
    }

    // NCAAFB-DS15
    if (dataTypeItem.no === 'NCAAFB-DS15') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay == true) {
                status = true;
            }
        }
    }

    // NCAAFB-DS16
    if (dataTypeItem.no === 'NCAAFB-DS16') {
        if (currentPlayItem.text === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.scoringPlay != true || currentPlayItem.pointAfterAttempt.value != 1 || currentPlayItem.pointAfterAttempt.value != 2) {
                status = true;
            }
        }
    }

    // NCAAFB-DS16-1
    if (dataTypeItem.no === 'NCAAFB-DS16-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            let pointAfterAttempts = [1, 2]
            if (currentPlayItem.type.id == 52 || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || currentPlayItem.scoringType.name != 'touchdown' || pointAfterAttempts.indexOf(parseInt(currentPlayItem.pointAfterAttempt.value)) == -1) {
                status = true;
            }
        }
    }

    // NCAAFB-DS17-1
    if (dataTypeItem.no === 'NCAAFB-DS17-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined || currentPlayItem.pointAfterAttempt === undefined) {
            status = true;
        } else {
            if (currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team1Id || currentPlayItem.scoringType.name != 'touchdown' || parseInt(currentPlayItem.pointAfterAttempt.value) != 0) {
                status = true;
            }
        }
    }

    // NCAAFB-18
    if (dataTypeItem.no === 'NCAAFB-18') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play')) {
                status = true;
            }
        }
    }

    // NCAAFB-DS19
    if (dataTypeItem.no === 'NCAAFB-DS19') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team2Id || currentPlayItem.statYardage <= 27) {
                status = true;
            }
        }
    }

    // NCAAFB-DS19-1
    if (dataTypeItem.no === 'NCAAFB-DS19-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.toLowerCase().includes('no play') || currentPlayItem.scoringPlay != true || currentPlayItem.end.team.id != team2Id || currentPlayItem.statYardage > 27) {
                status = true;
            }
        }
    }

    // NCAAFB-DS20
    if (dataTypeItem.no === 'NCAAFB-DS20') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1) {
                status = true;
            }
        }
    }

    // NCAAFB-DS21-1
    if (dataTypeItem.no === 'NCAAFB-DS21-1') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if ((!currentPlayItem.text.includes('1ST down') && !currentPlayItem.text.includes('1ST DOWN')) || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS21-2
    if (dataTypeItem.no === 'NCAAFB-DS21-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if ((!currentPlayItem.text.includes('1ST down') && !currentPlayItem.text.includes('1ST DOWN')) || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS21-3
    if (dataTypeItem.no === 'NCAAFB-DS21-3') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if ((!currentPlayItem.text.includes('1ST down') && !currentPlayItem.text.includes('1ST DOWN')) || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS24-2
    if (dataTypeItem.no === 'NCAAFB-DS24-2') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.includes('1ST Down') || currentPlayItem.text.includes('1ST DOWN') || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.start.down != 4 || currentPlayItem.scoringPlay != false || currentPlayItem.end.team.id != team2Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS24-3
    if (dataTypeItem.no === 'NCAAFB-DS24-3') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.includes('1ST Down') || currentPlayItem.text.includes('1ST DOWN') || dataTypeItem.matchList.indexOf(parseInt(currentPlayItem.type.id)) == -1 || currentPlayItem.start.down != 4 || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    // NCAAFB-DS27
    if (dataTypeItem.no === 'NCAAFB-DS27') {
        if (currentPlayItem.text === undefined || currentPlayItem.end === undefined || currentPlayItem.end.team === undefined) {
            status = true;
        } else {
            var startDowns = [1, 2, 3, 4]
            if (currentPlayItem.scoringPlay != false || startDowns.indexOf(parseInt(currentPlayItem.start.down)) == -1 || currentPlayItem.end.team.id != team1Id) {
                status = true;
            }
        }
    }

    return status;
}

export const checkSoccerFunc = (dataTypeItem, currentPlayItem, prevPlayItem, team1Id, team2Id, team1Name, team2Name, team1Abbre, team2Abbre, matchTeamId) => {
    let status = false;
    let team1Score, team2Score;
    // SOCCER-DS7
    if (dataTypeItem.no === 'SOCCER-DS7') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('Foul by') === -1) {
                status = true;
            }
        }
    }

    // SOCCER-DS8
    if (dataTypeItem.no === 'SOCCER-DS8') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('Foul by') === -1) {
                status = true;
            }
        }
    }

    // SOCCER-DS9
    if (dataTypeItem.no === 'SOCCER-DS9') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            // console.log(currentPlayItem.sequence, currentPlayItem.text, 'SOCCER-DS9-description')
            if (currentPlayItem.text.indexOf('Goal!') === -1) {
                status = true;
            } else {
                let team1NameIdx = currentPlayItem.text.indexOf(team1Name);
                let team2NameIdx = currentPlayItem.text.indexOf(team2Name);

                if (team1NameIdx == -1) team1NameIdx = currentPlayItem.text.indexOf(team1Name);
                if (team2NameIdx == -1) team2NameIdx = currentPlayItem.text.indexOf(team2Name);

                // console.log(team1NameIdx, team2NameIdx, team2Name.replace('&', 'and'), 'get Score')
                if (team1NameIdx !== -1 && team2NameIdx !== -1) {
                    // console.log(parseInt(currentPlayItem.text.slice(team1NameIdx + team1Name.length + 1, team1NameIdx + team1Name.length + 3).trim()), 'team1Score')
                    // console.log(parseInt(currentPlayItem.text.slice(team2NameIdx + team2Name.length + 1, team2NameIdx + team2Name.length + 3).trim()), 'team2Score')
                    team1Score = parseInt(currentPlayItem.text.slice(team1NameIdx + team1Name.length + 1, team1NameIdx + team1Name.length + 3).trim());
                    team2Score = parseInt(currentPlayItem.text.slice(team2NameIdx + team2Name.length + 1, team2NameIdx + team2Name.length + 3).trim())
                }
            }

            if (currentPlayItem.text.indexOf('OVERTURNED') !== -1) {
                status = true;
            }
        }
    }

    // SOCCER-DS10
    if (dataTypeItem.no === 'SOCCER-DS10') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('Goal!') === -1) {
                status = true;
            }

            if (currentPlayItem.text.indexOf('OVERTURNED') !== -1) {
                status = true;
            }
        }
    }

    // SOCCER-DS11
    if (dataTypeItem.no === 'SOCCER-DS11') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('Attempt saved') === -1 || (!currentPlayItem.text.toLowerCase().includes(team1Name.toLowerCase()) && !currentPlayItem.text.toLowerCase().includes(team1Abbre.toLowerCase()))) {
                status = true;
            }
        }
    }

    // SOCCER-DS12
    if (dataTypeItem.no === 'SOCCER-DS12') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('Attempt saved') === -1 || (!currentPlayItem.text.toLowerCase().includes(team2Name.toLowerCase()) && !currentPlayItem.text.toLowerCase().includes(team2Abbre.toLowerCase()))) {
                status = true;
            }
        }
    }

    // SOCCER-DS14
    if (dataTypeItem.no === 'SOCCER-DS14') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('Corner,') === -1 || (!currentPlayItem.text.toLowerCase().includes(team1Name.toLowerCase()) && !currentPlayItem.text.toLowerCase().includes(team1Abbre.toLowerCase()))) {
                status = true;
            }
        }
    }

    // SOCCER-DS15
    if (dataTypeItem.no === 'SOCCER-DS15') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('Corner,') === -1 || (!currentPlayItem.text.toLowerCase().includes(team2Name.toLowerCase()) && !currentPlayItem.text.toLowerCase().includes(team2Abbre.toLowerCase()))) {
                status = true;
            }
        }
    }

    // SOCCER-DS17
    if (dataTypeItem.no === 'SOCCER-DS17') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('OVERTURNED') === -1) {
                status = true;
            }
        }
    }

    // SOCCER-DS24
    if (dataTypeItem.no === 'SOCCER-DS24') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('Own Goal') === -1) {
                status = true;
            }
        }
    }

    // SOCCER-DS25
    if (dataTypeItem.no === 'SOCCER-DS25') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('Own Goal') === -1 || currentPlayItem.text.indexOf('OVERTURNED') !== -1) {
                status = true;
            }
        }
    }

    // SOCCER-DS27-1
    if (dataTypeItem.no === 'SOCCER-DS27-1') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('Delay in match') === -1) {
                status = true;
            }
        }
    }

    // SOCCER-DS27-2
    if (dataTypeItem.no === 'SOCCER-DS27-2') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('Delay over.') === -1) {
                status = true;
            }
        }
    }

    // SOCCER-DS28-1
    if (dataTypeItem.no === 'SOCCER-DS28-1') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('First Half begins.') === -1) {
                status = true;
            }
        }
    }

    // SOCCER-DS28-2
    if (dataTypeItem.no === 'SOCCER-DS28-2') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('Second Half begins') === -1) {
                status = true;
            }
        }
    }

    // SOCCER-DS28-3
    if (dataTypeItem.no === 'SOCCER-DS28-3') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('First Half ends,') === -1) {
                status = true;
            }
        }
    }

    // SOCCER-DS28-4
    if (dataTypeItem.no === 'SOCCER-DS28-4') {
        if (currentPlayItem.text === undefined) {
            status = true;
        } else {
            if (currentPlayItem.text.indexOf('Match ends,') === -1) {
                status = true;
            }
        }
    }

    // Compare TeamId
    if (dataTypeItem.teamId !== -1) {
        if (currentPlayItem.play === undefined || currentPlayItem.play === undefined) {
            status = true;
        } else {
            if (currentPlayItem.play.team) {
                if (dataTypeItem.teamId) {
                    if (currentPlayItem.play.team.displayName != team2Name) {
                        status = true;
                    }
                } else {
                    if (currentPlayItem.play.team.displayName != team1Name) {
                        status = true;
                    }
                }
            }
        }
    }

    // Compare TypeId
    if (dataTypeItem.typeId) {
        if (currentPlayItem.play === undefined) {
            status = true;
        } else {
            if (dataTypeItem.typeId != currentPlayItem.play.type.id) {
                status = true;
            }
        }

    }

    if (dataTypeItem.scoreValue !== -1) {
        // if(dataTypeItem.scoreValue != currentPlayItem.play.score){
        //     status = true;
        // }
    }

    return status;
}
