import { CheckCircle2, Droplets, Wheat, Award } from 'lucide-react';
import { mockConsumerData } from '../../data/mockData';
import '../warehouse/Dashboard.css';

const gradeColors = {
    'A+': 'badge-success',
    'A': 'badge-success',
    'B+': 'badge-info',
    'B': 'badge-info',
    'C': 'badge-warning',
};

const Quality = () => {
    const { qualityReports } = mockConsumerData;

    return (
        <div className="dashboard-page">
            <div className="dashboard-page-header">
                <h1>Quality Reports</h1>
                <p>Inspection results and quality grades for your stored crops</p>
            </div>

            <div className="grid grid-3">
                {qualityReports.map((r) => (
                    <div key={r._id} className="card quality-card">
                        <div className="quality-header">
                            <div className="flex gap-sm">
                                <Wheat size={18} style={{ color: 'var(--color-primary)' }} />
                                <span style={{ fontWeight: 700 }}>{r.item}</span>
                            </div>
                            <span className={`badge ${gradeColors[r.grade]}`}>Grade {r.grade}</span>
                        </div>
                        <div className="quality-batch">Batch: {r.batch}</div>
                        <div className="quality-metrics">
                            <div className="quality-metric">
                                <Droplets size={16} />
                                <div>
                                    <div className="qm-value">{r.moistureContent}%</div>
                                    <div className="qm-label">Moisture Content</div>
                                </div>
                            </div>
                            <div className="quality-metric">
                                <Award size={16} />
                                <div>
                                    <div className="qm-value">{r.proteinLevel}%</div>
                                    <div className="qm-label">Protein Level</div>
                                </div>
                            </div>
                        </div>
                        <div className="quality-footer">
                            <div className="flex gap-sm" style={{ color: 'var(--color-success)' }}>
                                <CheckCircle2 size={14} />
                                <span style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>{r.status.toUpperCase()}</span>
                            </div>
                            <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>
                                {new Date(r.inspectionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Quality;
