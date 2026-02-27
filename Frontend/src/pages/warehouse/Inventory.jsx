import { useState } from 'react';
import { Plus, Filter } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { mockInventory } from '../../data/mockData';
import './Dashboard.css';

const categories = ['All', 'Grains', 'Oilseeds', 'Fruits', 'Vegetables', 'Fibers'];
const statuses = ['All', 'Good', 'Warning', 'Critical'];

const columns = [
    { header: 'Item Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Location', accessor: 'location' },
    { header: 'Quantity', accessor: 'quantity', render: (row) => `${row.quantity.toLocaleString()} ${row.unit}` },
    {
        header: 'Quality',
        accessor: 'qualityStatus',
        render: (row) => (
            <span className={`badge badge-${row.qualityStatus === 'Good' ? 'success' : row.qualityStatus === 'Warning' ? 'warning' : 'danger'}`}>
                {row.qualityStatus}
            </span>
        ),
    },
    {
        header: 'Last Checked',
        accessor: 'lastChecked',
        render: (row) => new Date(row.lastChecked).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    },
];

const Inventory = () => {
    const [category, setCategory] = useState('All');
    const [status, setStatus] = useState('All');
    const [showModal, setShowModal] = useState(false);

    const filtered = mockInventory.filter((item) => {
        if (category !== 'All' && item.category !== category) return false;
        if (status !== 'All' && item.qualityStatus !== status) return false;
        return true;
    });

    return (
        <div className="dashboard-page">
            <div className="flex-between">
                <div className="dashboard-page-header">
                    <h1>Inventory Management</h1>
                    <p>Track and manage all warehouse assets</p>
                </div>
                <div className="page-actions">
                    <div className="filter-group">
                        <Filter size={16} />
                        <select className="filter-select" value={category} onChange={(e) => setCategory(e.target.value)}>
                            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <select className="filter-select" value={status} onChange={(e) => setStatus(e.target.value)}>
                            {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                        <Plus size={18} /> Add Asset
                    </button>
                </div>
            </div>

            <DataTable columns={columns} data={filtered} searchPlaceholder="Search inventory..." />

            {/* Add Asset Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h2>Add New Asset</h2>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>Enter the details for the new inventory item</p>
                        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); setShowModal(false); }}>
                            <div className="form-group">
                                <label>Item Name</label>
                                <div className="input-wrapper"><input type="text" placeholder="e.g. Organic Wheat" required /></div>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select className="filter-select" style={{ width: '100%', padding: '12px' }}>
                                    {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <div className="input-wrapper"><input type="text" placeholder="e.g. Silo A" required /></div>
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <div className="input-wrapper"><input type="number" placeholder="e.g. 500" required /></div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Add Asset</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
