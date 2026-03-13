import { useEffect, useRef, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatCard.css';

function AnimatedNumber({ value }) {
    const [displayed, setDisplayed] = useState(0);
    const num = parseFloat(String(value).replace(/,/g, ''));
    const isNum = !isNaN(num);
    const ref = useRef();
    const animated = useRef(false);

    useEffect(() => {
        if (!isNum) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !animated.current) {
                animated.current = true;
                const start = performance.now();
                const dur = 1200;
                const tick = (now) => {
                    const p = Math.min((now - start) / dur, 1);
                    const ease = 1 - Math.pow(1 - p, 3);
                    setDisplayed(Math.floor(ease * num));
                    if (p < 1) requestAnimationFrame(tick);
                    else setDisplayed(num);
                };
                requestAnimationFrame(tick);
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [num, isNum]);

    if (!isNum) return <span ref={ref}>{value}</span>;
    return <span ref={ref}>{Number.isInteger(num) ? displayed.toLocaleString() : displayed}</span>;
}

const colorMap = {
    primary: { accent: '#22c55e', glow: 'rgba(34,197,94,0.15)', icon: 'rgba(34,197,94,0.12)', iconBorder: 'rgba(34,197,94,0.25)' },
    accent: { accent: '#f59e0b', glow: 'rgba(245,158,11,0.15)', icon: 'rgba(245,158,11,0.12)', iconBorder: 'rgba(245,158,11,0.25)' },
    info: { accent: '#3b82f6', glow: 'rgba(59,130,246,0.15)', icon: 'rgba(59,130,246,0.12)', iconBorder: 'rgba(59,130,246,0.25)' },
    danger: { accent: '#ef4444', glow: 'rgba(239,68,68,0.15)', icon: 'rgba(239,68,68,0.12)', iconBorder: 'rgba(239,68,68,0.25)' },
    success: { accent: '#10b981', glow: 'rgba(16,185,129,0.15)', icon: 'rgba(16,185,129,0.12)', iconBorder: 'rgba(16,185,129,0.25)' },
};

const StatCard = ({ title, value, unit, trend, trendLabel, icon: Icon, color = 'primary' }) => {
    const [hovered, setHovered] = useState(false);
    const c = colorMap[color] || colorMap.primary;
    const isPositive = trend && (trend.startsWith('+') || (!trend.startsWith('-') && trend !== '0'));

    return (
        <div
            className="stat-card-3d"
            style={{ '--sc-accent': c.accent, '--sc-glow': c.glow }}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            {/* Top line accent */}
            <div className="sc3-top-bar" />

            <div className="sc3-header">
                <span className="sc3-title">{title}</span>
                {Icon && (
                    <div className="sc3-icon" style={{ background: c.icon, border: `1px solid ${c.iconBorder}`, color: c.accent }}>
                        <Icon size={18} />
                    </div>
                )}
            </div>

            <div className="sc3-value">
                <AnimatedNumber value={value} />
                {unit && <span className="sc3-unit">{unit}</span>}
            </div>

            {trend && (
                <div className={`sc3-trend ${isPositive ? 'up' : 'down'}`}>
                    {isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                    <span>{trend}</span>
                    {trendLabel && <span className="sc3-trend-label">{trendLabel}</span>}
                </div>
            )}

            {/* Hover glow */}
            <div className="sc3-glow" style={{ opacity: hovered ? 1 : 0 }} />
        </div>
    );
};

export default StatCard;
