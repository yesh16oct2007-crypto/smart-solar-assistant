import sqlite3
import os
import json
from datetime import datetime
from typing import List, Dict, Any, Optional

DB_PATH = os.path.join(os.path.dirname(__file__), "solar.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    # Table for solar recommendations
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS recommendations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        property_type TEXT NOT NULL,
        monthly_bill REAL NOT NULL,
        monthly_kwh REAL NOT NULL,
        roof_area_sqft REAL NOT NULL,
        budget REAL NOT NULL,
        roof_type TEXT NOT NULL,
        connection_type TEXT NOT NULL,
        battery_needed TEXT NOT NULL,
        recommended_capacity_kw REAL NOT NULL,
        panel_count INTEGER NOT NULL,
        panel_wattage INTEGER NOT NULL,
        gross_cost REAL NOT NULL,
        subsidy_amount REAL NOT NULL,
        net_cost REAL NOT NULL,
        monthly_generation_kwh REAL NOT NULL,
        annual_generation_kwh REAL NOT NULL,
        monthly_savings REAL NOT NULL,
        annual_savings REAL NOT NULL,
        payback_years REAL NOT NULL,
        system_type TEXT NOT NULL,
        co2_avoided_tonnes_yr REAL NOT NULL,
        trees_equivalent INTEGER NOT NULL,
        ai_explanation TEXT NOT NULL,
        calculation_breakdown TEXT NOT NULL
    );
    """)

    # Table for contact inquiries
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS contacts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        created_at TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        organization TEXT,
        inquiry_type TEXT NOT NULL,
        message TEXT NOT NULL,
        status TEXT DEFAULT 'received'
    );
    """)

    conn.commit()

    # Seed sample recommendations if empty
    cursor.execute("SELECT COUNT(*) FROM recommendations")
    count = cursor.fetchone()[0]
    if count == 0:
        seed_sample_data(cursor)
        conn.commit()

    conn.close()

def seed_sample_data(cursor):
    sample_items = [
        {
            "created_at": datetime.now().isoformat(),
            "city": "Bengaluru",
            "state": "Karnataka",
            "property_type": "Residential",
            "monthly_bill": 3800.0,
            "monthly_kwh": 450.0,
            "roof_area_sqft": 450.0,
            "budget": 200000.0,
            "roof_type": "Flat RCC Concrete",
            "connection_type": "Single-phase",
            "battery_needed": "No",
            "recommended_capacity_kw": 3.0,
            "panel_count": 6,
            "panel_wattage": 540,
            "gross_cost": 174000.0,
            "subsidy_amount": 78000.0,
            "net_cost": 96000.0,
            "monthly_generation_kwh": 378.0,
            "annual_generation_kwh": 4536.0,
            "monthly_savings": 3200.0,
            "annual_savings": 38400.0,
            "payback_years": 2.5,
            "system_type": "On-Grid (Grid-Tied) System with Net Metering",
            "co2_avoided_tonnes_yr": 3.72,
            "trees_equivalent": 167,
            "ai_explanation": "For an urban Bengaluru residential household with a monthly bill of ₹3,800 (~450 kWh), a 3.0 kW on-grid solar system strikes an optimal balance between self-consumption and roof area utilization. Under the PM Surya Ghar Muft Bijli Yojana, a maximum central subsidy of ₹78,000 applies, significantly dropping the net capex to under ₹1 lakh.",
            "calculation_breakdown": json.dumps({
                "irradiance_sun_hours": 5.2,
                "performance_ratio": 0.78,
                "tariff_rate": 8.44,
                "roof_utilization_pct": 53.3,
                "capex_per_kw": 58000
            })
        },
        {
            "created_at": datetime.now().isoformat(),
            "city": "Pune",
            "state": "Maharashtra",
            "property_type": "Commercial / Office",
            "monthly_bill": 24500.0,
            "monthly_kwh": 2200.0,
            "roof_area_sqft": 1800.0,
            "budget": 750000.0,
            "roof_type": "Sloped Metal Sheet",
            "connection_type": "Three-phase",
            "battery_needed": "Partial",
            "recommended_capacity_kw": 12.0,
            "panel_count": 22,
            "panel_wattage": 550,
            "gross_cost": 696000.0,
            "subsidy_amount": 0.0,
            "net_cost": 696000.0,
            "monthly_generation_kwh": 1476.0,
            "annual_generation_kwh": 17712.0,
            "monthly_savings": 16400.0,
            "annual_savings": 196800.0,
            "payback_years": 3.5,
            "system_type": "Hybrid Solar System with Essential Backup Battery",
            "co2_avoided_tonnes_yr": 14.52,
            "trees_equivalent": 653,
            "ai_explanation": "For a commercial setup in Pune, daytime business operating hours coincide perfectly with peak solar insolation. A 12 kW hybrid system covers base office loads (servers, workstation lights, network switches) while mitigating MSEDCL commercial peak tariffs (₹11.1/kWh). Accelerated depreciation (40%) also offers strong tax offsets in the first year.",
            "calculation_breakdown": json.dumps({
                "irradiance_sun_hours": 5.0,
                "performance_ratio": 0.77,
                "tariff_rate": 11.1,
                "roof_utilization_pct": 66.7,
                "capex_per_kw": 58000
            })
        },
        {
            "created_at": datetime.now().isoformat(),
            "city": "Jaipur",
            "state": "Rajasthan",
            "property_type": "College / Institutional",
            "monthly_bill": 85000.0,
            "monthly_kwh": 9500.0,
            "roof_area_sqft": 6000.0,
            "budget": 2500000.0,
            "roof_type": "Flat RCC Concrete",
            "connection_type": "Three-phase",
            "battery_needed": "No",
            "recommended_capacity_kw": 50.0,
            "panel_count": 92,
            "panel_wattage": 545,
            "gross_cost": 2350000.0,
            "subsidy_amount": 0.0,
            "net_cost": 2350000.0,
            "monthly_generation_kwh": 6750.0,
            "annual_generation_kwh": 81000.0,
            "monthly_savings": 60750.0,
            "annual_savings": 729000.0,
            "payback_years": 3.2,
            "system_type": "On-Grid (Grid-Tied) System with Net Metering",
            "co2_avoided_tonnes_yr": 66.42,
            "trees_equivalent": 2988,
            "ai_explanation": "Rajasthan features among the highest global horizontal irradiance (GHI) in India (5.5 peak sun hours). For an engineering college in Jaipur, a 50 kW on-grid solar plant offsets heavy classroom and laboratory air-conditioning daytime demands, cutting high HT commercial tariff costs with an estimated simple payback under 3.3 years.",
            "calculation_breakdown": json.dumps({
                "irradiance_sun_hours": 5.5,
                "performance_ratio": 0.80,
                "tariff_rate": 9.0,
                "roof_utilization_pct": 75.0,
                "capex_per_kw": 47000
            })
        }
    ]

    for item in sample_items:
        cursor.execute("""
        INSERT INTO recommendations (
            created_at, city, state, property_type, monthly_bill, monthly_kwh,
            roof_area_sqft, budget, roof_type, connection_type, battery_needed,
            recommended_capacity_kw, panel_count, panel_wattage, gross_cost,
            subsidy_amount, net_cost, monthly_generation_kwh, annual_generation_kwh,
            monthly_savings, annual_savings, payback_years, system_type,
            co2_avoided_tonnes_yr, trees_equivalent, ai_explanation, calculation_breakdown
        ) VALUES (
            :created_at, :city, :state, :property_type, :monthly_bill, :monthly_kwh,
            :roof_area_sqft, :budget, :roof_type, :connection_type, :battery_needed,
            :recommended_capacity_kw, :panel_count, :panel_wattage, :gross_cost,
            :subsidy_amount, :net_cost, :monthly_generation_kwh, :annual_generation_kwh,
            :monthly_savings, :annual_savings, :payback_years, :system_type,
            :co2_avoided_tonnes_yr, :trees_equivalent, :ai_explanation, :calculation_breakdown
        )
        """, item)

def save_recommendation(data: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO recommendations (
        created_at, city, state, property_type, monthly_bill, monthly_kwh,
        roof_area_sqft, budget, roof_type, connection_type, battery_needed,
        recommended_capacity_kw, panel_count, panel_wattage, gross_cost,
        subsidy_amount, net_cost, monthly_generation_kwh, annual_generation_kwh,
        monthly_savings, annual_savings, payback_years, system_type,
        co2_avoided_tonnes_yr, trees_equivalent, ai_explanation, calculation_breakdown
    ) VALUES (
        :created_at, :city, :state, :property_type, :monthly_bill, :monthly_kwh,
        :roof_area_sqft, :budget, :roof_type, :connection_type, :battery_needed,
        :recommended_capacity_kw, :panel_count, :panel_wattage, :gross_cost,
        :subsidy_amount, :net_cost, :monthly_generation_kwh, :annual_generation_kwh,
        :monthly_savings, :annual_savings, :payback_years, :system_type,
        :co2_avoided_tonnes_yr, :trees_equivalent, :ai_explanation, :calculation_breakdown
    )
    """, data)
    rec_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return rec_id

def get_recommendations(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recommendations ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    result = []
    for r in rows:
        d = dict(r)
        if "calculation_breakdown" in d and isinstance(d["calculation_breakdown"], str):
            try:
                d["calculation_breakdown"] = json.loads(d["calculation_breakdown"])
            except Exception:
                pass
        result.append(d)
    conn.close()
    return result

def get_recommendation_by_id(rec_id: int) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM recommendations WHERE id = ?", (rec_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    if "calculation_breakdown" in d and isinstance(d["calculation_breakdown"], str):
        try:
            d["calculation_breakdown"] = json.loads(d["calculation_breakdown"])
        except Exception:
            pass
    return d

def delete_recommendation(rec_id: int) -> bool:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM recommendations WHERE id = ?", (rec_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def save_contact(data: Dict[str, Any]) -> int:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT INTO contacts (
        created_at, name, email, phone, organization, inquiry_type, message, status
    ) VALUES (
        :created_at, :name, :email, :phone, :organization, :inquiry_type, :message, 'received'
    )
    """, data)
    contact_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return contact_id

def get_contacts(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM contacts ORDER BY id DESC LIMIT ?", (limit,))
    rows = cursor.fetchall()
    result = [dict(r) for r in rows]
    conn.close()
    return result
