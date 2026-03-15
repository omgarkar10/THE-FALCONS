import { useState, useEffect } from 'react';
import { Plus, Filter } from 'lucide-react';
import DataTable from '../../components/common/DataTable';
import { useStorage } from '../../context/StorageContext';
import './Dashboard.css';

const categories = ['All', 'Grains', 'Oilseeds', 'Fruits', 'Vegetables', 'Fibers'];
const statuses = ['All', 'Good', 'Warning', 'Critical'];

const columns = [
    { header: 'Item Name', accessor: 'name' },
    { header: 'Category', accessor: 'category' },
    { header: 'Location', accessor: 'location' },
    { header: 'Quantity', accessor: 'quantity', render: (row) => `${row.quantity.toLocaleString()} ${row.unit || 'tons'}` },
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
        header: 'Owner',
        accessor: 'farmerName',
        render: (row) => <span style={{ color: '#22c55e', fontStyle: 'italic' }}>{row.farmerName || 'AgroVault'}</span>
    },
    {
        header: 'Last Checked',
        accessor: 'lastChecked',
        render: (row) => new Date(row.lastChecked).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
    },
];

const Inventory = () => {
    const { warehouseInventory, addStockToFarmer } = useStorage();
    const [inventoryData, setInventoryData] = useState(warehouseInventory);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [category, setCategory] = useState('All');
    const [status, setStatus] = useState('All');

    // Modal & Form State
    const [showModal, setShowModal] = useState(false);
    const [newItemName, setNewItemName] = useState('');
    const [newItemCategory, setNewItemCategory] = useState(categories[1]);
    const [newItemFarmer, setNewItemFarmer] = useState('');
    const [newItemLocation, setNewItemLocation] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        setInventoryData(warehouseInventory);
    }, [warehouseInventory]);

    const handleAddAsset = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const formData = {
                commodity: newItemName,
                category: newItemCategory,
                farmerName: newItemFarmer,
                location: newItemLocation,
                quantity: Number(newItemQuantity),
                unit: 'tons'
            };

            addStockToFarmer(formData);

            // Reset form
            setNewItemName('');
            setNewItemCategory(categories[1]);
            setNewItemFarmer('');
            setNewItemLocation('');
            setNewItemQuantity('');
            setShowModal(false);
        } catch (err) {
            console.error('Error adding asset:', err);
            alert('Failed to add asset. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const filtered = inventoryData.filter((item) => {
        if (category !== 'All' && item.category !== category) return false;
        if (status !== 'All' && item.qualityStatus !== status) return false;
        return true;
    });

    return (
        <div className="dashboard-page reveal-up">
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

            {error ? (
                <div className="error-message">{error}</div>
            ) : loading ? (
                <div>Loading inventory...</div>
            ) : (
                <DataTable columns={columns} data={filtered} searchPlaceholder="Search inventory..." />
            )}

            {/* Add Asset Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => !isSubmitting && setShowModal(false)}>
                    <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                        <h2>Add New Asset</h2>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 'var(--space-lg)' }}>Enter the details for the new inventory item</p>
                        <form className="auth-form" onSubmit={handleAddAsset}>
                            <div className="form-group">
                                <label>Item Name</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="e.g. Organic Wheat"
                                        value={newItemName}
                                        onChange={(e) => setNewItemName(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Farmer Name (Owner)</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="e.g. Niket Farmer"
                                        value={newItemFarmer}
                                        onChange={(e) => setNewItemFarmer(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select
                                    className="filter-select"
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                                    value={newItemCategory}
                                    onChange={(e) => setNewItemCategory(e.target.value)}
                                    disabled={isSubmitting}
                                >
                                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Location</label>
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="e.g. Silo A"
                                        value={newItemLocation}
                                        onChange={(e) => setNewItemLocation(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Quantity</label>
                                <div className="input-wrapper">
                                    <input
                                        type="number"
                                        placeholder="e.g. 500"
                                        value={newItemQuantity}
                                        onChange={(e) => setNewItemQuantity(e.target.value)}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={isSubmitting}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? 'Adding...' : 'Add Asset'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Inventory;
