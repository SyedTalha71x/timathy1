/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Sparkles, 
  Check, 
  Clock, 
  Users, 
  Calendar, 
  FileText, 
  CreditCard,
  MessageSquare,
  Shield,
  Zap,
  Building2,
  Globe
} from "lucide-react";
import NavBar from "./navbar";

export default function Demo() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    studioName: '',
    email: '',
    phone: '',
    members: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Prüfen ob alle Pflichtfelder ausgefüllt sind
  const isFormValid = () => {
    return (
      formData.firstName.trim() !== '' &&
      formData.lastName.trim() !== '' &&
      formData.studioName.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.members.trim() !== '' &&
      formData.phone.trim() !== ''
    );
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prüfen ob Formular gültig ist
    if (!isFormValid()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Hier später die API-Integration einfügen
    // Simuliere API-Aufruf
    setTimeout(() => {
      console.log('Demo Request:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);
      
      // Nach 3 Sekunden zurück zur Home-Seite oder weiterleiten
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }, 1500);
  };

  const handleClose = () => {
    navigate('/');
  };

  const benefits = [
    {
      icon: Users,
      title: "Member Management",
      description: "Complete member overview with contract and payment history"
    },
    {
      icon: Calendar,
      title: "Smart Scheduling",
      description: "Appointment management with automatic reminders"
    },
    {
      icon: FileText,
      title: "Digital Contracts",
      description: "Create and manage contracts with electronic signatures"
    },
    {
      icon: CreditCard,
      title: "Integrated POS",
      description: "Seamless payment processing and invoicing"
    },
    {
      icon: MessageSquare,
      title: "Automated Communication",
      description: "Keep members informed via email, SMS, and push notifications"
    },
    {
      icon: Shield,
      title: "GDPR Compliant",
      description: "European servers with highest security standards"
    }
  ];

  return (
    <>
      <NavBar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      
      <div 
        className="min-h-screen bg-[#0a0a0a] overflow-x-hidden select-none pt-16"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          msUserSelect: 'none'
        }}
      >
        {/* Animated Background */}
        <div className="fixed inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px]" />
        </div>

        {/* Grid Pattern */}
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

        {/* Close Button - oben rechts */}
        {/* Hero Section mit kompaktem Header - weiter oben */}
        <section className="relative pt-4 md:pt-6 pb-8 md:pb-12">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="text-center mb-6 md:mb-8">
              <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-4 md:mb-5">
                <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-orange-400" />
                <span className="text-xs md:text-sm text-gray-300">Free & No Obligation</span>
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2 md:mb-3">
                Request Your Free Demo
              </h1>
              <p className="text-sm md:text-base text-gray-400 max-w-2xl mx-auto">
                Get a personalized tour of OrgaGym and see how we can transform your studio management.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-6 md:gap-10 items-start">
              {/* Form Section - jetzt weiter oben */}
              <div className="relative lg:sticky lg:top-24">
                <div className="relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-2xl md:rounded-3xl p-5 md:p-7 border border-white/10">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/20 rounded-full blur-[80px]" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-blue-500/20 rounded-full blur-[80px]" />
                  
                  <div className="relative z-10">
                    {!submitSuccess ? (
                      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4" id="demo-form">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 md:mb-2">
                              First Name *
                            </label>
                            <input
                              type="text"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm md:text-base"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-300 mb-1.5 md:mb-2">
                              Last Name *
                            </label>
                            <input
                              type="text"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                              required
                              className="w-full px-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm md:text-base"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5 md:mb-2">
                            Studio Name *
                          </label>
                          <input
                            type="text"
                            name="studioName"
                            value={formData.studioName}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm md:text-base"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5 md:mb-2">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm md:text-base"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5 md:mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all text-sm md:text-base"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-1.5 md:mb-2">
                            Number of Members *
                          </label>
                          <select
                            name="members"
                            value={formData.members}
                            onChange={handleInputChange}
                            required
                            className="w-full px-4 py-2.5 md:py-3 bg-white/5 border border-white/10 rounded-xl text-gray-300 focus:outline-none focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 transition-all appearance-none cursor-pointer text-sm md:text-base"
                          >
                            <option value="" disabled>Select number of members</option>
                            <option value="1-50">1-50 Members</option>
                            <option value="51-200">51-200 Members</option>
                            <option value="201-500">201-500 Members</option>
                            <option value="500+">More than 500 Members</option>
                          </select>
                        </div>
                        
                        {/* Desktop Submit Button */}
                        <button
                          type="submit"
                          disabled={!isFormValid() || isSubmitting}
                          className={`hidden md:flex w-full py-3 md:py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold text-base transition-all duration-300 items-center justify-center gap-2 mt-2 ${
                            !isFormValid() || isSubmitting
                              ? 'opacity-50 cursor-not-allowed'
                              : 'hover:scale-[1.02]'
                          }`}
                        >
                          {isSubmitting ? (
                            <>Sending... <Clock className="w-5 h-5 animate-spin" /></>
                          ) : (
                            <>Request Demo <ArrowRight className="w-5 h-5" /></>
                          )}
                        </button>
                        
                        <p className="text-center text-gray-500 text-xs mt-3">
                          All fields are required. By submitting this form, you agree to our privacy policy. We'll get back to you within 24 hours.
                        </p>
                      </form>
                    ) : (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Check className="w-8 h-8 text-green-400" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">Thank You!</h3>
                        <p className="text-gray-400 mb-4">
                          Your demo request has been sent successfully. We'll contact you within 24 hours to schedule your personal tour.
                        </p>
                        <p className="text-sm text-gray-500">
                          Redirecting you to the homepage...
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Benefits Section - jetzt rechts mit besserem Spacing */}
              <div className="space-y-5">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl md:rounded-3xl p-5 md:p-7 border border-white/10">
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-3">
                    What You'll Get
                  </h2>
                  <p className="text-gray-400 text-sm mb-5">
                    In your personalized demo, we'll show you how OrgaGym can help you:
                  </p>
                  
                  <div className="space-y-3">
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <benefit.icon className="w-3 h-3 text-orange-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium text-sm">
                            {benefit.title}
                          </h3>
                          <p className="text-gray-400 text-xs">
                            {benefit.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 pt-5 border-t border-white/10">
                    <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm">
                      <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-gray-300">30-min live demo</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-gray-300">Q&A session</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-orange-400" />
                        <span className="text-gray-300">Customized for your studio</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Trust Section - integriert in die rechte Seite */}
                <div className="bg-gradient-to-br from-white/5 to-white/0 backdrop-blur-xl rounded-2xl p-5 border border-white/10">
                  <h3 className="text-white font-semibold mb-3 text-center text-sm">Trusted by Studios Worldwide</h3>
                  <div className="flex flex-wrap justify-center gap-5 items-center">
                    <div className="text-center">
                      <div className="text-lg md:text-xl font-bold text-white">500+</div>
                      <div className="text-gray-400 text-xs">Active Studios</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg md:text-xl font-bold text-white">50k+</div>
                      <div className="text-gray-400 text-xs">Members Managed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg md:text-xl font-bold text-white">99.9%</div>
                      <div className="text-gray-400 text-xs">Uptime</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg md:text-xl font-bold text-white">24/7</div>
                      <div className="text-gray-400 text-xs">Support</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Action Button für mobile - Request Demo (mittig platziert, weiter unten) */}
      {isMobile && !submitSuccess && (
        <div className="fixed bottom-3 left-0 right-0 z-50 flex justify-center px-4">
          <button
            onClick={() => {
              if (isFormValid()) {
                const form = document.getElementById('demo-form');
                if (form) {
                  form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
                }
              }
            }}
            disabled={!isFormValid() || isSubmitting}
            className={`bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full px-6 py-4 shadow-2xl transition-all duration-300 flex items-center gap-2 font-semibold ${
              !isFormValid() || isSubmitting
                ? 'brightness-50 cursor-not-allowed shadow-orange-500/10'
                : 'shadow-orange-500/30 hover:scale-105 animate-bounce'
            }`}
            style={isFormValid() && !isSubmitting ? { animationDuration: '2s' } : {}}
          >
            {isSubmitting ? (
              <>
                <Clock className="w-5 h-5 animate-spin" />
                <span>Sending...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Request Demo</span>
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}