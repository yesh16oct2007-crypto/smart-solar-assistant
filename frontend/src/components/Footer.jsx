import React from 'react';
import { Sun, Heart, ExternalLink, Zap, ShieldAlert, Award } from 'lucide-react';

export default function Footer({ setActivePage }) {
  return (
    <footer className="bg-navy-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand & Project Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                <Sun className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-white">
                  Smart Solar Assistant
                </span>
                <span className="block text-xs text-emerald-400 font-medium">
                  AI Energy Recommendation Platform
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              An engineering-grade solar sizing and financial advisory platform tailored for India. 
              Accelerating rooftop solar adoption across residences, colleges, commercial offices, and industrial hubs.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/60 text-xs text-emerald-300">
              <Award className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>B.Tech Prompt Engineering Capstone Project</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Explore Tools
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => { setActivePage('recommendation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Solar Recommendation
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('calculator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Solar Cost Calculator
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('comparison'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  System Sizing Comparison
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Analytics Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Prompt Engineering Lab */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              AI & Academics
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <button
                  onClick={() => { setActivePage('prompt-lab'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-emerald-400 transition-colors flex items-center space-x-1"
                >
                  <span>Prompt Engineering Lab</span>
                  <span className="text-[10px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-mono">NEW</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  About the Project
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActivePage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-slate-400 hover:text-emerald-400 transition-colors"
                >
                  Contact & Feedback
                </button>
              </li>
            </ul>
          </div>

          {/* Government Initiatives */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-white mb-4">
              Indian Solar Schemes
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>PM Surya Ghar:</strong> Up to ₹78,000 CFA direct subsidy for residential consumers.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>40% Accelerated Depreciation</strong> for C&I installations under Section 32 IT Act.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <Zap className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                <span>
                  <strong>National Portal:</strong> Register at <code className="text-emerald-300">pmsuryaghar.gov.in</code>
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Disclaimer Note */}
        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="flex items-center space-x-1.5">
            <ShieldAlert className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span>
              Disclaimer: Sizing calculations and financial projections are illustrative engineering estimates based on CEA and MNRE benchmark parameters. Live tariffs, shadow patterns, and DISCOM net-metering policies may vary by utility circle.
            </span>
          </p>
          <div className="flex items-center space-x-4 text-xs text-slate-400 flex-shrink-0">
            <span>© {new Date().getFullYear()} Smart Solar Assistant</span>
            <span>•</span>
            <span className="text-emerald-400">Green Energy for India</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
