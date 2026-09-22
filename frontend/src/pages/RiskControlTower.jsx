import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { TowerControl, AlertTriangle, ShieldCheck } from 'lucide-react';

const createCustomIcon = (color, isCritical = false) => {
  const glow = isCritical ? 'animation: pulse-red 2s infinite;' : '';
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="
      width: 22px;
      height: 22px;
      border-radius: 50%;
      background: ${color};
      border: 3px solid #ffffff;
      box-shadow: 0 0 12px ${color};
      ${glow}
    "></div>`,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

export default function RiskControlTower({ onNavigateToShipments }) {
  const nodes = [
    {
      id: "PORT-HAM",
      name: "Port of Hamburg Hub",
      type: "Ocean Port",
      country: "Germany",
      lat: 53.5463,
      lng: 9.9603,
      risk: 82,
      risk_type: "Labor Strike & Terminal Closure",
      affected_pos: ["PO-4432", "PO-4435"],
      affected_suppliers: ["Taiwan Semiconductor Supplier", "Pacific Microchips Corp"],
      predicted_delay: "+12.5 days",
      downstream_impact: "Plant Munich - Line 3 Stoppage (Assembly line stoppage within 4 days due to microchip depletion)",
      recommended_action: "Reroute shipments to Port of Rotterdam & transfer 500 units from EU Distribution Center via air freight.",
      status: "Critical"
    },
    {
      id: "PORT-SHEN",
      name: "Port of Shenzhen",
      type: "Ocean Port",
      country: "China",
      lat: 22.5431,
      lng: 114.0579,
      risk: 74,
      risk_type: "Vessel Idling & Terminal Congestion",
      affected_pos: ["PO-4436", "PO-3055"],
      affected_suppliers: ["Global Metals Enterprise", "Shanghai Optoelectronics"],
      predicted_delay: "+6.0 days",
      downstream_impact: "US Midwest & EU Assembly delay (+6.0 days projected delay)",
      recommended_action: "Expedite customs filing and queue fast-track carrier pick-up.",
      status: "High Warning"
    },
    {
      id: "SUP-TAIWAN01",
      name: "Taiwan Semiconductor Supplier",
      type: "Tier-2 Sub-Tier",
      country: "Taiwan",
      lat: 24.8036,
      lng: 120.9686,
      risk: 82,
      risk_type: "Single Point of Failure Vulnerability",
      affected_pos: ["PO-4432"],
      affected_suppliers: ["TSMC Sub-Tier Foundries"],
      predicted_delay: "+14.0 days",
      downstream_impact: "40% of final assembly products critically dependent on single Tier-2 node",
      recommended_action: "Activate Dual Sourcing with Monterrey Component Tech (Mexico).",
      status: "Critical"
    },
    {
      id: "PORT-ROT",
      name: "Port of Rotterdam",
      type: "Ocean Port",
      country: "Netherlands",
      lat: 51.9560,
      lng: 4.0950,
      risk: 32,
      risk_type: "Normal Operations",
      affected_pos: ["PO-1089"],
      affected_suppliers: ["Alpha Components Ltd"],
      predicted_delay: "+0.5 days",
      downstream_impact: "Buffer inventory optimal",
      recommended_action: "Maintain standard monitoring.",
      status: "Healthy"
    }
  ];

  const [selectedNode, setSelectedNode] = useState(nodes[0]);

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#294436', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <TowerControl size={24} style={{ color: '#6a9f7d' }} /> Risk Control Tower
        </h1>
        <p style={{ color: '#6b8172', fontSize: '0.85rem', marginTop: '2px' }}>
          Interactive geospatial risk surveillance & downstream impact evaluation
        </p>
      </div>

      {/* Main Control Panel Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '1.25rem', height: '480px' }}>
        
        {/* LEFT: Map */}
        <div className="glass-panel" style={{ height: '100%', overflow: 'hidden', padding: '0.5rem', position: 'relative' }}>
          <MapContainer center={[selectedNode.lat, selectedNode.lng]} zoom={3} minZoom={2} maxZoom={8} style={{ height: '100%', width: '100%' }} worldCopyJump>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {nodes.map(n => {
              const color = n.risk >= 80 ? '#dc2626' : n.risk >= 50 ? '#d97706' : '#5b9b70';
              const icon = createCustomIcon(color, n.risk >= 80);
              return (
                <Marker
                  key={n.id}
                  position={[n.lat, n.lng]}
                  icon={icon}
                  eventHandlers={{ click: () => setSelectedNode(n) }}
                >
                  <Tooltip direction="top" offset={[0, -10]} sticky>
                    <strong>{n.name}</strong><br />Risk: {n.risk}% · {n.status}
                  </Tooltip>
                  <Popup>
                    <div style={{ fontWeight: 800, color: color }}>{n.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b8172' }}>Risk: {n.risk}% ({n.status})</div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Quick Node Switcher Overlay */}
          <div style={{ position: 'absolute', bottom: '15px', left: '15px', zIndex: 1000, display: 'flex', gap: '0.5rem' }}>
            {nodes.map(n => (
              <button
                key={n.id}
                onClick={() => setSelectedNode(n)}
                style={{
                  padding: '0.4rem 0.75rem',
                  background: selectedNode.id === n.id ? '#6a9f7d' : '#ffffff',
                  color: selectedNode.id === n.id ? '#ffffff' : '#456050',
                  border: selectedNode.id === n.id ? '1px solid #6a9f7d' : '1px solid #c7dccb',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                {n.name.split(' ')[0]} ({n.risk}%)
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Risk Intelligence Panel */}
        <div className="glass-panel" style={{ padding: '1.25rem', height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #d7e8da', paddingBottom: '0.75rem' }}>
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#294436' }}>{selectedNode.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#6b8172' }}>{selectedNode.type} • {selectedNode.country}</div>
            </div>
            <div style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '20px',
              background: selectedNode.risk >= 80 ? '#fef2f2' : '#fffbeb',
              border: `1px solid ${selectedNode.risk >= 80 ? '#fecaca' : '#fde68a'}`,
              color: selectedNode.risk >= 80 ? '#dc2626' : '#d97706',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}>
              {selectedNode.risk}% RISK
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: '#f4faf5', padding: '0.65rem', borderRadius: '6px', border: '1px solid #d7e8da' }}>
              <div style={{ fontSize: '0.7rem', color: '#6b8172' }}>Risk Type</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626', marginTop: '2px' }}>{selectedNode.risk_type}</div>
            </div>
            <div style={{ background: '#f4faf5', padding: '0.65rem', borderRadius: '6px', border: '1px solid #d7e8da' }}>
              <div style={{ fontSize: '0.7rem', color: '#6b8172' }}>Predicted Delay</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6a9f7d', marginTop: '2px' }}>{selectedNode.predicted_delay}</div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>Affected Purchase Orders</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {selectedNode.affected_pos.map((po, idx) => (
                <span
                  key={idx}
                  onClick={() => onNavigateToShipments && onNavigateToShipments(po)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    background: '#f0f9ff',
                    border: '1px solid #bae6fd',
                    color: '#6a9f7d',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {po} →
                </span>
              ))}
            </div>
          </div>

          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <AlertTriangle size={14} /> Downstream Impact
            </div>
            <div style={{ fontSize: '0.8rem', color: '#1e293b', marginTop: '0.35rem', lineHeight: 1.4 }}>
              {selectedNode.downstream_impact}
            </div>
          </div>

          <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5b9b70', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={14} /> Prescriptive Recommended Action
            </div>
            <div style={{ fontSize: '0.8rem', color: '#1e293b', marginTop: '0.35rem', lineHeight: 1.4 }}>
              {selectedNode.recommended_action}
            </div>
          </div>

        </div>

      </div>

      {/* BOTTOM: Chronological Risk Event Timeline */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#294436', marginBottom: '1rem' }}>
          Risk Event Chronological Timeline
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            { time: "09:30 AM", title: "Labor Strike Escalation", loc: "Port of Hamburg", delay: "+12.5d", severity: "CRITICAL" },
            { time: "06:15 AM", title: "Vessel Idling Spike", loc: "Port of Shenzhen", delay: "+6.0d", severity: "HIGH" },
            { time: "Yesterday", title: "Silicon Wafer Shortage", loc: "Taiwan Foundries", delay: "+14.0d", severity: "CRITICAL" },
            { time: "2 Days Ago", title: "Red Sea Transit Reroute", loc: "Suez Canal Corridor", delay: "+10.0d", severity: "HIGH" }
          ].map((item, idx) => (
            <div key={idx} style={{ padding: '0.75rem', background: '#f4faf5', border: '1px solid #d7e8da', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#6b8172' }}>
                <span>{item.time}</span>
                <span style={{ color: item.severity === 'CRITICAL' ? '#dc2626' : '#d97706', fontWeight: 700 }}>{item.severity}</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#294436', marginTop: '4px' }}>{item.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#6a9f7d', marginTop: '2px' }}>{item.loc} • {item.delay}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
