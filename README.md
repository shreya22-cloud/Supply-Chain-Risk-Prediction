# SupplyGuard AI — Intelligent Supply Chain Risk Prediction & Resiliency Platform

> **Subtitle:** Intelligent Supply Chain Risk Prediction & Resiliency Platform  
> **Tagline:** Predict disruption. Understand impact. Act before it happens.

---

## 📌 Executive Summary & Project Overview

**SupplyGuard AI** is a college-demonstration-ready, full-stack AI enterprise control tower that predicts supply chain disruptions before they happen. By fusing internal enterprise logistics data (POs, inventory, supplier metrics) with simulated exogenous data (port wait-time idling, weather events, geopolitical news sentiment), SupplyGuard AI constructs a **Digital Twin** of the supply chain network to forecast lead-time delays, trace downstream cascading risk, detect single points of failure (SPOFs), and prescribe actionable mitigations.

---

## ✨ Key Features

1. **AI Lead-Time Delay Prediction (XGBoost / RandomForest Regressor):**
   - Continuously forecasts lead-time delay in days (`+12.5 days`).
   - Uses **Conformal Prediction** to output 90% confidence uncertainty intervals (`[Nov 10 – Nov 15]`).
   - **Explainable AI (XAI):** Feature contribution breakdown charts explaining *why* a shipment is delayed.

2. **Supply Chain Digital Twin & Cascading Risk Engine:**
   - Interactive network graph representation (Suppliers → Ports → Factories → Warehouses → Customers).
   - **Cascading Risk Simulation:** Simulates capacity drops or port strikes (e.g., *Port of Hamburg - 50% capacity*) and traces downstream impact across shipments, warehouses, and assembly lines (*Munich Plant - Line 3*).
   - **Single Point of Failure (SPOF) Detection:** Uses **Betweenness Centrality** graph metrics to flag nodes controlling &gt;40% of manufacturing volume.

3. **NLP-Driven Macro Risk Early Warning System (EWS):**
   - Scans unstructured global shipping news feeds using Named Entity Recognition (NER) for locations, union labor actions, and weather spikes.
   - Includes an **Interactive News Analyzer** tool where users can paste news text to generate instant risk signals.

4. **Prescriptive Resilience & Mitigation Center:**
   - **Dynamic Inventory Rebalancing:** Recommends air freight bridge buffers to protect assembly line revenue (e.g., $4.5K added freight cost protecting $1.2M in revenue).
   - **Alternate Supplier Sourcing:** Compares primary vs. alternate nearshore vendors (e.g., Mexico vs. India) and generates **Draft Purchase Orders**.

5. **Risk Control Tower Dashboard & Analytics:**
   - Interactive Leaflet Global Risk Map with pulsing markers for global hubs (Hamburg, Shenzhen, Rotterdam, Singapore, LA, Mumbai, Shanghai, Chicago).
   - Recharts analytics for risk trends, port wait times, and tier distributions.

6. **SupplyGuard Copilot:**
   - Natural language AI assistant answering local supply chain queries.

7. **One-Click Demo Mode:**
   - Pre-loads the pre-configured *Port of Hamburg Labor Disruption* scenario for seamless presentation demonstrations.

---

## 🛠️ Technology Stack

- **Frontend:** React, Vite, JavaScript, Custom Dark Glassmorphism CSS, Recharts, Lucide Icons, Leaflet / React-Leaflet.
- **Backend:** Python 3.14 / 3.12+, FastAPI, SQLite (`sqlite3`), pandas, numpy, scikit-learn.
- **ML / Algorithms:** RandomForestRegressor, Conformal Uncertainty Intervals, Graph Betweenness Centrality, Rule-based NLP NER & Sentiment Parser.

---

## 📁 Project Folder Structure

```
Supply chain/
│
├── backend/
│   ├── main.py              # FastAPI Web API endpoints
│   ├── database.py          # SQLite database schema & realistic seeder
│   ├── models.py            # Pydantic data models
│   ├── ml_engine.py         # XGBoost / RandomForest lead-time delay model
│   ├── graph_engine.py      # Digital Twin graph traversal & cascading risk simulator
│   ├── nlp_engine.py        # Macro risk NLP news text analyzer
│   ├── risk_engine.py       # Multi-factor composite risk scoring formula
│   ├── supplyguard.db       # Local SQLite database
│   └── requirements.txt     # Python dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/      # Navbar, Sidebar
│   │   ├── pages/           # Overview, Control Tower, Shipments, Digital Twin, Alerts, NLP, Mitigation, Analytics, Upload, Copilot, Settings, Info
│   │   ├── data/            # API client service layer
│   │   ├── App.jsx          # App router & main layout
│   │   ├── main.jsx         # React entrypoint
│   │   └── index.css        # Dark futuristic control center glassmorphism CSS
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 🚀 How to Run the Application Locally

### 1. Start the Python FastAPI Backend

```bash
cd backend
pip install -r requirements.txt
python main.py
```
*The backend API will run at `http://localhost:8000`.*

### 2. Start the React Vite Frontend

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```
*The frontend control tower will open at `http://localhost:5173`.*

---

## 🔑 Demo Credentials

- **Email:** `admin@supplyguard.ai`
- **Password:** `admin123`

*(You can also click the **"Demo Mode: Hamburg Scenario"** button in the top navbar or login page to launch instantly).*

---

## 🎓 Recommended Demonstration Workflow for Judges

1. **Landing Page & Login:**
   - Click **"Explore Demo"** or login with `admin@supplyguard.ai`.
2. **Overview Dashboard:**
   - Show Network Health (87%), Active Risks (12), Estimated Exposure ($2.4M).
   - Click **Port of Hamburg** marker on the interactive map to view popup details.
3. **Risk Control Tower:**
   - Select **Port of Hamburg** to view 82% risk score, affected POs (`PO-4432`, `PO-4435`), and line-down hazard at Munich Plant.
4. **Shipment Intelligence & AI Prediction:**
   - Click **"Explain AI"** on `PO-4432` to inspect predicted delay (`+12.5 days`), Conformal interval, and feature impact bars (Port congestion 82%, Supplier reliability 82%).
5. **Supply Chain Digital Twin & Disruption Simulator:**
   - Click **"Highlight Single Point of Failure (SPOF)"** to identify Taiwan Semiconductor.
   - Run **"Simulate Disruption"** on Hamburg Port to trace cascading graph propagation downstream.
6. **Resilience & Mitigation Center:**
   - Review air freight rerouting ROI ($4,500 added cost protecting $1.2M revenue).
   - Click **"CREATE DRAFT PURCHASE ORDER"** for alternate supplier in Mexico.
7. **NLP Early Warning:**
   - Click **"ANALYZE WITH AI"** on the news text parser to extract entities and risk signals.

---

## 🔮 Future Scope

- **Autonomous AI Agents (ReAct Framework):** AI agents that autonomously draft supplier emails and negotiate expedited shipping rates.
- **Blockchain Track & Trace:** Smart contracts for immutable provenance and ESG compliance.
