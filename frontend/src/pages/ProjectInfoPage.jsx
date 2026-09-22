import React from 'react';
import { Info, Cpu, Network, Newspaper, ShieldCheck, Database, Layers, Sparkles } from 'lucide-react';

export default function ProjectInfoPage() {
  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '1000px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Info size={28} style={{ color: '#38bdf8' }} /> SupplyGuard AI — Project Architecture & Presentation Guide
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginTop: '4px' }}>
          Intelligent Supply Chain Risk Prediction & Resiliency Platform — Academic Demonstration Reference
        </p>
      </div>

      {/* 1. Project Concept & Problem Statement */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>1. Executive Summary & Problem Statement</h2>
        <p style={{ color: '#d1d5db', fontSize: '0.875rem', lineHeight: 1.6 }}>
          Modern global supply chains operate heavily on Just-In-Time (JIT) inventory models. While JIT minimizes warehousing costs, it creates immense fragility. A single localized disruption—such as a port strike in Hamburg, an extreme typhoon in the East China Sea, or a Tier-3 microchip supplier bankruptcy—can cascade through non-linear supply networks, bringing enterprise manufacturing to a halt and causing millions in lost revenue.
        </p>
        <p style={{ color: '#d1d5db', fontSize: '0.875rem', lineHeight: 1.6 }}>
          Traditional Supply Chain Management (SCM) platforms are historically reactive—tracking container locations after a delay has already occurred. <strong>SupplyGuard AI</strong> constructs a dynamic <em>"Digital Twin"</em> of the supply chain network, combining ERP procurement data with exogenous risk indicators (port wait times, weather indexes, news sentiment) to predict lead-time delays weeks in advance.
        </p>
      </div>

      {/* 2. System Architecture & ML Methods */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#38bdf8' }}>2. Machine Learning & Technical Architecture</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          
          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Cpu size={16} style={{ color: '#38bdf8' }} /> XGBoost Lead-Time Regression
            </div>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.4rem', lineHeight: 1.5 }}>
              Models lead-time delay as a continuous regression problem outputting predicted delay in days (+12.5d). Employs <strong>Conformal Prediction</strong> to generate 90% confidence uncertainty bounds ([Nov 10 – Nov 15]).
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Network size={16} style={{ color: '#a855f7' }} /> Digital Twin Graph Risk Engine
            </div>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.4rem', lineHeight: 1.5 }}>
              Models nodes (Suppliers, Ports, Warehouses, Plants) and directed edges. Uses <strong>Betweenness Centrality</strong> graph metrics to detect Single Points of Failure (SPOFs) with &gt;40% product dependency.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Newspaper size={16} style={{ color: '#8aaa91' }} /> NLP Macro Early Warning (EWS)
            </div>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.4rem', lineHeight: 1.5 }}>
              Scans unstructured news streams using Named Entity Recognition (NER) to extract locations, union labor strikes, and tariffs before physical logistics manifests reflect delays.
            </p>
          </div>

          <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f3f4f6', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheck size={16} style={{ color: '#10b981' }} /> Prescriptive Operations Research
            </div>
            <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.4rem', lineHeight: 1.5 }}>
              Recommends dynamic inventory rebalancing (air freight bridge buffers) and automated dual-sourcing purchase order staging to protect manufacturing revenue.
            </p>
          </div>

        </div>
      </div>

      {/* 3. Future Scope Section */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} /> 3. Future Scope & Next Expansion Phase
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.25rem' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '6px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6ee7b7' }}>1. Autonomous AI Agents (ReAct Reasoning Framework)</div>
            <div style={{ fontSize: '0.8rem', color: '#d1d5db', marginTop: '2px' }}>
              Upgrade the system with ReAct LLM autonomous agents. Instead of just prescribing a solution, AI agents can autonomously draft emails to suppliers, negotiate expedited shipping rates, and update ERP systems via REST API integrations.
            </div>
          </div>

          <div style={{ padding: '0.75rem', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '6px', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#7dd3fc' }}>2. Blockchain Track & Trace Provenance</div>
            <div style={{ fontSize: '0.8rem', color: '#d1d5db', marginTop: '2px' }}>
              Integration with smart contracts on a private enterprise blockchain to create immutable, cryptographically verifiable records of origin for ESG compliance and anti-counterfeiting.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
