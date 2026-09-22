import React, { useState, useEffect } from 'react';
import { Network, Play, ShieldAlert, AlertTriangle, ArrowRight, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { fetchNetworkGraph, simulateDisruption } from '../data/api';

export default function DigitalTwin() {
  const [graphData, setGraphData] = useState({ nodes: [], edges: [] });
  const [selectedNode, setSelectedNode] = useState(null);
  const [spofMode, setSpofMode] = useState(false);

  // Disruption Simulation state
  const [disruptionType, setDisruptionType] = useState('Port Closure');
  const [targetNodeId, setTargetNodeId] = useState('PORT-HAM');
  const [severityPct, setSeverityPct] = useState(50);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    loadGraph();
  }, []);

  const loadGraph = async () => {
    const res = await fetchNetworkGraph();
    setGraphData(res);
  };

  const handleRunSimulation = async () => {
    setSimulating(true);
    const res = await simulateDisruption({
      disruption_type: disruptionType,
      target_node_id: targetNodeId,
      severity_pct: severityPct
    });
    setSimulationResult(res);
    setSimulating(false);
  };

  // Node Positions for visually clean SVG rendering layout
  const nodePositions = {
    "SUP-TAIWAN01": { x: 80, y: 120, label: "Taiwan Semi (Tier-2)" },
    "SUP-GLOBAL04": { x: 80, y: 260, label: "Global Metals (Tier-2)" },
    "SUP-ALPHA02": { x: 80, y: 400, label: "Alpha Components (Tier-1)" },
    "PORT-SHEN": { x: 300, y: 160, label: "Port of Shenzhen" },
    "PORT-HAM": { x: 500, y: 160, label: "Port of Hamburg" },
    "PORT-ROT": { x: 500, y: 320, label: "Port of Rotterdam" },
    "FAC-MUN": { x: 720, y: 160, label: "Plant Munich" },
    "FAC-EUDC": { x: 720, y: 320, label: "EU Distribution Center" },
    "FAC-USMID": { x: 720, y: 460, label: "US Midwest Plant" },
    "CUST-EU": { x: 900, y: 240, label: "European Customers" }
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#294436', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Network size={24} style={{ color: '#6a9f7d' }} /> Supply Chain Digital Twin & Cascading Risk Engine
          </h1>
          <p style={{ color: '#6b8172', fontSize: '0.85rem', marginTop: '2px' }}>
            Mathematical network graph traversal & Graph Neural Network risk message passing
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => setSpofMode(!spofMode)}
            className="btn-secondary"
            style={{
              borderColor: spofMode ? '#dc2626' : '#c7dccb',
              color: spofMode ? '#dc2626' : '#456050',
              background: spofMode ? '#fef2f2' : '#ffffff'
            }}
          >
            <AlertTriangle size={16} /> {spofMode ? 'SPOF Highlight Active' : 'Highlight Single Point of Failure (SPOF)'}
          </button>

          <button onClick={handleRunSimulation} className="btn-primary">
            <Play size={16} fill="#fff" /> Simulate Disruption Scenario
          </button>
        </div>
      </div>

      {/* SPOF Alert Banner */}
      {spofMode && (
        <div style={{ padding: '1rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', color: '#991b1b' }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} /> SINGLE POINT OF FAILURE DETECTED: Taiwan Semiconductor Supplier (Betweenness Centrality = 0.82)
          </div>
          <div style={{ fontSize: '0.8rem', color: '#1e293b', marginTop: '4px' }}>
            "This Tier-2 supplier controls 40% of final assembly products with zero active pre-approved secondary buffer. Any delay at this node propagates immediately to Plant Munich."
          </div>
        </div>
      )}

      {/* Main Digital Twin Interactive Graph Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.2fr 1fr', gap: '1.25rem' }}>
        
        {/* SVG Network Visualizer */}
        <div className="glass-panel" style={{ height: '520px', padding: '1rem', position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6a9f7d', marginBottom: '0.5rem' }}>
            Interactive Network Graph (Click any node to inspect dependencies)
          </div>

          <svg width="100%" height="460" viewBox="0 0 1000 520" style={{ background: '#f4faf5', borderRadius: '8px', border: '1px solid #d7e8da' }}>
            
            {/* Draw Edges / Connecting Lines */}
            {graphData.edges.map((e, idx) => {
              const src = nodePositions[e.source_id];
              const tgt = nodePositions[e.target_id];
              if (!src || !tgt) return null;
              
              const isSimPath = simulationResult && (e.source_id === 'PORT-HAM' || e.target_id === 'PORT-HAM' || e.source_id === 'FAC-MUN');
              return (
                <g key={idx}>
                  <line
                    x1={src.x} y1={src.y}
                    x2={tgt.x} y2={tgt.y}
                    stroke={isSimPath ? '#dc2626' : '#c7dccb'}
                    strokeWidth={isSimPath ? 3 : 1.5}
                    strokeDasharray={isSimPath ? '6 6' : 'none'}
                  />
                </g>
              );
            })}

            {/* Draw Nodes */}
            {graphData.nodes.map((n) => {
              const pos = nodePositions[n.id] || { x: 400, y: 250, label: n.name };
              const isSpofHighlight = spofMode && n.is_spof;
              const isSelected = selectedNode?.id === n.id;

              const nodeColor = isSpofHighlight ? '#dc2626' : n.risk_score >= 80 ? '#dc2626' : n.risk_score >= 50 ? '#d97706' : '#5b9b70';

              return (
                <g
                  key={n.id}
                  onClick={() => setSelectedNode(n)}
                  style={{ cursor: 'pointer' }}
                >
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isSelected ? 20 : isSpofHighlight ? 22 : 16}
                    fill="#ffffff"
                    stroke={nodeColor}
                    strokeWidth={isSelected ? 4 : isSpofHighlight ? 4 : 2.5}
                    style={{
                      filter: isSpofHighlight || n.risk_score >= 80 ? `drop-shadow(0 0 8px ${nodeColor})` : 'none',
                      transition: 'all 0.2s ease'
                    }}
                  />
                  <text
                    x={pos.x}
                    y={pos.y + 32}
                    textAnchor="middle"
                    fill="#294436"
                    fontSize="11"
                    fontWeight="600"
                  >
                    {pos.label}
                  </text>
                  <text
                    x={pos.x}
                    y={pos.y + 45}
                    textAnchor="middle"
                    fill={nodeColor}
                    fontSize="10"
                    fontWeight="800"
                  >
                    {n.risk_score}% Risk
                  </text>
                </g>
              );
            })}

          </svg>

        </div>

        {/* Node Inspection & Disruption Simulation Control Drawer */}
        <div className="glass-panel" style={{ padding: '1.25rem', height: '520px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div style={{ borderBottom: '1px solid #d7e8da', paddingBottom: '0.75rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#6a9f7d', textTransform: 'uppercase' }}>
              Cascading Risk Simulator
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6b8172', marginTop: '2px' }}>
              Test network resilience against simulated external shocks
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px', display: 'block' }}>
                Select Disruption Scenario
              </label>
              <select
                value={disruptionType}
                onChange={(e) => setDisruptionType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  background: '#ffffff',
                  border: '1px solid #c7dccb',
                  borderRadius: '8px',
                  color: '#294436',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="Port Closure" style={{ background: '#ffffff', color: '#294436' }}>Port Closure / Capacity Drop</option>
                <option value="Supplier Failure" style={{ background: '#ffffff', color: '#294436' }}>Tier-2 Supplier Bankruptcy</option>
                <option value="Labor Strike" style={{ background: '#ffffff', color: '#294436' }}>Port Labor Strike</option>
                <option value="Severe Weather" style={{ background: '#ffffff', color: '#294436' }}>Typhoon Shipping Lane Blockade</option>
                <option value="Geopolitical Event" style={{ background: '#ffffff', color: '#294436' }}>Maritime Security Rerouting</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#475569', marginBottom: '4px', display: 'block' }}>
                Target Disruption Node
              </label>
              <select
                value={targetNodeId}
                onChange={(e) => setTargetNodeId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.75rem',
                  background: '#ffffff',
                  border: '1px solid #c7dccb',
                  borderRadius: '8px',
                  color: '#294436',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer'
                }}
              >
                <option value="PORT-HAM" style={{ background: '#ffffff', color: '#294436' }}>Port of Hamburg (Germany)</option>
                <option value="SUP-TAIWAN01" style={{ background: '#ffffff', color: '#294436' }}>Taiwan Semiconductor Supplier</option>
                <option value="PORT-SHEN" style={{ background: '#ffffff', color: '#294436' }}>Port of Shenzhen (China)</option>
                <option value="FAC-MUN" style={{ background: '#ffffff', color: '#294436' }}>Munich Assembly Plant</option>
              </select>
            </div>

            <button onClick={handleRunSimulation} className="btn-primary" style={{ justifyContent: 'center', marginTop: '0.25rem' }}>
              {simulating ? 'Propagating Graph Risk...' : 'RUN GRAPH SIMULATION'}
            </button>
          </div>

          {/* Simulation Output Step-by-Step Path */}
          {simulationResult && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#991b1b' }}>
                Cascading Risk Propagation Output
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.75rem', color: '#1e293b' }}>
                <div>Affected POs: <strong>{simulationResult.affected_shipments_count}</strong></div>
                <div>Warehouses: <strong>{simulationResult.affected_warehouses_count}</strong></div>
                <div>Plants at Risk: <strong>{simulationResult.affected_plants_count}</strong></div>
                <div>Exposure: <strong style={{ color: '#dc2626' }}>${(simulationResult.estimated_financial_exposure_usd/1000000).toFixed(1)}M</strong></div>
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6a9f7d', marginTop: '0.25rem' }}>Propagation Traversal Path:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {simulationResult.cascading_path.map((step, idx) => (
                  <div key={idx} style={{ fontSize: '0.72rem', color: '#456050', paddingLeft: '0.5rem', borderLeft: '2px solid #dc2626' }}>
                    <strong>Step {step.step}:</strong> {step.node_name} ({step.risk_after}% Risk)
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}

