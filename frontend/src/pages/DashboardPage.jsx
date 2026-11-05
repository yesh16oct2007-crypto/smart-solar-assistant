import React, { useState, useEffect } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { 
  Sun, 
  TrendingUp, 
  DollarSign, 
  Leaf, 
  Trash2, 
  Eye, 
  RefreshCw, 
  Plus, 
  Sparkles, 
  X, 
  CheckCircle, 
  Calendar,
  Building,
  ShieldAlert,
  Loader2
} from 'lucide-react';
import { fetchRecommendations, deleteRecommendation } from '../utils/api';
import { formatINR, formatKW, formatKWh, formatYears } from '../utils/formatters';

export default function DashboardPage({ setActivePage, sharedRecommendation }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [filterType, setFilterType] = useState('All');

  const loadData = async () => {
    setLoading(true);
    try {
      const resp = await fetchRecommendations(50);
      if (resp.success && resp.data) {
        setRecommendations(resp.data);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm(`Are you sure you want to delete recommendation #${id}?`)) return;
    try {
      await deleteRecommendation(id);
      setRecommendations(recommendations.filter(r => r.id !== id));
      if (selectedRecord?.id === id) setSelectedRecord(null);
    } catch (err) {
      alert('Failed to delete recommendation.');
    }
  };

  // Aggregate stats across stored recommendations
  const totalRecords = recommendations.length;
  const latestRec = recommendations[0] || sharedRecommendation;

  // Monthly expense comparison demo data (12 Months)
  const monthlyExpenseData = [
    { month: 'Jan', beforeSolar: 4200, afterSolar: 600 },
    { month: 'Feb', beforeSolar: 4600, afterSolar: 650 },
    { month: 'Mar', beforeSolar: 5800, afterSolar: 750 },
    { month: 'Apr', beforeSolar: 6800, afterSolar: 800 },
    { month: 'May', beforeSolar: 7200, afterSolar: 850 },
    { month: 'Jun', beforeSolar: 6100, afterSolar: 820 },
    { month: 'Jul', beforeSolar: 4900, afterSolar: 950 }, // Monsoon dip
    { month: 'Aug', beforeSolar: 4700, afterSolar: 920 }, // Monsoon dip
    { month: 'Sep', beforeSolar: 5100, afterSolar: 800 },
    { month: 'Oct', beforeSolar: 5400, afterSolar: 700 },
    { month: 'Nov', beforeSolar: 4300, afterSolar: 600 },
    { month: 'Dec', beforeSolar: 3900, afterSolar: 550 }
  ];

  // 25-Year Cumulative Savings Trajectory
  const cumulativeData = [
    { year: 'Yr 1', savings: 38400, investment: 96000 },
    { year: 'Yr 3', savings: 118000, investment: 96000 },
    { year: 'Yr 5', savings: 202000, investment: 96000 },
    { year: 'Yr 10', savings: 430000, investment: 96000 },
    { year: 'Yr 15', savings: 690000, investment: 110000 },
    { year: 'Yr 20', savings: 1010000, investment: 110000 },
    { year: 'Yr 25', savings: 1390000, investment: 110000 }
  ];

  const filteredRecs = filterType === 'All' 
    ? recommendations 
    : recommendations.filter(r => r.property_type?.toLowerCase().includes(filterType.toLowerCase()));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Analytics & Database Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 mt-1">
            Solar Energy Analytics Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Real-time telemetry, bill comparison curves, and historical sizing audits stored in SQLite.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors shadow-sm"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => { setActivePage('recommendation'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>New Recommendation</span>
          </button>
        </div>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] text-slate-500 font-semibold">Recommended Capacity</div>
          <div className="text-xl font-black text-navy-900 mt-1">
            {latestRec ? formatKW(latestRec.recommended_capacity_kw) : '3.0 kW'}
          </div>
          <div className="text-[10px] text-emerald-700 font-bold mt-0.5">
            Optimal sizing
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] text-slate-500 font-semibold">Net Installation Cost</div>
          <div className="text-xl font-black text-navy-900 mt-1">
            {latestRec ? formatINR(latestRec.net_cost) : '₹96,000'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Post-PM Surya Ghar
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] text-slate-500 font-semibold">Monthly Savings</div>
          <div className="text-xl font-black text-emerald-600 mt-1">
            {latestRec ? formatINR(latestRec.monthly_savings) : '₹3,200'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Per month net
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] text-slate-500 font-semibold">Annual Savings</div>
          <div className="text-xl font-black text-emerald-700 mt-1">
            {latestRec ? formatINR(latestRec.annual_savings) : '₹38,400'}
          </div>
          <div className="text-[10px] text-emerald-600 font-bold mt-0.5">
            Year 1 savings
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] text-slate-500 font-semibold">Energy Generation</div>
          <div className="text-xl font-black text-navy-900 mt-1">
            {latestRec ? formatKWh(latestRec.annual_generation_kwh) : '4,536 kWh'}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Annual clean yield
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="text-[11px] text-slate-500 font-semibold">CO₂ Offset / Yr</div>
          <div className="text-xl font-black text-teal-700 mt-1">
            {latestRec ? `${latestRec.co2_avoided_tonnes_yr} T` : '3.72 T'}
          </div>
          <div className="text-[10px] text-teal-600 font-bold mt-0.5">
            ~{latestRec?.trees_equivalent || 167} trees
          </div>
        </div>

      </div>

      {/* CHARTS ROW (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Monthly Electricity Expense Comparison */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy-900 text-base">
                Monthly Electricity Expense Comparison
              </h3>
              <p className="text-xs text-slate-500">
                Current utility bill vs expected bill post rooftop solar net metering (₹)
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyExpenseData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} tickFormatter={(v) => `₹${v}`} />
                <Tooltip 
                  formatter={(val, name) => [formatINR(val), name === 'beforeSolar' ? 'Before Solar (DISCOM)' : 'After Solar (Net)']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend 
                  wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
                  formatter={(val) => val === 'beforeSolar' ? 'Before Solar (Current Bill)' : 'After Solar (Net Exported Bill)'}
                />
                <Bar dataKey="beforeSolar" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="afterSolar" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: 25-Year Cumulative Savings Trajectory */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-navy-900 text-base">
                25-Year Cumulative Savings Trajectory
              </h3>
              <p className="text-xs text-slate-500">
                Cumulative net return vs Initial Capex threshold (₹ in Lakhs)
              </p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cumulativeData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748B' }} 
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(1)}L`} 
                />
                <Tooltip 
                  formatter={(val, name) => [formatINR(val), name === 'savings' ? 'Cumulative Net Savings' : 'Initial Capex']}
                  contentStyle={{ backgroundColor: '#0F172A', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }} />
                <Line type="monotone" dataKey="savings" stroke="#059669" strokeWidth={3} dot={{ r: 4 }} name="Cumulative Savings" />
                <Line type="stepAfter" dataKey="investment" stroke="#E2E8F0" strokeWidth={2} strokeDasharray="4 4" name="Capex Baseline" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* PREVIOUS RECOMMENDATIONS TABLE (SQLite Powered) */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden space-y-4 p-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-navy-900 text-lg">
              Saved Recommendations History ({totalRecords})
            </h3>
            <p className="text-xs text-slate-500">
              Stored persistently in SQLite database (<code className="text-slate-700">solar.db</code>)
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center space-x-1.5 text-xs">
            {['All', 'Residential', 'Commercial', 'College'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  filterType === cat
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Table / Cards */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Loading database records...</span>
          </div>
        ) : filteredRecs.length === 0 ? (
          <div className="py-12 text-center text-slate-400 text-xs">
            No recommendations found matching filter. Create a new plan from the Recommendation tab.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-[11px] font-bold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">ID</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Capacity</th>
                  <th className="py-3 px-3">Net Cost</th>
                  <th className="py-3 px-3">Subsidy</th>
                  <th className="py-3 px-3">Annual Savings</th>
                  <th className="py-3 px-3">Payback</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecs.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-slate-700">
                      #{rec.id}
                    </td>
                    <td className="py-3 px-3 font-medium text-navy-900">
                      {rec.city}, {rec.state}
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {rec.property_type}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-bold text-emerald-700">
                      {formatKW(rec.recommended_capacity_kw)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-navy-900">
                      {formatINR(rec.net_cost)}
                    </td>
                    <td className="py-3 px-3 text-emerald-600 font-medium">
                      {rec.subsidy_amount > 0 ? formatINR(rec.subsidy_amount) : '₹0 (Tax AD)'}
                    </td>
                    <td className="py-3 px-3 font-semibold text-emerald-700">
                      {formatINR(rec.annual_savings)}
                    </td>
                    <td className="py-3 px-3">
                      {formatYears(rec.payback_years)}
                    </td>
                    <td className="py-3 px-3 text-right space-x-1">
                      <button
                        onClick={() => setSelectedRecord(rec)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="View Full Audit"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(rec.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* DETAIL MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 bg-navy-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-emerald-100 max-h-[90vh] overflow-y-auto space-y-6">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  SQLite Record #{selectedRecord.id}
                </span>
                <h3 className="text-2xl font-black text-navy-900 mt-1">
                  {selectedRecord.recommended_capacity_kw} kW {selectedRecord.system_type}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedRecord.city}, {selectedRecord.state} • {selectedRecord.property_type}
                </p>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-navy-900 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Net Investment</span>
                <span className="font-bold text-navy-900 text-sm">{formatINR(selectedRecord.net_cost)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Govt Subsidy</span>
                <span className="font-bold text-emerald-700 text-sm">{formatINR(selectedRecord.subsidy_amount)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Annual Savings</span>
                <span className="font-bold text-emerald-700 text-sm">{formatINR(selectedRecord.annual_savings)}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Simple Payback</span>
                <span className="font-bold text-navy-900 text-sm">{formatYears(selectedRecord.payback_years)}</span>
              </div>
            </div>

            {/* Site Constraints */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs space-y-1.5">
              <div className="font-bold text-navy-900">Site Constraints & Inputs:</div>
              <div className="grid grid-cols-2 gap-2 text-slate-600">
                <div>Monthly Bill: <strong>{formatINR(selectedRecord.monthly_bill)}</strong></div>
                <div>Monthly Consumption: <strong>{selectedRecord.monthly_kwh} kWh</strong></div>
                <div>Rooftop Area: <strong>{selectedRecord.roof_area_sqft} sq ft</strong></div>
                <div>Roof Type: <strong>{selectedRecord.roof_type}</strong></div>
                <div>Connection: <strong>{selectedRecord.connection_type}</strong></div>
                <div>Battery Backup: <strong>{selectedRecord.battery_needed}</strong></div>
              </div>
            </div>

            {/* AI Explanation */}
            <div className="p-4 bg-navy-900 text-white rounded-2xl space-y-2">
              <div className="text-xs font-bold text-emerald-400 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4" />
                <span>AI Engineering Assessment</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed whitespace-pre-line max-h-48 overflow-y-auto">
                {selectedRecord.ai_explanation}
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                Close Audit View
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
