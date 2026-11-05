import React, { useState, useEffect } from 'react';
import { Sun, Menu, X, Sparkles, Activity, ShieldCheck } from 'lucide-react';
import { fetchHealth } from '../utils/api';

export default function Navbar({ activePage, setActivePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [healthStatus, setHealthStatus] = useState({ status: 'checking', gemini_mode: 'Loading...' });

  useEffect(() => {
    fetchHealth().then(setHealthStatus).catch(() => setHealthStatus({ status: 'offline', gemini_mode: 'Demo Mode' }));
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'recommendation', label: 'Solar Recommendation' },
    { id: 'calculator', label: 'Cost Calculator' },
    { id: 'comparison', label: 'System Comparison' },
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'prompt-lab', label: 'Prompt Lab', isBadge: true, badgeText: 'B.Tech Lab' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-emerald-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand Title */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center space-x-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Sun className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-navy-900 group-hover:text-emerald-700 transition-colors">
                Smart Solar
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Assistant
              </span>
              <p className="text-[11px] font-medium text-slate-500 -mt-0.5 hidden sm:block">
                AI Energy Recommendation System
              </p>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`relative px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-emerald-800 bg-emerald-50/90 shadow-sm'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{item.label}</span>
                  {item.isBadge && (
                    <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-sm">
                      {item.badgeText}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-emerald-600 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick CTA & Status Indicator */}
          <div className="hidden md:flex items-center space-x-3">
            <div
              title={`Mode: ${healthStatus.gemini_mode}`}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  healthStatus.gemini_api_configured ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="text-[11px]">
                {healthStatus.gemini_api_configured ? 'Gemini 2.5' : 'Demo AI'}
              </span>
            </div>

            <button
              onClick={() => handleNav('recommendation')}
              className="px-4 py-2 rounded-lg text-sm font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/30 transition-all flex items-center space-x-1.5"
            >
              <Sparkles className="w-4 h-4" />
              <span>Get Solar Plan</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-emerald-100 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 shadow-xl animate-fadeIn">
          <div className="flex flex-col space-y-1.5">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-800 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <span>{item.label}</span>
                  </span>
                  {item.isBadge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      {item.badgeText}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="pt-3 border-t border-slate-100 mt-2">
              <button
                onClick={() => handleNav('recommendation')}
                className="w-full py-3 rounded-xl text-center font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-md flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-5 h-5" />
                <span>Get Solar Recommendation</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
