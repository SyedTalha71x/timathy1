/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  Calendar, 
  FileText, 
  CreditCard, 
  BarChart3, 
  MessageSquare,
  Dumbbell,
  ClipboardList,
  Settings,
  Shield,
  Zap,
  Globe,
  ChevronRight,
  Play,
  Check,
  ArrowRight,
  Sparkles,
  Building2,
  Clock,
  TrendingUp,
  Menu,
  X
} from "lucide-react";

// Import logo
import OrgaGymLogo from "../../public/Orgagym white without text.svg";
import DashboardPng from "../../public/Dashboard.png";

// Animated counter component
const AnimatedCounter = ({ target, suffix = "", duration = 2000 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Feature card component
const FeatureCard = ({ icon: Icon, title, description, color, delay }) => (
  <div 
    className="group relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] backdrop-blur-xl rounded-2xl p-5 md:p-6 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`} />
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-3 md:mb-4 shadow-lg`}>
      <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
    </div>
    <h3 className="text-lg md:text-xl font-semibold text-white mb-2 group-hover:text-orange-400 transition-colors">
      {title}
    </h3>
    <p className="text-gray-400 text-sm leading-relaxed">
      {description}
    </p>
  </div>
);

// Floating badge component
const FloatingBadge = ({ children, className }) => (
  <div className={`absolute px-3 py-1.5 md:px-4 md:py-2 bg-white/10 backdrop-blur-xl rounded-full border border-white/20 text-white text-xs md:text-sm font-medium shadow-xl ${className}`}>
    {children}
  </div>
);

export default function Home() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Close mobile menu when clicking a link
  const handleNavClick = (href) => {
    setMobileMenuOpen(false);
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLogin = () => {
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const features = [
    {
      icon: Users,
      title: "Member Management",
      description: "Manage all members, contracts, and quotas in one place. With automatic status updates and complete history tracking.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Calendar,
      title: "Appointment Scheduling",
      description: "Smart appointment management with automatic reminders, calendar sync, and flexible booking logic.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: FileText,
      title: "Contract Management",
      description: "Create, manage, and automatically renew digital contracts. With customizable templates for every need.",
      color: "from-emerald-500 to-emerald-600"
    },
    {
      icon: CreditCard,
      title: "Point of Sale",
      description: "Integrated POS system for sales, invoices, and payment processing — all in one seamless interface.",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reports",
      description: "Detailed insights into member growth, revenue, and studio performance with real-time dashboards.",
      color: "from-pink-500 to-pink-600"
    },
    {
      icon: MessageSquare,
      title: "Communication",
      description: "Email, chat, and push notifications. Keep your members informed and engaged at all times.",
      color: "from-cyan-500 to-cyan-600"
    },
    {
      icon: Dumbbell,
      title: "Training Plans",
      description: "Create and manage individual training plans. Assign them to members and track their progress.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: ClipboardList,
      title: "Task Management",
      description: "To-do lists, team tasks, and workflow automation for efficient studio operations.",
      color: "from-amber-500 to-amber-600"
    },
    {
      icon: Shield,
      title: "Role-Based Access",
      description: "Define permissions for trainers, reception, and management with granular access control.",
      color: "from-indigo-500 to-indigo-600"
    }
  ];

  const stats = [
    { value: 500, suffix: "+", label: "Active Studios" },
    { value: 50000, suffix: "+", label: "Members Managed" },
    { value: 99.9, suffix: "%", label: "Uptime" },
    { value: 24, suffix: "/7", label: "Support" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] overflow-x-hidden">
      {/* Animated background gradient */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at ${mousePosition.x}% ${mousePosition.y}%, rgba(255, 132, 62, 0.15) 0%, transparent 50%),
            radial-gradient(circle at ${100 - mousePosition.x}% ${100 - mousePosition.y}%, rgba(63, 116, 255, 0.1) 0%, transparent 50%)
          `
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <img src={OrgaGymLogo} alt="OrgaGym" className="h-8 md:h-10 w-auto" />
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">OrgaGym</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Features</a>
              <a href="#overview" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Overview</a>
              <a href="#demo" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">Demo</a>
            </div>
            
            {/* Desktop Buttons */}
            <div className="hidden md:flex items-center gap-3">
              <a 
                href="#demo"
                className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
              >
                Request Demo
              </a>
              <button 
                onClick={handleLogin}
                className="px-5 py-2.5 bg-[#3F74FF] text-white rounded-xl font-medium text-sm transition-all duration-300 hover:bg-[#3F74FF]/90 hover:scale-105"
              >
                Login
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 py-4 px-4">
              <div className="flex flex-col gap-4">
                <a 
                  href="#features" 
                  onClick={() => handleNavClick('#features')}
                  className="text-gray-300 hover:text-white transition-colors text-base font-medium py-2"
                >
                  Features
                </a>
                <a 
                  href="#overview" 
                  onClick={() => handleNavClick('#overview')}
                  className="text-gray-300 hover:text-white transition-colors text-base font-medium py-2"
                >
                  Overview
                </a>
                <a 
                  href="#demo" 
                  onClick={() => handleNavClick('#demo')}
                  className="text-gray-300 hover:text-white transition-colors text-base font-medium py-2"
                >
                  Demo
                </a>
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
                  <a 
                    href="#demo"
                    onClick={() => handleNavClick('#demo')}
                    className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium text-center"
                  >
                    Request Demo
                  </a>
                  <button 
                    onClick={handleLogin}
                    className="w-full py-3 bg-[#3F74FF] text-white rounded-xl font-medium"
                  >
                    Login
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 md:pb-32 px-4">
        <div className="absolute top-1/4 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-orange-500/20 rounded-full blur-[100px] md:blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-blue-500/20 rounded-full blur-[100px] md:blur-[128px]" />
        
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-6 md:mb-8">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
              <span className="text-xs md:text-sm text-gray-300">The All-in-One Solution for Fitness Studios</span>
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-4 md:mb-6 leading-[1.1] tracking-tight">
              Studio Management
              <br />
              <span className="bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 bg-clip-text text-transparent">
                Reimagined
              </span>
            </h1>

            <p className="text-base sm:text-lg md:text-2xl text-gray-400 max-w-3xl mx-auto mb-8 md:mb-10 leading-relaxed px-2">
              OrgaGym combines member management, scheduling, contracts, and finances in one intuitive platform. Focus on what matters most — your members.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
              <a 
                href="#demo"
                className="group w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl md:rounded-2xl font-semibold text-base md:text-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 md:gap-3"
              >
                Request Free Demo
                <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a 
                href="#features"
                className="w-full sm:w-auto px-6 md:px-8 py-3.5 md:py-4 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-xl md:rounded-2xl font-semibold text-base md:text-lg hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 md:gap-3"
              >
                <Play className="w-4 h-4 md:w-5 md:h-5" />
                Learn More
              </a>
            </div>
          </div>

          {/* Dashboard Preview */}
          <div className={`relative mt-12 md:mt-20 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent z-10 pointer-events-none" />
            <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-blue-500/10" />
              <img 
                src={DashboardPng} 
                alt="OrgaGym Dashboard" 
                className="w-full h-auto relative z-0"
              />
            </div>

            {/* Floating badges - hidden on small mobile, visible on larger screens */}
            <FloatingBadge className="hidden sm:flex top-4 md:top-10 left-2 md:left-10 animate-bounce" style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-1.5 md:gap-2">
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse" />
                Live Dashboard
              </div>
            </FloatingBadge>
            
            <FloatingBadge className="hidden sm:flex top-1/4 md:top-1/3 right-2 md:right-10 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
              <div className="flex items-center gap-1.5 md:gap-2">
                <Zap className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
                Real-time Updates
              </div>
            </FloatingBadge>

            <FloatingBadge className="hidden md:flex bottom-1/4 left-20 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" />
                GDPR Compliant
              </div>
            </FloatingBadge>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-12 md:py-20 border-y border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-1 md:mb-2">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-gray-400 text-xs md:text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-16 md:py-32">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-10 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-4 md:mb-6">
              <Settings className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
              <span className="text-xs md:text-sm text-gray-300">Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 md:mb-4">
              Everything Your Studio Needs
            </h2>
            <p className="text-base md:text-xl text-gray-400 max-w-2xl mx-auto px-2">
              One platform. All the tools. From member management to accounting — OrgaGym has you covered.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature, index) => (
              <FeatureCard 
                key={index}
                {...feature}
                delay={index * 100}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section id="overview" className="relative py-16 md:py-32 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-500/10 to-transparent" />
        
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-4 md:mb-6">
                <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
                <span className="text-xs md:text-sm text-gray-300">Why OrgaGym?</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 md:mb-6 leading-tight">
                Less Administration.
                <br />
                <span className="text-orange-400">More Time for Members.</span>
              </h2>
              <p className="text-base md:text-lg text-gray-400 mb-6 md:mb-8 leading-relaxed">
                OrgaGym was built by studio owners for studio owners. We understand the daily challenges and created a solution that truly works.
              </p>

              <div className="space-y-3 md:space-y-4">
                {[
                  "Intuitive interface — no lengthy training required",
                  "European servers, fully GDPR compliant",
                  "Regular updates and new features",
                  "Personal support via chat and phone"
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
                    </div>
                    <span className="text-gray-300 text-sm md:text-base">{item}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6">
                <a 
                  href="#demo"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 text-center"
                >
                  Start Your Demo
                </a>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <Clock className="w-4 h-4" />
                  Ready in 5 minutes
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-blue-500/20 rounded-3xl blur-3xl" />
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-5 md:p-8 border border-white/10">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {[
                    { icon: Building2, label: "Studios", value: "500+" },
                    { icon: Users, label: "Members", value: "50k+" },
                    { icon: Calendar, label: "Bookings/Month", value: "100k+" },
                    { icon: Globe, label: "Regions", value: "DACH" }
                  ].map((item, index) => (
                    <div key={index} className="bg-white/5 rounded-xl md:rounded-2xl p-4 md:p-6 text-center hover:bg-white/10 transition-colors">
                      <item.icon className="w-6 h-6 md:w-8 md:h-8 text-orange-400 mx-auto mb-2 md:mb-3" />
                      <div className="text-xl md:text-2xl font-bold text-white mb-0.5 md:mb-1">{item.value}</div>
                      <div className="text-gray-400 text-xs md:text-sm">{item.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Request Demo Section */}
      <section id="demo" className="relative py-16 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-500/5 to-transparent" />
        
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-12 border border-white/10 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-orange-500/20 rounded-full blur-[80px] md:blur-[100px]" />
            <div className="absolute bottom-0 left-0 w-40 md:w-64 h-40 md:h-64 bg-blue-500/20 rounded-full blur-[80px] md:blur-[100px]" />
            
            <div className="relative z-10">
              <div className="text-center mb-8 md:mb-10">
                <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-4 md:mb-6">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
                  <span className="text-xs md:text-sm text-gray-300">Free & No Obligation</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">
                  Ready for More Efficient Studio Management?
                </h2>
                <p className="text-gray-400 text-base md:text-lg max-w-xl mx-auto">
                  Request a personalized demo and discover how OrgaGym can simplify your daily operations.
                </p>
              </div>

              <form className="space-y-3 md:space-y-4 max-w-lg mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full px-4 md:px-5 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm md:text-base"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full px-4 md:px-5 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm md:text-base"
                    required
                  />
                </div>
                <input
                  type="text"
                  placeholder="Studio Name"
                  className="w-full px-4 md:px-5 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm md:text-base"
                  required
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 md:px-5 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm md:text-base"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  className="w-full px-4 md:px-5 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm md:text-base"
                />
                <select
                  className="w-full px-4 md:px-5 py-3 md:py-4 bg-white/5 border border-white/10 rounded-xl text-gray-400 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none cursor-pointer text-sm md:text-base"
                  defaultValue=""
                >
                  <option value="" disabled>Number of Members</option>
                  <option value="1-50">1-50 Members</option>
                  <option value="51-200">51-200 Members</option>
                  <option value="201-500">201-500 Members</option>
                  <option value="500+">More than 500 Members</option>
                </select>
                <button
                  type="submit"
                  className="w-full py-3.5 md:py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-base md:text-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center gap-2 md:gap-3"
                >
                  Request Demo
                  <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </form>

              <p className="text-center text-gray-500 text-xs md:text-sm mt-5 md:mt-6">
                No credit card required • Personal onboarding • Response within 24 hours
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
