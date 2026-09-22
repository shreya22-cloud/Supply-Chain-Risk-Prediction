import React from 'react';
import { Zap, ShieldCheck, Cpu, Network, ArrowRight, Play, CheckCircle2, LineChart, Globe } from 'lucide-react';

export default function LandingPage({ onLaunch, onDemo }) {
  return (
    <div style={{ minHeight: '100vh', background: '#f4faf5', color: '#294436', position: 'relative', overflow: 'hidden' }}>
      
      {/* Mesh Background Glows */}
      <div style={{ position: 'absolute', top: '-10%', left: '20%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(2, 132, 199, 0.08) 0%, rgba(0, 0, 0, 0) 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: '40%', right: '10%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(0, 0, 0, 0) 70%)', pointerEvents: 'none' }} />

      {/* Header */}
      <header style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Zap size={28} style={{ color: '#6a9f7d' }} />
          <span style={{ fontSize: '1.4rem', fontWeight: 800, background: 'linear-gradient(135deg, #6a9f7d 0%, #86a98d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            SUPPLYGUARD AI
          </span>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onDemo} className="btn-secondary" style={{ fontSize: '0.875rem' }}>
            <Play size={16} /> Explore Demo
          </button>
          <button onClick={onLaunch} className="btn-primary" style={{ fontSize: '0.875rem' }}>
            Launch Control Tower <ArrowRight size={16} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main style={{ maxWidth: '1100px', margin: '3rem auto 4rem auto', textAlign: 'center', padding: '0 1.5rem' }}>
        
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 1rem', background: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '20px', fontSize: '0.85rem', color: '#568668', fontWeight: 600, marginBottom: '1.5rem' }}>
          <SparkleIcon /> Next-Generation Supply Chain Digital Twin Platform
        </div>

        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#294436', marginBottom: '1.25rem' }}>
          Predict Supply Chain Disruptions <br />
          <span style={{ background: 'linear-gradient(135deg, #6a9f7d 0%, #86a98d 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Before They Happen.
          </span>
        </h1>

        <p style={{ fontSize: '1.15rem', color: '#475569', maxWidth: '780px', margin: '0 auto 2.5rem auto', lineHeight: 1.6 }}>
          SupplyGuard AI combines predictive lead-time modeling, network graph Digital Twin intelligence, and NLP macro early-warning signals to protect your operations from costly bottlenecks.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1.25rem' }}>
          <button onClick={onLaunch} className="btn-primary" style={{ padding: '0.9rem 2rem', fontSize: '1rem' }}>
            Launch AI Control Tower <ArrowRight size={18} />
          </button>
          <button onClick={onDemo} className="btn-secondary" style={{ padding: '0.9rem 2rem', fontSize: '1rem', borderColor: '#6a9f7d', color: '#6a9f7d' }}>
            <Play size={18} fill="#6a9f7d" /> Run Hamburg Disruption Scenario
          </button>
        </div>

        {/* Visual Network Flow Animation Card */}
        <div className="glass-panel" style={{ marginTop: '4rem', padding: '2rem', position: 'relative', overflow: 'hidden', background: '#ffffff', borderColor: '#d7e8da' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #d7e8da', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#294436', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Network size={18} style={{ color: '#6a9f7d' }} /> LIVE SUPPLY CHAIN NETWORK SIMULATION
            </div>
            <div style={{ fontSize: '0.75rem', color: '#5b9b70', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#5b9b70', boxShadow: '0 0 8px #5b9b70' }}></span>
              126 Nodes Active
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1rem', alignItems: 'center' }}>
            {['Supplier Node', 'Port Terminal', 'Manufacturing Plant', 'Distribution Hub', 'OEM Customer'].map((step, idx) => (
              <div key={idx} style={{
                background: idx === 1 ? '#fef2f2' : '#f4faf5',
                border: idx === 1 ? '1px solid #fca5a5' : '1px solid #d7e8da',
                padding: '1.25rem 0.75rem',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#6b8172', textTransform: 'uppercase', marginBottom: '0.35rem' }}>Tier {idx + 1}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: idx === 1 ? '#991b1b' : '#294436' }}>{step}</div>
                <div style={{ fontSize: '0.7rem', color: idx === 1 ? '#dc2626' : '#5b9b70', marginTop: '0.5rem', fontWeight: 600 }}>
                  {idx === 1 ? '⚠️ 82% Risk' : '✓ Normal'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginTop: '3rem', textAlign: 'left' }}>
          {[
            { title: 'PREDICT', desc: 'Forecast exact shipment lead-time delays using XGBoost & Random Forest regression.', icon: LineChart, color: '#6a9f7d' },
            { title: 'DETECT', desc: 'Identify macro risks early with NLP sentiment analysis on global shipping news.', icon: Globe, color: '#86a98d' },
            { title: 'UNDERSTAND', desc: 'Trace cascading graph impact and single points of failure across suppliers.', icon: Network, color: '#9333ea' },
            { title: 'ACT', desc: 'Prescribe dynamic inventory rebalancing and automated alternate sourcing.', icon: ShieldCheck, color: '#5b9b70' }
          ].map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', borderColor: '#d7e8da' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={20} style={{ color: f.color }} />
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: f.color, letterSpacing: '0.05em' }}>{f.title}</div>
                <div style={{ fontSize: '0.825rem', color: '#6b8172', marginTop: '0.5rem', lineHeight: 1.5 }}>{f.desc}</div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
    </svg>
  );
}
