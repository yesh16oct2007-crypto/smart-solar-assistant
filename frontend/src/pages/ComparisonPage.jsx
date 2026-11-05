import React, { useState } from 'react';
import { 
  Layers, 
  Sun, 
  Battery, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  Home, 
  Building, 
  Factory, 
  ArrowRight,
  ShieldCheck,
  Sparkles,
  HelpCircle
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

export default function ComparisonPage({ setActivePage }) {
  const [activeTab, setActiveTab] = useState('capacity'); // 'capacity' or 'architecture'

  const capacitySystems = [
    {
      capacity: '1 kW',
      title: 'Compact Household System',
      grossPrice: 58000,
      subsidy: 30000,
      netPrice: 28000,
      dailyGen: '4.0 - 4.5 kWh',
      annualGen: '1,450 - 1,600 kWh',
      roofArea: '80 - 100 sq ft',
      panelCount: '2 Panels (540W Mono PERC)',
      idealFor: '1BHK / 2BHK Apartments, Small Rural Homes, Basic load (Lights, Fans, Refrigerator, TV)',
      annualSavings: '₹10,500 - ₹12,000',
      payback: '2.4 - 2.8 Years',
      highlights: ['Maximum subsidy efficiency per kW', 'Fits very small roof areas', 'Single-phase plug & play']
    },
    {
      capacity: '3 kW',
      title: 'Popular Urban Family Villa System',
      grossPrice: 174000,
      subsidy: 78000,
      netPrice: 96000,
      dailyGen: '12 - 14 kWh',
      annualGen: '4,400 - 4,800 kWh',
      roofArea: '240 - 280 sq ft',
      panelCount: '6 Panels (540W Mono PERC)',
      idealFor: '3BHK / 4BHK Independent Houses, Duplex Villas with 1-2 Inverter ACs, Washing Machine',
      annualSavings: '₹34,000 - ₹38,000',
      payback: '2.5 - 2.8 Years',
      isPopular: true,
      highlights: ['Optimal PM Surya Ghar subsidy bracket (Full ₹78,000)', 'Zero net electricity bill for typical middle-class home', 'Sub-3 year simple payback']
    },
    {
      capacity: '5 kW',
      title: 'Heavy Residential / Light Commercial',
      grossPrice: 270000,
      subsidy: 78000,
      netPrice: 192000,
      dailyGen: '20 - 23 kWh',
      annualGen: '7,300 - 8,000 kWh',
      roofArea: '400 - 460 sq ft',
      panelCount: '9 - 10 Panels (540W Mono PERC)',
      idealFor: 'Large Independent Bungalows with 3+ ACs, EV Charging, Small Clinics, Boutique Offices',
      annualSavings: '₹58,000 - ₹66,000',
      payback: '2.9 - 3.3 Years',
      highlights: ['Supports daytime electric vehicle charging', 'DISCOM single-phase ceiling threshold', 'High seasonal yield buffer']
    },
    {
      capacity: '10 kW',
      title: 'Commercial / Institutional Solar Plant',
      grossPrice: 510000,
      subsidy: 0, // CFA applies to residential; C&I gets 40% Accelerated Depreciation
      netPrice: 510000,
      dailyGen: '42 - 48 kWh',
      annualGen: '15,000 - 16,500 kWh',
      roofArea: '800 - 950 sq ft',
      panelCount: '18 - 20 Panels (550W TOPCon Bifacial)',
      idealFor: 'Colleges, Engineering Labs, Diagnostic Centers, Corporate Branch Offices, Small Hotels',
      annualSavings: '₹1,50,000 - ₹1,80,000',
      payback: '3.0 - 3.4 Years',
      taxBenefit: '40% Accelerated Depreciation saves ~₹1.2L corporate tax in Year 1',
      highlights: ['Commercial peak tariff mitigation (₹11+/kWh)', 'Three-phase 415V synchronization', 'Dual MPPT string inverter with cloud telemetry']
    }
  ];

  const architectures = [
    {
      name: 'On-Grid (Grid-Tied)',
      subtitle: 'Utility Synchronized via Net Meter',
      icon: Zap,
      badge: 'Most Cost Effective',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      capex: 'Lowest (₹45k - ₹58k / kW)',
      gridDependency: '100% Dependent (Shuts down during power outages for anti-islanding lineman safety)',
      batteryStorage: 'None required',
      netMetering: 'Fully Supported (Exports surplus kWh to DISCOM at banked tariff)',
      maintenance: 'Minimal (Clean panels every 2-3 weeks)',
      lifespan: 'Panels 25 Years, Inverter 10-12 Years',
      pros: [
        'Lowest upfront capital expenditure',
        'Eligible for PM Surya Ghar ₹78,000 direct subsidy',
        'No recurrent battery replacement cost every 5-8 years',
        'Highest energy efficiency (97%+ inverter yield)'
      ],
      cons: [
        'Zero backup during grid blackouts (Anti-islanding safety shuts down PV)',
        'Requires stable local DISCOM grid infrastructure'
      ],
      idealFor: 'Urban cities (Bengaluru, Delhi, Mumbai, Pune, Hyderabad) with 24x7 reliable grid electricity.'
    },
    {
      name: 'Hybrid Solar System',
      subtitle: 'Net Metering + Smart Battery Backup',
      icon: Layers,
      badge: 'Best Reliability & Flexibility',
      badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
      capex: 'Moderate to High (+₹22k - ₹28k / kW for LiFePO4 battery)',
      gridDependency: 'Hybrid (Runs on solar + battery during blackouts, syncs with grid when available)',
      batteryStorage: '3 kWh to 10 kWh Modular LiFePO4 (Lithium Iron Phosphate)',
      netMetering: 'Supported in most states (Solar charges battery first, exports surplus to grid)',
      maintenance: 'Low (LiFePO4 requires zero fluid maintenance; intelligent BMS managed)',
      lifespan: 'Panels 25 Years, Battery 10-12 Years (5,000 cycles at 80% DoD)',
      pros: [
        'Seamless blackout protection for fans, lights, Wi-Fi, and refrigeration',
        'Participates in DISCOM net-metering export when battery is full',
        'Peak load shifting capability'
      ],
      cons: [
        'Higher initial capital cost due to lithium storage',
        'Requires hybrid bi-directional inverter'
      ],
      idealFor: 'Suburbs, tier-2 towns, and areas with 1-3 hours of daily power cuts or critical medical equipment.'
    },
    {
      name: 'Off-Grid Solar System',
      subtitle: 'Autonomous Remote Power Island',
      icon: Battery,
      badge: '100% Energy Independence',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      capex: 'High (+₹30k - ₹38k / kW for large battery bank & MPPT PCU)',
      gridDependency: '0% (Completely detached from utility power company)',
      batteryStorage: 'Large capacity bank (Tubular lead-acid or heavy LiFePO4)',
      netMetering: 'Not Applicable (Zero grid interconnection; cannot sell excess power)',
      maintenance: 'Medium to High (Especially if lead-acid batteries require periodic topping)',
      lifespan: 'Panels 25 Years, Lead Acid 3-5 Years / Lithium 10 Years',
      pros: [
        'Total independence from electricity bills or DISCOM outages',
        'Perfect for areas where grid line extension is prohibitively expensive',
        'Autonomous clean power in remote rural locations'
      ],
      cons: [
        'Not eligible for PM Surya Ghar grid-tied subsidy',
        'Surplus generated when batteries are full is wasted (curtailed)',
        'Significant battery replacement expense over time'
      ],
      idealFor: 'Remote farmhouses, agricultural solar pumps, hill stations, and eco-resorts off the grid.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Architecture & Capacity Benchmarks
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
          Solar System Comparison Guide
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Compare standard system capacities (1 kW to 10 kW) and architectural topologies (On-Grid, Hybrid, Off-Grid) to find the right configuration for your energy profile.
        </p>

        {/* Tab Toggle */}
        <div className="inline-flex p-1.5 rounded-2xl bg-slate-100 border border-slate-200 mt-4">
          <button
            onClick={() => setActiveTab('capacity')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'capacity'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            Capacity Sizing (1 kW - 10 kW)
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === 'architecture'
                ? 'bg-white text-navy-900 shadow-sm'
                : 'text-slate-600 hover:text-navy-900'
            }`}
          >
            System Types (On-Grid vs Hybrid vs Off-Grid)
          </button>
        </div>
      </div>

      {/* TAB 1: CAPACITY SIZING (1 kW, 3 kW, 5 kW, 10 kW) */}
      {activeTab === 'capacity' && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {capacitySystems.map((sys, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-3xl p-6 border transition-all flex flex-col justify-between ${
                  sys.isPopular
                    ? 'border-2 border-emerald-500 shadow-xl shadow-emerald-500/10 ring-2 ring-emerald-500/10 relative'
                    : 'border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-300'
                }`}
              >
                {sys.isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                    Most Popular in India
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-3xl font-black text-navy-900">{sys.capacity}</span>
                      <h3 className="text-xs font-bold text-emerald-700 mt-0.5">{sys.title}</h3>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <Sun className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Price Box */}
                  <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-[11px] text-slate-500 font-medium">Estimated Net Cost</div>
                    <div className="text-2xl font-black text-navy-900 mt-0.5">
                      {formatINR(sys.netPrice)}
                    </div>
                    {sys.subsidy > 0 ? (
                      <div className="text-[10px] text-emerald-700 font-bold mt-1">
                        After ₹{formatINR(sys.subsidy)} PM Surya Ghar Subsidy
                      </div>
                    ) : (
                      <div className="text-[10px] text-slate-500 mt-1">
                        Gross: {formatINR(sys.grossPrice)} (Eligible for 40% AD)
                      </div>
                    )}
                  </div>

                  {/* Tech Specs */}
                  <div className="space-y-2 text-xs pt-1">
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Generation:</span>
                      <span className="font-bold text-navy-900">{sys.dailyGen}/day</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Roof Area:</span>
                      <span className="font-bold text-navy-900">{sys.roofArea}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Panel Specs:</span>
                      <span className="font-medium text-slate-700 text-right">{sys.panelCount}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-100">
                      <span className="text-slate-500">Annual Savings:</span>
                      <span className="font-bold text-emerald-700">{sys.annualSavings}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-500">Est. Payback:</span>
                      <span className="font-bold text-navy-900">{sys.payback}</span>
                    </div>
                  </div>

                  {/* Ideal Applications */}
                  <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/70 text-xs text-slate-700">
                    <span className="font-bold text-emerald-900 block mb-1">Ideal For:</span>
                    <p className="text-[11px] text-slate-600 leading-snug">{sys.idealFor}</p>
                  </div>
                </div>

                <button
                  onClick={() => { setActivePage('recommendation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="mt-5 w-full py-2.5 rounded-xl text-xs font-bold text-emerald-700 border border-emerald-300 hover:bg-emerald-50 transition-colors flex items-center justify-center space-x-1"
                >
                  <span>Select {sys.capacity} System</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-500 text-center">
            * Note: System prices, subsidies, and generation are benchmark estimates based on MNRE Central Financial Assistance and typical Indian irradiance (~4.8 PSH). Actual prices may vary depending on local installer, mounting height, and cable run distance.
          </div>

        </div>
      )}

      {/* TAB 2: ARCHITECTURE COMPARISON (On-Grid vs Hybrid vs Off-Grid) */}
      {activeTab === 'architecture' && (
        <div className="space-y-8 animate-fadeIn">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {architectures.map((arch, idx) => {
              const Icon = arch.icon;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-3xl p-7 border border-slate-200 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-5">
                    
                    <div className="flex items-start justify-between">
                      <div>
                        <span className={`inline-block text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border mb-2 ${arch.badgeColor}`}>
                          {arch.badge}
                        </span>
                        <h3 className="text-xl font-bold text-navy-900">{arch.name}</h3>
                        <p className="text-xs text-slate-500">{arch.subtitle}</p>
                      </div>
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 text-emerald-700 flex items-center justify-center">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>

                    {/* Parameters Table */}
                    <div className="space-y-2 text-xs pt-1">
                      <div className="py-2 border-b border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Relative Capex</span>
                        <span className="font-bold text-navy-900">{arch.capex}</span>
                      </div>
                      <div className="py-2 border-b border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Grid Dependency</span>
                        <span className="text-slate-700 leading-snug block mt-0.5">{arch.gridDependency}</span>
                      </div>
                      <div className="py-2 border-b border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Battery Storage</span>
                        <span className="text-slate-700 block mt-0.5">{arch.batteryStorage}</span>
                      </div>
                      <div className="py-2 border-b border-slate-100">
                        <span className="text-slate-400 block text-[10px] uppercase font-bold">Net Metering Eligibility</span>
                        <span className="font-semibold text-emerald-800 block mt-0.5">{arch.netMetering}</span>
                      </div>
                    </div>

                    {/* Pros and Cons */}
                    <div className="space-y-3 pt-2 text-xs">
                      <div>
                        <span className="font-bold text-emerald-800 block mb-1.5 flex items-center space-x-1">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Advantages</span>
                        </span>
                        <ul className="space-y-1 pl-1 text-slate-600 text-[11px]">
                          {arch.pros.map((p, pIdx) => (
                            <li key={pIdx} className="flex items-start space-x-1.5">
                              <span className="text-emerald-500 font-bold">•</span>
                              <span>{p}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-2">
                        <span className="font-bold text-slate-700 block mb-1.5 flex items-center space-x-1">
                          <XCircle className="w-4 h-4 text-amber-500" />
                          <span>Trade-offs</span>
                        </span>
                        <ul className="space-y-1 pl-1 text-slate-500 text-[11px]">
                          {arch.cons.map((c, cIdx) => (
                            <li key={cIdx} className="flex items-start space-x-1.5">
                              <span className="text-amber-500 font-bold">•</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                  </div>

                  <div className="pt-6 border-t border-slate-100 mt-6">
                    <p className="text-[11px] text-slate-500 mb-3">
                      <strong>Best Application:</strong> {arch.idealFor}
                    </p>
                    <button
                      onClick={() => { setActivePage('recommendation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-emerald-600 hover:text-white text-navy-900 font-bold text-xs transition-colors"
                    >
                      Configure This Architecture &rarr;
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

    </div>
  );
}
