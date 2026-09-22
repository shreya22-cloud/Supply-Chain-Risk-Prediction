import React, { useState, useEffect } from 'react';
import { Bell, FileJson, ShieldCheck } from 'lucide-react';
import { fetchAlerts } from '../data/api';

export default function AlertCenter({ onNavigateToMitigation }) {
  const [alerts, setAlerts] = useState([]);
  const [filter, setFilter] = useState('ALL');
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [showJsonView, setShowJsonView] = useState(false);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const res = await fetchAlerts();
    setAlerts(res);
    if (res.length > 0) setSelectedAlert(res[0]);
  };

  const filteredAlerts = alerts.filter(a => {
    if (filter === 'ALL') return true;
    return a.severity_level === filter;
  });

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#294436', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Bell size={24} style={{ color: '#dc2626' }} /> Autonomous Risk Alert Center
          </h1>
          <p style={{ color: '#6b8172', fontSize: '0.85rem', marginTop: '2px' }}>
            Standardized JSON alert streaming payloads & prescriptive action triggers
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {['ALL', 'CRITICAL', 'WARNING', 'INFO'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                background: filter === lvl ? '#6a9f7d' : '#ffffff',
                color: filter === lvl ? '#ffffff' : '#456050',
                border: filter === lvl ? '1px solid #6a9f7d' : '1px solid #c7dccb',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Main Alert Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '1.25rem' }}>
        
        {/* LEFT: Alert Stream List */}
        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', height: '520px', overflowY: 'auto' }}>
          {filteredAlerts.map((alt) => {
            const isSelected = selectedAlert?.id === alt.id;
            const isCritical = alt.severity_level === 'CRITICAL';
            const color = isCritical ? '#dc2626' : '#d97706';

            return (
              <div
                key={alt.id}
                onClick={() => setSelectedAlert(alt)}
                style={{
                  padding: '1rem',
                  borderRadius: '8px',
                  background: isSelected ? '#f0f9ff' : '#f4faf5',
                  border: isSelected ? '1px solid #6a9f7d' : '1px solid #d7e8da',
                  borderLeft: `4px solid ${color}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, color: color }}>{alt.id} • {alt.severity_level}</span>
                  <span style={{ fontSize: '0.7rem', color: '#6b8172' }}>{alt.date_created}</span>
                </div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#294436', marginTop: '4px' }}>{alt.title}</div>
                <div style={{ fontSize: '0.75rem', color: '#6b8172', marginTop: '2px' }}>Location: {alt.location} • Event: {alt.event_type}</div>
              </div>
            );
          })}
        </div>

        {/* RIGHT: Alert Payload & Action Intelligence */}
        {selectedAlert && (
          <div className="glass-panel" style={{ padding: '1.5rem', height: '520px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #d7e8da', paddingBottom: '1rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#dc2626' }}>ALERT ID: {selectedAlert.id}</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#294436', marginTop: '2px' }}>{selectedAlert.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b8172', marginTop: '2px' }}>
                  Location: {selectedAlert.location} • Detected: {selectedAlert.date_created}
                </div>
              </div>

              <button
                onClick={() => setShowJsonView(!showJsonView)}
                className="btn-secondary"
                style={{ fontSize: '0.75rem' }}
              >
                <FileJson size={14} /> {showJsonView ? 'Hide JSON Payload' : 'View JSON Payload'}
              </button>
            </div>

            {/* Standardized JSON View Toggle */}
            {showJsonView ? (
              <pre style={{
                background: '#294436',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #c7dccb',
                fontSize: '0.78rem',
                color: '#38bdf8',
                overflowX: 'auto'
              }}>
                {JSON.stringify({
                  alert_id: selectedAlert.id,
                  severity_level: selectedAlert.severity_level,
                  event_type: selectedAlert.event_type,
                  location: selectedAlert.location,
                  impact_analysis: {
                    affected_POs: selectedAlert.affected_pos,
                    predicted_delay_days: selectedAlert.predicted_delay_days,
                    downstream_assembly_impact: selectedAlert.downstream_impact
                  },
                  prescriptive_actions: selectedAlert.prescriptive_actions
                }, null, 2)}
              </pre>
            ) : (
              <>
                {/* Visual Impact Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div style={{ padding: '0.85rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 700 }}>Predicted Lead-Time Delay</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#dc2626', marginTop: '2px' }}>
                      +{selectedAlert.predicted_delay_days} days
                    </div>
                  </div>

                  <div style={{ padding: '0.85rem', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700 }}>Estimated Exposure</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d97706', marginTop: '2px' }}>
                      ${(selectedAlert.estimated_impact_usd / 1000000).toFixed(1)}M USD
                    </div>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.4rem' }}>Affected Purchase Orders</div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {Array.isArray(selectedAlert.affected_pos) && selectedAlert.affected_pos.map((po, i) => (
                      <span key={i} style={{ padding: '0.3rem 0.75rem', background: '#f0f9ff', border: '1px solid #bae6fd', color: '#6a9f7d', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>
                        {po}
                      </span>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#f4faf5', padding: '0.85rem', borderRadius: '8px', border: '1px solid #d7e8da' }}>
                  <div style={{ fontSize: '0.75rem', color: '#6b8172', fontWeight: 700 }}>Downstream Assembly Impact</div>
                  <div style={{ fontSize: '0.85rem', color: '#294436', marginTop: '4px', lineHeight: 1.4 }}>
                    {selectedAlert.downstream_impact}
                  </div>
                </div>

                {/* Trigger Prescriptive Action Button */}
                <button
                  onClick={() => onNavigateToMitigation && onNavigateToMitigation(selectedAlert)}
                  className="btn-primary"
                  style={{ marginTop: 'auto', justifyContent: 'center' }}
                >
                  <ShieldCheck size={16} /> Execute Resilience Mitigation Plan →
                </button>
              </>
            )}

          </div>
        )}

      </div>

    </div>
  );
}

