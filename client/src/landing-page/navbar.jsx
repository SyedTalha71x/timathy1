/* eslint-disable no-unused-vars */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import OrgaGymLogo from "../../public/OrgaGym Logo.svg";

export default function NavBar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 md:gap-3">
            <img src={OrgaGymLogo} alt="ORGAGYM" className="h-8 md:h-10 w-auto" />
            <span className="text-lg md:text-xl font-bold text-white tracking-tight">ORGAGYM</span>
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
  );
}
