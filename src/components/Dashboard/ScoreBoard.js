import React, { useEffect, useState } from "react";
import axios from "axios";

import { URL } from '../../const.js'

// const TABLE_HEADER = [
//     {
//         label: 'Time'
//     },
//     {
//         label: 'Name'
//     }
// ]

function ScoreBoard(props) {
    const [data, setData] = useState();

    useEffect(() => {
        axios.get(URL.BASKETBALL, {
            params: {
                event: 401584705
            }
        }).then((response) => {
            console.log(response.data)
            setData(response.data)
            console.log(data)
        });
    }, [])

    return(<div>admin</div>)
}

export default ScoreBoard;