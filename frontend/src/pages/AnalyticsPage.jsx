import React, { useState } from 'react';
import { BarChart3 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');

  const riskByTier = [
    { tier: 'Tier 1 (Direct)', risk: 28 },
    { tier: 'Tier 2 (Sub-Tier)', risk: 65 },
    { tier: 'Tier 3 (Raw Materials)', risk: 82 }
  ];

  const portCongestion = [
    { port: 'Hamburg', congestion: 82 },
    { port: 'Shenzhen', congestion: 74 },
    { port: 'Los Angeles', congestion: 62 },
    { port: 'Shanghai', congestion: 55 },
    { port: 'Singapore', congestion: 45 },
    { port: 'Rotterdam', congestion: 32 }
  ];

  const pieColors = ['#dc2626', '#d97706', '#6a9f7d', '#5b9b70'];
  const delayDistribution = [
    { name: 'Critical (>10d)', value: 18 },
    { name: 'High (4-10d)', value: 24 },
    { name: 'Medium (2-4d)', value: 32 },
    { name: 'Low (<2d)', value: 52 }
  ];

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#294436', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <BarChart3 size={24} style={{ color: '#6a9f7d' }} /> Multi-Dimensional Supply Analytics
          </h1>
          <p style={{ color: '#6b8172', fontSize: '0.85rem', marginTop: '2px' }}>
            Aggregated logistics performance matrices & lead-time delay distributions
          </p>
        </div>

        {/* Date Filter Pills */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {[
            { id: '7d', label: '7 Days' },
            { id: '30d', label: '30 Days' },
            { id: '90d', label: '90 Days' },
            { id: '1y', label: '1 Year' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setTimeRange(btn.id)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                background: timeRange === btn.id ? '#6a9f7d' : '#ffffff',
                color: timeRange === btn.id ? '#ffffff' : '#456050',
                border: timeRange === btn.id ? '1px solid #6a9f7d' : '1px solid #c7dccb',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
        
        {/* Chart 1: Port Congestion */}
        <div className="glass-panel" style={{ padding: '1.25rem', height: '340px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#294436', marginBottom: '1rem' }}>
            Port Waiting Time Congestion Level (%)
          </div>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={portCongestion}>
                <CartesianGrid strokeDasharray="3 3" stroke="#d7e8da" />
                <XAxis dataKey="port" stroke="#6b8172" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#6b8172" fontSize={11} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #c7dccb', color: '#294436' }} />
                <Bar dataKey="congestion" fill="#dc2626" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Risk Distribution by Tier */}
        <div className="glass-panel" style={{ padding: '1.25rem', height: '340px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#294436', marginBottom: '1rem' }}>
            Supplier Risk Score Distribution by Tier
          </div>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskByTier} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#d7e8da" />
                <XAxis type="number" domain={[0, 100]} stroke="#6b8172" fontSize={11} />
                <YAxis dataKey="tier" type="category" stroke="#6b8172" fontSize={11} width={130} />
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #c7dccb', color: '#294436' }} />
                <Bar dataKey="risk" fill="#6a9f7d" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Shipment Delay Risk Breakdown (Pie Chart) */}
        <div className="glass-panel" style={{ padding: '1.25rem', height: '340px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#294436', marginBottom: '1rem' }}>
            Shipment Delay Risk Classification (Active POs)
          </div>
          <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'center' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={delayDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
                  {delayDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#ffffff', border: '1px solid #c7dccb', color: '#294436' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Operational Insight Summary */}
        <div className="glass-panel" style={{ padding: '1.5rem', height: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#6a9f7d', marginBottom: '0.5rem' }}>
            Analytical Control Takeaways
          </div>
          <p style={{ color: '#6b8172', fontSize: '0.85rem', lineHeight: 1.6 }}>
            • <strong>Multi-Tier Vulnerability:</strong> 70% of high-risk items originate at the Tier-2 sub-tier level (e.g. Taiwan Semiconductor wafer foundries).
          </p>
          <p style={{ color: '#6b8172', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
            • <strong>Port Idling Bottlenecks:</strong> Port of Hamburg and Port of Shenzhen drive 85% of total lead-time delay variances across Europe & Americas corridors.
          </p>
          <p style={{ color: '#6b8172', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.5rem' }}>
            • <strong>Working Capital Savings:</strong> Surgical air freight rerouting on 7 high-risk shipments protects $2.4M in final assembly revenue with only $13.5K total added freight expense.
          </p>
        </div>

      </div>

    </div>
  );
}

