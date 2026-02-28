import { useState, useEffect } from 'react';
import {
    FileCheck, CheckCircle2, XCircle, Activity,
    Search, Filter, Download, Plus, ArrowRight,
    Beaker, Microscope, ShieldCheck, AlertCircle, RefreshCw
} from 'lucide-react';
import './QualityControl.css';

const mockQualityTests = [
    { id: 'QC-001', batch: 'WH-2026-001', crop: 'Wheat', test: 'Moisture Content', result: '12.5%', threshold: '< 14%', status: 'pass', date: '2026-02-27' },
    { id: 'QC-002', batch: 'WH-2026-001', crop: 'Wheat', test: 'Protein Level', result: '13.2%', threshold: '> 12%', status: 'pass', date: '2026-02-27' },
    { id: 'QC-003', batch: 'RC-2026-012', crop: 'Rice', test: 'Broken Grains', result: '8%', threshold: '< 5%', status: 'fail', date: '2026-02-26' },
    { id: 'QC-004', batch: 'CN-2026-008', crop: 'Corn', test: 'Aflatoxin Level', result: '15ppb', threshold: '< 20ppb', status: 'pass', date: '2026-02-26' },
    { id: 'QC-005', batch: 'BL-2026-005', crop: 'Barley', test: 'Germination Rate', result: '96%', threshold: '> 95%', status: 'pass', date: '2026-02-25' },
    { id: 'QC-006', batch: 'SB-2026-003', crop: 'Soybean', test: 'Oil Content', result: '18.5%', threshold: '> 18%', status: 'pass', date: '2026-02-25' },
    { id: 'QC-007', batch: 'CN-2026-007', crop: 'Corn', test: 'Moisture Content', result: '16.2%', threshold: '< 14%', status: 'fail', date: '2026-02-24' },
    { id: 'QC-008', batch: 'RC-2026-011', crop: 'Rice', test: 'Milling Recovery', result: '68%', threshold: '> 65%', status: 'pass', date: '2026-02-24' },
];

const QualityControl = () => {
    const [tests, setTests] = useState(mockQualityTests);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [animateIn, setAnimateIn] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        setAnimateIn(true);
    }, []);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate API fetch
        setTimeout(() => {
            setIsRefreshing(false);
            setAnimateIn(false);
            setTimeout(() => setAnimateIn(true), 10);
        }, 1500);
    };

    const handleNewTest = () => {
        const newId = `QC-0${tests.length + 1}`;
        const crops = ['Wheat', 'Rice', 'Corn', 'Soybean', 'Barley'];
        const parameters = ['Moisture Content', 'Protein Level', 'Gluten Strength', 'Purity'];

        const newTest = {
            id: newId,
            batch: `BT-2026-${Math.floor(Math.random() * 900) + 100}`,
            crop: crops[Math.floor(Math.random() * crops.length)],
            test: parameters[Math.floor(Math.random() * parameters.length)],
            result: `${(Math.random() * 5 + 10).toFixed(1)}%`,
            threshold: '< 15%',
            status: Math.random() > 0.2 ? 'pass' : 'fail',
            date: new Date().toISOString().split('T')[0]
        };

        setTests([newTest, ...tests]);
    };

    const stats = {
        passed: tests.filter(t => t.status === 'pass').length,
        failed: tests.filter(t => t.status === 'fail').length,
        total: tests.length,
        passRate: Math.round((tests.filter(t => t.status === 'pass').length / tests.length) * 100)
    };

    const filteredTests = tests.filter(test => {
        const matchesSearch = test.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
            test.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || test.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className={`qc-container ${animateIn ? 'fade-in' : ''}`}>
            <header className="qc-header">
                <div className="header-info">
                    <h1>Quality Control</h1>
                    <p>Monitor grain quality tests and compliance standards</p>
                </div>
                <div className="header-actions">
                    <button
                        className={`qc-btn-secondary ${isRefreshing ? 'rotating' : ''}`}
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                    >
                        <RefreshCw size={18} />
                        <span>{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                    </button>
                    <button className="qc-btn-primary" onClick={handleNewTest}>
                        <Plus size={18} />
                        <span>New Test</span>
                    </button>
                </div>
            </header>

            <div className="qc-stats-grid">
                <div className="qc-stat-card pass">
                    <div className="stat-icon">
                        <CheckCircle2 size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Tests Passed</span>
                        <div className="stat-value-group">
                            <span className="stat-value">{stats.passed}</span>
                        </div>
                    </div>
                    <div className="stat-trend positive">
                        <Activity size={14} />
                    </div>
                </div>

                <div className="qc-stat-card fail">
                    <div className="stat-icon">
                        <AlertCircle size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Tests Failed</span>
                        <div className="stat-value-group">
                            <span className="stat-value">{stats.failed}</span>
                        </div>
                    </div>
                </div>

                <div className="qc-stat-card rate">
                    <div className="stat-icon">
                        <ShieldCheck size={24} />
                    </div>
                    <div className="stat-content">
                        <span className="stat-label">Overall Pass Rate</span>
                        <div className="stat-value-group">
                            <span className="stat-value">{stats.passRate}%</span>
                        </div>
                    </div>
                    <div className="stat-progress">
                        <div className="progress-fill" style={{ width: `${stats.passRate}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="qc-content-card">
                <div className="card-toolbar">
                    <div className="toolbar-left">
                        <h3>Recent Quality Tests</h3>
                        <div className="search-box">
                            <Search size={18} />
                            <input
                                type="text"
                                placeholder="Search by Test ID or Batch..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="toolbar-right">
                        <select
                            className="filter-select"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="pass">Passed</option>
                            <option value="fail">Failed</option>
                        </select>
                        <button className="qc-btn-ghost">
                            <Download size={18} />
                            <span>Export Report</span>
                        </button>
                    </div>
                </div>

                <div className="qc-table-wrapper">
                    {isRefreshing && (
                        <div className="refresh-loader-overlay">
                            <div className="loader-spinner"></div>
                            <p>Updating Quality Data...</p>
                        </div>
                    )}
                    <table className="qc-table">
                        <thead>
                            <tr>
                                <th>Test ID</th>
                                <th>Batch</th>
                                <th>Crop</th>
                                <th>Test Parameter</th>
                                <th>Result</th>
                                <th>Threshold</th>
                                <th>Status</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTests.map((test, index) => (
                                <tr key={test.id} style={{ animationDelay: `${index * 50}ms` }} className="qc-table-row">
                                    <td className="font-bold">{test.id}</td>
                                    <td>{test.batch}</td>
                                    <td>
                                        <div className="crop-tag">
                                            {test.crop}
                                        </div>
                                    </td>
                                    <td>{test.test}</td>
                                    <td className="font-bold">{test.result}</td>
                                    <td className="text-secondary">{test.threshold}</td>
                                    <td>
                                        <span className={`status-badge ${test.status}`}>
                                            {test.status === 'pass' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                                            {test.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td>{test.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTests.length === 0 && (
                        <div className="empty-state">
                            <Beaker size={48} />
                            <p>No tests found matching your search</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default QualityControl;
