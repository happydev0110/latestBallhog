import React from 'react';
import { useTable } from 'react-table';

const DataTable = ({ columns, data, IndexCell }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data });

    return (
        <table className='table table-bordered table-striped' {...getTableProps()}>
            <thead className='table-dark'>
                {headerGroups.map((headerGroup, index) => (
                    <tr key={index} {...headerGroup.getHeaderGroupProps()}>
                        {IndexCell && <th>No</th>}
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map((row, index) => {
                    prepareRow(row);
                    return (
                        <tr key={index} {...row.getRowProps()}>
                            {IndexCell && <td>{index + 1}</td>}
                            {row.cells.map(cell => (
                                <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                            ))}
                        </tr>
                    );
                })}
                {
                    rows.length === 0 && <tr><td colSpan={columns.length+1}>No results</td></tr>
                }
            </tbody>
        </table>
    );
};

export default DataTable;