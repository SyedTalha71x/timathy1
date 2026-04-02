/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import OrgaGymLogo from "../../public/OrgaGym Logo.svg";
import LanguageDropdown from "../layouts/LanguageDropdown";

export default function NavBar({ mobileMenuOpen, setMobileMenuOpen }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Prüfen, ob wir auf der Demo-Seite sind
  const isDemoPage = location.pathname === '/demo';

  // Verhindert das Scrollen des Body wenn das mobile Menü offen ist
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

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

  const handleDemoClick = () => {
    setMobileMenuOpen(false);
    navigate('/demo');
  };

  const handleHomeClick = () => {
    setMobileMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 select-none"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          msUserSelect: 'none'
        }}
        onDragStart={(e) => {
          if (e.target.tagName === 'IMG') {
            e.preventDefault();
          }
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4">
          <div className="flex items-center justify-between">
            {/* Logo - immer sichtbar, klickbar zur Startseite */}
            <button 
              onClick={handleHomeClick}
              className="flex items-center gap-2 md:gap-3 hover:opacity-80 transition-opacity"
            >
              <img 
                src={OrgaGymLogo} 
                alt="ORGAGYM" 
                className="h-8 md:h-10 w-auto"
                draggable="false"
                onDragStart={(e) => e.preventDefault()}
              />
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ORGAGYM</span>
            </button>
            
            {/* Desktop Navigation - Nur anzeigen wenn NICHT auf Demo-Seite */}
            {!isDemoPage && (
              <div className="hidden md:flex items-center gap-8">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                  Features
                </a>
                <a href="#overview" className="text-gray-300 hover:text-white transition-colors text-sm font-medium">
                  Overview
                </a>
                <button 
                  onClick={handleDemoClick}
                  className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
                >
                  Demo
                </button>
              </div>
            )}
            
            {/* Desktop Buttons - Nur anzeigen wenn NICHT auf Demo-Seite */}
            {!isDemoPage && (
              <div className="hidden md:flex items-center gap-3">
                <button 
                  onClick={handleDemoClick}
                  className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105"
                >
                  Request Demo
                </button>
                <button 
                  onClick={handleLogin}
                  className="px-5 py-2.5 bg-[#3F74FF] text-white rounded-xl font-medium text-sm transition-all duration-300 hover:bg-[#3F74FF]/90 hover:scale-105"
                >
                  Login
                </button>
                <LanguageDropdown variant="flag" />
              </div>
            )}

            {/* Mobile Header - Sprachdropdown und Menu Button */}
            {!isDemoPage && (
              <div className="md:hidden flex items-center gap-2">
                <LanguageDropdown variant="flag" isMobile />
                <button 
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-white relative z-50"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            )}

            {/* Auf Demo-Seite: Sprachdropdown + Close Button */}
            {isDemoPage && (
              <div className="flex items-center gap-2">
                <LanguageDropdown variant="flag" isMobile />
                <button
                  onClick={() => navigate("/")}
                  className="p-2 text-white relative z-50"
                  aria-label="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu - Nur anzeigen wenn NICHT auf Demo-Seite */}
          {!isDemoPage && mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-xl border-b border-white/10 py-4 px-4 z-40">
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
                <div className="flex flex-col gap-3 pt-4 border-t border-white/10">
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

      {/* Overlay für mobile Menü - dunkelt den Hintergrund ab */}
      {!isDemoPage && mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
          style={{
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        />
      )}

      {/* CSS für die Fade-In Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}