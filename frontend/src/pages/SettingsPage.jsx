import React, { useState } from 'react';
import { Settings, ShieldCheck, Activity, Database, Cpu } from 'lucide-react';

export default function SettingsPage() {
  const [criticalThreshold, setCriticalThreshold] = useState(80);
  const [highThreshold, setHighThreshold] = useState(50);
  const [autoMitigation, setAutoMitigation] = useState(true);

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#294436', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Settings size={24} style={{ color: '#6a9f7d' }} /> System Settings & Health Monitor
        </h1>
        <p style={{ color: '#6b8172', fontSize: '0.85rem', marginTop: '2px' }}>
          Control tower threshold configuration, MLOps model parameters, & database status
        </p>
      </div>

      {/* System Status Indicators (Green Lights) */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#294436', marginBottom: '1rem' }}>
          System Operational Status
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {[
            { name: "FastAPI REST Server", status: "ONLINE", latency: "12ms", icon: Activity },
            { name: "ML Inference Engine", status: "ONLINE", latency: "45ms", icon: Cpu },
            { name: "SQLite Database", status: "ONLINE", latency: "2ms", icon: Database },
            { name: "Data Ingestion Pipeline", status: "ONLINE", latency: "Active", icon: ShieldCheck }
          ].map((sys, idx) => {
            const Icon = sys.icon;
            return (
              <div key={idx} style={{ padding: '0.85rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Icon size={18} style={{ color: '#5b9b70' }} />
                  <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#5b9b70' }}>● {sys.status}</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#294436', marginTop: '0.4rem' }}>{sys.name}</div>
                <div style={{ fontSize: '0.7rem', color: '#6b8172', marginTop: '2px' }}>Response: {sys.latency}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Threshold Configuration */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#294436' }}>
          Risk Alert Sensitivity Thresholds
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#456050' }}>
              Critical Risk Trigger Score Threshold: <strong>{criticalThreshold}%</strong>
            </label>
            <input
              type="range"
              min="60"
              max="95"
              value={criticalThreshold}
              onChange={(e) => setCriticalThreshold(parseInt(e.target.value))}
              style={{ width: '100%', marginTop: '0.5rem' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '0.8rem', color: '#456050' }}>
              High Warning Trigger Threshold: <strong>{highThreshold}%</strong>
            </label>
            <input
              type="range"
              min="30"
              max="70"
              value={highThreshold}
              onChange={(e) => setHighThreshold(parseInt(e.target.value))}
              style={{ width: '100%', marginTop: '0.5rem' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid #d7e8da' }}>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#294436' }}>Automated Prescriptive Mitigation Staging</div>
            <div style={{ fontSize: '0.75rem', color: '#6b8172' }}>Draft purchase orders automatically when single points of failure exceed 80% risk</div>
          </div>
          <input
            type="checkbox"
            checked={autoMitigation}
            onChange={(e) => setAutoMitigation(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
        </div>
      </div>

    </div>
  );
}

