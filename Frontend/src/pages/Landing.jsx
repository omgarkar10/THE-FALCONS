import { useEffect, useRef, useState, Suspense, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { Stars, Float, OrbitControls, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
import {
    Wheat, BarChart3, Package, Database, Wifi, Truck, FileCheck,
    ArrowRight, Shield, Zap, Target, TrendingUp, Thermometer,
    ChevronDown, CheckCircle2, Star, Activity, Award, Globe,
    Play, Cpu, Lock, BarChart2, Layers, RefreshCw
} from 'lucide-react';
import './Landing.css';

/* ─── 3D Background Elements ─────────────────────────── */
function FloatingOrb({ position, color, size = 0.4, speed = 1 }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        const t = clock.elapsedTime * speed;
        ref.current.position.y = position[1] + Math.sin(t) * 0.3;
        ref.current.position.x = position[0] + Math.cos(t * 0.7) * 0.15;
        ref.current.rotation.z += 0.003;
    });
    return (
        <mesh ref={ref} position={position}>
            <sphereGeometry args={[size, 32, 32]} />
            <MeshDistortMaterial color={color} distort={0.35} speed={1.5} transparent opacity={0.5} metalness={0.5} roughness={0.1} />
        </mesh>
    );
}

function WireframeSilo({ position, scale = 1 }) {
    const ref = useRef();
    useFrame(({ clock }) => {
        ref.current.rotation.y = clock.elapsedTime * 0.2;
        ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.5 + position[0]) * 0.2;
    });
    return (
        <group ref={ref} position={position} scale={scale}>
            <mesh>
                <cylinderGeometry args={[0.28, 0.32, 1.1, 12]} />
                <meshStandardMaterial color="#22c55e" wireframe transparent opacity={0.35} />
            </mesh>
            <mesh position={[0, 0.7, 0]}>
                <sphereGeometry args={[0.3, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#4ade80" wireframe transparent opacity={0.35} />
            </mesh>
        </group>
    );
}

function ParticleField({ count = 600 }) {
    const ref = useRef();
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 22;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 22;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    useFrame(({ clock }) => {
        ref.current.rotation.y = clock.elapsedTime * 0.015;
        ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.008) * 0.05;
    });
    return (
        <points ref={ref}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.035} color="#4ade80" transparent opacity={0.55} sizeAttenuation />
        </points>
    );
}

function HeroScene() {
    const groupRef = useRef();

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (groupRef.current) {
            // Subtle rotation based on mouse
            groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, state.pointer.y * 0.1, 0.05);
            groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, state.pointer.x * 0.1, 0.05);
        }
    });

    return (
        <group ref={groupRef}>
            <ambientLight intensity={0.4} />
            <pointLight position={[4, 6, 4]} intensity={2} color="#22c55e" />
            <pointLight position={[-6, -4, -3]} intensity={0.8} color="#f59e0b" />
            <Stars radius={90} depth={60} count={4000} factor={4} saturation={0} fade speed={0.8} />
            <ParticleField />
            <Float speed={1.3} floatIntensity={0.9}><WireframeSilo position={[-4, 0.5, -1.5]} scale={1.1} /></Float>
            <Float speed={1.7} floatIntensity={0.7}><WireframeSilo position={[-2.6, -0.7, -0.8]} scale={0.8} /></Float>
            <Float speed={1.1} floatIntensity={1.1}><WireframeSilo position={[3.5, 0.3, -2]} scale={1} /></Float>
            <Float speed={1.9} floatIntensity={0.6}><WireframeSilo position={[4.8, -0.6, -1]} scale={0.7} /></Float>
            <FloatingOrb position={[-1, 2.2, -1.2]} color="#4ade80" size={0.35} speed={0.9} />
            <FloatingOrb position={[2.2, 1.6, -0.6]} color="#f59e0b" size={0.25} speed={1.3} />
            <FloatingOrb position={[-2.5, -1.5, -0.5]} color="#60a5fa" size={0.3} speed={1.1} />
            <FloatingOrb position={[0.5, -1.8, -0.8]} color="#a78bfa" size={0.2} speed={1.5} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.35}
                maxPolarAngle={Math.PI / 1.9} minPolarAngle={Math.PI / 2.5} />
        </group>
    );
}

/* ─── Scroll Reveal Hook ──────────────────────────────── */
function useScrollReveal({ threshold = 0.15, once = true } = {}) {
    const ref = useRef();
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) { setVisible(true); if (once) obs.disconnect(); }
        }, { threshold });
        obs.observe(el);
        return () => obs.disconnect();
    }, [threshold, once]);
    return [ref, visible];
}

/* ─── Animated Counter ────────────────────────────────── */
function Counter({ value, suffix = '', decimals = 0, duration = 1800 }) {
    const [count, setCount] = useState(0);
    const [ref, visible] = useScrollReveal();
    const animated = useRef(false);
    useEffect(() => {
        if (!visible || animated.current) return;
        animated.current = true;
        const num = parseFloat(value);
        const start = performance.now();
        const tick = (now) => {
            const p = Math.min((now - start) / duration, 1);
            const ease = 1 - Math.pow(1 - p, 3);
            setCount(decimals > 0 ? (ease * num).toFixed(decimals) : Math.floor(ease * num));
            if (p < 1) requestAnimationFrame(tick);
            else setCount(decimals > 0 ? num.toFixed(decimals) : num);
        };
        requestAnimationFrame(tick);
    }, [visible, value, decimals, duration]);
    return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Scroll Reveal Wrapper (GSAP) ─────────────────────── */
function Reveal({ children, delay = 0, direction = 'up', className = '' }) {
    const elRef = useRef();

    useEffect(() => {
        const el = elRef.current;
        const xDir = direction === 'left' ? -60 : direction === 'right' ? 60 : 0;
        const yDir = direction === 'up' ? 60 : direction === 'down' ? -60 : 0;

        gsap.fromTo(el,
            {
                opacity: 0,
                x: xDir,
                y: yDir,
                scale: 0.95
            },
            {
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                duration: 1.2,
                delay: delay,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            }
        );
    }, [direction, delay]);

    return <div ref={elRef} className={className} style={{ opacity: 0 }}>{children}</div>;
}

/* ─── Typewriter ──────────────────────────────────────── */
function Typewriter({ phrases, speed = 75 }) {
    const [text, setText] = useState('');
    const [pi, setPi] = useState(0);
    const [ci, setCi] = useState(0);
    const [del, setDel] = useState(false);
    useEffect(() => {
        const current = phrases[pi];
        const t = setTimeout(() => {
            if (!del) {
                if (ci < current.length) { setText(current.slice(0, ci + 1)); setCi(c => c + 1); }
                else setTimeout(() => setDel(true), 1800);
            } else {
                if (ci > 0) { setText(current.slice(0, ci - 1)); setCi(c => c - 1); }
                else { setDel(false); setPi(i => (i + 1) % phrases.length); }
            }
        }, del ? speed / 2 : speed);
        return () => clearTimeout(t);
    }, [ci, del, pi, phrases, speed]);
    return <><span className="tw-text">{text}</span><span className="tw-cursor">|</span></>;
}

/* ─── Feature Card ────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc, color, delay }) {
    const [hovered, setHovered] = useState(false);
    return (
        <Reveal delay={delay} className="feature-card-wrap">
            <div className={`lp-feature-card ${hovered ? 'hovered' : ''}`}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}>
                <div className="lp-fc-icon" style={{ '--fc-color': color }}>
                    <Icon size={22} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
                <div className="lp-fc-arrow"><ArrowRight size={15} /></div>
            </div>
        </Reveal>
    );
}

/* ─── Data ────────────────────────────────────────────── */
const features = [
    { icon: BarChart3, title: 'Real-Time Dashboard', desc: 'Unified command center with live KPIs, facility health scores, and instant anomaly detection.', color: '#22c55e' },
    { icon: Package, title: 'Smart Inventory', desc: 'Automated tracking, quality scoring, and low-stock AI alerts keep your inventory always optimized.', color: '#3b82f6' },
    { icon: Database, title: 'Storage Monitoring', desc: 'Per-silo environmental control. Temperature, humidity, CO₂ — monitored 24/7 automatically.', color: '#f59e0b' },
    { icon: Wifi, title: 'IoT Sensor Network', desc: 'Connect hundreds of sensors in minutes. Auto-calibration, health checks, and live telemetry.', color: '#a78bfa' },
    { icon: Truck, title: 'Logistics & Dispatch', desc: 'End-to-end shipment tracking, route optimization, and automated dispatch notifications.', color: '#f87171' },
    { icon: FileCheck, title: 'AI Reports', desc: 'AI-powered insights, loss analysis, and trend reports delivered automatically to your team.', color: '#34d399' },
];

const howItWorks = [
    { icon: Wifi, num: '01', title: 'Install & Connect', desc: 'Deploy IoT sensors across your facility. AgroVault auto-discovers and onboards each device in minutes.' },
    { icon: Activity, num: '02', title: 'Monitor Live', desc: 'Get real-time visibility of temperature, humidity, CO₂, stock weight, and more — from any device.' },
    { icon: Zap, num: '03', title: 'Instant Alerts', desc: 'AI watches your thresholds 24/7 and sends immediate alerts before small issues become big losses.' },
    { icon: TrendingUp, num: '04', title: 'Grow Smarter', desc: 'Use predictive analytics and AI recommendations to continuously improve operations and reduce waste.' },
];

const testimonials = [
    { name: 'Rajesh Kumar', role: 'Operations Manager, GrainCorp', text: '"AgroVault reduced our post-harvest spoilage by 40% in just one quarter. The real-time alerts are a game-changer."', rating: 5, init: 'RK', color: '#22c55e' },
    { name: 'Priya Sharma', role: 'Farm Director, GreenHarvest', text: '"We manage 200+ sensors across 3 facilities from one beautiful dashboard. The IoT integration was seamless."', rating: 5, init: 'PS', color: '#3b82f6' },
    { name: 'Amit Patel', role: 'Supply Chain Head, AgriFlow', text: '"The consumer portal built trust with our clients overnight. Full visibility, zero calls asking for updates."', rating: 5, init: 'AP', color: '#f59e0b' },
];

const faqs = [
    { q: 'How quickly can I set up AgroVault?', a: 'Most facilities are fully operational within 48 hours. Our team guides you through every step of sensor installation and configuration.' },
    { q: 'What types of sensors are supported?', a: 'We support temperature, humidity, CO₂, moisture, and weight sensors from Bosch, Honeywell, and any custom IoT device with MQTT support.' },
    { q: 'Is my data secure and private?', a: 'All data is AES-256 encrypted in transit and at rest. We are SOC 2 Type II certified with a 99.9% uptime SLA and GDPR compliant.' },
    { q: 'Can I integrate with my existing ERP?', a: 'Yes. AgroVault offers REST APIs, webhooks, and native integrations with SAP, Oracle, and 20+ other ERP platforms.' },
    { q: 'Do you offer a free trial?', a: 'Yes — 30 days completely free, no credit card required. You get full access to all Professional features during the trial.' },
];

/* ─── Main Component ──────────────────────────────────── */
export default function Landing() {
    const [openFaq, setOpenFaq] = useState(null);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const onScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', onScroll, { passive: true });

        // Hero Entrance
        const tl = gsap.timeline();
        tl.fromTo('.lp-hero-pill', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 })
            .fromTo('.lp-hero-h1', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' }, '-=0.7')
            .fromTo('.lp-hero-sub', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
            .fromTo('.lp-hero-cta', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.8')
            .fromTo('.lp-hero-trust', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=0.5');

        // Ticker Looping
        gsap.to('.lp-ticker-slide', {
            xPercent: -50,
            repeat: -1,
            duration: 30,
            ease: "none"
        });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <div className="lp-root">

            {/* ═══ HERO ═══════════════════════════════════════════════ */}
            <section className="lp-hero">
                <div className="lp-hero-canvas">
                    <Canvas camera={{ position: [0, 0, 7], fov: 58 }} gl={{ antialias: true, alpha: true }}>
                        <Suspense fallback={null}><HeroScene /></Suspense>
                    </Canvas>
                </div>
                {/* Radial gradient overlay */}
                <div className="lp-hero-grad" />

                <div className="lp-hero-body container">
                    <div className="lp-hero-pill">
                        <Zap size={13} className="lp-pill-icon" />
                        Powered by Real-Time AI Intelligence <span className="pill-dot">●</span>
                        <span className="lp-pill-live">LIVE</span>
                    </div>

                    <h1 className="lp-hero-h1">
                        Transform Your<br />
                        Agricultural Storage<br />
                        <span className="lp-grad-text">
                            <Typewriter phrases={['Zero Waste.', 'Maximum Yield.', 'Full Control.', 'Future-Ready.']} />
                        </span>
                    </h1>

                    <p className="lp-hero-sub">
                        AgroVault is the all-in-one intelligent warehouse platform that turns your silos, sensors, and supply chains into a unified, data-driven ecosystem — cutting spoilage, boosting efficiency, and delivering complete visibility from field to consumer.
                    </p>

                    <div className="lp-hero-cta">
                        <Link to="/signup" className="lp-btn-primary">
                            Get Started Free <ArrowRight size={17} />
                        </Link>
                        <button className="lp-btn-ghost">
                            <span className="lp-play-btn"><Play size={14} fill="currentColor" /></span>
                            Watch Demo
                        </button>
                    </div>

                    <div className="lp-hero-trust">
                        <CheckCircle2 size={14} /> No credit card required
                        <span className="lp-trust-dot" />
                        <CheckCircle2 size={14} /> 30-day free trial
                        <span className="lp-trust-dot" />
                        <CheckCircle2 size={14} /> Setup in 48 hours
                    </div>
                </div>

                <div className="lp-scroll-hint">
                    <div className="lp-scroll-mouse"><div className="lp-scroll-wheel" /></div>
                    <span>Scroll to explore</span>
                </div>

                {/* Floating scroll-parallax testimonial card */}
                <div className="lp-hero-float-card" style={{ transform: `translateY(${scrollY * 0.06}px)` }}>
                    <div className="lp-hfc-content">
                        <div className="lp-hfc-stars">{'★'.repeat(5)}</div>
                        <p>"Reduced post-harvest loss by 40%"</p>
                        <span>GrainCorp — Rajesh Kumar</span>
                    </div>
                </div>


            </section>

            {/* ═══ TRUSTED TICKER ═══════════════════════════════════ */}
            <div className="lp-ticker">
                <div className="lp-ticker-label">TRUSTED BY LEADING AGRI ORGANIZATIONS</div>
                <div className="lp-ticker-track">
                    <div className="lp-ticker-slide">
                        {['FarmTech', 'SiloPro', 'CropWatch', 'AgriNet', 'GreenField', 'GrainCorp', 'AgriFlow', 'HarvestAI', 'FarmTech', 'SiloPro', 'CropWatch', 'AgriNet', 'GreenField', 'GrainCorp'].map((n, i) => (
                            <span key={i} className="lp-ticker-item"><Shield size={12} />{n}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* ═══ WHAT IS AGROVAULT ════════════════════════════════ */}
            <section className="lp-section lp-intro-section">
                <div className="container">
                    <Reveal>
                        <div className="lp-section-label">The Platform</div>
                        <h2 className="lp-section-h2">One platform.<br />Your entire agricultural operation.</h2>
                        <p className="lp-section-sub">From the first sensor ping to the final consumer delivery, AgroVault connects every layer of your agricultural supply chain into one intelligent, beautifully designed platform.</p>
                    </Reveal>

                    <div className="lp-intro-grid">
                        {[
                            { icon: Cpu, title: 'AI-Powered Intelligence', desc: 'Machine learning algorithms predict spoilage risks, recommend optimal storage conditions, and surface anomalies before they become problems.' },
                            { icon: Globe, title: 'Complete Visibility', desc: 'One unified view across every silo, sensor, truck, and team member — accessible from any device, anywhere in the world.' },
                            { icon: Lock, title: 'Enterprise Security', desc: 'SOC 2 Type II certified. AES-256 encryption at rest and in transit. Role-based access control for every team member.' },
                            { icon: RefreshCw, title: 'Always Real-Time', desc: 'Sub-second sensor updates, live alerts, and streaming data pipelines ensure you are always looking at what is happening now.' },
                        ].map((item, i) => (
                            <Reveal key={item.title} delay={i * 0.1} className="lp-intro-card-wrap">
                                <div className="lp-intro-card">
                                    <div className="lp-ic-icon"><item.icon size={20} /></div>
                                    <h3>{item.title}</h3>
                                    <p>{item.desc}</p>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FEATURES ═════════════════════════════════════════ */}
            <section className="lp-section lp-features-section" id="features">
                <div className="container">
                    <Reveal>
                        <div className="lp-section-label">Features</div>
                        <h2 className="lp-section-h2">Everything your warehouse needs.</h2>
                        <p className="lp-section-sub">A complete suite of tools built specifically for modern agricultural storage management — from IoT to AI, logistics to analytics.</p>
                    </Reveal>
                    <div className="lp-features-grid">
                        {features.map((f, i) => (
                            <FeatureCard key={f.title} {...f} delay={i * 0.08} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ HOW IT WORKS ══════════════════════════════════════ */}
            <section className="lp-section lp-how-section" id="how-it-works">
                <div className="lp-how-bg" />
                <div className="container">
                    <Reveal>
                        <div className="lp-section-label">How It Works</div>
                        <h2 className="lp-section-h2">Up & running in 4 steps.</h2>
                        <p className="lp-section-sub">From unboxing to insights — AgroVault has the fastest time-to-value of any agricultural intelligence platform on the market.</p>
                    </Reveal>
                    <div className="lp-how-grid">
                        {howItWorks.map((s, i) => (
                            <Reveal key={s.num} delay={i * 0.12}>
                                <div className="lp-how-card">
                                    <div className="lp-how-num">{s.num}</div>
                                    <div className="lp-how-icon"><s.icon size={22} /></div>
                                    <h3>{s.title}</h3>
                                    <p>{s.desc}</p>
                                    {i < howItWorks.length - 1 && <div className="lp-how-connector" />}
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ IMPACT STATS ══════════════════════════════════════ */}
            <section className="lp-stats-section">
                <div className="lp-stats-canvas">
                    <Canvas camera={{ position: [0, 0, 5] }} gl={{ alpha: true }}>
                        <ambientLight intensity={0.2} />
                        <pointLight position={[0, 3, 2]} intensity={1.5} color="#4ade80" />
                        <ParticleField count={300} />
                        <Stars radius={50} count={800} factor={3} fade />
                    </Canvas>
                </div>
                <div className="container lp-stats-inner">
                    {[
                        { val: 10, suf: 'M+', label: 'Tons Tracked', icon: Database },
                        { val: 99.9, suf: '%', label: 'Uptime Guarantee', icon: Shield, dec: 1 },
                        { val: 500, suf: '+', label: 'Warehouses Active', icon: Award },
                        { val: 45, suf: '%', label: 'Avg Spoilage Reduction', icon: TrendingUp },
                    ].map((s, i) => (
                        <Reveal key={s.label} delay={i * 0.1}>
                            <div className="lp-stat-card">
                                <s.icon size={26} className="lp-stat-icon" />
                                <div className="lp-stat-num"><Counter value={s.val} suffix={s.suf} decimals={s.dec || 0} /></div>
                                <div className="lp-stat-label">{s.label}</div>
                            </div>
                        </Reveal>
                    ))}
                </div>
            </section>

            {/* ═══ USE CASES ═════════════════════════════════════════ */}
            <section className="lp-section lp-usecases-section" id="use-cases">
                <div className="container">
                    <Reveal>
                        <div className="lp-section-label">Use Cases</div>
                        <h2 className="lp-section-h2">Built for every agricultural operation.</h2>
                        <p className="lp-section-sub">Whether you run a single grain silo or a national cold-chain network, AgroVault adapts to your scale and complexity.</p>
                    </Reveal>
                    <div className="lp-usecases-grid">
                        {[
                            { icon: Wheat, title: 'Grain Storage', color: '#f59e0b', desc: 'Precision temperature and moisture management for wheat, rice, corn, and other grains. Prevent mold, infestation, and spoilage 24/7.', tags: ['Temperature Control', 'Moisture Monitoring', 'Infestation Alerts'] },
                            { icon: Thermometer, title: 'Cold Chain', color: '#3b82f6', desc: 'End-to-end cold storage management for perishable produce. Real-time deviation alerts protect your cold chain compliance at every step.', tags: ['Compliance Tracking', 'Deviation Alerts', 'Chain of Custody'] },
                            { icon: Target, title: 'Precision Agriculture', color: '#22c55e', desc: 'Harness data from across your operation to make smarter decisions about harvest timing, storage allocation, and market distribution.', tags: ['Predictive Analytics', 'Harvest Planning', 'Market Timing'] },
                            { icon: BarChart2, title: 'Multi-Site Management', color: '#a78bfa', desc: 'Manage dozens of warehouses from one central dashboard. Compare performance, share resources, and benchmark against best practices.', tags: ['Central Dashboard', 'Cross-Site Compare', 'Resource Pooling'] },
                        ].map((uc, i) => (
                            <Reveal key={uc.title} delay={i * 0.1} className="lp-uc-wrap">
                                <div className="lp-uc-card" style={{ '--uc-color': uc.color }}>
                                    <div className="lp-uc-icon"><uc.icon size={26} /></div>
                                    <h3>{uc.title}</h3>
                                    <p>{uc.desc}</p>
                                    <div className="lp-uc-tags">
                                        {uc.tags.map(t => <span key={t} className="lp-uc-tag">{t}</span>)}
                                    </div>
                                    <div className="lp-uc-bar" />
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ TESTIMONIALS ═════════════════════════════════════ */}
            <section className="lp-section lp-testimonials-section">
                <div className="container">
                    <Reveal>
                        <div className="lp-section-label">Testimonials</div>
                        <h2 className="lp-section-h2">Trusted by operations like yours.</h2>
                    </Reveal>
                    <div className="lp-testimonials-grid">
                        {testimonials.map((t, i) => (
                            <Reveal key={t.name} delay={i * 0.12}>
                                <div className="lp-testimonial-card" style={{ '--tc-color': t.color }}>
                                    <div className="lp-tc-stars">{Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={13} fill="#f59e0b" color="#f59e0b" />)}</div>
                                    <p>{t.text}</p>
                                    <div className="lp-tc-author">
                                        <div className="lp-tc-avatar" style={{ background: t.color }}>{t.init}</div>
                                        <div><strong>{t.name}</strong><span>{t.role}</span></div>
                                    </div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ FAQ ═══════════════════════════════════════════════ */}
            <section className="lp-section lp-faq-section" id="faq">
                <div className="container lp-faq-container">
                    <Reveal>
                        <div className="lp-section-label">FAQ</div>
                        <h2 className="lp-section-h2">Questions? We have answers.</h2>
                    </Reveal>
                    <div className="lp-faq-list">
                        {faqs.map((f, i) => (
                            <Reveal key={i} delay={i * 0.07}>
                                <div className={`lp-faq-item ${openFaq === i ? 'open' : ''}`}>
                                    <button className="lp-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                        {f.q}
                                        <ChevronDown size={18} className="lp-faq-chevron" />
                                    </button>
                                    <div className="lp-faq-a"><p>{f.a}</p></div>
                                </div>
                            </Reveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ═══ CTA ═══════════════════════════════════════════════ */}
            <section className="lp-cta-section">
                <div className="lp-cta-canvas">
                    <Canvas camera={{ position: [0, 0, 4] }} gl={{ alpha: true }}>
                        <ambientLight intensity={0.15} />
                        <pointLight position={[0, 2, 2]} intensity={2} color="#4ade80" />
                        <ParticleField count={250} />
                    </Canvas>
                </div>
                <div className="container">
                    <Reveal>
                        <div className="lp-cta-body">
                            <div className="lp-cta-pill"><Zap size={13} /> Join 500+ agricultural facilities</div>
                            <h2>Ready to cut waste and maximize yield?</h2>
                            <p>Start your 30-day free trial today. No credit card. No commitment. Full Pro access from day one.</p>
                            <div className="lp-cta-actions">
                                <Link to="/signup" className="lp-btn-primary">Start Free Trial <ArrowRight size={17} /></Link>
                                <Link to="/login" className="lp-btn-ghost">Sign in to Dashboard</Link>
                            </div>
                            <div className="lp-cta-badges">
                                <span><CheckCircle2 size={14} /> SOC 2 Certified</span>
                                <span><CheckCircle2 size={14} /> GDPR Compliant</span>
                                <span><CheckCircle2 size={14} /> 99.9% Uptime</span>
                                <span><CheckCircle2 size={14} /> 24/7 Support</span>
                            </div>
                        </div>
                    </Reveal>
                </div>
            </section>
        </div>
    );
}
