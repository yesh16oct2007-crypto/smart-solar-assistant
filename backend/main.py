import os
from datetime import datetime
import json
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from database import (
    init_db,
    save_recommendation,
    get_recommendations,
    get_recommendation_by_id,
    delete_recommendation,
    save_contact,
    get_contacts
)
from solar_engine import (
    calculate_solar_recommendation,
    STATE_IRRADIANCE,
    DEFAULT_TARIFFS,
    CARBON_EMISSION_FACTOR
)
from gemini_service import (
    generate_ai_recommendation_explanation,
    generate_chatbot_reply
)
from models import (
    RecommendationRequest,
    CalculatorRequest,
    ChatRequest,
    ContactRequest
)

# Initialize database tables
init_db()

app = FastAPI(
    title="Smart Solar Energy Recommendation Assistant API",
    description="Production API powering solar PV sizing, financial calculations, MNRE subsidies, and Gemini AI energy advisory.",
    version="1.0.0"
)

# CORS setup for Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def health_check():
    gemini_key = os.getenv("GEMINI_API_KEY", "").strip()
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "sqlite_connected",
        "gemini_api_configured": bool(gemini_key),
        "gemini_mode": "Live API" if gemini_key else "Interactive Demo Mode (Deterministic Fallback)"
    }

@app.get("/api/states")
async def get_states():
    return {
        "states": [
            {"name": state, "irradiance": irrad}
            for state, irrad in sorted(STATE_IRRADIANCE.items())
        ],
        "default_tariffs": DEFAULT_TARIFFS
    }

@app.post("/api/recommend")
async def create_recommendation(payload: RecommendationRequest):
    try:
        # 1. Deterministic engineering calculation
        result = calculate_solar_recommendation(
            city=payload.city,
            state=payload.state,
            property_type=payload.property_type,
            monthly_bill=payload.monthly_bill,
            monthly_kwh=payload.monthly_kwh,
            roof_area_sqft=payload.roof_area_sqft,
            budget=payload.budget,
            roof_type=payload.roof_type,
            connection_type=payload.connection_type,
            battery_needed=payload.battery_needed,
            panel_wattage=payload.panel_wattage or 540,
            custom_tariff=payload.custom_tariff or 0.0
        )

        # 2. AI justification via Gemini or domain fallback
        ai_resp = await generate_ai_recommendation_explanation(payload.dict(), result)
        explanation_text = ai_resp.get("explanation", "")

        # 3. Save record to SQLite
        db_payload = {
            "created_at": datetime.now().isoformat(),
            "city": payload.city,
            "state": payload.state,
            "property_type": payload.property_type,
            "monthly_bill": payload.monthly_bill,
            "monthly_kwh": payload.monthly_kwh,
            "roof_area_sqft": payload.roof_area_sqft,
            "budget": payload.budget,
            "roof_type": payload.roof_type,
            "connection_type": payload.connection_type,
            "battery_needed": payload.battery_needed,
            "recommended_capacity_kw": result["recommended_capacity_kw"],
            "panel_count": result["panel_count"],
            "panel_wattage": result["panel_wattage"],
            "gross_cost": result["gross_cost"],
            "subsidy_amount": result["subsidy_amount"],
            "net_cost": result["net_cost"],
            "monthly_generation_kwh": result["monthly_generation_kwh"],
            "annual_generation_kwh": result["annual_generation_kwh"],
            "monthly_savings": result["monthly_savings"],
            "annual_savings": result["annual_savings"],
            "payback_years": result["payback_years"],
            "system_type": result["system_type"],
            "co2_avoided_tonnes_yr": result["co2_avoided_tonnes_yr"],
            "trees_equivalent": result["trees_equivalent"],
            "ai_explanation": explanation_text,
            "calculation_breakdown": json.dumps(result["calculation_breakdown"])
        }

        rec_id = save_recommendation(db_payload)
        result["id"] = rec_id
        result["ai_explanation"] = explanation_text
        result["ai_source"] = ai_resp.get("source", "Rule Engine")

        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")

@app.get("/api/recommendations")
async def list_recommendations(limit: int = Query(50, ge=1, le=100)):
    records = get_recommendations(limit=limit)
    return {
        "success": True,
        "count": len(records),
        "data": records
    }

@app.get("/api/recommendations/{rec_id}")
async def get_recommendation_detail(rec_id: int):
    rec = get_recommendation_by_id(rec_id)
    if not rec:
        raise HTTPException(status_code=404, detail="Recommendation record not found")
    return {
        "success": True,
        "data": rec
    }

@app.delete("/api/recommendations/{rec_id}")
async def remove_recommendation(rec_id: int):
    success = delete_recommendation(rec_id)
    if not success:
        raise HTTPException(status_code=404, detail="Recommendation record not found")
    return {
        "success": True,
        "message": f"Recommendation #{rec_id} deleted successfully"
    }

@app.post("/api/calculate")
async def calculate_solar_economics(req: CalculatorRequest):
    """
    Real-time interactive calculator endpoint with custom parameters and 25-year cashflow curve.
    """
    cap = req.capacity_kw
    daily_gen = cap * req.daily_sun_hours * 0.78
    monthly_gen = round(daily_gen * 30.0, 1)
    annual_gen = round(daily_gen * 365.0, 1)

    gross_cost = round(cap * req.cost_per_kw, 2)
    # PM Surya Ghar subsidy check
    subsidy = 0.0
    if req.property_type == "Residential" and not req.has_battery:
        if cap <= 2.0:
            subsidy = round(cap * 30000.0, 2)
        elif cap <= 3.0:
            subsidy = round(60000.0 + (cap - 2.0) * 18000.0, 2)
        else:
            subsidy = 78000.0

    net_cost = max(gross_cost - subsidy, 0.0)
    annual_savings = round(annual_gen * req.tariff_inr, 1)
    monthly_savings = round(annual_savings / 12.0, 1)

    payback_years = round(net_cost / annual_savings, 1) if annual_savings > 0 else 99.0
    co2_tonnes = round((annual_gen * CARBON_EMISSION_FACTOR) / 1000.0, 2)
    trees = int(round(co2_tonnes * 45))

    # 25-year cashflow with custom degradation and escalation
    timeline = []
    cumulative = -net_cost
    deg_rate = req.annual_degradation_pct / 100.0
    esc_rate = req.tariff_escalation_pct / 100.0

    for yr in range(1, 26):
        cur_gen = annual_gen * ((1.0 - deg_rate) ** (yr - 1))
        cur_tariff = req.tariff_inr * ((1.0 + esc_rate) ** (yr - 1))
        y_savings = round(cur_gen * cur_tariff, 1)
        om_cost = round((gross_cost * 0.01) * ((1.03) ** (yr - 1)), 1) if yr > 1 else 0.0
        inv_replacement = round(gross_cost * 0.15, 1) if yr == 12 else 0.0

        net_benefit = y_savings - om_cost - inv_replacement
        cumulative += net_benefit

        timeline.append({
            "year": yr,
            "annual_generation_kwh": round(cur_gen, 1),
            "tariff_inr": round(cur_tariff, 2),
            "annual_savings_inr": y_savings,
            "om_expense_inr": om_cost,
            "cumulative_net_inr": round(cumulative, 1)
        })

    return {
        "success": True,
        "capacity_kw": cap,
        "daily_generation_kwh": round(daily_gen, 1),
        "monthly_generation_kwh": monthly_gen,
        "annual_generation_kwh": annual_gen,
        "gross_cost": gross_cost,
        "subsidy": subsidy,
        "net_cost": net_cost,
        "monthly_savings": monthly_savings,
        "annual_savings": annual_savings,
        "payback_years": payback_years,
        "co2_tonnes_yr": co2_tonnes,
        "trees_equivalent": trees,
        "lifetime_savings_25yr": round(cumulative, 1),
        "timeline": timeline
    }

@app.post("/api/chat")
async def chat_endpoint(req: ChatRequest):
    history_dicts = [{"role": m.role, "content": m.content} for m in req.history or []]
    resp = await generate_chatbot_reply(req.message, history_dicts)
    return {
        "success": True,
        "reply": resp["reply"],
        "source": resp["source"],
        "is_demo": resp.get("is_demo", False)
    }

@app.post("/api/contact")
async def contact_endpoint(req: ContactRequest):
    contact_data = {
        "created_at": datetime.now().isoformat(),
        "name": req.name,
        "email": req.email,
        "phone": req.phone,
        "organization": req.organization or "N/A",
        "inquiry_type": req.inquiry_type,
        "message": req.message
    }
    contact_id = save_contact(contact_data)
    return {
        "success": True,
        "message": "Thank you for reaching out! Your inquiry has been stored in our database.",
        "ticket_id": f"SOLAR-{contact_id:04d}",
        "timestamp": contact_data["created_at"]
    }

@app.get("/api/contacts")
async def list_contacts():
    contacts = get_contacts(limit=50)
    return {
        "success": True,
        "count": len(contacts),
        "data": contacts
    }
