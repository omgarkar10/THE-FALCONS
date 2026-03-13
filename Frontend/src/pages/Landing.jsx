import { useEffect, useRef, useState, Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, Box, Torus, MeshDistortMaterial, Float, Stars, OrbitControls, Text3D, Center } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
    Wheat, BarChart3, Package, Database, Wifi, Truck, FileCheck,
    ArrowRight, Play, Shield, Zap, Target, TrendingUp, Thermometer,
    ChevronDown, CheckCircle2, Star, Activity, Award, Globe
} from 'lucide-react';
import './Landing.css';

gsap.registerPlugin(ScrollTrigger);

/* ──────────────────────────────────────────────────────────
   THREE.JS SCENE COMPONENTS
────────────────────────────────────────────────────────── */

function FloatingSilo({ position, color, scale = 1 }) {
    const meshRef = useRef();
    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.005;
            meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.7 + position[0]) * 0.15;
        }
    });
    return (
        <group position={position} scale={scale} ref={meshRef}>
            <mesh>
                <cylinderGeometry args={[0.3, 0.35, 1.2, 16]} />
                <meshStandardMaterial color={color} metalness={0.4} roughness={0.3} transparent opacity={0.85} />
            </mesh>
            <mesh position={[0, 0.75, 0]}>
                <sphereGeometry args={[0.32, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color={color} metalness={0.6} roughness={0.2} transparent opacity={0.85} />
            </mesh>
        </group>
    );
}

function ParticleField() {
    const pointsRef = useRef();
    const count = 800;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    useFrame((state) => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
            pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
        }
    });
    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
            </bufferGeometry>
            <pointsMaterial size={0.04} color="#4ade80" transparent opacity={0.5} sizeAttenuation />
        </points>
    );
}

function RotatingTorus({ position }) {
    const torusRef = useRef();
    useFrame((state) => {
        if (torusRef.current) {
            torusRef.current.rotation.x = state.clock.elapsedTime * 0.3;
            torusRef.current.rotation.y = state.clock.elapsedTime * 0.2;
        }
    });
    return (
        <mesh ref={torusRef} position={position}>
            <torusGeometry args={[0.8, 0.15, 16, 64]} />
            <meshStandardMaterial color="#22c55e" metalness={0.8} roughness={0.1} transparent opacity={0.6} wireframe />
        </mesh>
    );
}

function GlowSphere({ position, color }) {
    const meshRef = useRef();
    useFrame((state) => {
        if (meshRef.current) {
            const t = state.clock.elapsedTime;
            meshRef.current.scale.setScalar(1 + Math.sin(t * 1.5 + position[0]) * 0.08);
        }
    });
    return (
        <mesh ref={meshRef} position={position}>
            <sphereGeometry args={[0.25, 32, 32]} />
            <MeshDistortMaterial color={color} distort={0.4} speed={2} metalness={0.6} roughness={0.1} transparent opacity={0.75} />
        </mesh>
    );
}

function DataGrid() {
    const gridRef = useRef();
    useFrame((state) => {
        if (gridRef.current) {
            gridRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;
        }
    });
    const lines = [];
    for (let i = -3; i <= 3; i++) {
        lines.push(
            <mesh key={`h${i}`} position={[0, i * 0.5, 0]} rotation={[0, 0, 0]}>
                <boxGeometry args={[6, 0.01, 0.01]} />
                <meshStandardMaterial color="#16a34a" transparent opacity={0.2} />
            </mesh>
        );
        lines.push(
            <mesh key={`v${i}`} position={[i * 0.85, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[3.5, 0.01, 0.01]} />
                <meshStandardMaterial color="#16a34a" transparent opacity={0.2} />
            </mesh>
        );
    }
    return <group ref={gridRef}>{lines}</group>;
}

function HeroScene() {
    const siloColors = ['#16a34a', '#22c55e', '#4ade80', '#15803d', '#86efac'];
    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[5, 5, 5]} intensity={1.5} color="#4ade80" />
            <pointLight position={[-5, -5, -5]} intensity={0.8} color="#f59e0b" />
            <directionalLight position={[0, 10, 5]} intensity={0.5} />

            <Stars radius={80} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />
            <ParticleField />
            <DataGrid />

            <Float speed={1.4} rotationIntensity={0.5} floatIntensity={0.8}>
                <FloatingSilo position={[-3.5, 0.5, -1]} color={siloColors[0]} scale={1.2} />
            </Float>
            <Float speed={1.8} rotationIntensity={0.3} floatIntensity={0.6}>
                <FloatingSilo position={[-2.2, -0.8, -0.5]} color={siloColors[1]} scale={0.9} />
            </Float>
            <Float speed={1.1} rotationIntensity={0.6} floatIntensity={1.0}>
                <FloatingSilo position={[3.0, 0.2, -1.5]} color={siloColors[2]} scale={1.0} />
            </Float>
            <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.7}>
                <FloatingSilo position={[4.2, -0.5, -0.8]} color={siloColors[3]} scale={0.75} />
            </Float>

            <RotatingTorus position={[0, 1.5, -3]} />
            <RotatingTorus position={[1.5, -1.2, -2]} />

            <GlowSphere position={[-1, 2, -1]} color="#4ade80" />
            <GlowSphere position={[2.5, 1.5, -0.5]} color="#f59e0b" />
            <GlowSphere position={[-2.5, -1.5, -0.5]} color="#22d3ee" />
            <GlowSphere position={[0, -2, -1]} color="#a78bfa" />

            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} maxPolarAngle={Math.PI / 2} minPolarAngle={Math.PI / 3} />
        </>
    );
}

/* ──────────────────────────────────────────────────────────
   REACT COMPONENTS
────────────────────────────────────────────────────────── */

function AnimatedCounter({ target, suffix = '', duration = 2000 }) {
    const [count, setCount] = useState(0);
    const ref = useRef();
    const hasAnimated = useRef(false);
    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting && !hasAnimated.current) {
                hasAnimated.current = true;
                const isDecimal = target.toString().includes('.');
                const numericTarget = parseFloat(target);
                const startTime = performance.now();
                const animate = (now) => {
                    const elapsed = now - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    const current = isDecimal
                        ? (eased * numericTarget).toFixed(1)
                        : Math.floor(eased * numericTarget);
                    setCount(current);
                    if (progress < 1) requestAnimationFrame(animate);
                    else setCount(target);
                };
                requestAnimationFrame(animate);
            }
        }, { threshold: 0.3 });
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [target, duration]);
    return <span ref={ref}>{count}{suffix}</span>;
}

function TypewriterText({ texts, speed = 80 }) {
    const [displayed, setDisplayed] = useState('');
    const [textIdx, setTextIdx] = useState(0);
    const [charIdx, setCharIdx] = useState(0);
    const [deleting, setDeleting] = useState(false);
    useEffect(() => {
        const current = texts[textIdx];
        const timeout = setTimeout(() => {
            if (!deleting) {
                if (charIdx < current.length) {
                    setDisplayed(current.slice(0, charIdx + 1));
                    setCharIdx(c => c + 1);
                } else {
                    setTimeout(() => setDeleting(true), 1800);
                }
            } else {
                if (charIdx > 0) {
                    setDisplayed(current.slice(0, charIdx - 1));
                    setCharIdx(c => c - 1);
                } else {
                    setDeleting(false);
                    setTextIdx(i => (i + 1) % texts.length);
                }
            }
        }, deleting ? speed / 2 : speed);
        return () => clearTimeout(timeout);
    }, [charIdx, deleting, textIdx, texts, speed]);
    return (
        <span className="typewriter-text">
            {displayed}<span className="typewriter-cursor">|</span>
        </span>
    );
}

function ScrollReveal({ children, className = '', delay = 0 }) {
    const ref = useRef();
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        gsap.fromTo(el,
            { opacity: 0, y: 60, scale: 0.95 },
            {
                opacity: 1, y: 0, scale: 1, duration: 0.9,
                delay, ease: 'power3.out',
                scrollTrigger: { trigger: el, start: 'top 85%', once: true }
            }
        );
        return () => ScrollTrigger.getAll().forEach(t => t.kill());
    }, [delay]);
    return <div ref={ref} className={className} style={{ opacity: 0 }}>{children}</div>;
}

function LiveMetricCard({ label, value, unit, color, icon: Icon, trend }) {
    const [current, setCurrent] = useState(parseFloat(value));
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrent(v => parseFloat((v + (Math.random() - 0.5) * 0.4).toFixed(1)));
        }, 1800);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="live-metric-card" style={{ '--metric-color': color }}>
            <div className="lmc-header">
                <Icon size={16} />
                <span className="lmc-label">{label}</span>
                <span className="lmc-pulse" />
            </div>
            <div className="lmc-value">{current}<small>{unit}</small></div>
            <div className="lmc-trend">{trend}</div>
            <div className="lmc-bar"><div className="lmc-bar-fill" /></div>
        </div>
    );
}

const features = [
    { id: 'dashboard', icon: BarChart3, title: 'Real-Time Dashboard', desc: 'Monitor all warehouse operations with interactive KPIs and live charts. Get instant visibility into temperature, humidity, and stock levels.' },
    { id: 'inventory', icon: Package, title: 'Inventory Management', desc: 'Track every asset in your warehouse. Smart categorization, quality status tracking, and automated low-stock alerts.' },
    { id: 'storage', icon: Database, title: 'Storage Monitoring', desc: 'Per-silo environmental tracking with real-time sensor data. Temperature, humidity, and CO2 monitoring at your fingertips.' },
    { id: 'iot', icon: Wifi, title: 'IoT Sensor Network', desc: 'Manage hundreds of connected sensors across your facility. Automated calibration and health monitoring.' },
    { id: 'logistics', icon: Truck, title: 'Logistics & Dispatch', desc: 'Optimize supply chain operations. Track inbound and outbound shipments with real-time status updates.' },
    { id: 'reports', icon: FileCheck, title: 'Analytics & Reports', desc: 'Trend analysis, loss reports, and AI-powered recommendations. Make data-driven decisions with comprehensive insights.' },
];

const faqs = [
    { q: 'How quickly can I set up AgroVault?', a: 'Most facilities are fully operational within 48 hours. Our onboarding team guides you through sensor installation and platform configuration step by step.' },
    { q: 'What types of sensors are supported?', a: 'We support temperature, humidity, CO2, moisture, and weight sensors from major manufacturers including Bosch, Honeywell, and custom IoT devices.' },
    { q: 'Is my data secure?', a: 'Absolutely. All data is encrypted in transit and at rest. We are SOC 2 Type II compliant with 99.9% uptime SLA.' },
    { q: 'Can I integrate with existing ERP systems?', a: 'Yes. AgroVault provides REST APIs and webhooks for integration with ERP, accounting, and logistics platforms.' },
];

const steps = [
    { num: '01', title: 'Connect Your Warehouse', desc: 'Install IoT sensors and connect your facility to AgroVault in minutes.', icon: Wifi },
    { num: '02', title: 'Monitor Everything', desc: 'Get real-time visibility into temperature, humidity, stock levels, and facility health.', icon: Activity },
    { num: '03', title: 'Get Smart Alerts', desc: 'Receive intelligent notifications when conditions deviate from optimal thresholds.', icon: Zap },
    { num: '04', title: 'Act on Insights', desc: 'Make data-driven decisions with AI-powered analytics and actionable recommendations.', icon: TrendingUp },
];

/* ──────────────────────────────────────────────────────────
   MAIN LANDING COMPONENT
────────────────────────────────────────────────────────── */
const Landing = () => {
    const [activeFeature, setActiveFeature] = useState(0);
    const [openFaq, setOpenFaq] = useState(null);
    const heroRef = useRef();
    const navRef = useRef();

    useEffect(() => {
        // Parallax nav shrink on scroll
        const handleScroll = () => {
            if (navRef.current) {
                navRef.current.style.backdropFilter = window.scrollY > 50 ? 'blur(20px)' : 'blur(0px)';
            }
        };
        window.addEventListener('scroll', handleScroll);

        // Hero text entrance
        gsap.fromTo('.hero-badge-3d', { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.7)', delay: 0.3 });
        gsap.fromTo('.hero-title-3d', { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.5 });
        gsap.fromTo('.hero-desc-3d', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 });
        gsap.fromTo('.hero-cta-3d', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 1.0 });
        gsap.fromTo('.hero-metrics-3d', { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 1.2 });

        // Stagger feature cards
        gsap.fromTo('.feature-card-3d', { opacity: 0, y: 50 },
            {
                opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
                scrollTrigger: { trigger: '.features-section-3d', start: 'top 80%', once: true }
            });

        gsap.fromTo('.step-card-3d', { opacity: 0, scale: 0.85 },
            {
                opacity: 1, scale: 1, stagger: 0.15, duration: 0.7, ease: 'back.out(1.5)',
                scrollTrigger: { trigger: '.steps-section-3d', start: 'top 80%', once: true }
            });

        gsap.fromTo('.impact-num', { opacity: 0, scale: 0.5 },
            {
                opacity: 1, scale: 1, stagger: 0.1, duration: 0.6, ease: 'back.out(2)',
                scrollTrigger: { trigger: '.impact-section-3d', start: 'top 80%', once: true }
            });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            ScrollTrigger.getAll().forEach(t => t.kill());
        };
    }, []);

    return (
        <div className="landing-3d">
            {/* ── HERO ── */}
            <section className="hero-3d" ref={heroRef}>
                {/* 3D Canvas Background */}
                <div className="hero-canvas-container">
                    <Canvas camera={{ position: [0, 0, 6], fov: 60 }} gl={{ antialias: true, alpha: true }}>
                        <Suspense fallback={null}>
                            <HeroScene />
                        </Suspense>
                    </Canvas>
                </div>

                {/* Hero Content Overlay */}
                <div className="hero-overlay">
                    <div className="container">
                        <div className="hero-content-3d">
                            <div className="hero-badge-3d" style={{ opacity: 0 }}>
                                <Zap size={15} className="badge-icon" />
                                <span>Powered by Real-Time AI Intelligence</span>
                                <span className="badge-dot" />
                                <span className="badge-live">LIVE</span>
                            </div>

                            <h1 className="hero-title-3d" style={{ opacity: 0 }}>
                                Smarter Storage.<br />
                                <TypewriterText texts={['Fresher Crops.', 'Zero Waste.', 'Maximum Yield.', 'Full Control.']} />
                            </h1>

                            <p className="hero-desc-3d" style={{ opacity: 0 }}>
                                The all-in-one platform for monitoring grain storage, tracking crop inventory, managing IoT sensors, and optimizing your entire agricultural supply chain with real-time intelligence.
                            </p>

                            <div className="hero-cta-3d" style={{ opacity: 0 }}>
                                <Link to="/signup" className="btn-hero-primary">
                                    Get Started Free <ArrowRight size={18} />
                                </Link>
                                <button className="btn-hero-secondary">
                                    <div className="play-circle"><Play size={16} fill="currentColor" /></div>
                                    Watch Demo
                                </button>
                            </div>

                            <div className="hero-metrics-3d" style={{ opacity: 0 }}>
                                <LiveMetricCard label="Temperature" value="22.4" unit="°C" color="#22c55e" icon={Thermometer} trend="▲ Optimal" />
                                <LiveMetricCard label="Humidity" value="64.2" unit="%" color="#3b82f6" icon={Activity} trend="● Stable" />
                                <LiveMetricCard label="CO₂ Level" value="412" unit="ppm" color="#f59e0b" icon={Globe} trend="▼ Normal" />
                                <LiveMetricCard label="Stock" value="11160" unit=" T" color="#a78bfa" icon={Database} trend="▲ +2.4%" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="scroll-indicator">
                    <div className="scroll-wheel" />
                    <span>Scroll to explore</span>
                </div>
            </section>

            {/* ── TRUSTED BY ── */}
            <section className="trusted-3d">
                <div className="container">
                    <p className="trusted-label-3d">TRUSTED BY LEADING AGRICULTURAL ORGANIZATIONS</p>
                    <div className="trusted-track">
                        <div className="trusted-slide">
                            {['FarmTech', 'SiloPro', 'CropWatch', 'AgriNet', 'GreenField', 'GrainCorp', 'AgriFlow', 'FarmTech', 'SiloPro', 'CropWatch', 'AgriNet', 'GreenField'].map((name, i) => (
                                <div key={i} className="trusted-logo-3d">
                                    <Shield size={14} />{name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── FEATURES ── */}
            <section className="section-3d features-section-3d" id="features">
                <div className="container">
                    <ScrollReveal>
                        <div className="section-header-3d">
                            <span className="section-badge-3d">Features</span>
                            <h2>Everything in one command center</h2>
                            <p>From real-time monitoring to predictive analytics — AgroVault gives you complete control over your agricultural operations.</p>
                        </div>
                    </ScrollReveal>

                    <div className="features-grid-3d">
                        {features.map((f, i) => (
                            <div
                                key={f.id}
                                className={`feature-card-3d ${activeFeature === i ? 'active' : ''}`}
                                style={{ opacity: 0 }}
                                onClick={() => setActiveFeature(i)}
                            >
                                <div className="fc-icon-wrap">
                                    <f.icon size={22} />
                                    <div className="fc-icon-glow" />
                                </div>
                                <h3>{f.title}</h3>
                                <p>{f.desc}</p>
                                <div className="fc-arrow"><ArrowRight size={16} /></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── HOW IT WORKS ── */}
            <section className="section-3d steps-section-3d" id="how-it-works">
                <div className="steps-bg-grid" />
                <div className="container">
                    <ScrollReveal>
                        <div className="section-header-3d">
                            <span className="section-badge-3d">How It Works</span>
                            <h2>Up and running in 4 steps</h2>
                            <p>From installation to insights — AgroVault gets your warehouse operational in record time.</p>
                        </div>
                    </ScrollReveal>
                    <div className="steps-grid-3d">
                        {steps.map((s, i) => (
                            <div key={s.num} className="step-card-3d" style={{ opacity: 0 }}>
                                <div className="step-connector" />
                                <div className="step-num-3d">{s.num}</div>
                                <div className="step-icon-3d"><s.icon size={24} /></div>
                                <h3>{s.title}</h3>
                                <p>{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── IMPACT STATS ── */}
            <section className="impact-section-3d" id="impact">
                <div className="impact-canvas">
                    <Canvas camera={{ position: [0, 0, 5] }} gl={{ alpha: true }}>
                        <ambientLight intensity={0.3} />
                        <pointLight position={[3, 3, 3]} intensity={1} color="#4ade80" />
                        <Float speed={2} floatIntensity={0.5}>
                            <mesh>
                                <torusKnotGeometry args={[1.5, 0.3, 128, 32]} />
                                <meshStandardMaterial color="#16a34a" wireframe transparent opacity={0.15} />
                            </mesh>
                        </Float>
                        <Stars radius={50} count={1000} factor={3} fade />
                    </Canvas>
                </div>
                <div className="container">
                    <div className="impact-grid-3d">
                        {[
                            { value: 10, suffix: 'M+', label: 'Tons Tracked', icon: Database },
                            { value: 99.9, suffix: '%', label: 'Uptime', icon: Shield },
                            { value: 500, suffix: '+', label: 'Warehouses', icon: Award },
                            { value: 45, suffix: '%', label: 'Less Spoilage', icon: TrendingUp },
                        ].map((s) => (
                            <div key={s.label} className="impact-item-3d">
                                <div className="impact-icon"><s.icon size={28} /></div>
                                <div className="impact-num">
                                    <AnimatedCounter target={s.value} suffix={s.suffix} />
                                </div>
                                <div className="impact-label-3d">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── USE CASES ── */}
            <section className="section-3d use-cases-3d" id="use-cases">
                <div className="container">
                    <ScrollReveal>
                        <div className="section-header-3d">
                            <span className="section-badge-3d">Use Cases</span>
                            <h2>Built for every agricultural need</h2>
                            <p>Whether you manage grain silos, cold storage, or precision farming — AgroVault adapts to you.</p>
                        </div>
                    </ScrollReveal>
                    <div className="use-cases-grid-3d">
                        {[
                            { icon: Wheat, title: 'Grain Storage', desc: 'Maintain optimal conditions for wheat, rice, and corn with precision temperature control and moisture monitoring.', color: '#f59e0b' },
                            { icon: Thermometer, title: 'Cold Chain', desc: 'End-to-end cold storage management for perishable produce. Real-time alerts for temperature deviations.', color: '#3b82f6' },
                            { icon: Target, title: 'Precision Farming', desc: 'Data-driven crop storage decisions based on environmental analytics and predictive quality modeling.', color: '#22c55e' },
                        ].map((uc, i) => (
                            <ScrollReveal key={uc.title} delay={i * 0.15}>
                                <div className="use-case-card-3d" style={{ '--uc-color': uc.color }}>
                                    <div className="uc-icon-3d">
                                        <uc.icon size={28} />
                                        <div className="uc-icon-ring" />
                                    </div>
                                    <h3>{uc.title}</h3>
                                    <p>{uc.desc}</p>
                                    <div className="uc-bar" />
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── TESTIMONIALS ── */}
            <section className="section-3d testimonials-3d">
                <div className="container">
                    <ScrollReveal>
                        <div className="section-header-3d">
                            <span className="section-badge-3d">Testimonials</span>
                            <h2>Trusted by 500+ facilities worldwide</h2>
                        </div>
                    </ScrollReveal>
                    <div className="testimonials-grid-3d">
                        {[
                            { name: 'Rajesh Kumar', role: 'Operations Manager, GrainCorp', text: 'AgroVault reduced our spoilage by 40% in the first quarter. The real-time monitoring is a game-changer for our entire operation.', rating: 5, init: 'RK' },
                            { name: 'Priya Sharma', role: 'Farm Director, GreenHarvest', text: 'The IoT integration was seamless. We now manage 200+ sensors across 3 facilities from a single beautiful dashboard.', rating: 5, init: 'PS' },
                            { name: 'Amit Patel', role: 'Supply Chain Head, AgriFlow', text: 'The consumer portal gives our clients complete visibility into their stock. Transparency builds trust — and AgroVault delivers exactly that.', rating: 5, init: 'AP' },
                        ].map((t, i) => (
                            <ScrollReveal key={t.name} delay={i * 0.12}>
                                <div className="testimonial-card-3d">
                                    <div className="tc-stars">
                                        {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} fill="#f59e0b" color="#f59e0b" />)}
                                    </div>
                                    <p className="tc-text">"{t.text}"</p>
                                    <div className="tc-author">
                                        <div className="tc-avatar">{t.init}</div>
                                        <div>
                                            <div className="tc-name">{t.name}</div>
                                            <div className="tc-role">{t.role}</div>
                                        </div>
                                    </div>
                                    <div className="tc-glow" />
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FAQ ── */}
            <section className="section-3d faq-3d" id="faq">
                <div className="container" style={{ maxWidth: '780px' }}>
                    <ScrollReveal>
                        <div className="section-header-3d">
                            <span className="section-badge-3d">FAQ</span>
                            <h2>Frequently asked questions</h2>
                        </div>
                    </ScrollReveal>
                    <div className="faq-list-3d">
                        {faqs.map((faq, i) => (
                            <ScrollReveal key={i} delay={i * 0.08}>
                                <div className={`faq-item-3d ${openFaq === i ? 'open' : ''}`}>
                                    <button className="faq-q-3d" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                                        <span>{faq.q}</span>
                                        <ChevronDown size={20} className="faq-chevron" />
                                    </button>
                                    <div className="faq-a-3d">
                                        <p>{faq.a}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="cta-3d">
                <div className="cta-canvas">
                    <Canvas camera={{ position: [0, 0, 4] }} gl={{ alpha: true }}>
                        <ambientLight intensity={0.2} />
                        <pointLight position={[0, 2, 2]} intensity={2} color="#4ade80" />
                        <ParticleField />
                    </Canvas>
                </div>
                <div className="container">
                    <ScrollReveal>
                        <div className="cta-content-3d">
                            <div className="cta-badge"><Zap size={16} /> Ready to transform your warehouse?</div>
                            <h2>Join 500+ agricultural facilities already using AgroVault</h2>
                            <p>Start your free trial today — no credit card required. Get fully set up in under 48 hours.</p>
                            <div className="cta-actions-3d">
                                <Link to="/signup" className="btn-hero-primary">
                                    Get Started Free <ArrowRight size={18} />
                                </Link>
                                <Link to="/login" className="btn-hero-secondary">
                                    Sign In to Dashboard
                                </Link>
                            </div>
                            <div className="cta-trust">
                                <CheckCircle2 size={16} />No credit card required
                                <CheckCircle2 size={16} />48-hour setup
                                <CheckCircle2 size={16} />99.9% uptime SLA
                            </div>
                        </div>
                    </ScrollReveal>
                </div>
            </section>
        </div>
    );
};

export default Landing;
