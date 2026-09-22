from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PredictionRequest(BaseModel):
    supplier_id: Optional[str] = "SUP-TAIWAN01"
    origin_port: Optional[str] = "PORT-SHEN"
    destination_port: Optional[str] = "PORT-HAM"
    supplier_reliability: float = Field(default=82.0, ge=0, le=100)
    port_congestion: float = Field(default=82.0, ge=0, le=100)
    route_distance_km: float = Field(default=11500.0, ge=100)
    route_complexity: int = Field(default=3, ge=1, le=5)
    seasonality_factor: float = Field(default=1.2, ge=0.5, le=2.5)
    shipment_value_usd: float = Field(default=2100000.0, ge=0)
    current_inventory_days: float = Field(default=4.0, ge=0)
    weather_risk_index: float = Field(default=42.0, ge=0, le=100)
    geopolitical_risk_index: float = Field(default=78.0, ge=0, le=100)

class PredictionResponse(BaseModel):
    predicted_delay_days: float
    expected_arrival_date: str
    confidence_interval: List[str]
    risk_level: str
    confidence_pct: int
    explainable_factors: List[Dict[str, Any]]
    ai_insight: str

class DisruptionSimulationRequest(BaseModel):
    disruption_type: str = "Port Closure"
    target_node_id: str = "PORT-HAM"
    severity_pct: float = Field(default=50.0, ge=0, le=100)

class DisruptionSimulationResponse(BaseModel):
    disruption_type: str
    target_node: str
    severity_pct: float
    affected_shipments_count: int
    affected_warehouses_count: int
    affected_plants_count: int
    affected_products_count: int
    cascading_path: List[Dict[str, Any]]
    estimated_financial_exposure_usd: float
    recommended_mitigation: str

class NewsAnalysisRequest(BaseModel):
    news_text: str

class NewsAnalysisResponse(BaseModel):
    headline_summary: str
    sentiment: str
    risk_score: int
    event_type: str
    detected_location: str
    detected_organizations: List[str]
    potential_supply_impact: str
    affected_nodes: List[str]
    recommended_action: str

class MitigationRequest(BaseModel):
    po_id: str = "PO-4432"
    primary_supplier_id: str = "SUP-TAIWAN01"
    alternate_supplier_id: str = "SUP-MEXICO08"

class MitigationResponse(BaseModel):
    po_id: str
    current_risk_score: int
    post_action_risk_score: int
    suggested_action: str
    logistics_method: str
    estimated_added_cost_usd: float
    revenue_protected_usd: float
    primary_supplier: Dict[str, Any]
    alternate_supplier: Dict[str, Any]
    cost_difference_usd: float
    delay_reduction_days: float

class DataUploadResponse(BaseModel):
    message: str
    records_imported: int
    valid_records: int
    warnings_count: int
    errors_count: int
    preview_records: List[Dict[str, Any]]

class DraftPORequest(BaseModel):
    supplier_id: str
    product_id: str
    quantity: int
    target_facility: str
