import os
import time
import json
from typing import Dict, Any, List, Optional
import httpx

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()

# Primary and fallback Gemini models
GEMINI_MODELS = ["gemini-1.5-flash", "gemini-2.0-flash", "gemini-2.5-flash"]
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"

async def call_gemini(prompt: str, system_instruction: Optional[str] = None, json_mode: bool = False) -> Dict[str, Any]:
    """
    Calls the Google Gemini API securely using the backend GEMINI_API_KEY.
    Returns response text, token info, and execution latency.
    """
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key:
        return {
            "success": False,
            "error": "GEMINI_API_KEY is not configured in backend environment variables.",
            "source": "fallback"
        }

    start_time = time.time()
    
    contents = []
    contents.append({
        "role": "user",
        "parts": [{"text": prompt}]
    })

    payload: Dict[str, Any] = {
        "contents": contents,
        "generationConfig": {
            "temperature": 0.2 if json_mode else 0.4,
            "maxOutputTokens": 1200,
        }
    }

    if system_instruction:
        payload["systemInstruction"] = {
            "parts": [{"text": system_instruction}]
        }

    if json_mode:
        payload["generationConfig"]["responseMimeType"] = "application/json"

    # Attempt call with model fallbacks
    async with httpx.AsyncClient(timeout=20.0) as client:
        last_error = ""
        for model in GEMINI_MODELS:
            url = f"{GEMINI_API_URL.format(model=model)}?key={api_key}"
            try:
                resp = await client.post(url, json=payload)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        text = candidates[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                        elapsed = round(time.time() - start_time, 2)
                        usage = data.get("usageMetadata", {})
                        return {
                            "success": True,
                            "text": text,
                            "model": model,
                            "latency_sec": elapsed,
                            "usage": usage,
                            "source": "gemini"
                        }
                else:
                    last_error = f"HTTP {resp.status_code}: {resp.text[:200]}"
            except Exception as e:
                last_error = str(e)
                continue

    return {
        "success": False,
        "error": last_error or "Unable to reach Gemini API",
        "source": "fallback"
    }

def get_fallback_explanation(inputs: Dict[str, Any], results: Dict[str, Any]) -> str:
    """
    Detailed fallback explanation generated deterministically with high domain fidelity.
    """
    prop = inputs.get("property_type", "Residential")
    cap = results.get("recommended_capacity_kw", 3.0)
    cost = results.get("net_cost", 96000)
    subsidy = results.get("subsidy_amount", 0)
    payback = results.get("payback_years", 3.2)
    state = inputs.get("state", "India")
    system_type = results.get("system_type", "On-Grid")
    savings = results.get("annual_savings", 36000)
    panels = results.get("panel_count", 6)
    area = results.get("calculation_breakdown", {}).get("roof_utilization_sqft", 250)

    subsidy_text = (
        f"Under the Central Government's PM Surya Ghar Muft Bijli Yojana, this installation qualifies for a direct CFA subsidy of ₹{subsidy:,.0f}, bringing the net capex to ₹{cost:,.0f}."
        if subsidy > 0 else
        f"For {prop} properties, while direct residential CFA subsidies do not apply, accelerated depreciation (40%) under Section 32 of the Income Tax Act provides substantial first-year corporate tax savings."
    )

    return (
        f"**System Engineering Assessment for {inputs.get('city', 'Location')}, {state}:**\n\n"
        f"Based on your monthly consumption pattern and local solar insolation (~{results.get('calculation_breakdown', {}).get('irradiance_sun_hours', 4.8)} peak sun hours/day), "
        f"a **{cap} kW {system_type}** utilizing {panels} high-efficiency Mono PERC/TOPCon 540W bifacial modules is recommended.\n\n"
        f"1. **Rooftop Utilization:** The array will require approximately {area} sq. ft. of shadow-free rooftop area. "
        f"For your {inputs.get('roof_type', 'RCC')} roof, standard hot-dip galvanized mounting structures with south-facing 12°–18° tilt are recommended for optimal year-round yield.\n"
        f"2. **Grid & Power Safety:** Connected to your {inputs.get('connection_type', 'Single-phase')} electrical service, "
        f"the dual-MPPT grid-tied inverter will synchronize seamlessly with the DISCOM net-metering grid. Dual earthing pits (chemical copper-bonded) and Class-II surge protection devices (SPDs) are mandated per CEA 2024 regulations.\n"
        f"3. **Financial Payback:** {subsidy_text} With projected annual bill savings of ₹{savings:,.0f}, the calculated simple payback period is **{payback} years**, followed by over two decades of virtually free clean power."
    )

async def generate_ai_recommendation_explanation(inputs: Dict[str, Any], results: Dict[str, Any]) -> Dict[str, Any]:
    prompt = f"""
Act as a Senior MNRE-Certified Solar Energy Engineer in India.
Provide a clear, professional technical and financial justification for the following solar recommendation:

USER INPUTS:
- Location: {inputs.get('city')}, {inputs.get('state')}
- Property Type: {inputs.get('property_type')}
- Monthly Electricity Bill: ₹{inputs.get('monthly_bill')}
- Monthly Electricity Consumption: {inputs.get('monthly_kwh')} kWh
- Available Rooftop Area: {inputs.get('roof_area_sqft')} sq ft
- Roof Structure: {inputs.get('roof_type')}
- Electricity Connection: {inputs.get('connection_type')}
- Battery Backup Requirement: {inputs.get('battery_needed')}
- Budget Constraint: ₹{inputs.get('budget', 'Flexible')}

DETERMINISTIC CALCULATION RESULTS:
- Recommended Solar Capacity: {results.get('recommended_capacity_kw')} kW
- Total Panels Needed: {results.get('panel_count')} x 540W Mono PERC
- Gross Estimated Cost: ₹{results.get('gross_cost')}
- Government Subsidy (PM Surya Ghar): ₹{results.get('subsidy_amount')}
- Net Cost: ₹{results.get('net_cost')}
- Estimated Monthly Generation: {results.get('monthly_generation_kwh')} kWh
- Estimated Annual Bill Savings: ₹{results.get('annual_savings')}
- Estimated Payback Period: {results.get('payback_years')} years
- Recommended System Architecture: {results.get('system_type')}
- Annual Carbon Offset: {results.get('co2_avoided_tonnes_yr')} Tonnes CO2

Write a concise 3-paragraph executive rationale covering:
1. Sizing logic vs roof utilization and peak sun hours in {inputs.get('state')}.
2. Electrical configuration, inverter sizing ratio (DC:AC), and Indian CEA safety/earthing compliance.
3. Financial ROI, PM Surya Ghar subsidy details (or commercial accelerated depreciation), and net-metering benefits.
Do not fabricate live weather or tariff prices. Speak professionally to an Indian consumer.
"""
    system_instruction = "You are a professional MNRE-certified rooftop solar auditor in India. Provide technically precise, realistic, and reassuring advice."
    
    resp = await call_gemini(prompt, system_instruction)
    if resp.get("success"):
        return {
            "explanation": resp["text"],
            "source": f"Gemini API ({resp['model']})",
            "latency_sec": resp.get("latency_sec", 0.0)
        }
    else:
        fallback_text = get_fallback_explanation(inputs, results)
        return {
            "explanation": fallback_text,
            "source": "Smart Solar Local Rule-Engine (Demo Mode)",
            "note": resp.get("error", "Demo mode active")
        }

async def generate_chatbot_reply(user_message: str, history: List[Dict[str, str]]) -> Dict[str, Any]:
    """
    SolarAI Chatbot with Gemini integration & comprehensive fallback knowledge base.
    """
    system_instruction = """
You are 'SolarAI Assistant', an expert AI consultant for rooftop solar energy in India.
You provide accurate, helpful, and concise advice on:
1. Solar panel types (Mono PERC, Polycrystalline, TOPCon, Bifacial).
2. Rooftop sizing rules (approx 80-100 sq ft per kW).
3. Installation costs in India (₹45,000 to ₹65,000 per kW on-grid).
4. Subsidies under the PM Surya Ghar: Muft Bijli Yojana (₹30k for 1kW, ₹60k for 2kW, ₹78k for 3kW+ for residential).
5. On-grid vs Off-grid vs Hybrid systems.
6. Battery types: LiFePO4 (Lithium Iron Phosphate) vs Tubular Lead Acid.
7. DISCOM Net Metering regulations, CEA safety standards, maintenance (panel cleaning frequency, tilt angles).
Always be courteous, direct, and specify currency in Indian Rupees (₹).
Never claim live connection to DISCOM billing servers; provide realistic illustrative figures.
"""
    # Build conversation prompt
    conv_history = ""
    for msg in history[-6:]:
        role = "User" if msg.get("role") == "user" else "Assistant"
        conv_history += f"{role}: {msg.get('content', '')}\n"

    full_prompt = f"{conv_history}User: {user_message}\nAssistant:"

    resp = await call_gemini(full_prompt, system_instruction)
    if resp.get("success"):
        return {
            "reply": resp["text"],
            "source": f"Gemini API ({resp['model']})",
            "is_demo": False
        }

    # Rich contextual fallback responses for common queries
    reply = get_smart_fallback_chat_reply(user_message)
    return {
        "reply": reply,
        "source": "SolarAI Knowledge Base (Demo Mode)",
        "is_demo": True
    }

def get_smart_fallback_chat_reply(query: str) -> str:
    q = query.lower()
    if "subsidy" in q or "pm surya ghar" in q or "government" in q or "scheme" in q:
        return (
            "🏛️ **Government Solar Subsidies in India (PM Surya Ghar: Muft Bijli Yojana):**\n\n"
            "The Central Government offers generous Central Financial Assistance (CFA) for residential rooftop solar:\n"
            "• **1 kW System:** ₹30,000 flat subsidy\n"
            "• **2 kW System:** ₹60,000 flat subsidy\n"
            "• **3 kW and above:** ₹78,000 maximum subsidy\n\n"
            "*Eligibility Note:* Only residential grid-connected (On-grid or Hybrid) systems registered via the National Rooftop Solar Portal (`pmsuryaghar.gov.in`) with empanelled vendors and ALMM-approved DCR modules qualify. Commercial and industrial properties are not eligible for direct CFA, but can claim a 40% Accelerated Depreciation tax benefit."
        )
    elif "cost" in q or "price" in q or "budget" in q or "how much" in q:
        return (
            "💰 **Estimated Solar Installation Costs in India (Turnkey 2024-2026):**\n\n"
            "Benchmark on-grid rooftop solar costs with Tier-1 Mono PERC modules & string inverters:\n"
            "• **1 kW:** ₹55,000 – ₹65,000 (Net cost ~₹25,000 – ₹35,000 after subsidy)\n"
            "• **2 kW:** ₹1,10,000 – ₹1,25,000 (Net cost ~₹50,000 – ₹65,000 after subsidy)\n"
            "• **3 kW:** ₹1,60,000 – ₹1,85,000 (Net cost ~₹82,000 – ₹1,07,000 after subsidy)\n"
            "• **5 kW:** ₹2,50,000 – ₹2,90,000 (Net cost ~₹1,72,000 – ₹2,12,000 after subsidy)\n"
            "• **10 kW:** ₹4,50,000 – ₹5,20,000\n\n"
            "Hybrid systems with LiFePO4 lithium batteries add approx ₹25,000 per kWh of battery storage."
        )
    elif "battery" in q or "storage" in q or "backup" in q:
        return (
            "🔋 **Solar Battery Storage Comparison:**\n\n"
            "1. **LiFePO4 (Lithium Iron Phosphate):**\n"
            "   • *Lifespan:* 10–15 years (4,000–6,000 cycles at 80% Depth of Discharge)\n"
            "   • *Efficiency:* 95%+ roundtrip efficiency\n"
            "   • *Maintenance:* Zero maintenance, compact, wall-mountable\n"
            "   • *Cost:* Higher upfront capex (~₹20,000–₹26,000 per kWh)\n\n"
            "2. **Tubular Lead-Acid:**\n"
            "   • *Lifespan:* 3–5 years (1,200–1,500 cycles at 50% DoD)\n"
            "   • *Maintenance:* Requires periodic distilled water topping\n"
            "   • *Cost:* Lower upfront capex, but replaces 3 times over 12 years."
        )
    elif "on-grid" in q or "off-grid" in q or "hybrid" in q or "difference" in q:
        return (
            "⚡ **On-Grid vs Off-Grid vs Hybrid Systems:**\n\n"
            "• **On-Grid (Grid-Tied):** Most popular & economical for urban homes with stable grid power. No batteries; surplus power flows back to the utility grid via net metering. Shuts down during power outages for lineman safety (anti-islanding).\n"
            "• **Off-Grid:** 100% independent of the utility grid. Requires large battery banks and solar charge controllers. Ideal for remote rural areas or agricultural pump sets without grid access.\n"
            "• **Hybrid:** The best of both worlds. Exports excess solar during the day under net metering, while charging a dedicated battery to power critical loads (Wi-Fi, lights, fans, fridge) during blackouts."
        )
    elif "panel" in q or "mono perc" in q or "topcon" in q or "polycrystalline" in q:
        return (
            "☀️ **Solar Module Technologies:**\n\n"
            "• **Mono PERC (Monocrystalline Passivated Emitter and Rear Cell):** Today's industry workhorse in India (~21% efficiency). Excellent high-temperature coefficient.\n"
            "• **N-Type TOPCon (Tunnel Oxide Passivated Contact):** Cutting-edge technology (~22.5% efficiency). Lower annual degradation (0.4% vs 0.7%) and better diffuse-light performance.\n"
            "• **Bifacial Modules:** Absorbs sunlight from both front and rear surfaces (+5% to 15% extra gain from roof albedo reflection).\n"
            "• **Polycrystalline:** Older technology (~16% efficiency); largely phased out for modern rooftop installations."
        )
    elif "clean" in q or "maintenance" in q or "service" in q:
        return (
            "🧼 **Solar Maintenance Best Practices:**\n\n"
            "• **Cleaning Schedule:** Clean panels every 15–20 days using soft demineralized water and a microfiber brush or squeegee. In dusty/industrial zones, clean weekly.\n"
            "• **Timing:** Always clean early in the morning before 8:00 AM or late in the evening. Spraying cold water on midday hot glass (60°C+) can cause micro-cracks and thermal shock!\n"
            "• **Inspection:** Check quarterly for shadow growth from trees, inverter error codes, and DC cable conduit integrity."
        )
    else:
        return (
            "Hello! I am **SolarAI Assistant**, your rooftop solar engineering advisor in India. "
            "I can assist you with system capacity sizing, PM Surya Ghar subsidy calculations, On-Grid vs Hybrid choices, battery chemistry (LiFePO4 vs Lead Acid), and DISCOM net-metering guidelines. "
            "How can I help you optimize your solar transition today?"
        )

# PROMPT ENGINEERING LAB MODULE
PROMPT_TECHNIQUES = {
    "role_based": {
        "title": "Role-Based Prompting",
        "description": "Assigns a specific professional persona (e.g., MNRE Tier-1 Solar Auditor) with specialized domain vocabulary, industry standards, and engineering expectations.",
        "sample_prompt": "You are a Chief Electrical Engineer and MNRE Certified Solar Energy Auditor in India with 20 years of substation and rooftop PV design experience. Analyze the following site parameters and provide a rigorous sizing report adhering strictly to CEA Technical Standards for Grid Connectivity."
    },
    "context_based": {
        "title": "Context-Based Prompting",
        "description": "Supplies detailed contextual constraints such as state-level DISCOM tariff slabs, local Global Horizontal Irradiance (GHI), tilt angle shading, and roof superstructure limitations.",
        "sample_prompt": "Context: Location is Jodhpur, Rajasthan (5.5 peak sun hours, average summer ambient 44°C). The property has an RCC flat roof with an 8-foot water tank on the south-west corner casting afternoon shadows. DISCOM is JVVNL with non-telescopic tariff slabs. Factor temperature derating (-0.35%/°C above 25°C) into your recommendation."
    },
    "few_shot": {
        "title": "Few-Shot Prompting",
        "description": "Provides concrete input-output exemplars illustrating the exact depth of reasoning, tone, and step-by-step sizing logic expected from the LLM.",
        "sample_prompt": "Here are examples of how to analyze solar sizing:\n\nExample 1:\nInput: 400 kWh/month, Delhi, 400 sq ft roof, ₹3200 bill.\nAnalysis: 400 kWh / 30 = 13.3 kWh/day. Irradiance 4.8 * PR 0.78 = 3.74 kWh/kWp. Required: 13.3 / 3.74 = 3.55 kW -> Recommend 3 kW (5x 540W = 2.7 kW or 6x 540W = 3.24 kW). Subsidy: ₹78,000. Payback: 2.8 years.\n\nNow perform a matching step-by-step analysis for:"
    },
    "constraint_based": {
        "title": "Constraint-Based Prompting",
        "description": "Enforces strict negative boundaries and validation guards (e.g., maximum allowable roof utilization, strict single-phase power limits, budget caps).",
        "sample_prompt": "Strict Constraints:\n1. Do not recommend capacity exceeding 75% of available roof space (allow 25% for maintenance walkways).\n2. If single-phase grid connection, cap capacity at 5 kW.\n3. Exclude battery storage if budget is under ₹2,50,000.\n4. Output must explicitly list inverter DC:AC overloading ratio.\n5. Cite exact PM Surya Ghar subsidy bracket applicable."
    },
    "structured_json": {
        "title": "Structured JSON Output",
        "description": "Constrains the LLM output to conform strictly to a machine-readable JSON schema, preventing conversational preamble and allowing direct programmatic parsing.",
        "sample_prompt": "Return your recommendation strictly as a valid JSON object matching this schema:\n{\n  \"recommended_kw\": number,\n  \"panel_count\": integer,\n  \"module_model\": string,\n  \"gross_cost_inr\": number,\n  \"subsidy_inr\": number,\n  \"net_cost_inr\": number,\n  \"payback_years\": number,\n  \"cea_compliance_notes\": string[]\n}\nDo not output markdown code blocks or explanatory text outside the JSON."
    }
}

async def run_prompt_experiment(
    technique: str,
    custom_system_prompt: str,
    user_inputs: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Runs a prompt engineering experiment comparing a naive prompt vs the technique-augmented prompt.
    Returns both outputs, token usage, latency, and instructional breakdown for B.Tech students.
    """
    baseline_prompt = f"Recommend a solar system for: {json.dumps(user_inputs)}"
    
    # Run naive baseline
    t0 = time.time()
    baseline_resp = await call_gemini(baseline_prompt, None)
    baseline_latency = round(time.time() - t0, 2)
    
    if not baseline_resp.get("success"):
        baseline_text = (
            f"You should install a solar system of around 3 kW. It will cost around ₹1,50,000. "
            f"You will get some subsidy from government. It will save electricity bills and help environment."
        )
    else:
        baseline_text = baseline_resp.get("text", "")

    # Run engineered prompt
    engineered_prompt = f"{custom_system_prompt}\n\nSITE INPUT DATA:\n{json.dumps(user_inputs, indent=2)}"
    is_json = (technique == "structured_json")
    
    t1 = time.time()
    engineered_resp = await call_gemini(engineered_prompt, None, json_mode=is_json)
    engineered_latency = round(time.time() - t1, 2)

    if not engineered_resp.get("success"):
        if technique == "structured_json":
            engineered_text = json.dumps({
                "recommended_kw": 3.24,
                "panel_count": 6,
                "module_model": "540W Mono PERC Half-Cut Bifacial",
                "gross_cost_inr": 174000,
                "subsidy_inr": 78000,
                "net_cost_inr": 96000,
                "payback_years": 2.6,
                "cea_compliance_notes": [
                    "Requires dual chemical earthing pits for DC and AC sides",
                    "Type-2 surge protection device (SPD) in ACDB and DCDB",
                    "Complies with CEA Grid Standards (Frequency 49.5-50.5 Hz tolerance)"
                ]
            }, indent=2)
        else:
            engineered_text = (
                f"**Technical Audit Report:**\n\n"
                f"• **Recommended Array:** 3.24 kWp comprising 6x 540W Mono PERC bifacial modules.\n"
                f"• **Inverter Specification:** 3.0 kW string inverter with dual MPPT channels (DC:AC ratio 1.08).\n"
                f"• **Regulatory Compliance:** Adheres to PM Surya Ghar CFA guidelines with ₹78,000 central subsidy.\n"
                f"• **Financial Analysis:** Net outlay ₹96,000 with simple payback in 2.5 years based on current tariff."
            )
        tech_source = "SolarAI Prompt Lab Simulator"
    else:
        engineered_text = engineered_resp.get("text", "")
        tech_source = f"Gemini API ({engineered_resp.get('model')})"

    explanation = get_prompt_engineering_pedagogy(technique)

    return {
        "technique": technique,
        "technique_info": PROMPT_TECHNIQUES.get(technique, {}),
        "baseline": {
            "prompt": baseline_prompt,
            "output": baseline_text,
            "latency_sec": baseline_latency,
            "token_estimate": len(baseline_text.split()) * 2
        },
        "engineered": {
            "prompt": engineered_prompt,
            "output": engineered_text,
            "latency_sec": engineered_latency,
            "token_estimate": len(engineered_text.split()) * 2,
            "source": tech_source
        },
        "pedagogy_analysis": explanation
    }

def get_prompt_engineering_pedagogy(technique: str) -> Dict[str, str]:
    pedagogy = {
        "role_based": {
            "why_it_works": "Assigning a persona primes the LLM's internal representation weights toward specialized electrical engineering vocabulary, formal audit structure, and standard safety practices.",
            "prompt_component_impact": "Changes output tone from a generic conversational recommendation to a defensible, audit-grade engineering specification.",
            "academic_takeaway": "Role prompts reduce hallucination of ungrounded consumer advice by establishing domain boundary constraints."
        },
        "context_based": {
            "why_it_works": "Language models lack real-time local knowledge unless ground truth facts (GHI irradiance, DISCOM tariffs, local ambient temperature) are injected in-context.",
            "prompt_component_impact": "Grounds the model in regional Indian solar realities (e.g. higher dust derating in Rajasthan vs coastal humidity in Kerala).",
            "academic_takeaway": "In-context learning eliminates factual drift without retraining or fine-tuning the base foundational model."
        },
        "few_shot": {
            "why_it_works": "Exemplars activate in-context pattern matching, guiding the LLM's step-by-step arithmetic sequence before emitting the final answer.",
            "prompt_component_impact": "Prevents arithmetic jumps and forces the model to display intermediate formulas (kWh/day -> kWp sizing).",
            "academic_takeaway": "Few-shot prompting provides high structural consistency and aligns output formatting across diverse test cases."
        },
        "constraint_based": {
            "why_it_works": "Negative constraints restrict the generation space by penalizing violation tokens (such as exceeding roof boundaries or recommending batteries when under budget).",
            "prompt_component_impact": "Forces the system to account for practical physical realities (walkway clearance, electrical phase limits) that a naive prompt overlooks.",
            "academic_takeaway": "Constraint satisfaction prompting is essential for mission-critical software where outputs must satisfy safety and regulatory boundaries."
        },
        "structured_json": {
            "why_it_works": "Constraining the decoder to valid JSON tokens (or using structured outputs mode) eliminates conversational boilerplate.",
            "prompt_component_impact": "Produces a pure parseable data payload suitable for automated database insertion, API piping, or dynamic UI rendering.",
            "academic_takeaway": "Structured JSON prompting bridges probabilistic generative models with deterministic backend software architectures."
        }
    }
    return pedagogy.get(technique, {
        "why_it_works": "Combines domain context and structural constraints to focus LLM generation.",
        "prompt_component_impact": "Improves precision and eliminates unnecessary text.",
        "academic_takeaway": "Prompt engineering transforms general-purpose models into specialized enterprise assistants."
    })
