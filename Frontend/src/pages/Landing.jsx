import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Wheat, BarChart3, Package, Database, Wifi, Truck, FileCheck,
    ArrowRight, Play, CheckCircle2, Shield, Clock, Headphones,
    ChevronDown, Star, Zap, Target, TrendingUp, Thermometer
} from 'lucide-react';
import './Landing.css';

const features = [
    {
        id: 'dashboard',
        icon: BarChart3,
        title: 'Real-Time Dashboard',
        desc: 'Monitor all warehouse operations with interactive KPIs and live charts. Get instant visibility into temperature, humidity, and stock levels.',
        preview: { temp: '22.4', humidity: '64.2', co2: '412' },
    },
    {
        id: 'inventory',
        icon: Package,
        title: 'Inventory Management',
        desc: 'Track every asset in your warehouse. Smart categorization, quality status tracking, and automated low-stock alerts.',
        preview: null,
    },
    {
        id: 'storage',
        icon: Database,
        title: 'Storage Monitoring',
        desc: 'Per-silo environmental tracking with real-time sensor data. Temperature, humidity, and CO2 monitoring at your fingertips.',
        preview: null,
    },
    {
        id: 'iot',
        icon: Wifi,
        title: 'IoT Sensor Network',
        desc: 'Manage hundreds of connected sensors across your facility. Automated calibration and health monitoring.',
        preview: null,
    },
    {
        id: 'logistics',
        icon: Truck,
        title: 'Logistics & Dispatch',
        desc: 'Optimize supply chain operations. Track inbound and outbound shipments with real-time status updates.',
        preview: null,
    },
    {
        id: 'reports',
        icon: FileCheck,
        title: 'Reports & Analytics',
        desc: 'Trend analysis, loss reports, and AI-powered recommendations. Make data-driven decisions with comprehensive insights.',
        preview: null,
    },
];

const useCases = [
    { icon: Wheat, title: 'Grain Storage', desc: 'Maintain optimal conditions for wheat, rice, and corn with precision temperature control and moisture monitoring.' },
    { icon: Thermometer, title: 'Cold Chain', desc: 'End-to-end cold storage management for perishable produce. Real-time alerts for temperature deviations.' },
    { icon: Target, title: 'Precision Farming', desc: 'Data-driven crop storage decisions based on environmental analytics and predictive quality modeling.' },
];

const steps = [
    { num: '01', title: 'Connect Your Warehouse', desc: 'Install IoT sensors and connect your facility to the AgroVault platform in minutes.' },
    { num: '02', title: 'Monitor Everything', desc: 'Get real-time visibility into temperature, humidity, stock levels, and facility health.' },
    { num: '03', title: 'Get Smart Alerts', desc: 'Receive intelligent notifications when conditions deviate from optimal thresholds.' },
    { num: '04', title: 'Act on Insights', desc: 'Make data-driven decisions with AI-powered analytics and actionable recommendations.' },
];

const pricing = [
    {
        name: 'Starter',
        price: '49',
        desc: 'For small facilities',
        features: ['Up to 5 storage units', '10 sensors', 'Basic analytics', 'Email alerts', 'Community support'],
        popular: false,
    },
    {
        name: 'Professional',
        price: '149',
        desc: 'Most popular for growing operations',
        features: ['Up to 25 storage units', '100 sensors', 'Advanced analytics', 'SMS + Email alerts', 'Priority support', 'API access', 'Custom reports'],
        popular: true,
    },
    {
        name: 'Enterprise',
        price: 'Custom',
        desc: 'For large-scale operations',
        features: ['Unlimited storage units', 'Unlimited sensors', 'AI-powered insights', 'All alert channels', 'Dedicated support', 'Full API access', 'White-label option', 'SLA guarantee'],
        popular: false,
    },
];

const testimonials = [
    { name: 'Rajesh Kumar', role: 'Operations Manager, GrainCorp', text: 'AgroVault reduced our spoilage by 40% in the first quarter. The real-time monitoring is a game-changer.', rating: 5 },
    { name: 'Priya Sharma', role: 'Farm Director, GreenHarvest', text: 'The IoT integration was seamless. We now manage 200+ sensors across 3 facilities from a single dashboard.', rating: 5 },
    { name: 'Amit Patel', role: 'Supply Chain Head, AgriFlow', text: 'The consumer portal gives our clients complete visibility into their stock. Transparency builds trust.', rating: 5 },
];

const faqs = [
    { q: 'How quickly can I set up AgroVault?', a: 'Most facilities are fully operational within 48 hours. Our onboarding team guides you through sensor installation and platform configuration.' },
    { q: 'What types of sensors are supported?', a: 'We support temperature, humidity, CO2, moisture, and weight sensors from major manufacturers including Bosch, Honeywell, and custom IoT devices.' },
    { q: 'Is my data secure?', a: 'Absolutely. All data is encrypted in transit and at rest. We are SOC 2 Type II compliant with 99.9% uptime SLA.' },
    { q: 'Can I integrate with existing systems?', a: 'Yes. AgroVault provides REST APIs and webhooks for integration with ERP, accounting, and logistics platforms.' },
];

const Landing = () => {
    const [activeFeature, setActiveFeature] = useState(0);
    const [openFaq, setOpenFaq] = useState(null);

    return (
        <div className="landing">
            {/* Hero */}
            <section className="hero">
                <div className="container">
                    <div className="hero-grid">
                        <div className="hero-content">
                            <div className="hero-badge">
                                <Zap size={16} /> Smart Agricultural Warehouse Management
                            </div>
                            <h1 className="hero-title">
                                Smarter Storage.<br />
                                <span className="text-primary">Fresher Crops.</span><br />
                                <span className="text-accent">Zero Waste.</span>
                            </h1>
                            <p className="hero-desc">
                                The all-in-one platform for monitoring grain storage, tracking crop inventory, managing IoT sensors, and optimizing your entire agricultural supply chain with real-time intelligence.
                            </p>
                            <div className="hero-actions">
                                <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free <ArrowRight size={18} /></Link>
                                <button className="btn btn-secondary btn-lg"><Play size={18} /> See How It Works</button>
                            </div>
                            <div className="hero-trust">
                                <CheckCircle2 size={16} /> Free 14-day trial
                                <CheckCircle2 size={16} /> No credit card
                                <CheckCircle2 size={16} /> Cancel anytime
                                <CheckCircle2 size={16} /> 24/7 support
                            </div>
                        </div>
                        <div className="hero-preview">
                            <div className="preview-browser">
                                <div className="preview-dots">
                                    <span className="dot red" />
                                    <span className="dot yellow" />
                                    <span className="dot green" />
                                    <span className="preview-url">app.agrovault.io/dashboard</span>
                                </div>
                                <div className="preview-content">
                                    <div className="preview-metrics">
                                        <div className="preview-metric active">
                                            <span className="pm-label">Temperature</span>
                                            <span className="pm-value">22.4 <small>°C</small></span>
                                        </div>
                                        <div className="preview-metric">
                                            <span className="pm-label">Humidity</span>
                                            <span className="pm-value">64.2 <small>%</small></span>
                                        </div>
                                        <div className="preview-metric">
                                            <span className="pm-label">CO2 Level</span>
                                            <span className="pm-value">412 <small>ppm</small></span>
                                        </div>
                                    </div>
                                    <div className="preview-chart">
                                        <div className="preview-chart-header">
                                            <span>Temperature Trend</span>
                                            <span className="trend-badge">+0.3</span>
                                        </div>
                                        <div className="preview-bars">
                                            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d, i) => (
                                                <div key={d} className="preview-bar-col">
                                                    <div
                                                        className={`preview-bar ${i === 6 ? 'highlight' : ''}`}
                                                        style={{ height: `${50 + Math.random() * 40}%` }}
                                                    />
                                                    <span>{d}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="preview-status-grid">
                                        {[
                                            { name: 'Silo A · Temp', status: 'Normal', color: 'green' },
                                            { name: 'Silo B · Humid', status: 'Warning', color: 'orange' },
                                            { name: 'Cold Room 1', status: 'Normal', color: 'green' },
                                            { name: 'Loading Dock', status: 'Active', color: 'blue' },
                                        ].map((s) => (
                                            <div key={s.name} className="preview-status-item">
                                                <span className={`status-dot ${s.color}`} />
                                                <div>
                                                    <div className="ps-name">{s.name}</div>
                                                    <div className="ps-status">{s.status}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trusted By */}
            <section className="trusted-section">
                <div className="container">
                    <p className="trusted-label">TRUSTED BY LEADING AGRICULTURAL ORGANIZATIONS</p>
                    <div className="trusted-logos">
                        {['FarmTech', 'SiloPro', 'CropWatch', 'AgriNet', 'GreenField', 'GrainCorp', 'AgriFlow'].map((name) => (
                            <div key={name} className="trusted-logo">
                                <Shield size={16} /> {name}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section section" id="features">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Features</span>
                        <h2>Everything you need to manage your warehouse</h2>
                        <p>From real-time monitoring to predictive analytics, AgroVault provides a complete suite of tools for modern agricultural storage management.</p>
                    </div>
                    <div className="features-grid">
                        <div className="features-tabs">
                            {features.map((f, i) => (
                                <button
                                    key={f.id}
                                    className={`feature-tab ${activeFeature === i ? 'active' : ''}`}
                                    onClick={() => setActiveFeature(i)}
                                >
                                    <f.icon size={20} />
                                    <div>
                                        <div className="feature-tab-title">{f.title}</div>
                                        <div className="feature-tab-desc">{f.desc}</div>
                                    </div>
                                </button>
                            ))}
                        </div>
                        <div className="features-preview">
                            {(() => {
                                const ActiveIcon = features[activeFeature].icon;
                                return (
                                    <div className="feature-preview-card">
                                        <div className="feature-preview-header">
                                            <ActiveIcon size={24} />
                                            <h3>{features[activeFeature].title}</h3>
                                        </div>
                                        <p>{features[activeFeature].desc}</p>
                                        {activeFeature === 0 && (
                                            <div className="feature-demo-metrics">
                                                <div className="fdm-item"><span>Temperature</span><strong>22.4°C</strong></div>
                                                <div className="fdm-item"><span>Humidity</span><strong>64.2%</strong></div>
                                                <div className="fdm-item"><span>CO2</span><strong>412 ppm</strong></div>
                                                <div className="fdm-item"><span>Stock</span><strong>11,160 T</strong></div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}
                        </div>

                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="section" id="use-cases" style={{ background: 'var(--color-bg-secondary)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Use Cases</span>
                        <h2>Built for every agricultural need</h2>
                        <p>Whether you manage grain silos, cold storage, or precision farming operations, AgroVault adapts to your workflow.</p>
                    </div>
                    <div className="grid grid-3">
                        {useCases.map((uc) => (
                            <div key={uc.title} className="card use-case-card">
                                <div className="uc-icon"><uc.icon size={24} /></div>
                                <h3>{uc.title}</h3>
                                <p>{uc.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="section" id="how-it-works">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">How It Works</span>
                        <h2>Get started in 4 simple steps</h2>
                        <p>From installation to insights, AgroVault gets your warehouse operational in record time.</p>
                    </div>
                    <div className="steps-grid">
                        {steps.map((s) => (
                            <div key={s.num} className="step-card">
                                <div className="step-num">{s.num}</div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Impact Stats */}
            <section className="impact-section">
                <div className="container">
                    <div className="impact-grid">
                        {[
                            { value: '10M+', label: 'Tons Tracked' },
                            { value: '99.9%', label: 'Uptime' },
                            { value: '500+', label: 'Warehouses Managed' },
                            { value: '45%', label: 'Less Spoilage' },
                        ].map((s) => (
                            <div key={s.label} className="impact-item">
                                <div className="impact-value">{s.value}</div>
                                <div className="impact-label">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing */}
            <section className="section" id="pricing">
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Pricing</span>
                        <h2>Simple, transparent pricing</h2>
                        <p>Choose the plan that fits your operation. Scale up anytime.</p>
                    </div>
                    <div className="grid grid-3 pricing-grid">
                        {pricing.map((plan) => (
                            <div key={plan.name} className={`card pricing-card ${plan.popular ? 'popular' : ''}`}>
                                {plan.popular && <div className="popular-badge">Most Popular</div>}
                                <h3>{plan.name}</h3>
                                <p className="pricing-desc">{plan.desc}</p>
                                <div className="pricing-price">
                                    {plan.price !== 'Custom' && <span className="price-symbol">$</span>}
                                    <span className="price-value">{plan.price}</span>
                                    {plan.price !== 'Custom' && <span className="price-period">/month</span>}
                                </div>
                                <ul className="pricing-features">
                                    {plan.features.map((f) => (
                                        <li key={f}><CheckCircle2 size={16} /> {f}</li>
                                    ))}
                                </ul>
                                <Link to="/signup" className={`btn ${plan.popular ? 'btn-primary' : 'btn-outline'} btn-lg`} style={{ width: '100%', justifyContent: 'center' }}>
                                    Get Started
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section" id="testimonials" style={{ background: 'var(--color-bg-secondary)' }}>
                <div className="container">
                    <div className="section-header">
                        <span className="section-badge">Testimonials</span>
                        <h2>Trusted by industry leaders</h2>
                    </div>
                    <div className="grid grid-3">
                        {testimonials.map((t) => (
                            <div key={t.name} className="card testimonial-card">
                                <div className="testimonial-stars">
                                    {[...Array(t.rating)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" color="#f59e0b" />)}
                                </div>
                                <p className="testimonial-text">"{t.text}"</p>
                                <div className="testimonial-author">
                                    <div className="testimonial-avatar">{t.name.charAt(0)}</div>
                                    <div>
                                        <div className="testimonial-name">{t.name}</div>
                                        <div className="testimonial-role">{t.role}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="section" id="faq">
                <div className="container" style={{ maxWidth: '800px' }}>
                    <div className="section-header">
                        <span className="section-badge">FAQ</span>
                        <h2>Frequently asked questions</h2>
                    </div>
                    <div className="faq-list">
                        {faqs.map((faq, i) => (
                            <div key={i} className={`faq-item ${openFaq === i ? 'open' : ''}`}>
                                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                    {faq.q}
                                    <ChevronDown size={20} />
                                </button>
                                {openFaq === i && <div className="faq-answer">{faq.a}</div>}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="cta-section">
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2>Ready to transform your warehouse?</h2>
                    <p>Join 500+ agricultural facilities already using AgroVault.</p>
                    <div className="hero-actions" style={{ justifyContent: 'center' }}>
                        <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free <ArrowRight size={18} /></Link>
                        <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Landing;
