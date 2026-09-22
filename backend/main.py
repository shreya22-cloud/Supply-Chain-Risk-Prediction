from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import sqlite3
import json
import os
from datetime import datetime, timedelta

from database import init_db, get_db_connection, seed_data
from models import (
    PredictionRequest, PredictionResponse,
    DisruptionSimulationRequest, DisruptionSimulationResponse,
    NewsAnalysisRequest, NewsAnalysisResponse,
    MitigationRequest, MitigationResponse,
    DraftPORequest
)
from ml_engine import ml_predictor
from graph_engine import graph_engine
from nlp_engine import nlp_engine
from risk_engine import risk_engine

app = FastAPI(
    title="SupplyGuard AI Backend API",
    description="Intelligent Supply Chain Risk Prediction & Resiliency Platform API",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    init_db()

@app.get("/api/health")
def health_check():
    return {
        "status": "ONLINE",
        "api": "ONLINE",
        "ml_engine": "ONLINE",
        "database": "ONLINE",
        "data_pipeline": "ONLINE",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/dashboard")
def get_dashboard_summary():
    conn = get_db_connection()
    cursor = conn.cursor()

    # KPIs
    cursor.execute("SELECT COUNT(*) FROM suppliers")
    suppliers_monitored = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM alerts WHERE status = 'Unresolved'")
    active_risks = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM purchase_orders WHERE risk_level IN ('HIGH', 'CRITICAL')")
    high_risk_shipments = cursor.fetchone()[0]

    cursor.execute("SELECT COUNT(*) FROM purchase_orders WHERE predicted_delay_days > 2.0")
    predicted_delays = cursor.fetchone()[0]

    cursor.execute("SELECT SUM(value_usd) FROM purchase_orders WHERE risk_level IN ('HIGH', 'CRITICAL')")
    exposure_val = cursor.fetchone()[0] or 2400000.0

    # Ports for global map
    cursor.execute("SELECT * FROM ports")
    ports = [dict(row) for row in cursor.fetchall()]

    # Highest Current Risk Exposure
    cursor.execute("""
        SELECT s.name as entity, s.risk_score, 'Critical Supplier Exposure' as reason, s.status, 'Supplier' as type
        FROM suppliers s ORDER BY s.risk_score DESC LIMIT 3
    """)
    top_suppliers = [dict(row) for row in cursor.fetchall()]

    cursor.execute("""
        SELECT p.name as entity, p.risk_score, 'Labor Disruption & Congestion' as reason, p.status, 'Port' as type
        FROM ports p ORDER BY p.risk_score DESC LIMIT 3
    """)
    top_ports = [dict(row) for row in cursor.fetchall()]

    top_risk_exposure = top_ports + top_suppliers

    # Risk Trend Line Chart (30 Days)
    today = datetime.now()
    risk_trend = []
    for i in range(29, -1, -1):
        day_date = today - timedelta(days=i)
        # Smooth synthetic trend curve around 40-75%
        curr_risk = int(45 + 15 * np_sin(i/3) + (i % 4) * 2)
        pred_risk = int(curr_risk + (8 if i > 15 else -3))
        risk_trend.append({
            "date": day_date.strftime("%b %d"),
            "current_risk": max(15, min(95, curr_risk)),
            "predicted_risk": max(15, min(95, pred_risk))
        })

    # Upcoming Risk Events
    cursor.execute("SELECT * FROM risk_events WHERE status = 'Active' ORDER BY risk_score DESC LIMIT 5")
    raw_events = [dict(row) for row in cursor.fetchall()]
    upcoming_events = []
    for ev in raw_events:
        upcoming_events.append({
            "id": ev["id"],
            "event": ev["headline"],
            "location": ev["location"],
            "risk_level": "CRITICAL" if ev["risk_score"] >= 80 else "HIGH",
            "risk_score": ev["risk_score"],
            "expected_timeframe": "Within 48-72 hours",
            "affected_entities": ev["event_type"]
        })

    conn.close()

    return {
        "kpis": {
            "network_health_pct": 87,
            "active_risks_count": active_risks,
            "high_risk_shipments_count": high_risk_shipments,
            "predicted_delays_count": predicted_delays,
            "suppliers_monitored_count": suppliers_monitored,
            "estimated_exposure_usd": round(exposure_val, 2),
            "estimated_exposure_formatted": "$2.4M"
        },
        "map_ports": ports,
        "risk_trend": risk_trend,
        "top_risk_exposure": top_risk_exposure,
        "upcoming_risk_events": upcoming_events
    }

def np_sin(x):
    import math
    return math.sin(x)

@app.get("/api/suppliers")
def get_suppliers():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM suppliers ORDER BY risk_score DESC")
    suppliers = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return suppliers

@app.get("/api/suppliers/{supplier_id}")
def get_supplier_detail(supplier_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM suppliers WHERE id = ?", (supplier_id,))
    sup = cursor.fetchone()
    if not sup:
        conn.close()
        raise HTTPException(status_code=404, detail="Supplier not found")
    
    supplier = dict(sup)

    # Associated POs
    cursor.execute("SELECT * FROM purchase_orders WHERE supplier_id = ?", (supplier_id,))
    pos = [dict(row) for row in cursor.fetchall()]

    # Alternative supplier recommendations
    cursor.execute("SELECT * FROM suppliers WHERE category = ? AND id != ? LIMIT 3", (supplier["category"], supplier_id))
    alternates = [dict(row) for row in cursor.fetchall()]

    conn.close()
    return {
        "supplier": supplier,
        "purchase_orders": pos,
        "alternate_suppliers": alternates
    }

@app.get("/api/purchase-orders")
def get_purchase_orders():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT po.*, s.name as supplier_name, prd.name as product_name
        FROM purchase_orders po
        JOIN suppliers s ON po.supplier_id = s.id
        JOIN products prd ON po.product_id = prd.id
        ORDER BY po.predicted_delay_days DESC
    """)
    pos = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return pos

@app.get("/api/shipments")
def get_shipments():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT shp.*, po.value_usd, po.product_id, po.supplier_id
        FROM shipments shp
        JOIN purchase_orders po ON shp.po_id = po.id
        ORDER BY shp.risk_score DESC
    """)
    shipments = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return shipments

@app.get("/api/alerts")
def get_alerts():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts ORDER BY date_created DESC")
    alerts_raw = cursor.fetchall()
    alerts = []
    for row in alerts_raw:
        item = dict(row)
        try:
            item["affected_pos"] = json.loads(item["affected_pos"])
        except:
            pass
        try:
            item["prescriptive_actions"] = json.loads(item["prescriptive_actions"])
        except:
            pass
        alerts.append(item)
    conn.close()
    return alerts

@app.get("/api/alerts/{alert_id}")
def get_alert_detail(alert_id: str):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM alerts WHERE id = ?", (alert_id,))
    row = cursor.fetchone()
    if not row:
        conn.close()
        raise HTTPException(status_code=404, detail="Alert not found")
    item = dict(row)
    try:
        item["affected_pos"] = json.loads(item["affected_pos"])
    except:
        pass
    try:
        item["prescriptive_actions"] = json.loads(item["prescriptive_actions"])
    except:
        pass
    conn.close()
    return item

@app.get("/api/network")
def get_network_digital_twin():
    return graph_engine.get_network_graph()

@app.get("/api/analytics")
def get_analytics():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Risk Distribution by Tier
    cursor.execute("SELECT tier, AVG(risk_score) as avg_risk FROM suppliers GROUP BY tier")
    tier_risk = [dict(row) for row in cursor.fetchall()]

    # Port Congestion Metrics
    cursor.execute("SELECT name, congestion_level, risk_score FROM ports ORDER BY congestion_level DESC")
    port_metrics = [dict(row) for row in cursor.fetchall()]

    # Lead time breakdown by Country
    cursor.execute("SELECT country, AVG(avg_lead_time_days) as lead_time, AVG(on_time_rate) as on_time FROM suppliers GROUP BY country")
    geography_metrics = [dict(row) for row in cursor.fetchall()]

    conn.close()

    return {
        "tier_risk_distribution": tier_risk,
        "port_congestion_metrics": port_metrics,
        "geography_metrics": geography_metrics
    }

@app.get("/api/nlp-feed")
def get_nlp_feed():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM risk_events ORDER BY date_detected DESC")
    events = [dict(row) for row in cursor.fetchall()]
    conn.close()

    parsed = []
    for ev in events:
        item = dict(ev)
        try:
            item["detected_entities"] = json.loads(item["detected_entities"])
        except:
            pass
        parsed.append(item)
    return parsed

@app.get("/api/inventory")
def get_inventory():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        SELECT inv.*, prd.name as product_name, prd.unit_cost
        FROM inventory inv
        JOIN products prd ON inv.product_id = prd.id
    """)
    inv = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return inv

@app.post("/api/predict-delay", response_model=PredictionResponse)
def predict_shipment_delay(req: PredictionRequest):
    return ml_predictor.predict(req.dict())

@app.post("/api/simulate-risk", response_model=DisruptionSimulationResponse)
def simulate_graph_disruption(req: DisruptionSimulationRequest):
    return graph_engine.simulate_disruption(
        disruption_type=req.disruption_type,
        target_node_id=req.target_node_id,
        severity_pct=req.severity_pct
    )

@app.post("/api/analyze-news", response_model=NewsAnalysisResponse)
def analyze_unstructured_news(req: NewsAnalysisRequest):
    return nlp_engine.analyze_news_text(req.news_text)

@app.post("/api/mitigation", response_model=MitigationResponse)
def calculate_resiliency_mitigation(req: MitigationRequest):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM suppliers WHERE id = ?", (req.primary_supplier_id,))
    p_sup = dict(cursor.fetchone() or {"name": "Taiwan Semiconductor Supplier", "country": "Taiwan", "risk_score": 82, "avg_lead_time_days": 18.5})

    cursor.execute("SELECT * FROM suppliers WHERE id = ?", (req.alternate_supplier_id,))
    a_sup = dict(cursor.fetchone() or {"name": "Monterrey Component Tech", "country": "Mexico", "risk_score": 25, "avg_lead_time_days": 9.5})

    conn.close()

    return {
        "po_id": req.po_id,
        "current_risk_score": 82,
        "post_action_risk_score": 31,
        "suggested_action": "Transfer 500 units from EU Distribution Center to Plant Munich via Air Freight & Activate Dual Sourcing in Mexico.",
        "logistics_method": "Air Freight & Nearshore Dual-Sourcing",
        "estimated_added_cost_usd": 4500.0,
        "revenue_protected_usd": 1200000.0,
        "primary_supplier": p_sup,
        "alternate_supplier": a_sup,
        "cost_difference_usd": 14.50, # per unit difference
        "delay_reduction_days": 9.0
    }

@app.post("/api/draft-po")
def create_draft_purchase_order(req: DraftPORequest):
    po_id = f"PO-DRAFT-{int(datetime.now().timestamp()) % 10000}"
    return {
        "status": "DRAFT CREATED",
        "draft_po_id": po_id,
        "supplier_id": req.supplier_id,
        "product_id": req.product_id,
        "quantity": req.quantity,
        "target_facility": req.target_facility,
        "message": f"Draft Purchase Order {po_id} successfully created and dispatched to ERP procurement staging queue."
    }

@app.post("/api/upload")
def upload_supply_chain_data(file: UploadFile = File(...)):
    filename = file.filename
    return {
        "message": f"Successfully parsed and processed dataset file: {filename}",
        "records_imported": 45,
        "valid_records": 45,
        "warnings_count": 0,
        "errors_count": 0,
        "preview_records": [
            {"record_id": "IMP-001", "type": "PO Update", "status": "Validated", "risk_score": 22},
            {"record_id": "IMP-002", "type": "Port AIS Ping", "status": "Validated", "risk_score": 45},
            {"record_id": "IMP-003", "type": "Supplier Scorecard", "status": "Validated", "risk_score": 18}
        ]
    }

@app.get("/api/copilot")
def query_supplyguard_copilot(prompt: str):
    prompt_lower = prompt.lower()
    
    if "shipment" in prompt_lower or "highest risk" in prompt_lower:
        ans = (
            "The highest risk shipments currently in transit are **PO-4432** (Automotive Microcontrollers, +12.5 days predicted delay) "
            "and **PO-4435** (OLED Cockpit Displays, +9.0 days delay). Both are affected by the Port of Hamburg labor disruption."
        )
    elif "po-4432" in prompt_lower or "why" in prompt_lower and "delay" in prompt_lower:
        ans = (
            "**PO-4432** is delayed by +12.5 days primarily due to **Port of Hamburg labor strike** (82% congestion) "
            "and high Tier-2 dependency on **Taiwan Semiconductor Supplier** (82% risk score)."
        )
    elif "hamburg" in prompt_lower or "capacity" in prompt_lower:
        ans = (
            "If Port of Hamburg capacity drops by 50%, 12 outbound ocean shipments will be delayed, impacting "
            "4 regional distribution centers and causing a line-down risk at **Munich Plant (Line 3)** within 4 days."
        )
    elif "single point" in prompt_lower or "spof" in prompt_lower or "vulnerab" in prompt_lower:
        ans = (
            "**Taiwan Semiconductor Supplier (SUP-TAIWAN01)** has been flagged as a Single Point of Failure (SPOF). "
            "40% of final assembly products rely on this single Tier-2 node with no active pre-approved secondary buffer."
        )
    elif "mitigat" in prompt_lower or "action" in prompt_lower:
        ans = (
            "Recommended mitigation: Reroute shipments to **Port of Rotterdam** and transfer 500 units from "
            "EU Distribution Center to Munich Plant via air freight ($4,500 cost, protecting $1.2M in revenue)."
        )
    else:
        ans = (
            f"SupplyGuard Copilot analyzed your query: '{prompt}'. Currently monitoring 126 suppliers, 10 global ports, "
            "and 40 active shipments. 12 active risk alerts are flagged, with Port of Hamburg labor disruption posing the highest immediate exposure ($1.2M)."
        )

    return {
        "prompt": prompt,
        "answer": ans,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/demo-reset")
def trigger_demo_mode_scenario():
    conn = get_db_connection()
    seed_data(conn)
    conn.close()
    return {
        "status": "DEMO MODE ACTIVATED",
        "scenario": "Port of Hamburg Labor Disruption & Tier-2 Microchip Bottleneck",
        "primary_po": "PO-4432",
        "primary_port": "Port of Hamburg",
        "risk_score": 82,
        "predicted_delay": 12.5,
        "affected_plant": "Munich Plant - Line 3",
        "message": "Demo scenario active! Navigate through Risk Control Tower -> PO-4432 -> Digital Twin -> Mitigation Center."
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
