import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { motion, AnimatePresence, useScroll, useTransform } from "motion/react";
import {
  Wheat,
  LayoutDashboard,
  Package,
  Thermometer,
  Radio,
  Truck,
  ShieldCheck,
  BarChart3,
  Bell,
  Users,
  Settings,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Menu,
  X,
  Star,
  Zap,
  Shield,
  Globe,
  TrendingUp,
  Clock,
  Play,
  Leaf,
  Droplets,
  Wind,
  Cpu,
  Lock,
  Cloud,
  Smartphone,
  Database,
  Eye,
  Target,
  Award,
  Check,
  Minus,
  MousePointerClick,
  Sparkles,
  CircleDot,
  Activity,
  MapPin,
} from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

/* ─── DATA ─── */
const features = [
  { icon: LayoutDashboard, title: "Real-Time Dashboard", desc: "Bird's eye view of all warehouse operations with live KPI cards, interactive charts, and real-time alert monitoring across all locations.", color: "#10b981", lightBg: "bg-emerald-50 dark:bg-emerald-900/20", route: "/dashboard" },
  { icon: Package, title: "Inventory Management", desc: "Track crop batches, quantities, grades, and storage assignments with advanced filtering, auto-generated batch IDs, and CSV export.", color: "#3b82f6", lightBg: "bg-blue-50 dark:bg-blue-900/20", route: "/dashboard/inventory" },
  { icon: Thermometer, title: "Storage Monitoring", desc: "Monitor temperature, humidity, and gas levels across all storage units with live environmental data visualization and zone mapping.", color: "#f97316", lightBg: "bg-orange-50 dark:bg-orange-900/20", route: "/dashboard/storage" },
  { icon: Radio, title: "IoT Sensor Network", desc: "Manage hundreds of connected sensors with real-time status, remote configuration, polling intervals, and automated health alerts.", color: "#a855f7", lightBg: "bg-purple-50 dark:bg-purple-900/20", route: "/dashboard/sensors" },
  { icon: Truck, title: "Logistics & Dispatch", desc: "Coordinate shipments with GPS route tracking, schedule management, driver assignments, and ETA estimation for seamless operations.", color: "#06b6d4", lightBg: "bg-cyan-50 dark:bg-cyan-900/20", route: "/dashboard/logistics" },
  { icon: ShieldCheck, title: "Quality Control", desc: "Enforce quality standards with inspection workflows, grading systems, compliance documentation, and rejection tracking.", color: "#f43f5e", lightBg: "bg-rose-50 dark:bg-rose-900/20", route: "/dashboard/quality" },
  { icon: BarChart3, title: "Reports & Analytics", desc: "Generate deep insights with customizable reports, trend analysis, exportable data, and AI-powered recommendations.", color: "#6366f1", lightBg: "bg-indigo-50 dark:bg-indigo-900/20", route: "/dashboard/analytics" },
  { icon: Bell, title: "Smart Alerts", desc: "Intelligent alert routing with severity-based prioritization, multi-channel notifications via SMS, email, and push.", color: "#f59e0b", lightBg: "bg-amber-50 dark:bg-amber-900/20", route: "/dashboard/alerts" },
  { icon: Users, title: "Users & Roles", desc: "Four role tiers (Admin, Manager, Operator, Viewer) with toggle-based permissions and complete audit trail logging.", color: "#14b8a6", lightBg: "bg-teal-50 dark:bg-teal-900/20", route: "/dashboard/users" },
  { icon: Settings, title: "System Settings", desc: "Configure warehouses, notification preferences, third-party integrations, and system parameters from a centralized panel.", color: "#64748b", lightBg: "bg-slate-50 dark:bg-slate-900/20", route: "/dashboard/settings" },
];

const stats = [
  { value: 10, suffix: "M+", label: "Tons Tracked", icon: Package },
  { value: 99.9, suffix: "%", label: "Uptime SLA", icon: Zap },
  { value: 500, suffix: "+", label: "Warehouses", icon: Globe },
  { value: 45, suffix: "%", label: "Less Spoilage", icon: TrendingUp },
  { value: 2847, suffix: "", label: "Active Sensors", icon: Radio },
  { value: 24, suffix: "/7", label: "Monitoring", icon: Clock },
];

const testimonials = [
  { name: "Maria Santos", role: "Operations Director, GrainCorp", quote: "AgroVault reduced our spoilage rate by 34% in the first quarter. The IoT integration is game-changing for our 50+ grain silos.", rating: 5, avatar: "MS" },
  { name: "James Mitchell", role: "Warehouse Manager, Harvest Co.", quote: "The real-time dashboard gives me complete visibility into all operations. I can spot issues before they become problems.", rating: 5, avatar: "JM" },
  { name: "Priya Sharma", role: "Supply Chain Lead, AgriFlow", quote: "Logistics tracking and quality control in one platform. Streamlined our entire workflow and reduced manual paperwork by 80%.", rating: 5, avatar: "PS" },
  { name: "David Chen", role: "CTO, SiloPro International", quote: "The sensor configuration and alerting system is incredibly robust. We manage over 1,200 IoT devices seamlessly from one dashboard.", rating: 5, avatar: "DC" },
  { name: "Sarah Williams", role: "Quality Manager, FarmFresh Ltd.", quote: "Quality control inspections that used to take hours now take minutes. The grading system is intuitive and audit-ready.", rating: 5, avatar: "SW" },
  { name: "Carlos Rivera", role: "Regional Director, CropWatch", quote: "Rolling out AgroVault across 12 locations was remarkably smooth. The role-based access keeps our teams focused and secure.", rating: 5, avatar: "CR" },
];

const steps = [
  { step: "01", title: "Connect Your Warehouse", desc: "Register your storage units, deploy IoT sensors across silos, bins, and cold rooms. Our guided setup takes under 30 minutes.", icon: MapPin },
  { step: "02", title: "Monitor Everything", desc: "Real-time data flows in from sensors tracking temperature, humidity, moisture, CO2, and gas levels around the clock.", icon: Activity },
  { step: "03", title: "Get Smart Alerts", desc: "Configure threshold-based alerts for any parameter. Get notified via SMS, email, or push before issues escalate.", icon: Bell },
  { step: "04", title: "Act on Insights", desc: "AI-driven analytics and predictive models help you optimize storage conditions, reduce loss, and forecast demand.", icon: Sparkles },
];

const pricingPlans = [
  {
    name: "Starter",
    desc: "For small farms and single warehouses",
    monthly: 49,
    yearly: 39,
    features: ["Up to 50 sensors", "1 warehouse", "Basic dashboard", "Email alerts", "CSV export", "Community support"],
    missing: ["IoT configuration", "Quality control", "API access", "Role management"],
    popular: false,
  },
  {
    name: "Professional",
    desc: "For growing operations and multi-site teams",
    monthly: 149,
    yearly: 119,
    features: ["Up to 500 sensors", "5 warehouses", "Full dashboard & analytics", "SMS + email alerts", "Quality control module", "IoT remote config", "Role-based access (4 tiers)", "Priority support"],
    missing: ["Custom integrations", "Dedicated account manager"],
    popular: true,
  },
  {
    name: "Enterprise",
    desc: "For large-scale agricultural operations",
    monthly: 399,
    yearly: 319,
    features: ["Unlimited sensors", "Unlimited warehouses", "Custom dashboards", "All alert channels", "Full platform access", "API & webhook access", "Custom integrations", "SSO & audit logs", "Dedicated account manager", "SLA guarantee"],
    missing: [],
    popular: false,
  },
];

const faqs = [
  { q: "How quickly can I get started with AgroVault?", a: "Most customers are up and running within a day. Our guided setup wizard walks you through sensor deployment, warehouse registration, and user configuration. For enterprise deployments, our implementation team provides white-glove onboarding." },
  { q: "What types of sensors does AgroVault support?", a: "We support a wide range of IoT sensors including temperature probes, humidity sensors, CO2 detectors, moisture meters, gas analyzers, and weight scales. Our platform is compatible with LoRaWAN, Zigbee, Wi-Fi, and cellular-connected devices from leading manufacturers." },
  { q: "Is my data secure?", a: "Absolutely. We use AES-256 encryption at rest and TLS 1.3 in transit. Our infrastructure runs on SOC 2 Type II certified data centers. We support SSO via SAML 2.0 and provide complete audit logs for compliance. Role-based access ensures users only see what they need." },
  { q: "Can I integrate AgroVault with my existing systems?", a: "Yes! Our Professional and Enterprise plans include API access with comprehensive documentation. We offer pre-built integrations with popular ERP systems, accounting software, and logistics platforms. Custom integrations are available on Enterprise plans." },
  { q: "What happens if a sensor goes offline?", a: "AgroVault monitors sensor health in real-time. If a sensor goes offline or reports anomalous readings, you'll receive an instant alert. The system logs all connectivity events and can auto-retry connections. Historical data is preserved for gap analysis." },
  { q: "Do you offer a free trial?", a: "Yes! All plans include a 14-day free trial with full feature access. No credit card is required to start. Our team is available to help you explore the platform during your trial period." },
];

const integrations = [
  { name: "LoRaWAN", icon: Radio, desc: "Long-range IoT" },
  { name: "REST API", icon: Cloud, desc: "Custom integrations" },
  { name: "Mobile App", icon: Smartphone, desc: "iOS & Android" },
  { name: "SQL Database", icon: Database, desc: "Data warehouse" },
  { name: "SCADA", icon: Cpu, desc: "Industrial systems" },
  { name: "SSO/SAML", icon: Lock, desc: "Enterprise auth" },
];

const useCases = [
  { title: "Grain Storage", desc: "Monitor temperature and moisture in grain silos to prevent spoilage and maintain optimal conditions year-round.", image: "https://images.unsplash.com/photo-1761162850759-f48693513725?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmFpbiUyMGhhcnZlc3QlMjBjb21iaW5lJTIwZ29sZGVuJTIwd2hlYXR8ZW58MXx8fHwxNzcyMTg0MTcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", icon: Wheat },
  { title: "Cold Chain", desc: "Ensure temperature-sensitive produce and dairy maintain strict cold chain requirements from storage to delivery.", image: "https://images.unsplash.com/photo-1739204618173-3e89def7140f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjB3YXJlaG91c2UlMjBpbnRlcmlvciUyMGxvZ2lzdGljcyUyMHNoZWx2ZXN8ZW58MXx8fHwxNzcyMTg0MTcxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", icon: Droplets },
  { title: "Precision Farming", desc: "Leverage sensor data and analytics to make precision agriculture decisions across vast farming operations.", image: "https://images.unsplash.com/photo-1677126577258-1a82fdf1a976?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGZhcm1pbmclMjBkcm9uZSUyMHRlY2hub2xvZ3klMjBmaWVsZHxlbnwxfHx8fDE3NzIxODQxNzB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral", icon: Target },
];

/* ─── HOOKS ─── */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function AnimatedCounter({ target, suffix = "", duration = 2000 }: { target: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const start = performance.now();
        const isDecimal = target % 1 !== 0;
        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const val = eased * target;
          setCount(isDecimal ? parseFloat(val.toFixed(1)) : Math.floor(val));
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      }
    }, { threshold: 0.3 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* Floating particles for hero */
function FloatingParticles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 6 + 2,
    duration: Math.random() * 15 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-primary/10"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], x: [0, 15, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* Marquee for trusted brands */
function BrandMarquee() {
  const brands = ["GrainCorp", "AgriFlow", "HarvestCo", "FarmTech", "SiloPro", "CropWatch", "AgriNet", "GreenField"];
  const doubled = [...brands, ...brands];

  return (
    <div className="overflow-hidden relative">
      <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-muted/50 to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-muted/50 to-transparent z-10" />
      <motion.div
        className="flex gap-16 items-center whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {doubled.map((brand, i) => (
          <div key={`${brand}-${i}`} className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity">
            <Leaf className="w-5 h-5 text-primary" />
            <span className="text-[17px] tracking-tight" style={{ fontWeight: 700 }}>{brand}</span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

/* Live dashboard mockup */
function DashboardMockup() {
  const [activeMetric, setActiveMetric] = useState(0);
  const metrics = [
    { label: "Temperature", value: "22.4", unit: "C", trend: "+0.3", color: "#f97316", data: [18, 19, 21, 22, 21, 22, 22.4] },
    { label: "Humidity", value: "64.2", unit: "%", trend: "-1.1", color: "#3b82f6", data: [68, 67, 66, 65, 65, 64, 64.2] },
    { label: "CO2 Level", value: "412", unit: "ppm", trend: "+5", color: "#10b981", data: [400, 403, 405, 408, 410, 411, 412] },
  ];

  useEffect(() => {
    const t = setInterval(() => setActiveMetric((p) => (p + 1) % 3), 3000);
    return () => clearInterval(t);
  }, []);

  const m = metrics[activeMetric];

  return (
    <div className="bg-card rounded-2xl border border-border shadow-2xl overflow-hidden">
      {/* Mock header bar */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/30">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-400" />
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <div className="w-3 h-3 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 flex justify-center">
          <div className="px-4 py-1 rounded-lg bg-muted text-[11px] text-muted-foreground">app.agrovault.io/dashboard</div>
        </div>
      </div>

      <div className="p-5">
        {/* Mini KPI row */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {metrics.map((met, i) => (
            <button
              key={met.label}
              onClick={() => setActiveMetric(i)}
              className={`p-3 rounded-xl border transition-all text-left ${i === activeMetric ? "border-primary/40 bg-primary/5 shadow-sm" : "border-border hover:border-primary/20"}`}
            >
              <p className="text-[10px] text-muted-foreground mb-1">{met.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-[18px]" style={{ fontWeight: 700, color: met.color }}>{met.value}</span>
                <span className="text-[10px] text-muted-foreground">{met.unit}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Mini chart */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeMetric}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="bg-muted/30 rounded-xl p-4 border border-border"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-[12px]" style={{ fontWeight: 600 }}>{m.label} Trend</span>
              <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: `${m.color}15`, color: m.color, fontWeight: 600 }}>{m.trend}</span>
            </div>
            <div className="flex items-end gap-1 h-16">
              {m.data.map((d, i) => {
                const max = Math.max(...m.data);
                const min = Math.min(...m.data) - 5;
                const height = ((d - min) / (max - min)) * 100;
                return (
                  <motion.div
                    key={i}
                    className="flex-1 rounded-t-sm"
                    style={{ backgroundColor: i === m.data.length - 1 ? m.color : `${m.color}40` }}
                    initial={{ height: 0 }}
                    animate={{ height: `${height}%` }}
                    transition={{ duration: 0.5, delay: i * 0.05 }}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-2">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <span key={d} className="text-[9px] text-muted-foreground flex-1 text-center">{d}</span>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mini sensor status */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          {[
            { name: "Silo A - Temp", status: "Normal", color: "#10b981" },
            { name: "Silo B - Humid", status: "Warning", color: "#f59e0b" },
            { name: "Cold Room 1", status: "Normal", color: "#10b981" },
            { name: "Loading Dock", status: "Active", color: "#3b82f6" },
          ].map((s) => (
            <div key={s.name} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border">
              <div className="relative">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{ backgroundColor: s.color }}
                  animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] truncate" style={{ fontWeight: 500 }}>{s.name}</p>
                <p className="text-[9px] text-muted-foreground">{s.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── MAIN LANDING ─── */
export function Landing() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const [yearlyBilling, setYearlyBilling] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeUseCase, setActiveUseCase] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.15], [1, 0.95]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = useCallback((id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Rotate features
  useEffect(() => {
    const t = setInterval(() => setActiveFeature((p) => (p + 1) % features.length), 4000);
    return () => clearInterval(t);
  }, []);

  // Rotate use cases
  useEffect(() => {
    const t = setInterval(() => setActiveUseCase((p) => (p + 1) % useCases.length), 5000);
    return () => clearInterval(t);
  }, []);

  const featuresView = useInView();
  const statsView = useInView();
  const howView = useInView();
  const testimonialsView = useInView();
  const pricingView = useInView();
  const useCasesView = useInView();
  const integrationsView = useInView();
  const faqView = useInView();

  const navLinks = ["Features", "Use Cases", "How It Works", "Pricing", "Testimonials", "FAQ"];

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-card/90 backdrop-blur-xl shadow-lg border-b border-border" : "bg-transparent"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-[72px]">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollTo("hero")}>
              <motion.div
                className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
                whileHover={{ rotate: 15, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Wheat className="w-5 h-5 text-primary-foreground" />
              </motion.div>
              <span className="text-[18px] tracking-tight" style={{ fontWeight: 700 }}>AgroVault</span>
            </div>

            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollTo(item.toLowerCase().replace(/ /g, "-"))}
                  className="text-[13px] text-muted-foreground hover:text-foreground transition-colors relative group"
                  style={{ fontWeight: 500 }}
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary rounded-full group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <button onClick={() => navigate("/dashboard")} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors px-4 py-2" style={{ fontWeight: 500 }}>
                Sign In
              </button>
              <motion.button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-[13px] shadow-lg shadow-primary/25"
                style={{ fontWeight: 600 }}
                whileHover={{ scale: 1.03, boxShadow: "0 8px 30px rgba(27,94,32,0.35)" }}
                whileTap={{ scale: 0.97 }}
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>

            <button className="lg:hidden p-2 rounded-xl hover:bg-muted transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-card border-b border-border shadow-xl overflow-hidden"
            >
              <div className="px-4 py-4 space-y-1">
                {navLinks.map((item) => (
                  <button key={item} onClick={() => scrollTo(item.toLowerCase().replace(/ /g, "-"))} className="block w-full text-left px-4 py-3 rounded-xl text-[14px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" style={{ fontWeight: 500 }}>
                    {item}
                  </button>
                ))}
                <div className="pt-3 border-t border-border mt-3 space-y-2">
                  <button onClick={() => navigate("/dashboard")} className="block w-full text-center px-4 py-3 rounded-xl text-[14px] text-muted-foreground hover:bg-muted transition-colors" style={{ fontWeight: 500 }}>Sign In</button>
                  <button onClick={() => navigate("/dashboard")} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground text-[14px]" style={{ fontWeight: 600 }}>Get Started <ArrowRight className="w-4 h-4" /></button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════ HERO ═══════════════ */}
      <section id="hero" className="relative pt-28 lg:pt-36 pb-20 lg:pb-32 overflow-hidden" ref={heroRef}>
        <FloatingParticles />
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-accent/5 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-primary/3 blur-[120px]" />
        </div>

        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-[13px] mb-6 border border-primary/10"
                style={{ fontWeight: 500 }}
              >
                <motion.div animate={{ rotate: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }}>
                  <Zap className="w-4 h-4 text-accent" />
                </motion.div>
                Smart Agricultural Warehouse Management
              </motion.div>

              <h1 className="text-[36px] sm:text-[44px] lg:text-[52px] !leading-[1.08] tracking-tight mb-6" style={{ fontWeight: 800 }}>
                Smarter Storage.{" "}
                <motion.span className="text-primary inline-block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                  Fresher Crops.
                </motion.span>{" "}
                <motion.span className="text-accent inline-block" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                  Zero Waste.
                </motion.span>
              </h1>

              <p className="text-[16px] sm:text-[18px] text-muted-foreground !leading-[1.7] mb-8 max-w-xl">
                The all-in-one platform for monitoring grain storage, tracking crop inventory, managing IoT sensors, and optimizing your entire agricultural supply chain with real-time intelligence.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 mb-10">
                <motion.button
                  onClick={() => navigate("/dashboard")}
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-primary-foreground text-[15px] shadow-xl shadow-primary/30"
                  style={{ fontWeight: 600 }}
                  whileHover={{ scale: 1.03, boxShadow: "0 12px 40px rgba(27,94,32,0.4)" }}
                  whileTap={{ scale: 0.97 }}
                >
                  Get Started Free <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => scrollTo("how-it-works")}
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl border border-border text-[15px] hover:bg-muted transition-colors"
                  style={{ fontWeight: 500 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Play className="w-4 h-4" /> See How It Works
                </motion.button>
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
                {["Free 14-day trial", "No credit card", "Cancel anytime", "24/7 support"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" /> {t}
                  </span>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <DashboardMockup />
              <div className="absolute -z-10 -inset-6 bg-primary/8 blur-3xl rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* ═══════════════ TRUSTED BY (Marquee) ═══════════════ */}
      <section className="py-10 border-y border-border bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[12px] text-muted-foreground mb-6 tracking-widest" style={{ fontWeight: 600 }}>
            TRUSTED BY LEADING AGRICULTURAL ORGANIZATIONS
          </p>
          <BrandMarquee />
        </div>
      </section>

      {/* ═══════════════ FEATURES (Interactive Tabs) ═══════════════ */}
      <section id="features" className="py-20 lg:py-28" ref={featuresView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={featuresView.inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-[13px] mb-4 border border-primary/10" style={{ fontWeight: 500 }}>
              <MousePointerClick className="w-4 h-4" /> 10 Powerful Modules
            </div>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] tracking-tight !leading-[1.12] mb-4" style={{ fontWeight: 700 }}>
              Everything You Need to <span className="text-primary">Manage Your Warehouse</span>
            </h2>
            <p className="text-[16px] text-muted-foreground max-w-2xl mx-auto !leading-[1.7]">
              Click any module to explore. Ten powerful tools working together to give you complete control over storage operations.
            </p>
          </motion.div>

          {/* Feature tabs + detail */}
          <div className="grid lg:grid-cols-[380px_1fr] gap-8">
            {/* Tab list */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
              {features.map((f, i) => (
                <motion.button
                  key={f.title}
                  onClick={() => setActiveFeature(i)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={featuresView.inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.04 }}
                  className={`w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-300 border ${i === activeFeature ? "bg-primary/5 border-primary/20 shadow-md" : "border-transparent hover:bg-muted hover:border-border"}`}
                >
                  <div className={`w-10 h-10 rounded-lg ${f.lightBg} flex items-center justify-center shrink-0 transition-transform ${i === activeFeature ? "scale-110" : ""}`}>
                    <f.icon className="w-5 h-5" style={{ color: f.color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] mb-0.5" style={{ fontWeight: 600 }}>{f.title}</p>
                    <p className={`text-[12px] text-muted-foreground !leading-[1.5] transition-all ${i === activeFeature ? "max-h-20 opacity-100" : "max-h-0 opacity-0 overflow-hidden"}`}>
                      {f.desc}
                    </p>
                  </div>
                  {i === activeFeature && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto mt-1">
                      <CircleDot className="w-4 h-4 text-primary" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>

            {/* Feature detail card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature}
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.98 }}
                transition={{ duration: 0.4 }}
                className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden"
              >
                {/* Feature visual */}
                <div className="p-8 lg:p-10 flex flex-col items-center justify-center min-h-[400px]" style={{ background: `linear-gradient(135deg, ${features[activeFeature].color}08, ${features[activeFeature].color}15)` }}>
                  <motion.div
                    className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg"
                    style={{ backgroundColor: `${features[activeFeature].color}15`, border: `2px solid ${features[activeFeature].color}30` }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    {(() => { const Icon = features[activeFeature].icon; return <Icon className="w-10 h-10" style={{ color: features[activeFeature].color }} />; })()}
                  </motion.div>
                  <h3 className="text-[22px] mb-3 text-center" style={{ fontWeight: 700 }}>{features[activeFeature].title}</h3>
                  <p className="text-[14px] text-muted-foreground text-center max-w-md !leading-[1.7] mb-6">{features[activeFeature].desc}</p>

                  {/* Interactive demo bars */}
                  <div className="w-full max-w-sm space-y-3">
                    {[85, 62, 94, 73].map((val, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <span className="text-[11px] text-muted-foreground w-16 text-right" style={{ fontWeight: 500 }}>
                          {["Efficiency", "Accuracy", "Uptime", "Coverage"][i]}
                        </span>
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: features[activeFeature].color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${val}%` }}
                            transition={{ duration: 1, delay: i * 0.15 }}
                          />
                        </div>
                        <span className="text-[11px] w-8" style={{ fontWeight: 600, color: features[activeFeature].color }}>{val}%</span>
                      </div>
                    ))}
                  </div>

                  <motion.button
                    onClick={() => navigate(features[activeFeature].route)}
                    className="mt-8 flex items-center gap-2 px-6 py-2.5 rounded-xl text-[13px] text-white shadow-lg"
                    style={{ backgroundColor: features[activeFeature].color, fontWeight: 600 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Explore {features[activeFeature].title} <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════ USE CASES ═══════════════ */}
      <section id="use-cases" className="py-20 lg:py-28 bg-muted/20 border-y border-border" ref={useCasesView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={useCasesView.inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-[13px] mb-4 border border-primary/10" style={{ fontWeight: 500 }}>
              <Target className="w-4 h-4" /> Industry Solutions
            </div>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] tracking-tight !leading-[1.12] mb-4" style={{ fontWeight: 700 }}>
              Built for <span className="text-primary">Every Agricultural Need</span>
            </h2>
            <p className="text-[16px] text-muted-foreground max-w-2xl mx-auto">
              From grain silos to cold storage, AgroVault adapts to your specific industry requirements.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center">
            {/* Use case tabs */}
            <div className="space-y-4">
              {useCases.map((uc, i) => (
                <motion.button
                  key={uc.title}
                  onClick={() => setActiveUseCase(i)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={useCasesView.inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className={`w-full flex items-start gap-4 p-5 rounded-2xl text-left transition-all duration-300 border ${i === activeUseCase ? "bg-card border-primary/20 shadow-lg" : "border-transparent hover:bg-card/50 hover:border-border"}`}
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-all ${i === activeUseCase ? "bg-primary text-white" : "bg-primary/10 text-primary"}`}>
                    <uc.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[16px] mb-1" style={{ fontWeight: 600 }}>{uc.title}</p>
                    <p className="text-[13px] text-muted-foreground !leading-[1.6]">{uc.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Image display */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeUseCase}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="relative rounded-2xl overflow-hidden shadow-2xl border border-border"
              >
                <ImageWithFallback
                  src={useCases[activeUseCase].image}
                  alt={useCases[activeUseCase].title}
                  className="w-full h-[300px] sm:h-[400px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center gap-3 mb-2">
                    {(() => { const Icon = useCases[activeUseCase].icon; return <Icon className="w-5 h-5 text-white" />; })()}
                    <h3 className="text-[20px] text-white" style={{ fontWeight: 700 }}>{useCases[activeUseCase].title}</h3>
                  </div>
                  <p className="text-[13px] text-white/80 !leading-[1.6]">{useCases[activeUseCase].desc}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS (Animated Counters) ═══════════════ */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden" ref={statsView.ref}>
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" animate={{ x: [0, 30, 0], y: [0, -20, 0] }} transition={{ duration: 10, repeat: Infinity }} />
          <motion.div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-white/5 blur-3xl" animate={{ x: [0, -20, 0], y: [0, 30, 0] }} transition={{ duration: 12, repeat: Infinity }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={statsView.inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
            <h2 className="text-[28px] sm:text-[36px] tracking-tight !leading-[1.12] mb-3" style={{ fontWeight: 700 }}>Powering Agricultural Operations Worldwide</h2>
            <p className="text-[16px] text-white/70 max-w-xl mx-auto">Real numbers from real warehouses using AgroVault every day.</p>
          </motion.div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={statsView.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="text-center p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 hover:bg-white/15 transition-colors group"
              >
                <motion.div whileHover={{ scale: 1.2, rotate: 10 }} transition={{ type: "spring" }}>
                  <stat.icon className="w-7 h-7 mx-auto mb-3 text-white/70 group-hover:text-white transition-colors" />
                </motion.div>
                <p className="text-[34px] sm:text-[40px] mb-1" style={{ fontWeight: 800 }}>
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-[13px] text-white/60" style={{ fontWeight: 500 }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how-it-works" className="py-20 lg:py-28" ref={howView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={howView.inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-[13px] mb-4 border border-primary/10" style={{ fontWeight: 500 }}>
              <Sparkles className="w-4 h-4" /> Simple 4-Step Setup
            </div>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] tracking-tight !leading-[1.12] mb-4" style={{ fontWeight: 700 }}>
              Up and Running <span className="text-primary">in Minutes</span>
            </h2>
            <p className="text-[16px] text-muted-foreground max-w-2xl mx-auto">
              Our guided onboarding gets you from zero to full warehouse visibility faster than ever.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-20 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                animate={howView.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative text-center group"
              >
                <motion.div
                  className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5 border-2 border-primary/20 group-hover:bg-primary group-hover:border-primary transition-all duration-300 relative z-10 bg-background"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <step.icon className="w-7 h-7 text-primary group-hover:text-white transition-colors" />
                </motion.div>
                <span className="text-[12px] text-primary mb-2 block" style={{ fontWeight: 700 }}>STEP {step.step}</span>
                <h3 className="text-[16px] mb-2" style={{ fontWeight: 600 }}>{step.title}</h3>
                <p className="text-[13px] text-muted-foreground !leading-[1.7]">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ INTEGRATIONS ═══════════════ */}
      <section className="py-20 bg-muted/20 border-y border-border" ref={integrationsView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={integrationsView.inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-[13px] mb-4 border border-primary/10" style={{ fontWeight: 500 }}>
              <Cpu className="w-4 h-4" /> Seamless Integrations
            </div>
            <h2 className="text-[28px] sm:text-[36px] tracking-tight !leading-[1.12] mb-4" style={{ fontWeight: 700 }}>
              Connects With Your <span className="text-primary">Existing Tools</span>
            </h2>
            <p className="text-[16px] text-muted-foreground max-w-xl mx-auto">
              Built to work with the protocols and platforms you already use.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {integrations.map((ig, i) => (
              <motion.div
                key={ig.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={integrationsView.inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.07 }}
                className="bg-card rounded-2xl border border-border p-5 text-center shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer"
              >
                <motion.div whileHover={{ rotate: 15, scale: 1.2 }} className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/15 transition-colors">
                  <ig.icon className="w-6 h-6 text-primary" />
                </motion.div>
                <p className="text-[13px] mb-0.5" style={{ fontWeight: 600 }}>{ig.name}</p>
                <p className="text-[11px] text-muted-foreground">{ig.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section id="pricing" className="py-20 lg:py-28" ref={pricingView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={pricingView.inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-[13px] mb-4 border border-primary/10" style={{ fontWeight: 500 }}>
              <Award className="w-4 h-4" /> Simple Pricing
            </div>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] tracking-tight !leading-[1.12] mb-4" style={{ fontWeight: 700 }}>
              Plans That <span className="text-primary">Scale With You</span>
            </h2>
            <p className="text-[16px] text-muted-foreground max-w-xl mx-auto mb-8">
              Start free, upgrade as you grow. No hidden fees, no surprises.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 p-1.5 bg-muted rounded-xl border border-border">
              <button
                onClick={() => setYearlyBilling(false)}
                className={`px-4 py-2 rounded-lg text-[13px] transition-all ${!yearlyBilling ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
                style={{ fontWeight: 500 }}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearlyBilling(true)}
                className={`px-4 py-2 rounded-lg text-[13px] transition-all ${yearlyBilling ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
                style={{ fontWeight: 500 }}
              >
                Yearly <span className="text-[11px] text-primary ml-1" style={{ fontWeight: 600 }}>Save 20%</span>
              </button>
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                animate={pricingView.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`relative bg-card rounded-2xl border p-7 shadow-sm transition-all duration-300 hover:shadow-xl ${plan.popular ? "border-primary shadow-lg scale-[1.02] lg:scale-105" : "border-border"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-[11px]" style={{ fontWeight: 600 }}>
                    Most Popular
                  </div>
                )}

                <h3 className="text-[18px] mb-1" style={{ fontWeight: 700 }}>{plan.name}</h3>
                <p className="text-[13px] text-muted-foreground mb-5">{plan.desc}</p>

                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-[40px]" style={{ fontWeight: 800 }}>
                    ${yearlyBilling ? plan.yearly : plan.monthly}
                  </span>
                  <span className="text-[14px] text-muted-foreground">/month</span>
                </div>

                <motion.button
                  onClick={() => navigate("/dashboard")}
                  className={`w-full py-3 rounded-xl text-[14px] mb-6 transition-all ${plan.popular ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "bg-muted hover:bg-primary/10 text-foreground"}`}
                  style={{ fontWeight: 600 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Start Free Trial
                </motion.button>

                <div className="space-y-2.5">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-[13px] text-muted-foreground">{f}</span>
                    </div>
                  ))}
                  {plan.missing.map((f) => (
                    <div key={f} className="flex items-start gap-2.5 opacity-40">
                      <Minus className="w-4 h-4 shrink-0 mt-0.5" />
                      <span className="text-[13px] text-muted-foreground">{f}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section id="testimonials" className="py-20 lg:py-28 bg-muted/20 border-y border-border" ref={testimonialsView.ref}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={testimonialsView.inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-[13px] mb-4 border border-primary/10" style={{ fontWeight: 500 }}>
              <Star className="w-4 h-4 text-accent" /> Customer Stories
            </div>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[42px] tracking-tight !leading-[1.12] mb-4" style={{ fontWeight: 700 }}>
              Loved by <span className="text-primary">Warehouse Teams</span> Worldwide
            </h2>
            <p className="text-[16px] text-muted-foreground max-w-xl mx-auto">
              Hear from the teams transforming their operations with AgroVault.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 30 }}
                animate={testimonialsView.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <motion.div key={j} initial={{ scale: 0 }} animate={testimonialsView.inView ? { scale: 1 } : {}} transition={{ delay: i * 0.08 + j * 0.05 }}>
                      <Star className="w-4 h-4 text-accent fill-accent" />
                    </motion.div>
                  ))}
                </div>
                <p className="text-[14px] text-muted-foreground !leading-[1.7] mb-6 italic">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-border">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[13px] group-hover:bg-primary group-hover:text-white transition-colors" style={{ fontWeight: 600 }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-[13px]" style={{ fontWeight: 600 }}>{t.name}</p>
                    <p className="text-[11px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section id="faq" className="py-20 lg:py-28" ref={faqView.ref}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={faqView.inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }} className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-[13px] mb-4 border border-primary/10" style={{ fontWeight: 500 }}>
              <Eye className="w-4 h-4" /> FAQ
            </div>
            <h2 className="text-[28px] sm:text-[36px] tracking-tight !leading-[1.12] mb-4" style={{ fontWeight: 700 }}>
              Frequently Asked <span className="text-primary">Questions</span>
            </h2>
            <p className="text-[16px] text-muted-foreground">Everything you need to know about AgroVault.</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={faqView.inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="bg-card rounded-xl border border-border overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-muted/30 transition-colors"
                >
                  <span className="text-[14px]" style={{ fontWeight: 600 }}>{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5">
                        <p className="text-[13px] text-muted-foreground !leading-[1.8]">{faq.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
        <div className="absolute inset-0 pointer-events-none">
          <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full bg-primary/5 blur-3xl" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <motion.div
              className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-8 border-2 border-primary/20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Wheat className="w-10 h-10 text-primary" />
            </motion.div>
            <h2 className="text-[28px] sm:text-[36px] lg:text-[46px] tracking-tight !leading-[1.1] mb-5" style={{ fontWeight: 800 }}>
              Ready to Transform Your{" "}<span className="text-primary">Warehouse Operations?</span>
            </h2>
            <p className="text-[16px] sm:text-[18px] text-muted-foreground mb-10 max-w-xl mx-auto !leading-[1.7]">
              Join 500+ agricultural businesses already using AgroVault to reduce crop loss, streamline logistics, and make data-driven decisions.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-3 px-9 py-4 rounded-xl bg-primary text-primary-foreground text-[16px] shadow-xl shadow-primary/30"
                style={{ fontWeight: 600 }}
                whileHover={{ scale: 1.03, boxShadow: "0 16px 50px rgba(27,94,32,0.4)" }}
                whileTap={{ scale: 0.97 }}
              >
                Start Your Free Trial <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                onClick={() => scrollTo("features")}
                className="flex items-center gap-2 px-9 py-4 rounded-xl border border-border text-[16px] hover:bg-muted transition-colors"
                style={{ fontWeight: 500 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Features
              </motion.button>
            </div>
            <p className="text-[13px] text-muted-foreground mt-6">No credit card required. 14-day free trial. Cancel anytime.</p>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="bg-card border-t border-border py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <Wheat className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-[18px] tracking-tight" style={{ fontWeight: 700 }}>AgroVault</span>
              </div>
              <p className="text-[13px] text-muted-foreground !leading-[1.7] max-w-sm mb-5">
                The intelligent agricultural warehouse management platform. Monitor, manage, and optimize your entire storage operation from one place.
              </p>
              <div className="flex items-center gap-3">
                {["Twitter", "LinkedIn", "GitHub", "YouTube"].map((s) => (
                  <button key={s} className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors text-[12px]" style={{ fontWeight: 600 }}>
                    {s[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[13px] mb-4" style={{ fontWeight: 600 }}>Product</p>
              <div className="space-y-2.5">
                {["Dashboard", "Inventory", "Storage Monitoring", "IoT Sensors", "Quality Control", "Analytics"].map((link) => (
                  <button key={link} onClick={() => navigate("/dashboard")} className="block text-[13px] text-muted-foreground hover:text-foreground transition-colors">{link}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[13px] mb-4" style={{ fontWeight: 600 }}>Company</p>
              <div className="space-y-2.5">
                {["About Us", "Careers", "Blog", "Press", "Contact", "Partners"].map((link) => (
                  <p key={link} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{link}</p>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[13px] mb-4" style={{ fontWeight: 600 }}>Legal</p>
              <div className="space-y-2.5">
                {["Privacy Policy", "Terms of Service", "Security", "GDPR Compliance", "SLA", "Cookie Policy"].map((link) => (
                  <p key={link} className="text-[13px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer">{link}</p>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[12px] text-muted-foreground">&copy; 2026 AgroVault Inc. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Shield className="w-3 h-3" /> SOC 2 Certified
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Lock className="w-3 h-3" /> AES-256 Encrypted
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <Globe className="w-3 h-3" /> GDPR Compliant
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
