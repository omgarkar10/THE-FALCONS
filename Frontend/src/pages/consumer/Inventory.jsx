import DataTable from '../../components/common/DataTable';
import { mockConsumerData } from '../../data/mockData';
import '../warehouse/Dashboard.css';

const columns = [
    { header: 'Item', accessor: 'name' },
    { header: 'Location', accessor: 'location' },
    { header: 'Quantity', accessor: 'quantity', render: (row) => `${row.quantity} tons` },
    {
        header: 'Quality',
        accessor: 'quality',
        render: (row) => (
            <span className={`badge ${row.quality === 'Premium' ? 'badge-success' : 'badge-info'}`}>
                {row.quality}
            </span>
        ),
    },
    { header: 'Storage Cost', accessor: 'storageCost', render: (row) => `₹${row.storageCost}/mo` },
    {
        header: 'Stored Since',
        accessor: 'storedSince',
        render: (row) => new Date(row.storedSince).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    },
];

const ConsumerInventory = () => {
    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>My Stock</h1>
                <p>Track your stored crops and inventory</p>
            </div>
            <DataTable columns={columns} data={mockConsumerData.myStock} searchPlaceholder="Search my stock..." />
        </div>
    );
};

export default ConsumerInventory;
