import { useState } from 'react';
import { Search, ChevronUp, ChevronDown } from 'lucide-react';
import './DataTable.css';

const DataTable = ({ columns, data, searchable = true, searchPlaceholder = 'Search...' }) => {
    const [search, setSearch] = useState('');
    const [sortKey, setSortKey] = useState(null);
    const [sortDir, setSortDir] = useState('asc');

    const handleSort = (key) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
    };

    const filteredData = data.filter((row) =>
        columns.some((col) => {
            const value = col.accessor ? row[col.accessor] : '';
            return String(value).toLowerCase().includes(search.toLowerCase());
        })
    );

    const sortedData = sortKey
        ? [...filteredData].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (typeof aVal === 'number') {
                return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
            }
            return sortDir === 'asc'
                ? String(aVal).localeCompare(String(bVal))
                : String(bVal).localeCompare(String(aVal));
        })
        : filteredData;

    return (
        <div className="data-table-wrapper">
            {searchable && (
                <div className="data-table-search">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder={searchPlaceholder}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            )}
            <div className="data-table-scroll">
                <table className="data-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.accessor || col.header}
                                    onClick={() => col.accessor && handleSort(col.accessor)}
                                    className={col.accessor ? 'sortable' : ''}
                                >
                                    <div className="th-content">
                                        {col.header}
                                        {sortKey === col.accessor && (
                                            sortDir === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                                        )}
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="table-empty">
                                    No data found
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((row, i) => (
                                <tr key={row._id || i}>
                                    {columns.map((col) => (
                                        <td key={col.accessor || col.header}>
                                            {col.render ? col.render(row) : row[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;
