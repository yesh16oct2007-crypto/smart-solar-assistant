import math
from typing import Dict, Any, Tuple

# Regional Peak Sun Hours (PSH) across Indian States and UTs (kWh/m²/day)
STATE_IRRADIANCE: Dict[str, float] = {
    "Rajasthan": 5.5,
    "Gujarat": 5.4,
    "Karnataka": 5.2,
    "Andhra Pradesh": 5.2,
    "Telangana": 5.1,
    "Tamil Nadu": 5.1,
    "Madhya Pradesh": 5.1,
    "Maharashtra": 5.0,
    "Haryana": 4.9,
    "Delhi": 4.8,
    "Punjab": 4.8,
    "Uttar Pradesh": 4.7,
    "Odisha": 4.7,
    "Bihar": 4.6,
    "Kerala": 4.6,
    "West Bengal": 4.5,
    "Jharkhand": 4.6,
    "Chhattisgarh": 4.8,
    "Uttarakhand": 4.7,
    "Himachal Pradesh": 4.6,
    "Jammu and Kashmir": 4.8,
    "Assam": 4.2,
    "Goa": 4.9
}
DEFAULT_IRRADIANCE = 4.8

# Average Electricity Tariffs (₹ / kWh) by Property Type
DEFAULT_TARIFFS = {
    "Residential": 7.5,
    "Commercial / Office": 10.8,
    "College / Institutional": 8.8,
    "Industrial": 8.2
}

# Standard Module Specifications
DEFAULT_PANEL_WATT = 540  # 540W Mono PERC Bifacial
SQFT_PER_KW = 85.0        # Roof area required per kW with walkway and tilt pitch clearance
PERFORMANCE_RATIO = 0.78  # Standard PV system efficiency factor (temp losses, dust, inverter loss)
CARBON_EMISSION_FACTOR = 0.82  # kg CO2 / kWh (CEA Indian Grid Baseline)

def get_state_irradiance(state: str) -> float:
    return STATE_IRRADIANCE.get(state.strip(), DEFAULT_IRRADIANCE)

def calculate_pm_surya_ghar_subsidy(capacity_kw: float, property_type: str, battery_needed: str) -> float:
    """
    PM Surya Ghar: Muft Bijli Yojana Central Financial Assistance (CFA)
    Rules for Residential Rooftop Solar (effective 2024-2026):
    - Up to 2 kW: ₹30,000 per kW (Max ₹60,000)
    - Additional capacity between 2 kW and 3 kW: ₹18,000 per additional kW (Max ₹78,000 at 3 kW)
    - Beyond 3 kW: Capped at ₹78,000 maximum CFA subsidy
    - Commercial / Institutional / Industrial: 0 direct CFA subsidy (eligible for 40% accelerated depreciation)
    - Pure Off-Grid systems: not eligible for PM Surya Ghar grid-tied subsidy
    """
    if property_type != "Residential" or battery_needed == "Yes":
        return 0.0

    if capacity_kw <= 0:
        return 0.0
    elif capacity_kw <= 2.0:
        return round(capacity_kw * 30000.0, 2)
    elif capacity_kw <= 3.0:
        return round(60000.0 + (capacity_kw - 2.0) * 18000.0, 2)
    else:
        return 78000.0

def estimate_cost_per_kw(capacity_kw: float, system_type_mode: str) -> float:
    """
    Benchmark Turnkey Solar Installation Cost in India (MNRE benchmarks):
    Includes Mono PERC modules, on-grid/hybrid inverter, GI mounting structure,
    earthing kit, lightning arrestor, ACDB/DCDB, wiring, and commissioning.
    """
    # Scale economy discounts for larger systems
    if capacity_kw <= 3.0:
        base_rate = 58000.0
    elif capacity_kw <= 10.0:
        base_rate = 52000.0
    elif capacity_kw <= 25.0:
        base_rate = 47000.0
    else:
        base_rate = 43000.0

    if system_type_mode == "Hybrid":
        # Includes hybrid inverter + LiFePO4 battery storage (~3-5 kWh per 3kW)
        return base_rate + 22000.0
    elif system_type_mode == "Off-Grid":
        # Includes off-grid PCU + full autonomous battery bank
        return base_rate + 32000.0
    else:
        # Pure On-Grid (Grid-Tied)
        return base_rate

def calculate_solar_recommendation(
    city: str,
    state: str,
    property_type: str,
    monthly_bill: float,
    monthly_kwh: float,
    roof_area_sqft: float,
    budget: float,
    roof_type: str,
    connection_type: str,
    battery_needed: str,
    panel_wattage: int = DEFAULT_PANEL_WATT,
    custom_tariff: float = 0.0
) -> Dict[str, Any]:
    """
    Core deterministic engineering sizing engine.
    Produces accurate, transparent, and sensible solar system configurations.
    """
    irradiance = get_state_irradiance(state)
    
    # 1. Determine electricity tariff
    if custom_tariff and custom_tariff > 0:
        tariff = custom_tariff
    elif monthly_kwh > 0 and monthly_bill > 0:
        tariff = round(monthly_bill / monthly_kwh, 2)
        # Sanity bounds check on tariff (₹4 to ₹16)
        if tariff < 4.0 or tariff > 16.0:
            tariff = DEFAULT_TARIFFS.get(property_type, 7.5)
    else:
        tariff = DEFAULT_TARIFFS.get(property_type, 7.5)

    # 2. Derive monthly consumption if missing
    if monthly_kwh <= 0 and monthly_bill > 0:
        monthly_kwh = round(monthly_bill / tariff, 1)
    elif monthly_bill <= 0 and monthly_kwh > 0:
        monthly_bill = round(monthly_kwh * tariff, 1)
    elif monthly_kwh <= 0 and monthly_bill <= 0:
        # Default reasonable residential consumption
        monthly_kwh = 350.0
        monthly_bill = round(monthly_kwh * tariff, 1)

    daily_kwh_need = monthly_kwh / 30.0

    # 3. Capacity needed based on energy demand
    # Energy generated per kWp per day = irradiance * performance_ratio
    daily_gen_per_kw = irradiance * PERFORMANCE_RATIO
    capacity_by_consumption = daily_kwh_need / daily_gen_per_kw

    # 4. Capacity allowed by available rooftop area
    # e.g., 85 sq.ft per kW
    capacity_by_roof = max(roof_area_sqft / SQFT_PER_KW, 0.5)

    # 5. Capacity constrained by budget (if specified and > 0)
    system_type_mode = "On-Grid"
    if battery_needed == "Partial":
        system_type_mode = "Hybrid"
    elif battery_needed == "Yes":
        system_type_mode = "Off-Grid"

    # Preliminary cost per kW
    cost_per_kw_estimate = estimate_cost_per_kw(capacity_by_consumption, system_type_mode)
    if budget and budget > 30000:
        # Approximate capacity budget can purchase
        capacity_by_budget = budget / cost_per_kw_estimate
    else:
        capacity_by_budget = 9999.0

    # 6. Sizing Selection:
    # Recommended capacity is limited by roof space and budget, targetting 100% of consumption
    raw_capacity = min(capacity_by_consumption, capacity_by_roof, capacity_by_budget)
    
    # Practical sizing increments:
    # Under 5 kW: round to nearest 0.5 kW (minimum 1.0 kW)
    # Between 5 kW and 20 kW: round to nearest 1.0 kW
    # Over 20 kW: round to nearest 5.0 kW
    if raw_capacity < 1.0:
        recommended_capacity_kw = 1.0
    elif raw_capacity < 5.0:
        recommended_capacity_kw = round(raw_capacity * 2) / 2
    elif raw_capacity < 20.0:
        recommended_capacity_kw = float(round(raw_capacity))
    else:
        recommended_capacity_kw = float(round(raw_capacity / 5) * 5)

    # Ensure single-phase connections do not exceed DISCOM single-phase ceiling (typically 3-5 kW)
    if connection_type == "Single-phase" and recommended_capacity_kw > 5.0:
        connection_note = "DISCOM regulations typically limit single-phase net metering to 5 kW. Sizing adjusted to 5 kW or three-phase upgrade recommended."
        recommended_capacity_kw = 5.0
    else:
        connection_note = "Connection type is suitable for recommended capacity."

    # 7. Panel Count & Actual DC Capacity
    # Module rating in Watts (e.g. 540W = 0.54 kW)
    module_kw = panel_wattage / 1000.0
    panel_count = math.ceil(recommended_capacity_kw / module_kw)
    actual_dc_kw = round(panel_count * module_kw, 2)
    actual_roof_required = round(panel_count * 28.0 * 1.5, 1) # panel area + 50% inter-row spacing

    # 8. Generation Calculations
    daily_gen_kwh = actual_dc_kw * daily_gen_per_kw
    monthly_gen_kwh = round(daily_gen_kwh * 30.0, 1)
    annual_gen_kwh = round(daily_gen_kwh * 365.0, 1)

    # 9. Cost & Financials
    cost_per_kw = estimate_cost_per_kw(actual_dc_kw, system_type_mode)
    gross_cost = round(actual_dc_kw * cost_per_kw, 2)
    subsidy_amount = calculate_pm_surya_ghar_subsidy(actual_dc_kw, property_type, battery_needed)
    net_cost = max(gross_cost - subsidy_amount, 0.0)

    # 10. Savings Calculations
    # Self-consumed energy offsets tariff. Any excess generation credited at feed-in tariff (~₹2.5/kWh)
    consumed_solar = min(monthly_gen_kwh, monthly_kwh)
    excess_exported = max(monthly_gen_kwh - monthly_kwh, 0.0)
    monthly_savings = round((consumed_solar * tariff) + (excess_exported * 2.5), 1)
    annual_savings = round(monthly_savings * 12.0, 1)

    # 11. Payback Period
    if annual_savings > 0:
        payback_years = round(net_cost / annual_savings, 1)
    else:
        payback_years = 99.0

    # 12. Environmental Metrics
    co2_avoided_tonnes_yr = round((annual_gen_kwh * CARBON_EMISSION_FACTOR) / 1000.0, 2)
    trees_equivalent = int(round(co2_avoided_tonnes_yr * 45))

    # 13. System Type Descriptor
    if system_type_mode == "On-Grid":
        system_type_name = "On-Grid (Grid-Tied) System with Net Metering"
        system_description = "Synchronizes with the local power grid without batteries. Surplus power is exported back to the grid via a bi-directional net meter."
    elif system_type_mode == "Hybrid":
        system_type_name = "Hybrid Solar System with Essential Battery Backup"
        system_description = "Combines grid net-metering benefits with a LiFePO4 battery bank to keep critical loads running during grid blackouts."
    else:
        system_type_name = "Off-Grid Solar System with Autonomous Battery Bank"
        system_description = "Completely independent of the utility grid, equipped with large storage to power loads 24/7."

    # 14. 25-Year Financial Projection
    # 0.7% degradation, 3.5% tariff inflation, 1.5% annual O&M
    cumulative_savings_25yr = 0.0
    current_annual_savings = annual_savings
    cash_flow_series = []
    current_net = -net_cost

    for yr in range(1, 26):
        # Degrade generation by 0.7% each year after yr 1
        gen_factor = (1.0 - (yr - 1) * 0.007)
        # Increase tariff by 3.5% each year
        tariff_factor = (1.035 ** (yr - 1))
        yearly_savings = round(annual_savings * gen_factor * tariff_factor, 1)
        # O&M expense (approx 1% of gross capex starting year 2)
        om_cost = round((gross_cost * 0.01) * (1.03 ** (yr - 1)), 1) if yr > 1 else 0.0
        # Inverter replacement at year 12 (approx 15% of initial cost)
        replacement_cost = round(gross_cost * 0.15, 1) if yr == 12 else 0.0
        
        net_year_benefit = yearly_savings - om_cost - replacement_cost
        current_net += net_year_benefit
        cumulative_savings_25yr += net_year_benefit

        if yr in [1, 3, 5, 10, 15, 20, 25]:
            cash_flow_series.append({
                "year": yr,
                "annual_savings": yearly_savings,
                "net_cumulative": round(current_net, 1)
            })

    breakdown = {
        "irradiance_sun_hours": irradiance,
        "performance_ratio": PERFORMANCE_RATIO,
        "tariff_rate": tariff,
        "daily_gen_per_kw": round(daily_gen_per_kw, 2),
        "actual_dc_kw": actual_dc_kw,
        "cost_per_kw": cost_per_kw,
        "roof_utilization_sqft": actual_roof_required,
        "roof_utilization_pct": round(min((actual_roof_required / max(roof_area_sqft, 1.0)) * 100, 100.0), 1),
        "connection_note": connection_note,
        "cash_flow_series": cash_flow_series,
        "cumulative_savings_25yr": round(cumulative_savings_25yr, 1)
    }

    return {
        "city": city,
        "state": state,
        "property_type": property_type,
        "monthly_bill": monthly_bill,
        "monthly_kwh": monthly_kwh,
        "roof_area_sqft": roof_area_sqft,
        "budget": budget,
        "roof_type": roof_type,
        "connection_type": connection_type,
        "battery_needed": battery_needed,
        "recommended_capacity_kw": recommended_capacity_kw,
        "actual_dc_kw": actual_dc_kw,
        "panel_count": panel_count,
        "panel_wattage": panel_wattage,
        "gross_cost": gross_cost,
        "subsidy_amount": subsidy_amount,
        "net_cost": net_cost,
        "monthly_generation_kwh": monthly_gen_kwh,
        "annual_generation_kwh": annual_gen_kwh,
        "monthly_savings": monthly_savings,
        "annual_savings": annual_savings,
        "payback_years": payback_years,
        "system_type": system_type_name,
        "system_description": system_description,
        "co2_avoided_tonnes_yr": co2_avoided_tonnes_yr,
        "trees_equivalent": trees_equivalent,
        "calculation_breakdown": breakdown
    }
