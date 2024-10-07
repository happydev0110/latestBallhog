import React, { useEffect, useState } from 'react';
import defaultNHLLogo from '../../assets/images/nhl_logo.png';

import default_NBA_Logo from '../../assets/images/nba-logo.png';
import default_MLB_Logo from '../../assets/images/mlb_logo.png';
import default_MLS_Logo from '../../assets/images/mls_logo.png';
import default_nfl_Logo from '../../assets/images/nfl_logo.png';
import default_ncaa_fb_Logo from '../../assets/images/ncaa_fb_logo.png';
// import { TEAM_LIST } from "../../const";

const Logo = {
    NBA: default_NBA_Logo,
    NBA2: default_NBA_Logo,
    NHL: defaultNHLLogo,
    NHL2: defaultNHLLogo,
    NCAA: defaultNHLLogo,
    SOCCER: default_MLS_Logo,
    MLB: default_MLB_Logo,
    NFL: default_nfl_Logo,
    NCAAFB: default_ncaa_fb_Logo
}

export default function ScoreBoard(props) {
    const { tabStatus, eventId, team1Idx, playList, awayScore, homeScore, time, tableScore, selTblIdx, description, increaseAmt, selTeamIdx, selTextIdx, historyList, sportCategory, player1Name, player2Name, player3Name, player4Name, selectedTeam1s, handlePlayName, handlePlayerTeam1s } = props;

    const [show0, setShow0] = useState(false);
    const [show1, setShow1] = useState(false);
    const [show2, setShow2] = useState(false);
    const [show3, setShow3] = useState(false);

    const [team1DropDown1, setTeam1DropDown1] = useState(false);
    const [team1DropDown2, setTeam1DropDown2] = useState(false);
    const [team1DropDown3, setTeam1DropDown3] = useState(false);
    const [team1DropDown4, setTeam1DropDown4] = useState(false);

    useEffect(() => {
        handleTeamShown(selTblIdx)
    }, [])

    const handleTeamShown = (index) => {
        switch (index) {
            case 0:
                setShow0(!show0)
                break;
            case 1:
                setShow1(!show1)
                break;
            case 2:
                setShow2(!show2)
                break;
            case 3:
                setShow3(!show3)
                break;
            default:
                break;
        }
    }

    const showTeamDropDown = (index) => {
        switch (index) {
            case 1:
                setTeam1DropDown1(!team1DropDown1)
                break;
            case 2:
                setTeam1DropDown2(!team1DropDown2)
                break;
            case 3:
                setTeam1DropDown3(!team1DropDown3)
                break;
            case 4:
                setTeam1DropDown4(!team1DropDown4)
                break;
            default:
                break;
        }
    }

    return (
        <>
            {
                !tabStatus && <>
                    {/* Team Section */}
                    <div className='row pb-3'>
                        <div className='col-md-12'>
                            <div className={selTblIdx == 0 ? 'border border-danger border-3 p-3' : 'border p-3'} >
                                <div className='float-left text-center row mb-3' >
                                    <div className='col'>
                                        <input type='text'
                                            value={player1Name}
                                            onChange={(evt) => {
                                                handlePlayName(evt.target.value, 1)
                                            }}
                                            className='border-0'
                                            style={{ width: 85 }}
                                        />
                                        <p className='d-inline-block pl-2' style={{ fontSize: 18 }}>{tableScore[0]}</p>
                                    </div>
                                    <div className='col float-left d-flex'>
                                        <div className='d-inline-block px-2'>
                                            {
                                                eventId != -1 && selectedTeam1s[0] != -1 &&
                                                <>
                                                    <div className='d-inline-block' onClick={() => { showTeamDropDown(1) }}>
                                                        <img src={selectedTeam1s[0] != -1 ? playList.boxscore.teams[selectedTeam1s[0]].team.logo : undefined} style={{ width: 30, height: 30 }} />
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        {
                                            team1DropDown1 &&
                                            <select
                                                className="form-select form-select-sm"
                                                style={{ width: 100 }}
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
                                        }
                                    </div>
                                </div>
                                <div onClick={() => {
                                    handleTeamShown(0)
                                }}>
                                    {
                                        (show0 || selTblIdx == 0) ? historyList[0].map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <div className='d-inline-flex'>
                                                        {
                                                            // selTeamIdx != -1 &&
                                                            <img className='d-inline-block' src={item.teamIdx !== -1 ? playList.boxscore.teams[item.teamIdx].team.logo : Logo[sportCategory]} style={{ width: 30, height: 30 }} />
                                                        }
                                                        <p className='d-inline-block' style={{ paddingLeft: 10 }}>{item.description}
                                                            {item.increase != 0 && <b className='text-danger'>{" " + item.increase + " (" + item.score + ") " + item.time}</b>}
                                                        </p>
                                                    </div><br />
                                                </div>
                                            )
                                        }) : historyList[0].slice(-1).map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <div className='d-inline-flex'>
                                                        {
                                                            // selTeamIdx != -1 &&
                                                            <img className='d-inline-block' src={item.teamIdx !== -1 ? playList.boxscore.teams[item.teamIdx].team.logo : Logo[sportCategory]} style={{ width: 30, height: 30 }} />
                                                        }
                                                        <p className='d-inline-block' style={{ paddingLeft: 10 }}>{item.description}
                                                            {item.increase != 0 && <b className='text-danger'>{" " + item.increase + " (" + item.score + ") " + item.time}</b>}
                                                        </p>
                                                    </div><br />
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        !show0 && <h5>...</h5>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row pb-3'>
                        <div className='col-md-12'>
                            <div className={selTblIdx == 1 ? 'border border-danger border-3 p-3' : 'border p-3'}>
                                <div className='float-left text-center row mb-3' >
                                    <div className='col'>
                                        <input type='text'
                                            value={player2Name}
                                            onChange={(evt) => {
                                                handlePlayName(evt.target.value, 2)
                                            }}
                                            className='border-0'
                                            style={{ width: 85 }}
                                        />
                                        <p className='d-inline-block pl-2' style={{ fontSize: 18 }}>{tableScore[1]}</p>
                                    </div>
                                    <div className='col float-left d-flex'>
                                        <div className='d-inline-block px-2'>
                                            {
                                                eventId != -1 && selectedTeam1s[1] != -1 &&
                                                <>
                                                    <div className='d-inline-block' onClick={() => { showTeamDropDown(2) }}>
                                                        <img src={selectedTeam1s[1] != -1 ? playList.boxscore.teams[selectedTeam1s[1]].team.logo : undefined} style={{ width: 30, height: 30 }} />
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        {
                                            team1DropDown2 &&
                                            <select
                                                className="form-select form-select-sm"
                                                style={{ width: 100 }}
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
                                        }
                                    </div>
                                    {/* <h5 className='d-inline-block pb-3' style={{ paddingRight: 45 }}>{player2Name}</h5> */}

                                    {/* <p className='d-inline-block float-right text-primary'>{show1 ? <h5 className='d-inline-block text-bold text-white bg-primary' style={{ width: 24, height: 20, borderRadius: '50%', paddingBottom: 23, fontSize: 18 }}>+</h5> : <h5 className='d-inline-block text-bold text-white bg-primary' style={{ width: 24, height: 20, borderRadius: '50%', paddingBottom: 23, fontSize: 18 }}>-</h5>}</p> */}
                                </div>
                                <div onClick={() => {
                                    handleTeamShown(1)
                                }}>
                                    {
                                        (show1 || selTblIdx == 1) ? historyList[1].map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <div className='d-inline-flex'>
                                                        {
                                                            // selTeamIdx != -1 &&
                                                            <img className='d-inline-block' src={item.teamIdx !== -1 ? playList.boxscore.teams[item.teamIdx].team.logo : Logo[sportCategory]} style={{ width: 30, height: 30 }} />
                                                        }
                                                        <p className='d-inline-block' style={{ paddingLeft: 10 }}>{item.description}
                                                            {item.increase != 0 && <b className='text-danger'>{" " + item.increase + " (" + item.score + ") " + item.time}</b>}
                                                        </p>
                                                    </div><br />
                                                </div>
                                            )
                                        }) : historyList[1].slice(-1).map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <div className='d-inline-flex'>
                                                        {
                                                            // selTeamIdx != -1 &&
                                                            <img className='d-inline-block' src={item.teamIdx !== -1 ? playList.boxscore.teams[item.teamIdx].team.logo : Logo[sportCategory]} style={{ width: 30, height: 30 }} />
                                                        }
                                                        <p className='d-inline-block' style={{ paddingLeft: 10 }}>{item.description}
                                                            {item.increase != 0 && <b className='text-danger'>{" " + item.increase + " (" + item.score + ") " + item.time}</b>}
                                                        </p>
                                                    </div><br />
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        !show1 && <h5>...</h5>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row pb-3'>
                        <div className='col-md-12'>
                            <div className={selTblIdx == 2 ? 'border border-danger border-3 p-3' : 'border p-3'}>
                                <div className='float-left text-center row mb-3' >
                                    <div className='col'>
                                        <input type='text'
                                            value={player3Name}
                                            onChange={(evt) => {
                                                handlePlayName(evt.target.value, 3)
                                            }}
                                            className='border-0'
                                            style={{ width: 85 }}
                                        />
                                        <p className='d-inline-block pl-2' style={{ fontSize: 18 }}>{tableScore[2]}</p>
                                    </div>
                                    <div className='col float-left d-flex'>
                                        <div className='d-inline-block px-2'>
                                            {
                                                eventId != -1 && selectedTeam1s[2] != -1 &&
                                                <>
                                                    <div className='d-inline-block' onClick={() => { showTeamDropDown(3) }}>
                                                        <img src={selectedTeam1s[2] != -1 ? playList.boxscore.teams[selectedTeam1s[2]].team.logo : undefined} style={{ width: 30, height: 30 }} />
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        {
                                            team1DropDown3 &&
                                            <select
                                                className="form-select form-select-sm"
                                                style={{ width: 100 }}
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
                                        }
                                    </div>
                                    {/* <h5 className='d-inline-block pb-3' style={{ paddingRight: 45 }}>{player3Name}</h5 > */}

                                    {/* <p className='d-inline-block float-right text-primary'>{show2 ? <h5 className='d-inline-block text-bold text-white bg-primary' style={{ width: 24, height: 20, borderRadius: '50%', paddingBottom: 23, fontSize: 18 }}>+</h5> : <h5 className='d-inline-block text-bold text-white bg-primary' style={{ width: 24, height: 20, borderRadius: '50%', paddingBottom: 23, fontSize: 18 }}>-</h5>}</p> */}
                                </div>
                                <div onClick={() => {
                                    handleTeamShown(2)
                                }}>
                                    {
                                        (show2 || selTblIdx == 2) ? historyList[2].map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <div className='d-inline-flex'>
                                                        {
                                                            // selTeamIdx != -1 &&
                                                            <img className='d-inline-block' src={item.teamIdx !== -1 ? playList.boxscore.teams[item.teamIdx].team.logo : Logo[sportCategory]} style={{ width: 30, height: 30 }} />
                                                        }
                                                        <p className='d-inline-block' style={{ paddingLeft: 10 }}>{item.description}
                                                            {item.increase != 0 && <b className='text-danger'>{" " + item.increase + " (" + item.score + ") " + item.time}</b>}
                                                        </p>
                                                    </div><br />
                                                </div>
                                            )
                                        }) : historyList[2].slice(-1).map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <div className='d-inline-flex'>
                                                        {
                                                            // selTeamIdx != -1 &&
                                                            <img className='d-inline-block' src={item.teamIdx !== -1 ? playList.boxscore.teams[item.teamIdx].team.logo : Logo[sportCategory]} style={{ width: 30, height: 30 }} />
                                                        }

                                                        <p className='d-inline-block' style={{ paddingLeft: 10 }}>{item.description}
                                                            {item.increase != 0 && <b className='text-danger'>{" " + item.increase + " (" + item.score + ") " + item.time}</b>}
                                                        </p>
                                                    </div><br />
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        !show2 && <h5>...</h5>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='row pb-3'>
                        <div className='col-md-12'>
                            <div className={selTblIdx == 3 ? 'border border-danger border-3 p-3' : 'border p-3'}>
                                <div className='float-left text-center row mb-3' >
                                    <div className='col'>
                                        <input type='text'
                                            value={player4Name}
                                            onChange={(evt) => {
                                                handlePlayName(evt.target.value, 4)
                                            }}
                                            className='border-0'
                                            style={{ width: 85 }}
                                        />
                                        <p className='d-inline-block pl-2' style={{ fontSize: 18 }}>{tableScore[3]}</p>
                                    </div>
                                    <div className='col float-left d-flex'>
                                        <div className='d-inline-block px-2'>
                                            {
                                                eventId != -1 && selectedTeam1s[3] != -1 &&
                                                <>
                                                    <div className='d-inline-block' onClick={() => { showTeamDropDown(4) }}>
                                                        <img src={selectedTeam1s[3] != -1 ? playList.boxscore.teams[selectedTeam1s[3]].team.logo : undefined} style={{ width: 30, height: 30 }} />
                                                    </div>
                                                </>
                                            }
                                        </div>
                                        {
                                            team1DropDown4 &&
                                            <select
                                                className="form-select form-select-sm"
                                                style={{ width: 100 }}
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
                                        }
                                    </div>
                                    {/* <h5 className='d-inline-block pb-3' style={{ paddingRight: 45 }}>{player4Name}</h5> */}

                                    {/* <p className='d-inline-block float-right text-primary'>{show3 ? <h5 className='d-inline-block text-bold text-white bg-primary' style={{ width: 24, height: 20, borderRadius: '50%', paddingBottom: 23, fontSize: 18 }}>+</h5> : <h5 className='d-inline-block text-bold text-white bg-primary' style={{ width: 24, height: 20, borderRadius: '50%', paddingBottom: 23, fontSize: 18 }}>-</h5>}</p> */}
                                </div>
                                <div onClick={() => {
                                    handleTeamShown(3)
                                }}>
                                    {
                                        (show3 || selTblIdx == 3) ? historyList[3].map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <div key={index} className='d-inline-flex'>
                                                        {
                                                            // selTeamIdx != -1 &&
                                                            <img className='d-inline-block' src={item.teamIdx !== -1 ? playList.boxscore.teams[item.teamIdx].team.logo : Logo[sportCategory]} style={{ width: 30, height: 30 }} />
                                                        }
                                                        <p className='d-inline-block' style={{ paddingLeft: 10 }}>{item.description}
                                                            {item.increase != 0 && <b className='text-danger'>{" " + item.increase + " (" + item.score + ") " + item.time}</b>}
                                                        </p>
                                                    </div><br />
                                                </div>
                                            )
                                        }) : historyList[3].slice(-1).map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <div className='d-inline-flex'>
                                                        {
                                                            // selTeamIdx != -1 &&
                                                            <img className='d-inline-block' src={item.teamIdx !== -1 ? playList.boxscore.teams[item.teamIdx].team.logo : Logo[sportCategory]} style={{ width: 30, height: 30 }} />
                                                        }
                                                        <p className='d-inline-block' style={{ paddingLeft: 10 }}>{item.description}
                                                            {item.increase != 0 && <b className='text-danger'>{" " + item.increase + " (" + item.score + ") " + item.time}</b>}
                                                        </p>
                                                    </div><br />
                                                </div>
                                            )
                                        })
                                    }
                                    {
                                        !show3 && <h5>...</h5>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='text-center mt-3'>
                        <button className='btn btn-primary text-uppercase' style={{backgroundColor: 'red', color: 'white'}} onClick={() => {}}> Scoring Rule</button>
                    </div>
                </>
            }
        </>
    )
}