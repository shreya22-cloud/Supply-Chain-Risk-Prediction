import sqlite3
import os
import json
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(__file__), "supplyguard.db")

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()

    # Create Tables
    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            role TEXT DEFAULT 'Logistics Admin',
            password TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS suppliers (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            country TEXT NOT NULL,
            tier INTEGER DEFAULT 1,
            reliability INTEGER DEFAULT 90,
            risk_score INTEGER DEFAULT 20,
            avg_lead_time_days REAL DEFAULT 14.0,
            on_time_rate REAL DEFAULT 92.5,
            financial_risk TEXT DEFAULT 'LOW',
            status TEXT DEFAULT 'Healthy',
            category TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS ports (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            country TEXT NOT NULL,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            congestion_level INTEGER DEFAULT 30,
            risk_score INTEGER DEFAULT 25,
            status TEXT DEFAULT 'Healthy'
        );

        CREATE TABLE IF NOT EXISTS warehouses (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            capacity_used INTEGER DEFAULT 65,
            status TEXT DEFAULT 'Healthy'
        );

        CREATE TABLE IF NOT EXISTS products (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            category TEXT NOT NULL,
            unit_cost REAL NOT NULL,
            criticality TEXT DEFAULT 'High'
        );

        CREATE TABLE IF NOT EXISTS purchase_orders (
            id TEXT PRIMARY KEY,
            supplier_id TEXT NOT NULL,
            product_id TEXT NOT NULL,
            quantity INTEGER NOT NULL,
            value_usd REAL NOT NULL,
            origin_port TEXT NOT NULL,
            destination_port TEXT NOT NULL,
            destination_facility TEXT NOT NULL,
            order_date TEXT NOT NULL,
            scheduled_arrival TEXT NOT NULL,
            predicted_arrival TEXT NOT NULL,
            predicted_delay_days REAL DEFAULT 0.0,
            risk_level TEXT DEFAULT 'LOW',
            confidence_pct INTEGER DEFAULT 85,
            status TEXT DEFAULT 'In Transit',
            FOREIGN KEY (supplier_id) REFERENCES suppliers (id),
            FOREIGN KEY (product_id) REFERENCES products (id)
        );

        CREATE TABLE IF NOT EXISTS shipments (
            id TEXT PRIMARY KEY,
            po_id TEXT NOT NULL,
            origin TEXT NOT NULL,
            destination TEXT NOT NULL,
            carrier TEXT NOT NULL,
            mode TEXT DEFAULT 'Ocean Freight',
            current_location TEXT NOT NULL,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            status TEXT DEFAULT 'On Schedule',
            predicted_delay_days REAL DEFAULT 0.0,
            risk_score INTEGER DEFAULT 15,
            FOREIGN KEY (po_id) REFERENCES purchase_orders (id)
        );

        CREATE TABLE IF NOT EXISTS inventory (
            id TEXT PRIMARY KEY,
            product_id TEXT NOT NULL,
            facility_name TEXT NOT NULL,
            current_stock INTEGER NOT NULL,
            reorder_point INTEGER NOT NULL,
            safety_stock INTEGER NOT NULL,
            days_of_supply INTEGER NOT NULL,
            status TEXT DEFAULT 'Optimal',
            FOREIGN KEY (product_id) REFERENCES products (id)
        );

        CREATE TABLE IF NOT EXISTS risk_events (
            id TEXT PRIMARY KEY,
            headline TEXT NOT NULL,
            location TEXT NOT NULL,
            event_type TEXT NOT NULL,
            sentiment TEXT DEFAULT 'Negative',
            risk_score INTEGER DEFAULT 75,
            detected_entities TEXT,
            date_detected TEXT NOT NULL,
            status TEXT DEFAULT 'Active'
        );

        CREATE TABLE IF NOT EXISTS alerts (
            id TEXT PRIMARY KEY,
            severity_level TEXT NOT NULL,
            event_type TEXT NOT NULL,
            location TEXT NOT NULL,
            title TEXT NOT NULL,
            affected_pos TEXT NOT NULL,
            predicted_delay_days REAL DEFAULT 0.0,
            downstream_impact TEXT NOT NULL,
            estimated_impact_usd REAL DEFAULT 0.0,
            prescriptive_actions TEXT NOT NULL,
            date_created TEXT NOT NULL,
            status TEXT DEFAULT 'Unresolved'
        );

        CREATE TABLE IF NOT EXISTS nodes (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            country TEXT NOT NULL,
            lat REAL NOT NULL,
            lng REAL NOT NULL,
            risk_score INTEGER DEFAULT 20,
            dependency_pct REAL DEFAULT 15.0,
            is_spof INTEGER DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS edges (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            source_id TEXT NOT NULL,
            target_id TEXT NOT NULL,
            relationship TEXT NOT NULL,
            lead_time_days INTEGER DEFAULT 10,
            volume_weight REAL DEFAULT 1.0
        );
    """)

    conn.commit()

    # Seed initial sample data if empty
    cursor.execute("SELECT COUNT(*) FROM suppliers")
    if cursor.fetchone()[0] == 0:
        seed_data(conn)

    conn.close()

def seed_data(conn):
    cursor = conn.cursor()

    # Clear existing data if resetting
    tables = ["users", "suppliers", "ports", "warehouses", "products", "purchase_orders", "shipments", "inventory", "risk_events", "alerts", "nodes", "edges"]
    for t in tables:
        cursor.execute(f"DELETE FROM {t}")

    now = datetime.now()

    # Seed Admin User
    cursor.execute("""
        INSERT INTO users (email, name, role, password)
        VALUES ('admin@supplyguard.ai', 'Chief Supply Officer', 'Logistics Commander', 'admin123')
    """)

    # Seed Ports (8 columns)
    ports_data = [
        ("PORT-HAM", "Port of Hamburg", "Germany", 53.5463, 9.9603, 82, 85, "Critical"),
        ("PORT-SHEN", "Port of Shenzhen", "China", 22.5431, 114.0579, 74, 68, "High Warning"),
        ("PORT-ROT", "Port of Rotterdam", "Netherlands", 51.9560, 4.0950, 32, 22, "Healthy"),
        ("PORT-SIN", "Port of Singapore", "Singapore", 1.2644, 103.8400, 45, 30, "Healthy"),
        ("PORT-LA", "Port of Los Angeles", "USA", 33.7420, -118.2710, 62, 58, "Warning"),
        ("PORT-BOM", "Port of Mumbai (JNPT)", "India", 18.9500, 72.9500, 38, 25, "Healthy"),
        ("PORT-SHA", "Port of Shanghai", "China", 31.2304, 121.4737, 55, 48, "Warning"),
        ("PORT-BUS", "Port of Busan", "South Korea", 35.1796, 129.0756, 28, 18, "Healthy"),
        ("PORT-MUN", "Munich Inland Logistics Port", "Germany", 48.1351, 11.5820, 35, 20, "Healthy"),
        ("PORT-CHI", "Port of Chicago", "USA", 41.8781, -87.6298, 25, 15, "Healthy")
    ]
    cursor.executemany("INSERT INTO ports VALUES (?,?,?,?,?,?,?,?)", ports_data)

    # Seed Warehouses / Facilities (7 columns)
    warehouses_data = [
        ("FAC-MUN", "Munich Assembly Plant (Plant Munich)", "Munich, Germany", 48.1371, 11.5755, 92, "High Warning"),
        ("FAC-EUDC", "EU Distribution Center", "Rotterdam, Netherlands", 51.9244, 4.4777, 68, "Healthy"),
        ("FAC-USMID", "US Midwest Assembly Plant", "Chicago, USA", 41.8781, -87.6298, 78, "Warning"),
        ("FAC-SING", "Asia Hub Warehouse", "Singapore", 1.3521, 103.8198, 45, "Healthy"),
        ("FAC-SHG", "Shanghai Giga Depot", "Shanghai, China", 31.2304, 121.4737, 85, "Warning"),
        ("FAC-TEX", "Austin Precision Hub", "Austin, USA", 30.2672, -97.7431, 50, "Healthy"),
        ("FAC-DEL", "Delhi Logistics Depot", "Delhi, India", 28.6139, 77.2090, 40, "Healthy"),
        ("FAC-TPE", "Hsinchu Tech Storage", "Taiwan", 24.8036, 120.9686, 75, "Warning"),
        ("FAC-TOK", "Tokyo Precision Works", "Tokyo, Japan", 35.6762, 139.6503, 30, "Healthy"),
        ("FAC-MEX", "Monterrey Auto Assembly", "Monterrey, Mexico", 25.6866, -100.3161, 60, "Healthy")
    ]
    cursor.executemany("INSERT INTO warehouses VALUES (?,?,?,?,?,?,?)", warehouses_data)

    # Seed Products (5 columns)
    products_data = [
        ("PRD-CHIP01", "Automotive Microcontroller AI-v4", "Semiconductors", 420.0, "Critical"),
        ("PRD-BAT02", "High-Density Lithium Pack 85kWh", "Energy Storage", 3200.0, "Critical"),
        ("PRD-DISP03", "OLED Cockpit Display System", "Electronics", 650.0, "High"),
        ("PRD-GEAR04", "Titanium Precision Planetary Gearbox", "Mechanical", 1150.0, "High"),
        ("PRD-WIRE05", "High-Voltage Copper Harness Assembly", "Wiring", 180.0, "Medium"),
        ("PRD-SENS06", "LiDAR Rangefinder Sensor Node", "Sensors", 890.0, "Critical"),
        ("PRD-STEEL07", "Lightweight Aluminum Alloy Chassis Sheet", "Raw Materials", 450.0, "Medium"),
        ("PRD-PUMP08", "Cryogenic Thermal Coolant Pump", "Fluid Systems", 520.0, "Medium"),
        ("PRD-BRAKE09", "Ceramic Composite Brake Rotor Set", "Safety Systems", 780.0, "High"),
        ("PRD-ECU10", "Master Vehicle Control ECU", "Compute", 1450.0, "Critical")
    ]
    cursor.executemany("INSERT INTO products VALUES (?,?,?,?,?)", products_data)

    # Seed 30 Suppliers (11 columns)
    suppliers_list = [
        ("SUP-TAIWAN01", "Taiwan Semiconductor (TSMC Sub-Tier)", "Taiwan", 1, 82, 82, 18.5, 84.0, "HIGH", "Critical", "Semiconductors"),
        ("SUP-ALPHA02", "Alpha Components Ltd", "India", 1, 88, 45, 14.0, 91.2, "LOW", "Healthy", "Electronics"),
        ("SUP-PACIFIC03", "Pacific Microchips Corp", "Taiwan", 1, 79, 78, 21.0, 81.5, "MEDIUM", "Warning", "Semiconductors"),
        ("SUP-GLOBAL04", "Global Metals Enterprise", "China", 2, 85, 68, 16.0, 88.0, "HIGH", "Warning", "Raw Materials"),
        ("SUP-NORDIC05", "Nordic Electronics GmbH", "Germany", 1, 96, 15, 8.0, 97.5, "LOW", "Healthy", "Sensors"),
        ("SUP-SHANGHAI06", "Shanghai Optoelectronics", "China", 2, 74, 72, 19.0, 78.0, "MEDIUM", "Warning", "Displays"),
        ("SUP-NIPPON07", "Nippon Precision Tech", "Japan", 1, 98, 12, 10.0, 98.2, "LOW", "Healthy", "Mechanical"),
        ("SUP-MEXICO08", "Monterrey Component Tech", "Mexico", 1, 94, 25, 9.5, 94.0, "LOW", "Healthy", "Wiring"),
        ("SUP-MUMBAI09", "Mumbai Heavy Castings", "India", 2, 86, 30, 15.0, 89.0, "LOW", "Healthy", "Mechanical"),
        ("SUP-RHINE10", "Rhine Precision Machining", "Germany", 1, 92, 40, 11.0, 93.0, "LOW", "Healthy", "Safety Systems"),
        ("SUP-KOREA11", "Busan Energy Systems", "South Korea", 1, 91, 35, 13.5, 92.0, "LOW", "Healthy", "Batteries"),
        ("SUP-SAIGON12", "Saigon Cable Assemblies", "Vietnam", 2, 83, 52, 17.0, 85.0, "MEDIUM", "Warning", "Wiring"),
        ("SUP-DETROIT13", "Midwest Stamping Co", "USA", 1, 95, 18, 6.0, 96.0, "LOW", "Healthy", "Raw Materials"),
        ("SUP-TEXAS14", "Austin Micro Systems", "USA", 1, 93, 22, 7.5, 95.0, "LOW", "Healthy", "Compute"),
        ("SUP-DUTCH15", "Veldhoven Litho Components", "Netherlands", 1, 97, 14, 9.0, 98.0, "LOW", "Healthy", "Semiconductors"),
        ("SUP-SIEMENS16", "Bavarian Automation Systems", "Germany", 1, 94, 28, 10.0, 94.5, "LOW", "Healthy", "Fluid Systems"),
        ("SUP-SHENZHEN17", "Shenzhen Speed PCB", "China", 2, 76, 70, 16.5, 80.0, "MEDIUM", "Warning", "Electronics"),
        ("SUP-BANGALORE18", "Deccan Embedded Systems", "India", 1, 89, 32, 12.0, 91.0, "LOW", "Healthy", "Sensors"),
        ("SUP-OSAKA19", "Kansai Chemical Solutions", "Japan", 2, 92, 20, 14.0, 95.0, "LOW", "Healthy", "Batteries"),
        ("SUP-PENANG20", "Penang Chip Packaging", "Malaysia", 2, 80, 60, 18.0, 83.0, "MEDIUM", "Warning", "Semiconductors"),
        ("SUP-GRAZ21", "Alpine Drive Components", "Austria", 1, 96, 16, 8.5, 96.8, "LOW", "Healthy", "Mechanical"),
        ("SUP-SZCZECIN22", "Pomerania Wire Harnesses", "Poland", 1, 90, 38, 9.0, 91.5, "LOW", "Healthy", "Wiring"),
        ("SUP-GUADALAJARA23", "Jalisco Electronics Sub-Tier", "Mexico", 2, 88, 30, 10.5, 90.0, "LOW", "Healthy", "Electronics"),
        ("SUP-TORONTO24", "Ontario Precision Alloy", "Canada", 1, 95, 15, 7.0, 96.5, "LOW", "Healthy", "Raw Materials"),
        ("SUP-INCHEON25", "Incheon Display Tech", "South Korea", 1, 87, 48, 14.5, 88.5, "LOW", "Healthy", "Displays"),
        ("SUP-HANOI26", "Red River Tech Assembly", "Vietnam", 2, 81, 58, 16.0, 84.0, "MEDIUM", "Warning", "Sensors"),
        ("SUP-GENEVA27", "Swiss Micro Sensors", "Switzerland", 1, 99, 8, 7.5, 99.1, "LOW", "Healthy", "Sensors"),
        ("SUP-WUHANK28", "Central China Foundries", "China", 3, 68, 85, 24.0, 72.0, "HIGH", "Critical", "Raw Materials"),
        ("SUP-BIRMINGHAM29", "Midlands Forging Ltd", "UK", 1, 91, 35, 11.0, 92.0, "LOW", "Healthy", "Mechanical"),
        ("SUP-SINGAPORE30", "Lion City Micro Systems", "Singapore", 1, 94, 20, 9.5, 95.0, "LOW", "Healthy", "Compute")
    ]
    cursor.executemany("INSERT INTO suppliers VALUES (?,?,?,?,?,?,?,?,?,?,?)", suppliers_list)

    # Seed POs (15 columns matching schema!)
    pos_data = [
        ("PO-4432", "SUP-TAIWAN01", "PRD-CHIP01", 5000, 2100000.0, "PORT-SHEN", "PORT-HAM", "Munich Assembly Plant (Plant Munich)", (now - timedelta(days=12)).strftime("%Y-%m-%d"), "2026-11-10", "2026-11-22", 12.5, "CRITICAL", 90, "At Risk"),
        ("PO-4435", "SUP-PACIFIC03", "PRD-DISP03", 2500, 1625000.0, "PORT-SHEN", "PORT-HAM", "Munich Assembly Plant (Plant Munich)", (now - timedelta(days=10)).strftime("%Y-%m-%d"), "2026-11-12", "2026-11-21", 9.0, "CRITICAL", 88, "At Risk"),
        ("PO-4436", "SUP-GLOBAL04", "PRD-STEEL07", 10000, 4500000.0, "PORT-SHEN", "PORT-ROT", "EU Distribution Center", (now - timedelta(days=15)).strftime("%Y-%m-%d"), "2026-11-08", "2026-11-14", 6.0, "HIGH", 85, "Delayed"),
        ("PO-1089", "SUP-ALPHA02", "PRD-WIRE05", 12000, 2160000.0, "PORT-BOM", "PORT-LA", "US Midwest Assembly Plant", (now - timedelta(days=8)).strftime("%Y-%m-%d"), "2026-11-15", "2026-11-16", 1.0, "LOW", 95, "On Schedule"),
        ("PO-2201", "SUP-NORDIC05", "PRD-SENS06", 3000, 2670000.0, "PORT-MUN", "PORT-MUN", "Munich Assembly Plant (Plant Munich)", (now - timedelta(days=5)).strftime("%Y-%m-%d"), "2026-11-05", "2026-11-05", 0.0, "LOW", 98, "On Schedule"),
        ("PO-3055", "SUP-SHANGHAI06", "PRD-DISP03", 1800, 1170000.0, "PORT-SHA", "PORT-LA", "US Midwest Assembly Plant", (now - timedelta(days=14)).strftime("%Y-%m-%d"), "2026-11-18", "2026-11-23", 5.0, "HIGH", 82, "At Risk"),
        ("PO-5110", "SUP-KOREA11", "PRD-BAT02", 800, 2560000.0, "PORT-BUS", "PORT-ROT", "EU Distribution Center", (now - timedelta(days=16)).strftime("%Y-%m-%d"), "2026-11-20", "2026-11-21", 1.0, "LOW", 92, "On Schedule"),
        ("PO-6124", "SUP-MEXICO08", "PRD-WIRE05", 15000, 2700000.0, "PORT-CHI", "PORT-CHI", "US Midwest Assembly Plant", (now - timedelta(days=4)).strftime("%Y-%m-%d"), "2026-11-07", "2026-11-07", 0.0, "LOW", 96, "On Schedule"),
        ("PO-7289", "SUP-SAIGON12", "PRD-WIRE05", 8000, 1440000.0, "PORT-SIN", "PORT-LA", "Austin Precision Hub", (now - timedelta(days=11)).strftime("%Y-%m-%d"), "2026-11-14", "2026-11-18", 4.2, "MEDIUM", 84, "At Risk"),
        ("PO-8812", "SUP-WUHANK28", "PRD-STEEL07", 20000, 9000000.0, "PORT-SHA", "PORT-HAM", "Munich Assembly Plant (Plant Munich)", (now - timedelta(days=20)).strftime("%Y-%m-%d"), "2026-11-02", "2026-11-16", 14.0, "CRITICAL", 91, "Severely Delayed")
    ]

    # Generate 40 additional realistic POs programmatically (15 columns each!)
    for i in range(11, 51):
        po_id = f"PO-{9000+i}"
        sup_id = suppliers_list[i % len(suppliers_list)][0]
        prd_id = products_data[i % len(products_data)][0]
        val = float((i * 125000) % 3000000 + 350000)
        qty = (i * 450) % 8000 + 1000
        delay = 0.0
        risk = "LOW"
        status = "On Schedule"
        if i % 7 == 0:
            delay = round(3.5 + (i % 5), 1)
            risk = "HIGH"
            status = "At Risk"
        elif i % 11 == 0:
            delay = round(8.0 + (i % 6), 1)
            risk = "CRITICAL"
            status = "Severely Delayed"

        sched = (now + timedelta(days=(i % 25) + 2)).strftime("%Y-%m-%d")
        pred = (now + timedelta(days=(i % 25) + 2 + int(delay))).strftime("%Y-%m-%d")

        pos_data.append((
            po_id, sup_id, prd_id, qty, val, "PORT-SHEN", "PORT-HAM", "EU Distribution Center",
            (now - timedelta(days=10)).strftime("%Y-%m-%d"), sched, pred, delay, risk, 85 + (i % 12), status
        ))

    cursor.executemany("INSERT INTO purchase_orders VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", pos_data)

    # Seed Shipments (12 columns)
    shipments_data = []
    for i, po in enumerate(pos_data[:40]):
        shp_id = f"SHP-{7000+i}"
        po_id = po[0]
        orig = po[5]
        dest = po[6]
        delay = po[11]
        risk_lvl = po[12]
        status = "On Schedule"
        risk_sc = 15
        if risk_lvl == "HIGH":
            status = "Delayed"
            risk_sc = 68
        elif risk_lvl == "CRITICAL":
            status = "At Risk"
            risk_sc = 85

        shipments_data.append((
            shp_id, po_id, orig, dest, "Maersk Line / Ocean Express", "Ocean Freight",
            "North Sea Transit Lane" if "HAM" in dest else "Pacific Route 4",
            52.8 + (i % 3), 7.2 + (i % 4), status, delay, risk_sc
        ))
    cursor.executemany("INSERT INTO shipments VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", shipments_data)

    # Seed Inventory Records (8 columns)
    inventory_data = [
        ("INV-CHIP-MUN", "PRD-CHIP01", "Munich Assembly Plant (Plant Munich)", 1200, 3000, 2500, 4, "Critical Low"),
        ("INV-BAT-MUN", "PRD-BAT02", "Munich Assembly Plant (Plant Munich)", 450, 800, 600, 8, "Warning Low"),
        ("INV-DISP-EU", "PRD-DISP03", "EU Distribution Center", 3200, 2000, 1500, 18, "Optimal"),
        ("INV-GEAR-US", "PRD-GEAR04", "US Midwest Assembly Plant", 1800, 1200, 1000, 14, "Optimal"),
        ("INV-WIRE-US", "PRD-WIRE05", "US Midwest Assembly Plant", 8500, 5000, 4000, 22, "Optimal"),
        ("INV-SENS-TEX", "PRD-SENS06", "Austin Precision Hub", 620, 1000, 800, 7, "Warning Low"),
        ("INV-STEEL-EU", "PRD-STEEL07", "EU Distribution Center", 15000, 8000, 6000, 28, "Optimal"),
        ("INV-PUMP-MUN", "PRD-PUMP08", "Munich Assembly Plant (Plant Munich)", 1100, 1500, 1200, 9, "Warning Low"),
        ("INV-BRAKE-MEX", "PRD-BRAKE09", "Monterrey Auto Assembly", 2400, 1800, 1500, 16, "Optimal"),
        ("INV-ECU-SING", "PRD-ECU10", "Asia Hub Warehouse", 1950, 1200, 1000, 20, "Optimal")
    ]
    cursor.executemany("INSERT INTO inventory VALUES (?,?,?,?,?,?,?,?)", inventory_data)

    # Seed Risk Events (9 columns)
    risk_events_data = [
        ("EVT-901", "Labor strike escalates at Port of Hamburg terminal", "Port of Hamburg, Germany", "Labor Strike", "Negative", 85, json.dumps(["Port Authority", "Ver.di Union", "Hamburg Container Terminal"]), (now - timedelta(hours=3)).strftime("%Y-%m-%d %H:%M"), "Active"),
        ("EVT-902", "Typhoon Kong-rey causes severe delays in East China Sea shipping lanes", "Shenzhen / Shanghai", "Severe Weather", "Negative", 78, json.dumps(["Port of Shenzhen", "East China Maritime Command"]), (now - timedelta(hours=14)).strftime("%Y-%m-%d %H:%M"), "Active"),
        ("EVT-903", "Semiconductor wafer raw material silicon shortage detected in Tier-3 sub-tier", "Taiwan / Wuhan", "Raw Material Shortage", "Negative", 82, json.dumps(["TSMC Sub-Tier", "Wuhan Foundries"]), (now - timedelta(days=1)).strftime("%Y-%m-%d %H:%M"), "Active"),
        ("EVT-904", "Red Sea maritime security rerouting adds 10-14 days to Asia-Europe ocean transit", "Suez / Red Sea", "Geopolitical Event", "Negative", 72, json.dumps(["Bab el-Mandeb", "Maersk", "MSC"]), (now - timedelta(days=2)).strftime("%Y-%m-%d %H:%M"), "Active"),
        ("EVT-905", "Port congestion at Port of Los Angeles hits 62% wait-time spike", "Los Angeles, USA", "Port Congestion", "Negative", 65, json.dumps(["LA Longshoremen", "Pacific Maritime"]), (now - timedelta(days=3)).strftime("%Y-%m-%d %H:%M"), "Active"),
        ("EVT-906", "Automotive microchip supplier financial restructuring flagged by D&B index", "Taiwan", "Supplier Financial Risk", "Negative", 75, json.dumps(["Taiwan Semiconductor Sub-Tier"]), (now - timedelta(days=4)).strftime("%Y-%m-%d %H:%M"), "Active"),
        ("EVT-907", "Weather conditions improving near Singapore Strait transit routes", "Singapore", "Weather Recovery", "Positive", 25, json.dumps(["Singapore Maritime Authority"]), (now - timedelta(days=5)).strftime("%Y-%m-%d %H:%M"), "Resolved")
    ]
    cursor.executemany("INSERT INTO risk_events VALUES (?,?,?,?,?,?,?,?,?)", risk_events_data)

    # Seed Standardized JSON Alert Structure (12 columns)
    alert_rsk9921_actions = json.dumps([
        {
            "action": "Reroute Shipments to Port of Rotterdam & Air Freight Emergency Bridge Buffer",
            "estimated_added_cost": "$4,500",
            "revenue_saved": "$1.2M",
            "details": "Transfer 500 units from EU Distribution Center to Plant Munich via air/fast rail freight to prevent assembly stoppage."
        }
    ])

    alerts_data = [
        (
            "RSK-9921", "CRITICAL", "Labor Strike", "Port of Hamburg",
            "Critical Labor Strike Disrupting Port of Hamburg Outbound Shipments",
            json.dumps(["PO-4432", "PO-4435"]), 12.5,
            "Plant Munich - Line 3 Stoppage (Assembly line stoppage within 4 days due to Automotive Microcontroller depletion)",
            1200000.0, alert_rsk9921_actions, now.strftime("%Y-%m-%d %H:%M"), "Unresolved"
        ),
        (
            "RSK-9922", "WARNING", "Port Congestion", "Port of Shenzhen",
            "Severe Vessel Idling & Terminal Congestion Spike at Shenzhen Terminal 4",
            json.dumps(["PO-4436", "PO-3055"]), 6.0,
            "US Midwest & EU Assembly delay (+6.0 days projected delay)",
            450000.0, json.dumps([{"action": "Expedite customs filing and queue fast-track carrier pick-up", "estimated_added_cost": "$1,200", "revenue_saved": "$450K"}]),
            (now - timedelta(hours=6)).strftime("%Y-%m-%d %H:%M"), "Unresolved"
        ),
        (
            "RSK-9923", "CRITICAL", "Single Point of Failure", "Taiwan Semiconductor Supplier (SUP-TAIWAN01)",
            "Single Point of Failure (SPOF) Dependency Vulnerability Triggered",
            json.dumps(["PO-4432"]), 14.0,
            "40% of final assembly products critically dependent on single Tier-2 sub-tier node",
            2400000.0, json.dumps([{"action": "Activate Dual Sourcing with Monterrey Component Tech (Mexico)", "estimated_added_cost": "$8,500", "revenue_saved": "$2.4M"}]),
            (now - timedelta(hours=18)).strftime("%Y-%m-%d %H:%M"), "Unresolved"
        )
    ]
    cursor.executemany("INSERT INTO alerts VALUES (?,?,?,?,?,?,?,?,?,?,?,?)", alerts_data)

    # Seed Nodes & Edges for Digital Twin Network Graph
    nodes_data = [
        ("SUP-TAIWAN01", "Taiwan Semiconductor Supplier", "Supplier", "Taiwan", 24.8036, 120.9686, 82, 40.0, 1),
        ("SUP-GLOBAL04", "Global Metals Enterprise", "Supplier", "China", 31.2304, 121.4737, 68, 25.0, 0),
        ("SUP-ALPHA02", "Alpha Components Ltd", "Supplier", "India", 19.0760, 72.8777, 45, 18.0, 0),
        ("PORT-SHEN", "Port of Shenzhen", "Port", "China", 22.5431, 114.0579, 74, 35.0, 0),
        ("PORT-HAM", "Port of Hamburg", "Port", "Germany", 53.5463, 9.9603, 82, 45.0, 1),
        ("PORT-ROT", "Port of Rotterdam", "Port", "Netherlands", 51.9560, 4.0950, 32, 20.0, 0),
        ("FAC-MUN", "Munich Plant (Plant Munich)", "Factory", "Germany", 48.1371, 11.5755, 88, 50.0, 1),
        ("FAC-EUDC", "EU Distribution Center", "Warehouse", "Netherlands", 51.9244, 4.4777, 65, 30.0, 0),
        ("FAC-USMID", "US Midwest Assembly Plant", "Factory", "USA", 41.8781, -87.6298, 75, 35.0, 0),
        ("CUST-EU", "European Commercial OEM Customers", "Customer", "Germany", 50.1109, 8.6821, 20, 100.0, 0)
    ]
    cursor.executemany("INSERT INTO nodes VALUES (?,?,?,?,?,?,?,?,?)", nodes_data)

    edges_data = [
        ("SUP-TAIWAN01", "PORT-SHEN", "Supplies To", 4, 1.5),
        ("SUP-GLOBAL04", "PORT-SHEN", "Supplies To", 3, 1.2),
        ("SUP-ALPHA02", "PORT-ROT", "Supplies To", 12, 1.0),
        ("PORT-SHEN", "PORT-HAM", "Transported Via", 18, 2.0),
        ("PORT-SHEN", "PORT-ROT", "Transported Via", 16, 1.2),
        ("PORT-HAM", "FAC-MUN", "Transported Via", 2, 2.5),
        ("PORT-ROT", "FAC-EUDC", "Transported Via", 1, 1.5),
        ("FAC-EUDC", "FAC-MUN", "Supplies Buffer To", 1, 1.0),
        ("FAC-MUN", "CUST-EU", "Delivers To", 2, 3.0)
    ]
    cursor.executemany("INSERT INTO edges (source_id, target_id, relationship, lead_time_days, volume_weight) VALUES (?,?,?,?,?)", edges_data)

    conn.commit()
    print("Database seeded successfully with realistic global supply chain data.")

if __name__ == "__main__":
    init_db()
