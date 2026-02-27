import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatCard.css';

const StatCard = ({ title, value, unit, trend, trendLabel, icon: Icon, color = 'primary' }) => {
    const isPositive = trend && (trend.startsWith('+') || !trend.startsWith('-'));
    const isNeutral = !trend;

    return (
        <div className={`stat-card stat-card-${color}`}>
            <div className="stat-card-header">
                <span className="stat-card-title">{title}</span>
                {Icon && (
                    <div className={`stat-card-icon stat-icon-${color}`}>
                        <Icon size={20} />
                    </div>
                )}
            </div>
            <div className="stat-card-value">
                {value}
                {unit && <span className="stat-card-unit">{unit}</span>}
            </div>
            {!isNeutral && (
                <div className={`stat-card-trend ${isPositive ? 'trend-up' : 'trend-down'}`}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    <span>{trend}</span>
                    {trendLabel && <span className="trend-label">{trendLabel}</span>}
                </div>
            )}
        </div>
    );
};

export default StatCard;
