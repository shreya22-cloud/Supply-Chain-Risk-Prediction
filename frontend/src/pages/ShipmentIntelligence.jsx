import React, { useState, useEffect } from 'react';
import { Truck, Search, Filter, Sparkles, AlertTriangle, CheckCircle2, ChevronRight, Calculator, BarChart2 } from 'lucide-react';
import { fetchPurchaseOrders, predictDelay } from '../data/api';

export default function ShipmentIntelligence({ initialSearch = '' }) {
  const [pos, setPos] = useState([]);
  const [search, setSearch] = useState(initialSearch);
  const [selectedPO, setSelectedPO] = useState(null);
  const [showPredictor, setShowPredictor] = useState(false);

  // Prediction Form State
  const [formData, setFormData] = useState({
    supplier_id: "SUP-TAIWAN01",
    origin_port: "PORT-SHEN",
    destination_port: "PORT-HAM",
    supplier_reliability: 82,
    port_congestion: 82,
    route_distance_km: 11500,
    route_complexity: 3,
    seasonality_factor: 1.2,
    shipment_value_usd: 2100000,
    current_inventory_days: 4,
    weather_risk_index: 42,
    geopolitical_risk_index: 78
  });

  const [predicting, setPredicting] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);

  useEffect(() => {
    loadPOs();
  }, []);

  const loadPOs = async () => {
    const res = await fetchPurchaseOrders();
    setPos(res);
  };

  const handleRunPrediction = async (e) => {
    if (e) e.preventDefault();
    setPredicting(true);
    const res = await predictDelay(formData);
    setPredictionResult(res);
    setPredicting(false);
  };

  const filteredPOs = pos.filter(po => 
    po.id.toLowerCase().includes(search.toLowerCase()) ||
    po.supplier_name.toLowerCase().includes(search.toLowerCase()) ||
    po.destination_facility.toLowerCase().includes(search.toLowerCase()) ||
    po.status.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#294436', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Truck size={24} style={{ color: '#6a9f7d' }} /> Shipment Intelligence & Lead-Time Prediction
          </h1>
          <p style={{ color: '#6b8172', fontSize: '0.85rem', marginTop: '2px' }}>
            Continuous regression lead-time modeling & explainable AI uncertainty estimation
          </p>
        </div>
        <button
          onClick={() => { setShowPredictor(true); handleRunPrediction(); }}
          className="btn-primary"
        >
          <Sparkles size={16} /> Run AI Delay Predictor Form
        </button>
      </div>

      {/* Table & Controls Panel */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#91a99a' }} />
            <input
              type="text"
              placeholder="Search PO ID, Supplier, Facility..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                padding: '0.5rem 1rem 0.5rem 2.2rem',
                background: '#ffffff',
                border: '1px solid #c7dccb',
                borderRadius: '6px',
                color: '#294436',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            />
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6b8172', display: 'flex', alignItems: 'center' }}>
            Showing {filteredPOs.length} Purchase Orders
          </div>
        </div>

        {/* PO Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #d7e8da', color: '#6b8172' }}>
                <th style={{ padding: '0.75rem' }}>PO ID</th>
                <th style={{ padding: '0.75rem' }}>Supplier</th>
                <th style={{ padding: '0.75rem' }}>Origin → Dest</th>
                <th style={{ padding: '0.75rem' }}>Sched. Arrival</th>
                <th style={{ padding: '0.75rem' }}>Pred. Arrival</th>
                <th style={{ padding: '0.75rem' }}>Pred. Delay</th>
                <th style={{ padding: '0.75rem' }}>Risk</th>
                <th style={{ padding: '0.75rem' }}>Confidence</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredPOs.slice(0, 15).map((po, idx) => {
                const isCritical = po.risk_level === 'CRITICAL';
                const isHigh = po.risk_level === 'HIGH';
                const badgeClass = isCritical ? 'badge-critical' : isHigh ? 'badge-warning' : 'badge-healthy';

                return (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid #edf7ef',
                      background: po.id === 'PO-4432' ? '#fef2f2' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: '#6a9f7d' }}>{po.id}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: '#294436' }}>{po.supplier_name}</td>
                    <td style={{ padding: '0.75rem', color: '#6b8172' }}>{po.origin_port.replace('PORT-', '')} → {po.destination_port.replace('PORT-', '')}</td>
                    <td style={{ padding: '0.75rem', color: '#6b8172' }}>{po.scheduled_arrival}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 700, color: isCritical ? '#dc2626' : '#294436' }}>{po.predicted_arrival}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 800, color: isCritical ? '#dc2626' : isHigh ? '#d97706' : '#5b9b70' }}>
                      +{po.predicted_delay_days} days
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${badgeClass}`}>{po.risk_level}</span>
                    </td>
                    <td style={{ padding: '0.75rem', color: '#6b8172' }}>{po.confidence_pct}%</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: isCritical ? '#dc2626' : '#5b9b70' }}>{po.status}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() => {
                          setSelectedPO(po);
                          setFormData({
                            ...formData,
                            supplier_reliability: po.risk_level === 'CRITICAL' ? 79 : 92,
                            port_congestion: po.risk_level === 'CRITICAL' ? 82 : 35
                          });
                          setShowPredictor(true);
                          handleRunPrediction();
                        }}
                        style={{
                          padding: '0.3rem 0.6rem',
                          background: '#f0f9ff',
                          border: '1px solid #bae6fd',
                          color: '#6a9f7d',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          fontWeight: 600
                        }}
                      >
                        Explain AI →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* AI Delay Predictor Modal / Drawer */}
      {showPredictor && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.4)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 100
        }}>
          <div className="glass-panel" style={{ width: '900px', maxWidth: '95vw', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', background: '#ffffff', border: '1px solid #d7e8da', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #d7e8da', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Sparkles size={20} style={{ color: '#6a9f7d' }} />
                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: '#294436' }}>
                  XGBoost AI Lead-Time Delay Predictor
                </span>
              </div>
              <button
                onClick={() => setShowPredictor(false)}
                style={{ background: 'none', border: 'none', color: '#6b8172', fontSize: '1.2rem', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              
              {/* Form Controls */}
              <form onSubmit={handleRunPrediction} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6a9f7d' }}>Feature Parameter Input</div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#6b8172' }}>Supplier Reliability %</label>
                    <input
                      type="number"
                      value={formData.supplier_reliability}
                      onChange={(e) => setFormData({ ...formData, supplier_reliability: parseFloat(e.target.value) })}
                      style={{ width: '100%', padding: '0.4rem', background: '#ffffff', border: '1px solid #c7dccb', borderRadius: '4px', color: '#294436' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#6b8172' }}>Port Congestion %</label>
                    <input
                      type="number"
                      value={formData.port_congestion}
                      onChange={(e) => setFormData({ ...formData, port_congestion: parseFloat(e.target.value) })}
                      style={{ width: '100%', padding: '0.4rem', background: '#ffffff', border: '1px solid #c7dccb', borderRadius: '4px', color: '#294436' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#6b8172' }}>Weather Risk Index</label>
                    <input
                      type="number"
                      value={formData.weather_risk_index}
                      onChange={(e) => setFormData({ ...formData, weather_risk_index: parseFloat(e.target.value) })}
                      style={{ width: '100%', padding: '0.4rem', background: '#ffffff', border: '1px solid #c7dccb', borderRadius: '4px', color: '#294436' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#6b8172' }}>Geopolitical Risk Index</label>
                    <input
                      type="number"
                      value={formData.geopolitical_risk_index}
                      onChange={(e) => setFormData({ ...formData, geopolitical_risk_index: parseFloat(e.target.value) })}
                      style={{ width: '100%', padding: '0.4rem', background: '#ffffff', border: '1px solid #c7dccb', borderRadius: '4px', color: '#294436' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#6b8172' }}>Route Complexity (1-5)</label>
                    <input
                      type="number"
                      value={formData.route_complexity}
                      onChange={(e) => setFormData({ ...formData, route_complexity: parseInt(e.target.value) })}
                      style={{ width: '100%', padding: '0.4rem', background: '#ffffff', border: '1px solid #c7dccb', borderRadius: '4px', color: '#294436' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: '#6b8172' }}>Current Inventory (Days)</label>
                    <input
                      type="number"
                      value={formData.current_inventory_days}
                      onChange={(e) => setFormData({ ...formData, current_inventory_days: parseFloat(e.target.value) })}
                      style={{ width: '100%', padding: '0.4rem', background: '#ffffff', border: '1px solid #c7dccb', borderRadius: '4px', color: '#294436' }}
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '0.5rem', justifyContent: 'center' }}>
                  {predicting ? 'Computing Inference...' : 'RUN AI PREDICTION'}
                </button>
              </form>

              {/* Prediction Output & Explainable AI Breakdown */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {predictionResult && (
                  <>
                    <div style={{
                      padding: '1.25rem',
                      borderRadius: '10px',
                      background: predictionResult.risk_level === 'CRITICAL' ? '#fef2f2' : '#fffbeb',
                      border: `1px solid ${predictionResult.risk_level === 'CRITICAL' ? '#fecaca' : '#fde68a'}`
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#6b8172', textTransform: 'uppercase' }}>Predicted Delay Variance</div>
                          <div style={{ fontSize: '2.2rem', fontWeight: 900, color: predictionResult.risk_level === 'CRITICAL' ? '#dc2626' : '#d97706' }}>
                            +{predictionResult.predicted_delay_days} days
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span className={`badge ${predictionResult.risk_level === 'CRITICAL' ? 'badge-critical' : 'badge-warning'}`}>
                            {predictionResult.risk_level} RISK
                          </span>
                          <div style={{ fontSize: '0.75rem', color: '#6b8172', marginTop: '4px' }}>
                            Arrival: <strong>{predictionResult.expected_arrival_date}</strong>
                          </div>
                        </div>
                      </div>

                      <div style={{ fontSize: '0.75rem', color: '#6a9f7d', marginTop: '0.5rem', fontWeight: 600 }}>
                        90% Conformal Confidence Interval: [{predictionResult.confidence_interval[0]} – {predictionResult.confidence_interval[1]}]
                      </div>
                    </div>

                    {/* Explainable AI Feature Impact Bars */}
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#294436', marginBottom: '0.5rem' }}>
                        Why is this shipment at risk? (Explainable AI Breakdown)
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        {predictionResult.explainable_factors.map((f, i) => (
                          <div key={i}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#456050' }}>
                              <span>{f.factor}</span>
                              <span style={{ fontWeight: 700, color: f.color === '#EF4444' ? '#dc2626' : '#d97706' }}>{f.value}</span>
                            </div>
                            <div style={{ width: '100%', height: '6px', background: '#d7e8da', borderRadius: '3px', marginTop: '2px', overflow: 'hidden' }}>
                              <div style={{ width: `${f.impact_score}%`, height: '100%', background: f.color === '#EF4444' ? '#dc2626' : '#d97706', borderRadius: '3px' }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Insight Text */}
                    <div style={{ padding: '0.75rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6a9f7d', marginBottom: '2px' }}>AI Explanation Insight</div>
                      <div style={{ fontSize: '0.78rem', color: '#1e293b', lineHeight: 1.4 }}>
                        "{predictionResult.ai_insight}"
                      </div>
                    </div>
                  </>
                )}

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}

