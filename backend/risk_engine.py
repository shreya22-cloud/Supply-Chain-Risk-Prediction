class RiskEngine:
    """
    Supply Chain Multi-Factor Composite Risk Engine.
    Formula:
    - Supplier Reliability = 25%
    - Port Congestion = 20%
    - Weather Risk = 15%
    - Geopolitical Risk = 15%
    - Historical Delay = 15%
    - Inventory Safety Level = 10%
    """

    @staticmethod
    def calculate_composite_risk(
        supplier_reliability: float,
        port_congestion: float,
        weather_risk: float,
        geopolitical_risk: float,
        historical_delay_days: float,
        inventory_days: float
    ) -> dict:

        rel_factor = (100.0 - supplier_reliability) * 0.25
        cong_factor = port_congestion * 0.20
        wth_factor = weather_risk * 0.15
        geo_factor = geopolitical_risk * 0.15
        hist_factor = min(100.0, historical_delay_days * 7.0) * 0.15

        # Inventory buffer reduces risk if days of supply is high
        inv_factor = max(0.0, 100.0 - inventory_days * 5.0) * 0.10

        composite_score = int(rel_factor + cong_factor + wth_factor + geo_factor + hist_factor + inv_factor)
        composite_score = min(98, max(5, composite_score))

        if composite_score >= 75:
            status = "CRITICAL RISK"
            color = "#EF4444"
        elif composite_score >= 50:
            status = "HIGH WARNING"
            color = "#F59E0B"
        elif composite_score >= 30:
            status = "MODERATE"
            color = "#38BDF8"
        else:
            status = "HEALTHY"
            color = "#10B981"

        return {
            "composite_risk_score": composite_score,
            "status": status,
            "badge_color": color,
            "weight_breakdown": {
                "supplier_reliability_weight": "25%",
                "port_congestion_weight": "20%",
                "weather_risk_weight": "15%",
                "geopolitical_risk_weight": "15%",
                "historical_delay_weight": "15%",
                "inventory_buffer_weight": "10%"
            }
        }

risk_engine = RiskEngine()
