import React, { useState } from 'react';
import { 
  Sparkles, 
  Terminal, 
  Cpu, 
  Layers, 
  CheckCircle, 
  HelpCircle, 
  Play, 
  Loader2, 
  Clock, 
  Code, 
  FileText, 
  ArrowRight,
  BookOpen,
  Info,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';
import { runPromptLabExperiment } from '../utils/api';

const PROMPT_TECHNIQUES = [
  {
    id: 'role_based',
    name: 'Role-Based Prompting',
    tag: 'Persona Priming',
    description: 'Assigns a specialized domain persona (e.g. Chief MNRE Rooftop Solar Auditor) to prime professional vocabulary, standards compliance, and tone.',
    defaultTemplate: `You are a Senior MNRE-Certified Solar Energy Auditor and CEA Grid Compliance Specialist in India with 15 years of rooftop PV design experience.
Provide a rigorous technical engineering specification for the site parameters below. Cite Indian Standards (IS 16444, CEA Technical Standards for Grid Connectivity 2024), inverter stringing guidelines, and safety earthing requirements.`
  },
  {
    id: 'context_based',
    name: 'Context-Based Prompting',
    tag: 'In-Context Grounding',
    description: 'Supplies local geographical and commercial facts (Global Horizontal Irradiance, DISCOM tariff brackets, ambient heat derating) to eliminate hallucinated defaults.',
    defaultTemplate: `Context Grounding:
- Geographic Location: Jodhpur, Rajasthan (Global Horizontal Irradiance: 5.5 PSH/day).
- Local Climate: Ambient summer temperature reaches 44°C; apply module Pmax temperature coefficient derating (-0.35%/°C above 25°C STC).
- Utility DISCOM: JVVNL Non-telescopic Commercial Tariff (₹9.80/kWh + 18% electricity duty).
- Structural Context: RCC Flat Terrace with 2.5m stairwell shadow on west side.
Analyze this specific contextual environment and size an optimal PV array accordingly.`
  },
  {
    id: 'few_shot',
    name: 'Few-Shot Prompting',
    tag: 'Exemplar Guided',
    description: 'Provides concrete input-to-output examples demonstrating the exact arithmetic steps, format, and depth of reasoning expected.',
    defaultTemplate: `Follow this step-by-step audit structure based on the exemplars below:

[Exemplar 1]
Input: 300 kWh/month, Jaipur, 350 sq ft RCC roof, ₹2,800 bill.
Step 1 Demand: 300 / 30 = 10 kWh/day.
Step 2 Capacity: 10 / (5.5 PSH * 0.78 PR) = 2.33 kWp.
Step 3 Module Selection: 5x 540W Mono PERC = 2.70 kWp DC.
Step 4 Subsidy: PM Surya Ghar Tier-2 = ₹60,000 + (0.7 * 18,000) = ₹72,600.
Step 5 Payback: Net Capex ₹84,000 / Annual Savings ₹31,200 = 2.7 Years.

Now, analyze the following new site using the exact same 5-step mathematical progression:`
  },
  {
    id: 'constraint_based',
    name: 'Constraint-Based Prompting',
    tag: 'Boundary Enforcement',
    description: 'Enforces strict negative boundaries (roof clearance, single-phase 5kW ceilings, budget restrictions) that prevent impractical recommendations.',
    defaultTemplate: `Strict Engineering & Financial Constraints:
1. Rooftop Boundary: Do not utilize more than 70% of total roof area; retain 30% for module cleaning walkways and perimeter parapet setbacks.
2. Grid Code Ceiling: If electrical service is Single-Phase, strictly cap inverter AC rating at 5.0 kW per DISCOM regulations.
3. Budget Enforcer: Exclude battery storage systems if budget is under ₹2,50,000.
4. Transparency Mandate: Explicitly state the inverter DC:AC overloading ratio (target 1.15 to 1.25).
5. Output format must cite exact PM Surya Ghar CFA bracket.`
  },
  {
    id: 'structured_json',
    name: 'Structured JSON Output',
    tag: 'Schema Constrained',
    description: 'Forces the LLM to output valid JSON conforming strictly to a specified schema, making it safe for downstream software automation.',
    defaultTemplate: `Analyze the solar requirements and respond strictly with a valid JSON object matching this schema. Do not include markdown formatting or commentary outside the JSON:

{
  "recommended_capacity_kw": number,
  "panel_count": integer,
  "module_model": string,
  "gross_capex_inr": number,
  "pm_surya_ghar_subsidy_inr": number,
  "net_capex_inr": number,
  "simple_payback_years": number,
  "safety_compliance_checkpoints": string[]
}`
  }
];

export default function PromptLabPage() {
  const [selectedTech, setSelectedTech] = useState(PROMPT_TECHNIQUES[0]);
  const [customPrompt, setCustomPrompt] = useState(PROMPT_TECHNIQUES[0].defaultTemplate);
  
  // Customizable Solar Site Inputs for the prompt
  const [siteInputs, setSiteInputs] = useState({
    city: 'Jaipur',
    state: 'Rajasthan',
    property_type: 'Residential',
    monthly_bill: 3800,
    monthly_kwh: 450,
    roof_area_sqft: 400,
    roof_type: 'Flat RCC Concrete',
    connection_type: 'Single-phase',
    battery_needed: 'No'
  });

  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleSelectTech = (tech) => {
    setSelectedTech(tech);
    setCustomPrompt(tech.defaultTemplate);
    setResult(null);
    setError(null);
  };

  const handleRunExperiment = async () => {
    setRunning(true);
    setError(null);

    try {
      const resp = await runPromptLabExperiment({
        technique: selectedTech.id,
        custom_prompt: customPrompt,
        site_inputs: siteInputs
      });

      if (resp.success && resp.data) {
        setResult(resp.data);
      } else {
        setError('Prompt evaluation failed. Please verify backend connection.');
      }
    } catch (err) {
      setError(err.message || 'Error executing prompt test.');
    } finally {
      setRunning(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">
          <Sparkles className="w-4 h-4 text-emerald-600" />
          <span>B.Tech Coursework Showcase • Prompt Engineering Subject</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900">
          Interactive Prompt Engineering Lab
        </h1>
        <p className="text-sm sm:text-base text-slate-600">
          Explore how modern prompting paradigms — <strong>Role</strong>, <strong>Context</strong>, <strong>Few-Shot</strong>, <strong>Constraints</strong>, and <strong>Structured JSON</strong> — alter generative AI behavior, reduce hallucinations, and bridge LLM reasoning with deterministic engineering calculations.
        </p>
      </div>

      {/* CORE PEDAGOGY NOTICE: AI REASONING VS DETERMINISTIC MATH */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-navy-900 to-emerald-950 text-white border border-emerald-800/80 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
              <Info className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-emerald-300">
                Academic Distinction: Deterministic Calculations vs Probabilistic LLMs
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed max-w-3xl mt-0.5">
                In production solar engineering, critical calculations (kW sizing, CFA subsidy brackets, simple payback) are executed by our deterministic backend engine to ensure zero arithmetic error. The Gemini LLM is used as an <strong>interpretive reasoning layer</strong> to translate data into actionable, regulatory-compliant advice.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-900 text-emerald-200 border border-emerald-700 whitespace-nowrap">
            Hybrid Architecture
          </span>
        </div>
      </div>

      {/* TECHNIQUE SELECTOR CARDS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Select Prompting Strategy</span>
          </h3>
          <span className="text-xs text-slate-400">Click to load template</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {PROMPT_TECHNIQUES.map((tech) => {
            const isSelected = selectedTech.id === tech.id;
            return (
              <button
                key={tech.id}
                onClick={() => handleSelectTech(tech)}
                className={`p-4 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-md ring-2 ring-emerald-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div>
                  <span className={`inline-block text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full mb-2 ${
                    isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {tech.tag}
                  </span>
                  <h4 className="text-xs font-bold text-navy-900 leading-tight mb-1">
                    {tech.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {tech.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* PLAYGROUND: PROMPT EDITOR & SITE INPUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Prompt Template & Site Inputs (6 Cols) */}
        <div className="lg:col-span-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
          
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-navy-900 text-sm flex items-center space-x-2">
                <Code className="w-4 h-4 text-emerald-600" />
                <span>Prompt Template Editor</span>
              </h3>
              <p className="text-[11px] text-slate-400">
                You can edit this prompt in real time to observe the impact on LLM output.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(customPrompt)}
              className="text-xs text-slate-500 hover:text-emerald-700 flex items-center space-x-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>

          <textarea
            rows={8}
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            className="w-full p-3.5 rounded-xl border border-slate-300 font-mono text-xs text-slate-800 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed resize-none"
          />

          {/* Quick Site Inputs Form */}
          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Site Data Injected Into Prompt:
            </h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
              <div>
                <label className="text-[10px] text-slate-500 font-medium block">City & State</label>
                <input
                  type="text"
                  value={`${siteInputs.city}, ${siteInputs.state}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(',');
                    setSiteInputs({ ...siteInputs, city: parts[0]?.trim() || '', state: parts[1]?.trim() || '' });
                  }}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-medium block">Monthly Bill (₹)</label>
                <input
                  type="number"
                  value={siteInputs.monthly_bill}
                  onChange={(e) => setSiteInputs({ ...siteInputs, monthly_bill: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-500 font-medium block">Roof Area (sq ft)</label>
                <input
                  type="number"
                  value={siteInputs.roof_area_sqft}
                  onChange={(e) => setSiteInputs({ ...siteInputs, roof_area_sqft: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-200 bg-slate-50 text-xs"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
              {error}
            </div>
          )}

          {/* Run Button */}
          <button
            onClick={handleRunExperiment}
            disabled={running}
            className="w-full py-3.5 rounded-2xl font-bold text-white bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center justify-center space-x-2 text-sm"
          >
            {running ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Running Prompt Experiment through Gemini...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Execute Prompt Comparison & Ablation</span>
              </>
            )}
          </button>

        </div>

        {/* RIGHT COLUMN: Comparative Output & Pedagogy Analysis (6 Cols) */}
        <div className="lg:col-span-6 space-y-6">
          
          {!result && !running && (
            <div className="bg-white p-8 rounded-3xl border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                <Terminal className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-navy-900">
                Ablation Playground Ready
              </h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Click <strong>"Execute Prompt Comparison"</strong> to run a live side-by-side experiment comparing a naive prompt against your chosen prompt engineering strategy.
              </p>
            </div>
          )}

          {running && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
              <h4 className="text-sm font-bold text-navy-900">
                Generating Comparative Outputs...
              </h4>
              <p className="text-xs text-slate-500">
                Evaluating baseline naive prompt vs engineered prompt through Gemini API...
              </p>
            </div>
          )}

          {result && !running && (
            <div className="space-y-6 animate-fadeIn">
              
              {/* COMPARISON CARDS */}
              <div className="space-y-4">
                
                {/* 1. Naive Baseline */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-600 uppercase tracking-wider text-[10px]">
                      🔴 Naive Baseline Prompt (Unengineered)
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {result.baseline.latency_sec}s • ~{result.baseline.token_estimate} tokens
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-sans max-h-36 overflow-y-auto">
                    {result.baseline.output}
                  </div>
                  <p className="text-[10px] text-slate-400 italic">
                    Observation: Lacks standards compliance, vague cost estimation, no safety earthing notes.
                  </p>
                </div>

                {/* 2. Engineered Output */}
                <div className="bg-emerald-50/70 p-4 rounded-2xl border-2 border-emerald-500 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-900 uppercase tracking-wider text-[10px] flex items-center space-x-1">
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>🟢 Augmented Prompt Output ({result.technique_info?.title})</span>
                    </span>
                    <span className="text-[10px] text-emerald-700 font-bold">
                      {result.engineered.latency_sec}s • {result.engineered.source}
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-emerald-200 text-xs text-slate-800 leading-relaxed font-mono whitespace-pre-wrap max-h-56 overflow-y-auto">
                    {result.engineered.output}
                  </div>
                </div>

              </div>

              {/* PEDAGOGICAL BREAKDOWN: WHY IT WORKED */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-navy-900 uppercase tracking-wider">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <span>Prompt Engineering Academic Analysis</span>
                </div>

                <div className="space-y-2 text-xs text-slate-700">
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <strong className="text-emerald-800 block text-[11px] mb-0.5">Mechanism of Action:</strong>
                    <span>{result.pedagogy_analysis?.why_it_works}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <strong className="text-teal-800 block text-[11px] mb-0.5">Prompt Element Impact:</strong>
                    <span>{result.pedagogy_analysis?.prompt_component_impact}</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <strong className="text-navy-900 block text-[11px] mb-0.5">Key Subject Takeaway:</strong>
                    <span>{result.pedagogy_analysis?.academic_takeaway}</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
