import React from 'react';
import { 
  Sun, 
  Target, 
  Layers, 
  Cpu, 
  Sparkles, 
  Award, 
  ShieldCheck, 
  Zap, 
  Globe2, 
  CheckCircle2, 
  ArrowRight,
  Database,
  Code2,
  LineChart
} from 'lucide-react';

export default function AboutPage({ setActivePage }) {
  const techStack = [
    { name: 'React.js with Vite', role: 'Frontend Framework', desc: 'Fast, modern, reactive component-driven UI bundled with Vite for near-instant HMR.', icon: Code2 },
    { name: 'Tailwind CSS', role: 'Design & Aesthetics', desc: 'Custom emerald green-energy color palette, glassmorphic panels, and responsive layout primitives.', icon: Layers },
    { name: 'FastAPI (Python)', role: 'Backend Microservice', desc: 'High-throughput asynchronous REST API providing deterministic sizing and financial calculation endpoints.', icon: Zap },
    { name: 'SQLite', role: 'Relational Database', desc: 'Lightweight zero-configuration relational database storing user solar audit histories and contact tickets.', icon: Database },
    { name: 'Google Gemini API', role: 'Generative AI Engine', desc: 'Powers domain-specific engineering audit rationales and contextual advisory through the SolarAI Assistant.', icon: Sparkles },
    { name: 'Recharts', role: 'Data Visualization', desc: 'Interactive charts rendering 25-year cumulative wealth curves and monthly expense comparison bars.', icon: LineChart },
  ];

  const milestones = [
    { title: 'Drone Rooftop LiDAR Integration', desc: 'Automated 3D point cloud generation for real-time 3D shadow obstruction modeling and tilt optimization.' },
    { title: 'IoT Smart Meter Sync', desc: 'Bi-directional telemetry via DISCOM smart meters (AMI) for automated net-metering settlement verification.' },
    { title: 'Battery BMS Health Predictor', desc: 'Machine learning cycle degradation prediction for residential and commercial LiFePO4 battery banks.' },
    { title: 'Multi-Lingual Regional Audio Assistant', desc: 'Voice-driven SolarAI assistant in Hindi, Tamil, Telugu, Kannada, Marathi, and Bengali.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <Award className="w-4 h-4 text-emerald-600" />
          <span>India Clean Energy Platform Overview</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
          About Smart Solar Assistant
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Empowering Indian households, institutions, and businesses with transparent rooftop PV sizing, verified PM Surya Ghar subsidies, and AI engineering intelligence.
        </p>
      </div>

      {/* OBJECTIVES & PROBLEM STATEMENT */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Problem Statement */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-navy-900">The Problem Statement</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Despite India receiving over 300 sunny days annually and the Central Government launching the ambitious <strong>PM Surya Ghar: Muft Bijli Yojana</strong> (targetting 1 crore rooftop installations), rooftop solar adoption faces acute roadblocks:
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Opaque Pricing:</strong> Consumers receive arbitrary, inflated vendor quotes lacking transparent bill-of-materials.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Sizing Misconceptions:</strong> Oversizing systems beyond DISCOM net-metering limits or undersizing due to flawed peak sun hour estimates.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-amber-600 font-bold">•</span>
              <span><strong>Subsidy Confusion:</strong> Lack of clarity on Central Financial Assistance brackets and eligibility criteria for residential vs commercial consumers.</span>
            </li>
          </ul>
        </div>

        {/* Proposed Solution */}
        <div className="bg-white p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Zap className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-navy-900">Our Proposed Solution</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>Smart Solar Energy Recommendation Assistant</strong> provides an end-to-end, scientifically defensible platform that pairs mathematical PV physics with generative AI reasoning:
          </p>
          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Deterministic Sizing Engine:</strong> Accurate kW sizing derived from regional Peak Sun Hours (PSH), roof area constraints, and tier-1 module dimensions.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>Verified Indian Subsidies:</strong> Precise calculation of PM Surya Ghar CFA subsidies (up to ₹78,000) and commercial accelerated depreciation.</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-emerald-600 font-bold">•</span>
              <span><strong>AI Audit Rationale Layer:</strong> Leverages Gemini AI to generate audit-grade engineering justifications covering inverter DC:AC ratios, CEA safety earthing, and DISCOM net-metering synchronization.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* TECH STACK CARDS */}
      <div className="space-y-6">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-navy-900">Technology Architecture</h2>
          <p className="text-xs text-slate-500 mt-1">Built using production-ready open-source libraries and APIs</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-navy-900">{tech.name}</h3>
                    <span className="text-[11px] text-emerald-700 font-medium">{tech.role}</span>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {tech.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* FUTURE ROADMAP */}
      <div className="bg-gradient-to-br from-slate-900 to-navy-950 text-white p-8 sm:p-10 rounded-3xl space-y-6">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-800">
            Next Generation
          </span>
          <h2 className="text-2xl font-bold text-white mt-2">Future Enhancements Roadmap</h2>
          <p className="text-xs text-slate-400 mt-1">Planned expansions for advanced commercial energy auditing</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {milestones.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
              <h3 className="text-sm font-bold text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{item.title}</span>
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
