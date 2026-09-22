import React, { useState, useEffect } from 'react';
import {
  Activity, AlertTriangle, ShieldAlert, Truck, Users, DollarSign,
  Globe, RefreshCw
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip as ChartTooltip, CartesianGrid } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup, Tooltip as MapTooltip } from 'react-leaflet';
import L from 'leaflet';
import { fetchDashboardData } from '../data/api';

// Custom Leaflet Markers for Light Mode
const createCustomIcon = (color, isCritical = false) => {
  const glow = isCritical ? 'animation: pulse-red 2s infinite;' : '';
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div style="
      width: 18px;
      height: 18px;
      border-radius: 50%;
      background: ${color};
      border: 3px solid #ffffff;
      box-shadow: 0 0 10px ${color};
      ${glow}
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9]
  });
};

export default function OverviewDashboard({ onNavigate }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const res = await fetchDashboardData();
    if (res) setData(res);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const mapCenter = [30.0, 30.0];

  const portsLocations = [
    { name: "Port of Hamburg", lat: 53.5463, lng: 9.9603, risk: 82, event: "Labor Disruption", shipments: 12, delay: "12.5 days", impact: "$1.2M", status: "Critical" },
    { name: "Port of Shenzhen", lat: 22.5431, lng: 114.0579, risk: 74, event: "Terminal Congestion", shipments: 8, delay: "6.0 days", impact: "$450K", status: "High Warning" },
    { name: "Port of Rotterdam", lat: 51.9560, lng: 4.0950, risk: 32, event: "Normal Flow", shipments: 15, delay: "0.5 days", impact: "$0", status: "Healthy" },
    { name: "Port of Singapore", lat: 1.2644, lng: 103.8400, risk: 45, event: "Weather Clearing", shipments: 18, delay: "1.2 days", impact: "$50K", status: "Healthy" },
    { name: "Port of Los Angeles", lat: 33.7420, lng: -118.2710, risk: 62, event: "Wait-Time Spike", shipments: 10, delay: "4.5 days", impact: "$320K", status: "Warning" },
    { name: "Port of Mumbai (JNPT)", lat: 18.9500, lng: 72.9500, risk: 38, event: "Smooth Clearance", shipments: 9, delay: "1.0 days", impact: "$0", status: "Healthy" },
    { name: "Port of Shanghai", lat: 31.2304, lng: 121.4737, risk: 55, event: "Typhoon Buffer", shipments: 14, delay: "3.5 days", impact: "$180K", status: "Warning" },
    { name: "Port of Busan", lat: 35.1796, lng: 129.0756, risk: 28, event: "Optimal Throughput", shipments: 11, delay: "0.2 days", impact: "$0", status: "Healthy" },
    { name: "Munich Assembly Plant", lat: 48.1371, lng: 11.5755, risk: 88, event: "Line-Down Hazard", shipments: 6, delay: "12.5 days", impact: "$2.4M", status: "Critical" },
    { name: "Port of Chicago", lat: 41.8781, lng: -87.6298, risk: 25, event: "Rail Terminal Clear", shipments: 7, delay: "0.0 days", impact: "$0", status: "Healthy" }
  ];

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#294436' }}>Supply Chain Control Tower</h1>
          <p style={{ color: '#6b8172', fontSize: '0.85rem', marginTop: '2px' }}>
            Real-time neural intelligence for proactive disruption management & lead-time resiliency
          </p>
        </div>
        <button onClick={loadData} className="btn-secondary" style={{ fontSize: '0.8rem' }}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Intelligence
        </button>
      </div>

      {/* Top 6 KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '1rem' }}>
        
        <KPICard title="Network Health" value="87%" badge="+1.2%" icon={Activity} color="#5b9b70" />
        <KPICard title="Active Risks" value="12" badge="High Alert" icon={AlertTriangle} color="#dc2626" isCritical />
        <KPICard title="High-Risk POs" value="7" badge="+2 today" icon={ShieldAlert} color="#d97706" />
        <KPICard title="Predicted Delays" value="18" badge="Avg +6.4d" icon={Truck} color="#6a9f7d" />
        <KPICard title="Suppliers Monitored" value="126" badge="Tier 1-3" icon={Users} color="#8aaa91" />
        <KPICard title="Estimated Exposure" value="$2.4M" badge="Protected $1.2M" icon={DollarSign} color="#a4a98d" />

      </div>

      {/* Global Risk Map & Control Intelligence Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        
        {/* Interactive Global Leaflet Map */}
        <div className="glass-panel" style={{ padding: '1.25rem', height: '440px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.95rem', color: '#294436' }}>
              <Globe size={18} style={{ color: '#6a9f7d' }} /> Global Risk Control Map
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', fontWeight: 600 }}>
              <span style={{ color: '#dc2626' }}>● Critical (80%+)</span>
              <span style={{ color: '#d97706' }}>● Warning (50-79%)</span>
              <span style={{ color: '#5b9b70' }}>● Healthy (&lt;50%)</span>
            </div>
          </div>

          <div style={{ flex: 1, borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer center={mapCenter} zoom={2} minZoom={2} maxZoom={7} style={{ height: '100%', width: '100%' }} scrollWheelZoom={true} worldCopyJump>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              {portsLocations.map((p, idx) => {
                const color = p.risk >= 80 ? '#dc2626' : p.risk >= 50 ? '#d97706' : '#5b9b70';
                const customIcon = createCustomIcon(color, p.risk >= 80);
                return (
                  <Marker key={idx} position={[p.lat, p.lng]} icon={customIcon}>
                    <MapTooltip direction="top" offset={[0, -8]} sticky>
                      <strong>{p.name}</strong><br />Risk: {p.risk}% · {p.status}
                    </MapTooltip>
                    <Popup>
                      <div style={{ padding: '0.2rem', minWidth: '180px' }}>
                        <div style={{ fontWeight: 800, fontSize: '0.9rem', color: color }}>{p.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#6b8172', marginTop: '2px' }}>Event: {p.event}</div>
                        <div style={{ marginTop: '0.5rem', borderTop: '1px solid #d7e8da', paddingTop: '0.4rem', fontSize: '0.75rem', color: '#294436' }}>
                          <div><strong>Risk Score:</strong> {p.risk}%</div>
                          <div><strong>Affected POs:</strong> {p.shipments} shipments</div>
                          <div><strong>Predicted Delay:</strong> +{p.delay}</div>
                          <div><strong>Financial Impact:</strong> {p.impact}</div>
                        </div>
                        <button
                          onClick={() => onNavigate('control-tower')}
                          style={{
                            marginTop: '0.6rem',
                            width: '100%',
                            padding: '0.35rem',
                            background: '#6a9f7d',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Inspect Control Tower →
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </div>

        {/* Highest Current Risk Exposure Ranking */}
        <div className="glass-panel" style={{ padding: '1.25rem', height: '440px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#294436' }}>
              Highest Current Risk Exposure
            </div>
            <button onClick={() => onNavigate('suppliers')} style={{ background: 'none', border: 'none', color: '#6a9f7d', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
              View All →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto' }}>
            {[
              { entity: "Taiwan Semiconductor Supplier", type: "Tier-2 Sub-Tier", risk: 82, impact: "$2.4M", reason: "Single Point of Failure dependency", color: "#dc2626" },
              { entity: "Port of Hamburg", type: "Ocean Terminal", risk: 82, impact: "$1.2M", reason: "Labor strike & terminal closure", color: "#dc2626" },
              { entity: "Port of Shenzhen Network", type: "Container Hub", risk: 74, impact: "$450K", reason: "Vessel idling & berth congestion", color: "#d97706" },
              { entity: "Pacific Microchips Corp", type: "Tier-1 Supplier", risk: 78, impact: "$1.6M", reason: "OLED display raw material delay", color: "#d97706" },
              { entity: "Central China Foundries", type: "Tier-3 Sub-Tier", risk: 85, impact: "$9.0M", reason: "Silicon wafer shortage", color: "#dc2626" }
            ].map((item, idx) => (
              <div
                key={idx}
                onClick={() => onNavigate('control-tower')}
                style={{
                  padding: '0.75rem',
                  borderRadius: '8px',
                  background: '#f4faf5',
                  border: '1px solid #d7e8da',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#294436' }}>{item.entity}</div>
                  <div style={{ fontSize: '0.72rem', color: '#6b8172', marginTop: '2px' }}>{item.type} • {item.reason}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 800, color: item.color }}>{item.risk}%</div>
                  <div style={{ fontSize: '0.7rem', color: '#6b8172' }}>{item.impact}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Risk Trend Chart & Upcoming Risk Events Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1.4fr', gap: '1.5rem' }}>
        
        {/* 30-Day Supply Chain Risk Trend Line Chart */}
        <div className="glass-panel" style={{ padding: '1.25rem', height: '320px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#294436' }}>Supply Chain Risk Trend (30 Days)</div>
              <div style={{ fontSize: '0.75rem', color: '#6b8172' }}>Historical vs ML Model Projected Risk Score</div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem' }}>
              <span style={{ color: '#6a9f7d', fontWeight: 600 }}>── Current Risk</span>
              <span style={{ color: '#dc2626', fontWeight: 600 }}>- - Predicted Risk</span>
            </div>
          </div>

          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data?.risk_trend || sampleTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d7e8da" />
                <XAxis dataKey="date" stroke="#6b8172" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#6b8172" fontSize={11} />
                <ChartTooltip contentStyle={{ background: '#ffffff', border: '1px solid #c7dccb', borderRadius: '8px', color: '#294436' }} />
                <Line type="monotone" dataKey="current_risk" stroke="#6a9f7d" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="predicted_risk" stroke="#dc2626" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Upcoming Risk Events Cards */}
        <div className="glass-panel" style={{ padding: '1.25rem', height: '320px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#294436' }}>Upcoming Risk Signals (Early Warning)</div>
            <button onClick={() => onNavigate('nlp-warning')} style={{ background: 'none', border: 'none', color: '#6a9f7d', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>
              NLP Radar →
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', flex: 1, overflowY: 'auto' }}>
            {[
              { type: "Labor Action", event: "Ver.di union labor strike at Port of Hamburg", loc: "Hamburg, Germany", time: "Within 48h", risk: "CRITICAL 85%", color: "#dc2626" },
              { type: "Severe Weather", event: "Typhoon Kong-rey path threatening East China Sea lanes", loc: "Shenzhen / Shanghai", time: "Within 72h", risk: "HIGH 78%", color: "#d97706" },
              { type: "Raw Material", event: "Silicon wafer raw material shortage in Tier-3 sub-tier", loc: "Taiwan / Wuhan", time: "1-2 Weeks", risk: "HIGH 82%", color: "#d97706" },
              { type: "Geopolitical", event: "Red Sea maritime security rerouting adds 10-14 days", loc: "Suez / Red Sea", time: "Ongoing", risk: "HIGH 72%", color: "#d97706" }
            ].map((ev, i) => (
              <div key={i} style={{ padding: '0.65rem 0.85rem', background: '#f4faf5', border: '1px solid #d7e8da', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: ev.color, textTransform: 'uppercase' }}>{ev.type}</span>
                  <span style={{ fontSize: '0.7rem', color: '#6b8172' }}>{ev.time}</span>
                </div>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#294436', marginTop: '2px' }}>{ev.event}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b8172', marginTop: '2px' }}>Location: {ev.loc} • Risk: {ev.risk}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}

function KPICard({ title, value, badge, icon: Icon, color, isCritical }) {
  return (
    <div className={`glass-panel ${isCritical ? 'neon-glow-red' : ''}`} style={{ padding: '1rem', position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#6b8172' }}>{title}</span>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={16} style={{ color: color }} />
        </div>
      </div>
      <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#294436', marginTop: '0.4rem' }}>{value}</div>
      <div style={{ fontSize: '0.7rem', fontWeight: 600, color: color, marginTop: '0.2rem' }}>{badge}</div>
    </div>
  );
}

const sampleTrendData = [
  { date: 'Oct 18', current_risk: 42, predicted_risk: 45 },
  { date: 'Oct 22', current_risk: 45, predicted_risk: 48 },
  { date: 'Oct 26', current_risk: 50, predicted_risk: 58 },
  { date: 'Oct 30', current_risk: 65, predicted_risk: 74 },
  { date: 'Nov 03', current_risk: 78, predicted_risk: 85 },
  { date: 'Nov 07', current_risk: 82, predicted_risk: 88 }
];
