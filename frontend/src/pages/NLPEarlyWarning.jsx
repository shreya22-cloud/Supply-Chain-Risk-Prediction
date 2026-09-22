import React, { useState, useEffect } from 'react';
import { Newspaper, Sparkles } from 'lucide-react';
import { fetchNLPFeed, analyzeNews } from '../data/api';

export default function NLPEarlyWarning() {
  const [events, setEvents] = useState([]);
  const [inputText, setInputText] = useState("Labor negotiations intensify at Port of Hamburg terminal as Ver.di union delegates threaten container vessel unloading freeze over shift safety disputes.");
  const [analysis, setAnalysis] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const res = await fetchNLPFeed();
    setEvents(res);
  };

  const handleAnalyze = async (e) => {
    if (e) e.preventDefault();
    setAnalyzing(true);
    const res = await analyzeNews(inputText);
    setAnalysis(res);
    setAnalyzing(false);
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#294436', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Newspaper size={24} style={{ color: '#6a9f7d' }} /> Macro Risk NLP Early Warning Radar
        </h1>
        <p style={{ color: '#6b8172', fontSize: '0.85rem', marginTop: '2px' }}>
          Unstructured global news feed parsing, Named Entity Recognition (NER), & sentiment anomaly detection
        </p>
      </div>

      {/* Interactive NLP Text Parser Tool */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#6a9f7d', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} /> Interactive Supply Chain News Text Analyzer
        </div>

        <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <textarea
            rows={3}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Paste supply-chain news headline or social media chatter here..."
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              background: '#ffffff',
              border: '1px solid #c7dccb',
              borderRadius: '8px',
              color: '#294436',
              fontSize: '0.9rem',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setInputText("Typhoon Kong-rey path shifts towards East China Sea shipping lanes, threatening major port terminal closures at Shenzhen and Shanghai within 48 hours.")}
                style={{ padding: '0.35rem 0.75rem', background: '#f4faf5', border: '1px solid #c7dccb', color: '#475569', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Sample 1: Weather Shock
              </button>
              <button
                type="button"
                onClick={() => setInputText("Automotive microchip wafer raw material silicon shortage detected in Tier-3 sub-tier supplier foundries in Taiwan and Wuhan.")}
                style={{ padding: '0.35rem 0.75rem', background: '#f4faf5', border: '1px solid #c7dccb', color: '#475569', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}
              >
                Sample 2: Component Shortage
              </button>
            </div>

            <button type="submit" className="btn-primary">
              <Sparkles size={16} /> {analyzing ? 'Extracting Entities...' : 'ANALYZE WITH AI'}
            </button>
          </div>
        </form>

        {/* NLP Output Result Card */}
        {analysis && (
          <div style={{ marginTop: '1.25rem', padding: '1.25rem', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#6a9f7d', textTransform: 'uppercase' }}>{analysis.event_type}</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#294436', marginTop: '2px' }}>{analysis.headline_summary}</div>
              </div>
              <div style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '20px',
                background: analysis.risk_score >= 70 ? '#fef2f2' : '#fffbeb',
                border: `1px solid ${analysis.risk_score >= 70 ? '#fecaca' : '#fde68a'}`,
                color: analysis.risk_score >= 70 ? '#dc2626' : '#d97706',
                fontWeight: 900,
                fontSize: '0.85rem'
              }}>
                {analysis.risk_score}% RISK SIGNAL
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem', marginBottom: '1rem' }}>
              <div style={{ background: '#ffffff', border: '1px solid #c7dccb', padding: '0.65rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: '#6b8172' }}>Detected Location</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#294436', marginTop: '2px' }}>{analysis.detected_location}</div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #c7dccb', padding: '0.65rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: '#6b8172' }}>Sentiment Score</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', marginTop: '2px' }}>{analysis.sentiment}</div>
              </div>
              <div style={{ background: '#ffffff', border: '1px solid #c7dccb', padding: '0.65rem', borderRadius: '6px' }}>
                <div style={{ fontSize: '0.7rem', color: '#6b8172' }}>Detected Entities (NER)</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6a9f7d', marginTop: '2px' }}>{analysis.detected_organizations.join(', ')}</div>
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: '#294436', lineHeight: 1.5 }}>
              <strong>Potential Supply Impact:</strong> {analysis.potential_supply_impact}
            </div>

            <div style={{ fontSize: '0.8rem', color: '#5b9b70', marginTop: '0.5rem', fontWeight: 600 }}>
              <strong>Recommended Action:</strong> {analysis.recommended_action}
            </div>

          </div>
        )}
      </div>

      {/* Historical Macro NLP News Table */}
      <div className="glass-panel" style={{ padding: '1.25rem' }}>
        <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#294436', marginBottom: '1rem' }}>
          Global Logistics Intelligence News Stream
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #d7e8da', color: '#6b8172' }}>
                <th style={{ padding: '0.75rem' }}>Headline</th>
                <th style={{ padding: '0.75rem' }}>Location</th>
                <th style={{ padding: '0.75rem' }}>Event Category</th>
                <th style={{ padding: '0.75rem' }}>Sentiment</th>
                <th style={{ padding: '0.75rem' }}>Risk Score</th>
                <th style={{ padding: '0.75rem' }}>Date Detected</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #edf7ef' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600, color: '#294436' }}>{ev.headline}</td>
                  <td style={{ padding: '0.75rem', color: '#6a9f7d' }}>{ev.location}</td>
                  <td style={{ padding: '0.75rem', color: '#6b8172' }}>{ev.event_type}</td>
                  <td style={{ padding: '0.75rem', color: ev.sentiment === 'Negative' ? '#dc2626' : '#5b9b70', fontWeight: 700 }}>{ev.sentiment}</td>
                  <td style={{ padding: '0.75rem', fontWeight: 800, color: ev.risk_score >= 80 ? '#dc2626' : '#d97706' }}>{ev.risk_score}%</td>
                  <td style={{ padding: '0.75rem', color: '#6b8172' }}>{ev.date_detected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

