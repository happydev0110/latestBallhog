import React from "react";

function TableComponent(props) {

    return (
        <table className="table">
            <thead className="table-dark">
                <tr>
                    {
                        props.header.map((item, index) => {
                            return (
                                <th key={index}>{item.label}</th>
                            )
                        })
                    }
                </tr>
            </thead>
            <tbody>
                <tr>
                    {
                        props.list && props.list.map((item, index) => {
                            return (
                                <td key={index}>{item.value}</td>
                                // <th key={index}>{item.label}</th>
                            )
                        })
                    }
                </tr>
            </tbody>
        </table>
    );
}

export default TableComponent;