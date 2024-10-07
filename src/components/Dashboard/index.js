import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { URL } from '../../const.js';

import Filter from '../../layouts/Filter';
import ScoreBoard from './ScoreBoard';

function App() {
    const [eventList, setEvenList] = useState([]);

    useEffect(() => {
        axios.get(URL.EVENT).then((response) => {
            setEvenList(response.data)
            // console.log("event list", response.data)
            // console.log('App render')
        });
    }, [])

    return (
        <>
            <div className='my-3'>
                <div className='row'>
                    <div className='col-6'>
                        <Filter label='Event Name:'
                            list={eventList.events ? eventList.events : []}
                        />
                    </div>
                    <div className='col-6'>
                        {/* <Filter label='Refresh Frequency:' /> */}
                    </div>
                </div>
            </div>
            <ScoreBoard />
        </>
    );
}

export default App;
