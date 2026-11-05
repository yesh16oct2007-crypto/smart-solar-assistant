from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class RecommendationRequest(BaseModel):
    city: str = Field(..., example="Bengaluru")
    state: str = Field(..., example="Karnataka")
    property_type: str = Field(..., example="Residential")
    monthly_bill: float = Field(..., ge=0, example=3500.0)
    monthly_kwh: float = Field(..., ge=0, example=400.0)
    roof_area_sqft: float = Field(..., ge=50, example=450.0)
    budget: float = Field(0.0, ge=0, example=200000.0)
    roof_type: str = Field("Flat RCC Concrete", example="Flat RCC Concrete")
    connection_type: str = Field("Single-phase", example="Single-phase")
    battery_needed: str = Field("No", example="No")
    panel_wattage: Optional[int] = Field(540, example=540)
    custom_tariff: Optional[float] = Field(0.0, ge=0)

class CalculatorRequest(BaseModel):
    capacity_kw: float = Field(..., ge=0.5, le=500.0)
    tariff_inr: float = Field(..., ge=2.0, le=25.0)
    cost_per_kw: float = Field(..., ge=30000.0, le=120000.0)
    daily_sun_hours: float = Field(..., ge=3.0, le=7.0)
    annual_degradation_pct: float = Field(0.7, ge=0.0, le=3.0)
    tariff_escalation_pct: float = Field(3.5, ge=0.0, le=10.0)
    property_type: str = Field("Residential")
    has_battery: bool = Field(False)

class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1)
    history: Optional[List[ChatMessage]] = Field(default_factory=list)

class PromptLabRequest(BaseModel):
    technique: str = Field(..., example="role_based")
    custom_prompt: str = Field(..., min_length=5)
    site_inputs: Dict[str, Any]

class ContactRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: str = Field(..., min_length=5)
    phone: str = Field(..., min_length=10)
    organization: Optional[str] = ""
    inquiry_type: str = Field(..., example="Residential Consultation")
    message: str = Field(..., min_length=5)
