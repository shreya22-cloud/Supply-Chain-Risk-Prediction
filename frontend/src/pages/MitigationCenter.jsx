import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, RefreshCw, FileText, Plane, Building } from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateMitigation, createDraftPO } from '../data/api';

export default function MitigationCenter({ activeAlert }) {
  const [mitigationResult, setMitigationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [draftPoResult, setDraftPoResult] = useState(null);

  const handleRunMitigationCalc = async () => {
    setLoading(true);
    const res = await calculateMitigation({
      po_id: "PO-4432",
      primary_supplier_id: "SUP-TAIWAN01",
      alternate_supplier_id: "SUP-MEXICO08"
    });
    setMitigationResult(res);
    setLoading(false);
  };

  const handleCreateDraftPO = async () => {
    const res = await createDraftPO({
      supplier_id: "SUP-MEXICO08",
      product_id: "PRD-CHIP01",
      quantity: 2500,
      target_facility: "Munich Assembly Plant (Plant Munich)"
    });
    setDraftPoResult(res);
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#294436', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldAlert size={24} style={{ color: '#5b9b70' }} /> Prescriptive Resilience & Mitigation Center
        </h1>
        <p style={{ color: '#6b8172', fontSize: '0.85rem', marginTop: '2px' }}>
          Dynamic inventory rebalancing, expedited freight optimization, & alternate supplier dual-sourcing
        </p>
      </div>

      {/* Main Prescriptive Solution Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Solution Card 1: Dynamic Inventory Rebalancing */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="badge badge-critical">CRITICAL DISRUPTION IDENTIFIED</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#294436', marginTop: '0.5rem' }}>
                Option A: Dynamic Inventory Buffer Rebalancing
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0f9ff', border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Plane size={20} style={{ color: '#6a9f7d' }} />
            </div>
          </div>

          <div style={{ background: '#f4faf5', padding: '0.85rem', borderRadius: '8px', border: '1px solid #d7e8da' }}>
            <div style={{ fontSize: '0.75rem', color: '#6b8172' }}>Prescriptive Action Description</div>
            <div style={{ fontSize: '0.85rem', color: '#294436', marginTop: '4px', lineHeight: 1.4 }}>
              "Transfer 500 units of Automotive Microcontrollers from EU Distribution Center to Munich Assembly Plant (Line 3) via emergency air freight to bridge the 14-day delay gap."
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div style={{ background: '#fef2f2', padding: '0.75rem', borderRadius: '6px', border: '1px solid #fecaca' }}>
              <div style={{ fontSize: '0.7rem', color: '#dc2626' }}>Added Freight Cost</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#dc2626', marginTop: '2px' }}>$4,500</div>
            </div>
            <div style={{ background: '#f0fdf4', padding: '0.75rem', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.7rem', color: '#5b9b70' }}>Revenue Protected</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#5b9b70', marginTop: '2px' }}>$1.2M</div>
            </div>
            <div style={{ background: '#f0f9ff', padding: '0.75rem', borderRadius: '6px', border: '1px solid #bae6fd' }}>
              <div style={{ fontSize: '0.7rem', color: '#6a9f7d' }}>Post-Action Risk</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 900, color: '#6a9f7d', marginTop: '2px' }}>82% → 31%</div>
            </div>
          </div>

          <button onClick={handleRunMitigationCalc} className="btn-primary" style={{ marginTop: 'auto', justifyContent: 'center' }}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} /> {loading ? 'Computing...' : 'Apply Simulation & Calculate ROI'}
          </button>
        </div>

        {/* Solution Card 2: Automated Alternate Supplier Sourcing */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="badge badge-warning">RECOMMENDED DUAL SOURCING</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#294436', marginTop: '0.5rem' }}>
                Option B: Alternate Nearshore Supplier Activation
              </div>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building size={20} style={{ color: '#5b9b70' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div style={{ padding: '0.75rem', background: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <div style={{ fontSize: '0.7rem', color: '#dc2626', fontWeight: 700 }}>Primary Supplier (India/Taiwan)</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#294436', marginTop: '2px' }}>Taiwan Semiconductor</div>
              <div style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '4px' }}>Risk: 82% • Lead Time: 18.5d</div>
            </div>

            <div style={{ padding: '0.75rem', background: '#f0fdf4', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
              <div style={{ fontSize: '0.7rem', color: '#5b9b70', fontWeight: 700 }}>Alternate Supplier (Mexico Nearshore)</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#294436', marginTop: '2px' }}>Monterrey Component Tech</div>
              <div style={{ fontSize: '0.75rem', color: '#5b9b70', marginTop: '4px' }}>Risk: 25% • Transit Time: 8.0d</div>
            </div>
          </div>

          <div style={{ background: '#f4faf5', border: '1px solid #d7e8da', padding: '0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: '#6b8172' }}>
            Unit Cost Differential: <strong>+$14.50 / unit</strong> • Expected Delay Reduction: <strong>-9.0 Days</strong>
          </div>

          <button
            onClick={handleCreateDraftPO}
            className="btn-primary"
            style={{
              marginTop: 'auto',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)'
            }}
          >
            <FileText size={16} /> CREATE DRAFT PURCHASE ORDER
          </button>
        </div>

      </div>

      {/* Draft PO Confirmation Feedback Banner */}
      {draftPoResult && (
        <div style={{ padding: '1.25rem', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', color: '#166534' }}>
          <div style={{ fontSize: '1rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={20} /> {draftPoResult.message}
          </div>
          <div style={{ fontSize: '0.8rem', color: '#1e293b', marginTop: '4px' }}>
            Target Facility: <strong>{draftPoResult.target_facility}</strong> • Quantity: <strong>{draftPoResult.quantity} units</strong> • Status: <strong>{draftPoResult.status}</strong>
          </div>
        </div>
      )}

    </div>
  );
}

