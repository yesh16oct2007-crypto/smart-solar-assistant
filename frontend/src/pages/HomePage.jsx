import React, { useState } from 'react';
import { 
  Sparkles, 
  Calculator, 
  Zap, 
  CheckCircle2, 
  TrendingUp, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  Sun, 
  BatteryCharging, 
  Layers, 
  Compass, 
  DollarSign 
} from 'lucide-react';
import { SolarHeroIllustration, SolarPanelsIllustration, EcoLeafIllustration } from '../components/SolarIllustration';

export default function HomePage({ setActivePage }) {
  const [selectedState, setSelectedState] = useState('Rajasthan');

  const stateHighlights = {
    Rajasthan: { psh: 5.5, potential: 'Highest in India', note: 'Ideal for high-yield mono PERC bifacial installations with ~1500 kWh/kWp/yr.' },
    Gujarat: { psh: 5.4, potential: 'Exceptional Solar Hub', note: 'Strong DISCOM solar infrastructure & fast net-metering synchronization.' },
    Karnataka: { psh: 5.2, potential: 'High Rooftop Potential', note: 'Moderate ambient temps minimize thermal coefficient losses in modules.' },
    Maharashtra: { psh: 5.0, potential: 'Heavy Commercial Savings', note: 'High commercial tariff slabs (₹11+) yield fast sub-3-year payback.' },
    'Tamil Nadu': { psh: 5.1, potential: 'Industrial & Wind-Solar Hybrid', note: 'Reliable insolation across industrial belts like Coimbatore & Chennai.' }
  };

  return (
    <div className="space-y-20 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-24">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-100/60 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-72 h-72 bg-teal-100/40 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTAs */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 shadow-sm">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                <span>PM Surya Ghar: Muft Bijli Yojana Ready (₹78,000 Subsidy)</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-navy-900 leading-[1.12]">
                Smart Solar Energy <br className="hidden sm:inline" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800">
                  Recommendation Assistant
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 font-medium leading-relaxed max-w-2xl">
                Discover Your Ideal Solar System. Reduce Electricity Costs. Build a Sustainable Future.
              </p>

              <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl">
                Engineered for Indian homes, colleges, offices, and factories. Combines rigorous electrical physics sizing with Google Gemini AI to deliver transparent ROI and subsidy breakdowns.
              </p>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  onClick={() => { setActivePage('recommendation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-6 py-3.5 rounded-xl text-base font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all flex items-center justify-center space-x-2.5"
                >
                  <Sparkles className="w-5 h-5" />
                  <span>Get Solar Recommendation</span>
                </button>

                <button
                  onClick={() => { setActivePage('calculator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-6 py-3.5 rounded-xl text-base font-bold text-navy-900 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm hover:border-emerald-300 transition-all flex items-center justify-center space-x-2.5"
                >
                  <Calculator className="w-5 h-5 text-emerald-600" />
                  <span>Calculate Savings</span>
                </button>
              </div>

              {/* Key Highlights Pill Row */}
              <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 border-t border-slate-100">
                <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                  <div className="text-xl font-bold text-emerald-700">300+</div>
                  <div className="text-[11px] font-medium text-slate-500">Sunny Days / Yr</div>
                </div>
                <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                  <div className="text-xl font-bold text-emerald-700">₹78,000</div>
                  <div className="text-[11px] font-medium text-slate-500">Govt CFA Subsidy</div>
                </div>
                <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                  <div className="text-xl font-bold text-emerald-700">Up to 90%</div>
                  <div className="text-[11px] font-medium text-slate-500">Bill Reduction</div>
                </div>
                <div className="p-2.5 bg-slate-50/80 rounded-xl border border-slate-100">
                  <div className="text-xl font-bold text-emerald-700">25 Years</div>
                  <div className="text-[11px] font-medium text-slate-500">Panel Performance</div>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Illustration & Floating Cards */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-lg">
                <SolarHeroIllustration className="w-full h-auto drop-shadow-xl" />

                {/* Floating Metric Badge 1: Payback */}
                <div className="absolute -bottom-4 -left-4 sm:left-2 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-xl border border-emerald-100 flex items-center space-x-3 animate-float">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Average Payback</div>
                    <div className="text-base font-extrabold text-navy-900">2.5 to 3.8 Years</div>
                  </div>
                </div>

                {/* Floating Metric Badge 2: Prompt Engineering Subject Badge */}
                <div className="absolute top-2 -right-2 sm:right-0 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-xl border border-emerald-100 flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-teal-500 text-white flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold uppercase">Academic Project</div>
                    <div className="text-xs font-bold text-emerald-800">Prompt Engineering Lab</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW IT WORKS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Transparent 4-Step Process
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
            How Smart Solar Assistant Works
          </h2>
          <p className="text-slate-600 text-base">
            From raw electricity bills to an audit-grade solar PV blueprint with verified Indian subsidies and AI reasoning.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              01
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">Input Site & Bill Data</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Enter your city, property type, monthly bill or kWh consumption, and available rooftop area.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              02
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">Deterministic Sizing</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our physics engine calculates exact kW capacity, panel count (540W Mono PERC), and roof area clearance based on state peak sun hours.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              03
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">Financials & Subsidy</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Applies PM Surya Ghar Muft Bijli Yojana Central Financial Assistance (up to ₹78,000) and calculates payback in years.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-lg mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              04
            </div>
            <h3 className="text-lg font-bold text-navy-900 mb-2">AI Engineering Rationale</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Google Gemini generates a formal engineering justification covering inverter DC:AC ratios, CEA earthing safety, and net-metering.
            </p>
          </div>

        </div>
      </section>

      {/* 3. FEATURE CARDS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Complete Toolkit
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
            Engineered for Precision & Transparency
          </h2>
          <p className="text-slate-600 text-base">
            Everything you need to evaluate rooftop solar feasibility without fabricated quotes or vendor bias.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Feature 1 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5">
                <Sun className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">
                Solar Recommendation Engine
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Input monthly bills, roof dimensions, and backup requirements. Get a tailored recommendation with panel count, gross/net cost, monthly generation, and payback period.
              </p>
            </div>
            <button
              onClick={() => { setActivePage('recommendation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-sm font-bold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1.5"
            >
              <span>Get Recommendation</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5">
                <Calculator className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">
                Interactive Cost Calculator
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Adjust sliders for system capacity, DISCOM tariffs, installation costs, and degradation rates. View real-time 25-year cumulative wealth generated and CO2 offset.
              </p>
            </div>
            <button
              onClick={() => { setActivePage('calculator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center space-x-1.5"
            >
              <span>Try Live Calculator</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feature 3: Prompt Lab */}
          <div className="bg-gradient-to-br from-emerald-900 to-navy-900 text-white p-7 rounded-2xl shadow-md hover:shadow-xl transition-all flex flex-col justify-between border border-emerald-700">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center justify-center mb-5">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-white mb-2 uppercase">
                B.Tech Coursework Lab
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Prompt Engineering Lab
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">
                Interactive demonstration of Role-based, Few-shot, Context-based, and Constraint-based prompting for generative AI solar audits.
              </p>
            </div>
            <button
              onClick={() => { setActivePage('prompt-lab'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-sm font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1.5"
            >
              <span>Explore Prompt Lab</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">
                System Comparison Matrix
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Compare 1 kW, 3 kW, 5 kW, and 10 kW configurations alongside On-Grid, Off-Grid, and Hybrid battery architectures.
              </p>
            </div>
            <button
              onClick={() => { setActivePage('comparison'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-sm font-bold text-amber-700 hover:text-amber-800 flex items-center space-x-1.5"
            >
              <span>View System Comparison</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">
                Executive Analytics Dashboard
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Visualize monthly bill comparisons, 25-year cumulative savings trajectories, and manage stored SQLite recommendations.
              </p>
            </div>
            <button
              onClick={() => { setActivePage('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-sm font-bold text-blue-700 hover:text-blue-800 flex items-center space-x-1.5"
            >
              <span>Open Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-400 hover:shadow-lg transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5">
                <BatteryCharging className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">
                SolarAI Floating Assistant
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                Chat anytime with our floating AI assistant trained on Indian DISCOM regulations, PM Surya Ghar procedures, and battery chemistry.
              </p>
            </div>
            <div className="text-sm font-bold text-purple-700 flex items-center space-x-1.5">
              <span>Click bottom-right badge anytime</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. INDIAN STATES SOLAR POTENTIAL EXPLORER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Solar Insolation Benchmark
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                Indian State Solar Radiation
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                India receives an average of 4.5 to 5.5 Peak Sun Hours (PSH) per day. Click a state to explore its solar potential and yield characteristics:
              </p>

              {/* State Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {Object.keys(stateHighlights).map((state) => (
                  <button
                    key={state}
                    onClick={() => setSelectedState(state)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      selectedState === state
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {state}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 bg-emerald-50/70 p-6 sm:p-8 rounded-2xl border border-emerald-100">
              <div className="flex items-center justify-between pb-4 border-b border-emerald-200">
                <div>
                  <h4 className="text-xl font-bold text-navy-900">{selectedState}</h4>
                  <span className="text-xs font-semibold text-emerald-700">
                    {stateHighlights[selectedState].potential}
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-emerald-800">
                    {stateHighlights[selectedState].psh} PSH
                  </div>
                  <div className="text-[11px] font-medium text-slate-500">Peak Sun Hours / Day</div>
                </div>
              </div>

              <p className="mt-4 text-sm text-slate-700 leading-relaxed">
                {stateHighlights[selectedState].note}
              </p>

              <div className="mt-6 pt-4 border-t border-emerald-200/60 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Ready to calculate your exact rooftop system in {selectedState}?
                </span>
                <button
                  onClick={() => { setActivePage('recommendation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
                >
                  Configure For {selectedState}
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-900 via-emerald-950 to-navy-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-8 border border-emerald-800">
          <div className="space-y-3 max-w-xl">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Ready to Cut Your Electricity Bills by Up to 90%?
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Generate your free, personalized solar sizing report with PM Surya Ghar subsidy calculations and engineering payback estimates now.
            </p>
          </div>

          <button
            onClick={() => { setActivePage('recommendation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-8 py-4 rounded-xl font-extrabold text-navy-900 bg-white hover:bg-emerald-50 shadow-lg hover:shadow-xl transition-all flex items-center space-x-2 flex-shrink-0"
          >
            <Sparkles className="w-5 h-5 text-emerald-600" />
            <span>Generate Free Plan</span>
          </button>
        </div>
      </section>

    </div>
  );
}
