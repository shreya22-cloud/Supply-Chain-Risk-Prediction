import React, { useState, useEffect } from 'react';
import { Users, Search, ArrowRight } from 'lucide-react';
import { fetchSuppliers, fetchSupplierDetail } from '../data/api';

export default function SupplierIntelligence({ onSelectSupplier }) {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    const res = await fetchSuppliers();
    setSuppliers(res);
  };

  const handleSupplierClick = async (sup) => {
    setSelectedSupplier(sup);
    const detail = await fetchSupplierDetail(sup.id);
    setDetailData(detail);
  };

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.country.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#294436', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Users size={24} style={{ color: '#6a9f7d' }} /> Supplier Intelligence & Scorecard Radar
          </h1>
          <p style={{ color: '#6b8172', fontSize: '0.85rem', marginTop: '2px' }}>
            Multi-tier supplier risk profiling, financial health tracking, and alternate vendor mapping
          </p>
        </div>
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#91a99a' }} />
          <input
            type="text"
            placeholder="Search Supplier, Country, Category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '0.45rem 1rem 0.45rem 2.2rem',
              background: '#ffffff',
              border: '1px solid #c7dccb',
              borderRadius: '6px',
              color: '#294436',
              fontSize: '0.85rem',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* Supplier Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
        {filteredSuppliers.map((sup, idx) => {
          const isCritical = sup.risk_score >= 80;
          const isWarning = sup.risk_score >= 50 && sup.risk_score < 80;
          const badgeBg = isCritical ? '#fef2f2' : isWarning ? '#fffbeb' : '#f0fdf4';
          const badgeBorder = isCritical ? '#fecaca' : isWarning ? '#fde68a' : '#bbf7d0';
          const badgeColor = isCritical ? '#dc2626' : isWarning ? '#d97706' : '#5b9b70';

          return (
            <div
              key={idx}
              className="glass-card-interactive"
              onClick={() => handleSupplierClick(sup)}
              style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', background: '#ffffff', border: '1px solid #d7e8da' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: '#294436' }}>{sup.name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#6b8172', marginTop: '2px' }}>
                    {sup.country} • Tier {sup.tier} • {sup.category}
                  </div>
                </div>
                <div style={{
                  padding: '0.25rem 0.6rem',
                  borderRadius: '12px',
                  background: badgeBg,
                  border: `1px solid ${badgeBorder}`,
                  color: badgeColor,
                  fontWeight: 800,
                  fontSize: '0.75rem'
                }}>
                  {sup.risk_score}% RISK
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', background: '#f4faf5', border: '1px solid #d7e8da', padding: '0.65rem', borderRadius: '6px' }}>
                <div>
                  <div style={{ fontSize: '0.65rem', color: '#6b8172' }}>OTIF Rate</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#294436' }}>{sup.on_time_rate}%</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: '#6b8172' }}>Avg Lead Time</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#294436' }}>{sup.avg_lead_time_days}d</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.65rem', color: '#6b8172' }}>Financial Risk</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: sup.financial_risk === 'HIGH' ? '#dc2626' : '#5b9b70' }}>{sup.financial_risk}</div>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#6a9f7d', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                Inspect Supplier Scorecard <ArrowRight size={14} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Supplier Detail Modal */}
      {selectedSupplier && (
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
          <div className="glass-panel" style={{ width: '800px', maxWidth: '95vw', padding: '1.75rem', background: '#ffffff', border: '1px solid #d7e8da', boxShadow: '0 20px 50px rgba(0,0,0,0.15)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #d7e8da', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#294436' }}>{selectedSupplier.name}</div>
                <div style={{ fontSize: '0.8rem', color: '#6b8172' }}>{selectedSupplier.country} • Tier {selectedSupplier.tier} • {selectedSupplier.category}</div>
              </div>
              <button onClick={() => setSelectedSupplier(null)} style={{ background: 'none', border: 'none', color: '#6b8172', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
              
              <div style={{ padding: '1rem', background: '#f4faf5', borderRadius: '8px', border: '1px solid #d7e8da' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6a9f7d' }}>Reliability & Lead Time Performance</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#294436', marginTop: '0.4rem' }}>{selectedSupplier.reliability}%</div>
                <div style={{ fontSize: '0.75rem', color: '#6b8172', marginTop: '4px' }}>
                  On-Time In-Full (OTIF): {selectedSupplier.on_time_rate}% • Lead Time: {selectedSupplier.avg_lead_time_days} days
                </div>
              </div>

              <div style={{ padding: '1rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#dc2626' }}>Composite Risk Exposure</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#dc2626', marginTop: '0.4rem' }}>{selectedSupplier.risk_score}%</div>
                <div style={{ fontSize: '0.75rem', color: '#6b8172', marginTop: '4px' }}>
                  Financial Risk Index: <strong>{selectedSupplier.financial_risk}</strong>
                </div>
              </div>

            </div>

            {/* Alternate Suppliers */}
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#294436', marginBottom: '0.6rem' }}>
                Pre-Approved Alternate Suppliers ({selectedSupplier.category})
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {detailData?.alternate_suppliers?.map((alt, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#5b9b70' }}>{alt.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#6b8172', marginTop: '2px' }}>{alt.country} • Risk: {alt.risk_score}% • Lead Time: {alt.avg_lead_time_days}d</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

