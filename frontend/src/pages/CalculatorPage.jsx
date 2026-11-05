import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Leaf, 
  Sun, 
  Sparkles, 
  RotateCcw, 
  ShieldCheck, 
  IndianRupee, 
  HelpCircle,
  Clock,
  Zap,
  Battery
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Area, 
  AreaChart,
  ReferenceLine
} from 'recharts';
import { formatINR, formatKW, formatKWh, formatYears } from '../utils/formatters';
import { calculateEconomics } from '../utils/api';

export default function CalculatorPage({ setActivePage }) {
  // Sizing and cost assumptions
  const [capacityKw, setCapacityKw] = useState(5.0);
  const [costPerKw, setCostPerKw] = useState(54000);
  const [tariffInr, setTariffInr] = useState(8.5);
  const [sunHours, setSunHours] = useState(4.8);
  const [degradationPct, setDegradationPct] = useState(0.7);
  const [tariffEscalationPct, setTariffEscalationPct] = useState(3.5);
  const [propertyType, setPropertyType] = useState('Residential');
  const [hasBattery, setHasBattery] = useState(false);

  // Live calculated results
  const [calcData, setCalcData] = useState(null);
  const [loading, setLoading] = useState(false);

  // Recalculate on any slider change
  useEffect(() => {
    let isCancelled = false;

    // Fast local deterministic calculation for instant 60fps UI
    const cap = Number(capacityKw);
    const dailyGen = cap * Number(sunHours) * 0.78;
    const monthlyGen = Math.round(dailyGen * 30 * 10) / 10;
    const annualGen = Math.round(dailyGen * 365 * 10) / 10;
    const grossCost = Math.round(cap * Number(costPerKw));

    let subsidy = 0;
    if (propertyType === 'Residential' && !hasBattery) {
      if (cap <= 2.0) subsidy = cap * 30000;
      else if (cap <= 3.0) subsidy = 60000 + (cap - 2.0) * 18000;
      else subsidy = 78000;
    }

    const netCost = Math.max(grossCost - subsidy, 0);
    const annualSavings = Math.round(annualGen * Number(tariffInr));
    const monthlySavings = Math.round(annualSavings / 12);
    const payback = annualSavings > 0 ? Math.round((netCost / annualSavings) * 10) / 10 : 99;
    const co2 = Math.round((annualGen * 0.82 / 1000) * 100) / 100;
    const trees = Math.round(co2 * 45);

    // 25-Year Timeline
    let cumulative = -netCost;
    const timeline = [];
    const degRate = Number(degradationPct) / 100;
    const escRate = Number(tariffEscalationPct) / 100;

    for (let yr = 1; yr <= 25; yr++) {
      const curGen = annualGen * Math.pow(1.0 - degRate, yr - 1);
      const curTariff = Number(tariffInr) * Math.pow(1.0 + escRate, yr - 1);
      const yrSavings = curGen * curTariff;
      const omCost = yr > 1 ? (grossCost * 0.01) * Math.pow(1.03, yr - 1) : 0;
      const invReplacement = yr === 12 ? (grossCost * 0.15) : 0;

      cumulative += (yrSavings - omCost - invReplacement);
      timeline.push({
        year: `Yr ${yr}`,
        yearNum: yr,
        netCashFlow: Math.round(cumulative),
        annualSavings: Math.round(yrSavings),
        isPositive: cumulative >= 0
      });
    }

    setCalcData({
      capacity_kw: cap,
      daily_gen: dailyGen,
      monthly_gen: monthlyGen,
      annual_gen: annualGen,
      gross_cost: grossCost,
      subsidy: subsidy,
      net_cost: netCost,
      monthly_savings: monthlySavings,
      annual_savings: annualSavings,
      payback_years: payback,
      co2_tonnes: co2,
      trees_equivalent: trees,
      lifetime_savings: Math.round(cumulative),
      timeline: timeline
    });

    return () => { isCancelled = true; };
  }, [capacityKw, costPerKw, tariffInr, sunHours, degradationPct, tariffEscalationPct, propertyType, hasBattery]);

  const handleReset = () => {
    setCapacityKw(5.0);
    setCostPerKw(54000);
    setTariffInr(8.5);
    setSunHours(4.8);
    setDegradationPct(0.7);
    setTariffEscalationPct(3.5);
    setPropertyType('Residential');
    setHasBattery(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Interactive Financial Simulator
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
          Solar Cost & Savings Calculator
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Adjust tariffs, installation benchmarks, degradation rates, and capacity to project cash flow, simple payback, and 25-year cumulative wealth creation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* SLIDERS & CONTROLS PANEL (5 Cols) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-navy-900 text-base flex items-center space-x-2">
              <Calculator className="w-5 h-5 text-emerald-600" />
              <span>System Parameters</span>
            </h3>
            <button
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-emerald-700 flex items-center space-x-1 font-semibold"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

          {/* 1. System Capacity */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">System Capacity</label>
              <span className="font-extrabold text-emerald-700 text-sm">
                {formatKW(capacityKw)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="50"
              step="0.5"
              value={capacityKw}
              onChange={(e) => setCapacityKw(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>1 kW (Home)</span>
              <span>10 kW (Commercial)</span>
              <span>50 kW (Industrial)</span>
            </div>
          </div>

          {/* 2. Grid Electricity Tariff */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">Grid Tariff (₹ / kWh)</label>
              <span className="font-extrabold text-emerald-700 text-sm">
                ₹{tariffInr.toFixed(1)} / kWh
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="16"
              step="0.2"
              value={tariffInr}
              onChange={(e) => setTariffInr(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹4.0 (Subsidized)</span>
              <span>₹8.5 (Avg Urban)</span>
              <span>₹16.0 (Peak Commercial)</span>
            </div>
          </div>

          {/* 3. Turnkey Capex per kW */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">Turnkey Cost per kW</label>
              <span className="font-extrabold text-emerald-700 text-sm">
                {formatINR(costPerKw)} / kW
              </span>
            </div>
            <input
              type="range"
              min="38000"
              max="95000"
              step="1000"
              value={costPerKw}
              onChange={(e) => setCostPerKw(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>₹38k (Bulk Utility)</span>
              <span>₹54k (Standard Benchmark)</span>
              <span>₹95k (Premium Hybrid)</span>
            </div>
          </div>

          {/* 4. Peak Sun Hours */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="font-bold text-slate-700">Daily Sun Hours (PSH)</label>
              <span className="font-extrabold text-emerald-700 text-sm">
                {sunHours.toFixed(1)} Hours / Day
              </span>
            </div>
            <input
              type="range"
              min="3.5"
              max="6.0"
              step="0.1"
              value={sunHours}
              onChange={(e) => setSunHours(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>3.5 hrs (East/Northeast)</span>
              <span>4.8 hrs (National Avg)</span>
              <span>6.0 hrs (Rajasthan/Ladakh)</span>
            </div>
          </div>

          {/* 5. Toggles: Property Type & Battery */}
          <div className="pt-2 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Property Type
              </label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="Residential">Residential (PM Surya Ghar)</option>
                <option value="Commercial">Commercial / Institutional</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Battery Storage?
              </label>
              <select
                value={hasBattery ? 'yes' : 'no'}
                onChange={(e) => setHasBattery(e.target.value === 'yes')}
                className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium"
              >
                <option value="no">No Battery (On-Grid)</option>
                <option value="yes">With LiFePO4 Battery</option>
              </select>
            </div>
          </div>

          {/* 6. Advanced Rates: Degradation & Inflation */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Long-Term Economic Factors
            </div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-[11px] text-slate-600 block mb-0.5">
                  Panel Degradation: <strong>{degradationPct}%/yr</strong>
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="1.5"
                  step="0.1"
                  value={degradationPct}
                  onChange={(e) => setDegradationPct(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none accent-emerald-600"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-0.5">
                  Tariff Escalation: <strong>{tariffEscalationPct}%/yr</strong>
                </label>
                <input
                  type="range"
                  min="1.0"
                  max="8.0"
                  step="0.5"
                  value={tariffEscalationPct}
                  onChange={(e) => setTariffEscalationPct(Number(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 rounded appearance-none accent-emerald-600"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RESULTS & CHARTS DISPLAY (7 Cols) */}
        {calcData && (
          <div className="lg:col-span-7 space-y-6">
            
            {/* Primary KPI Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
              
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">Net Investment</div>
                <div className="text-xl font-black text-navy-900 mt-0.5">
                  {formatINR(calcData.net_cost)}
                </div>
                {calcData.subsidy > 0 && (
                  <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                    Subsidized by {formatINR(calcData.subsidy)}
                  </div>
                )}
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">Annual Savings</div>
                <div className="text-xl font-black text-emerald-600 mt-0.5">
                  {formatINR(calcData.annual_savings)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {formatINR(calcData.monthly_savings)} / month
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">Payback Period</div>
                <div className="text-xl font-black text-navy-900 mt-0.5">
                  {formatYears(calcData.payback_years)}
                </div>
                <div className="text-[10px] text-teal-600 font-bold mt-0.5">
                  Break-even horizon
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">Annual Generation</div>
                <div className="text-lg font-black text-navy-900 mt-0.5">
                  {formatKWh(calcData.annual_gen)}
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {formatKWh(calcData.monthly_gen)} / mo
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">25-Yr Net Wealth</div>
                <div className="text-lg font-black text-emerald-700 mt-0.5">
                  {formatINR(calcData.lifetime_savings)}
                </div>
                <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
                  After O&M & Replacement
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                <div className="text-xs text-slate-500 font-medium">CO₂ Avoided</div>
                <div className="text-lg font-black text-teal-700 mt-0.5">
                  {calcData.co2_tonnes} T/yr
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  ~{calcData.trees_equivalent} trees planted
                </div>
              </div>

            </div>

            {/* 25-Year Cumulative Cash Flow Chart */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="font-bold text-navy-900 text-base">
                    25-Year Cumulative Net Cash Flow
                  </h4>
                  <p className="text-xs text-slate-500">
                    Takes into account initial capital expenditure, annual savings, module degradation, and inverter replacement at Year 12.
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="font-semibold text-slate-700">Cumulative Savings (₹)</span>
                </div>
              </div>

              <div className="h-72 w-full pt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={calcData.timeline} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="wealthGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748B' }} />
                    <YAxis 
                      tick={{ fontSize: 11, fill: '#64748B' }}
                      tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />
                    <Tooltip 
                      formatter={(val) => [formatINR(val), "Net Cash Flow"]}
                      labelFormatter={(label) => `${label}`}
                      contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <ReferenceLine y={0} stroke="#94A3B8" strokeDasharray="3 3" />
                    <Area 
                      type="monotone" 
                      dataKey="netCashFlow" 
                      stroke="#059669" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#wealthGrad)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
                <span>
                  🟢 Break-even is reached around Year <strong>{Math.ceil(calcData.payback_years)}</strong>, providing {25 - Math.ceil(calcData.payback_years)} years of pure profit.
                </span>
                <button
                  onClick={() => { setActivePage('recommendation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="font-bold text-emerald-700 hover:text-emerald-800 flex-shrink-0"
                >
                  Generate Official Report &rarr;
                </button>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
