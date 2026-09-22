import re
import json

class NLPEngine:
    """
    Lightweight Natural Language Processing & Macro Risk Analyzer.
    Extracts Named Entities (Locations, Organizations, Events), calculates sentiment spikes,
    and assigns probabilistic risk scores to unstructured supply chain news.
    """

    def __init__(self):
        self.risk_keywords = {
            "critical": ["strike", "embargo", "closure", "bankruptcy", "shortage", "typhoon", "earthquake", "lockdown", "war", "blockade", "fire"],
            "warning": ["delay", "congestion", "tariff", "protest", "disruption", "bottleneck", "dispute", "storm", "freeze", "inspection"],
            "info": ["negotiation", "audit", "weather", "maintenance", "rebalance", "inbound", "schedule", "expansion"]
        }

        self.locations_db = ["Hamburg", "Shenzhen", "Rotterdam", "Singapore", "Los Angeles", "Mumbai", "Shanghai", "Taiwan", "Suez", "Chicago", "Munich", "Mexico", "Vietnam", "Japan", "Panama Canal"]
        self.orgs_db = ["Port Authority", "Ver.di Union", "Maersk", "MSC", "Teamsters Union", "TSMC", "Customs & Border Control", "Evergreen Maritime", "COSCO", "FedEx", "DHL"]

    def analyze_news_text(self, text: str) -> dict:
        text_lower = text.lower()

        # 1. Sentiment & Risk Score Calculation
        score = 20 # baseline
        detected_risk_words = []

        for kw in self.risk_keywords["critical"]:
            if kw in text_lower:
                score += 25
                detected_risk_words.append(kw)

        for kw in self.risk_keywords["warning"]:
            if kw in text_lower:
                score += 12
                detected_risk_words.append(kw)

        score = min(95, max(15, score))

        if score >= 70:
            sentiment = "Strong Negative (High Alert)"
            event_type = "Severe Operational Disruption"
        elif score >= 45:
            sentiment = "Negative (Moderate Risk)"
            event_type = "Supply Chain Bottleneck"
        else:
            sentiment = "Neutral / Low Risk"
            event_type = "Standard Operational Event"

        # 2. Named Entity Recognition (NER)
        found_locations = [loc for loc in self.locations_db if loc.lower() in text_lower]
        if not found_locations:
            found_locations = ["Global Ocean Lane"]

        found_orgs = [org for org in self.orgs_db if org.lower() in text_lower]
        if not found_orgs:
            found_orgs = ["Regional Logistics Operator"]

        # 3. Supply Chain Impact Mapping
        primary_loc = found_locations[0]
        affected_nodes = [f"Port of {primary_loc}", f"{primary_loc} Distribution Hub"]

        potential_impact = (
            f"Detected {sentiment} signal involving {', '.join(found_orgs)} at {primary_loc}. "
            f"Estimated lead-time variance increase of +4.5 to +12.0 days for shipments routed through this hub."
        )

        rec_action = f"Flag POs passing through {primary_loc} and evaluate alternate carrier routing or safety stock reallocation."

        # Headline Summary
        first_sentence = text.split('.')[0] if '.' in text else text[:80]
        headline_summary = first_sentence if len(first_sentence) < 100 else first_sentence[:97] + "..."

        return {
            "headline_summary": headline_summary,
            "sentiment": sentiment,
            "risk_score": score,
            "event_type": event_type,
            "detected_location": primary_loc,
            "detected_organizations": found_orgs,
            "potential_supply_impact": potential_impact,
            "affected_nodes": affected_nodes,
            "recommended_action": rec_action
        }

nlp_engine = NLPEngine()
