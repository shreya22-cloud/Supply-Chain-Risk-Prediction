import React, { useState } from 'react';
import { Bot, Send, User } from 'lucide-react';
import { queryCopilot } from '../data/api';

export default function CopilotPage() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am SupplyGuard Copilot, your neural AI logistics assistant. Ask me anything about high-risk shipments, port bottlenecks, single points of failure, or mitigation plans.'
    }
  ]);

  const quickPrompts = [
    "What shipments are at highest risk?",
    "Why is PO-4432 delayed?",
    "What happens if Hamburg port capacity drops?",
    "Which suppliers are single points of failure?",
    "What mitigation actions are available?"
  ];

  const handleSend = async (textToSend) => {
    const q = textToSend || prompt;
    if (!q.trim()) return;

    const newMsgs = [...messages, { sender: 'user', text: q }];
    setMessages(newMsgs);
    setPrompt('');
    setLoading(true);

    const res = await queryCopilot(q);
    setMessages([...newMsgs, { sender: 'bot', text: res.answer }]);
    setLoading(false);
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', height: 'calc(100vh - 90px)' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#294436', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Bot size={24} style={{ color: '#6a9f7d' }} /> SupplyGuard Copilot AI Assistant
        </h1>
        <p style={{ color: '#6b8172', fontSize: '0.85rem', marginTop: '2px' }}>
          Natural language Q&A interface powered by local supply chain knowledge engine
        </p>
      </div>

      {/* Main Chat Panel */}
      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1.25rem', overflow: 'hidden' }}>
        
        {/* Quick Prompt Chips */}
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.85rem', borderBottom: '1px solid #d7e8da' }}>
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(qp)}
              style={{
                padding: '0.35rem 0.75rem',
                borderRadius: '16px',
                background: '#f0f9ff',
                border: '1px solid #bae6fd',
                color: '#6a9f7d',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              ⚡ {qp}
            </button>
          ))}
        </div>

        {/* Message Stream */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((m, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignSelf: m.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              {m.sender === 'bot' && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6a9f7d 0%, #8aaa91 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Bot size={18} style={{ color: '#fff' }} />
                </div>
              )}

              <div style={{
                padding: '0.85rem 1.1rem',
                borderRadius: '12px',
                background: m.sender === 'user' ? '#6a9f7d' : '#f4faf5',
                border: m.sender === 'user' ? 'none' : '1px solid #d7e8da',
                color: m.sender === 'user' ? '#ffffff' : '#294436',
                fontSize: '0.875rem',
                lineHeight: 1.5
              }}>
                {m.text}
              </div>

              {m.sender === 'user' && (
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#6b8172', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <User size={16} style={{ color: '#fff' }} />
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div style={{ fontSize: '0.8rem', color: '#6b8172', fontStyle: 'italic' }}>
              SupplyGuard Copilot is searching database & ML engine...
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.85rem', borderTop: '1px solid #d7e8da' }}>
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Ask SupplyGuard Copilot about POs, suppliers, or port risks..."
            style={{
              flex: 1,
              padding: '0.65rem 1rem',
              background: '#ffffff',
              border: '1px solid #c7dccb',
              borderRadius: '8px',
              color: '#294436',
              fontSize: '0.875rem',
              outline: 'none'
            }}
          />
          <button type="submit" className="btn-primary">
            <Send size={16} /> Send Query
          </button>
        </form>

      </div>

    </div>
  );
}

