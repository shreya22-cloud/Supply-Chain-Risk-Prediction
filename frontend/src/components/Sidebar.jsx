import React, { useState } from 'react';
import {
  LayoutDashboard, TowerControl, Truck, Users, Network, Bell,
  Newspaper, ShieldAlert, BarChart3, UploadCloud, Bot, Settings,
  ChevronLeft, ChevronRight, Zap
} from 'lucide-react';

export default function Sidebar({ activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'control-tower', label: 'Risk Control Tower', icon: TowerControl },
    { id: 'shipments', label: 'Shipments & Delay AI', icon: Truck },
    { id: 'suppliers', label: 'Suppliers Intelligence', icon: Users },
    { id: 'digital-twin', label: 'Supply Network / Twin', icon: Network },
    { id: 'alerts', label: 'Risk Alerts', icon: Bell },
    { id: 'nlp-warning', label: 'Macro NLP Early Warning', icon: Newspaper },
    { id: 'mitigation', label: 'Resilience & Mitigation', icon: ShieldAlert },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'upload', label: 'Data Upload', icon: UploadCloud },
    { id: 'copilot', label: 'AI Copilot Assistant', icon: Bot },
    { id: 'settings', label: 'System Settings', icon: Settings }
  ];

  return (
    <aside style={{
      width: collapsed ? '72px' : '260px',
      background: '#ffffff',
      boxShadow: '1px 0 10px rgba(0, 0, 0, 0.03)',
      borderRight: '1px solid #d7e8da',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      transition: 'width 0.25s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Brand Header */}
      <div style={{
        padding: '1.25rem 1.25rem 1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'space-between',
        borderBottom: '1px solid #d7e8da'
      }}>
        {!collapsed && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={22} style={{ color: '#6a9f7d' }} />
              <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(135deg, #6a9f7d 0%, #8aaa91 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                SUPPLYGUARD AI
              </span>
            </div>
            <div style={{ fontSize: '0.68rem', color: '#6b8172', marginTop: '2px', fontWeight: 500 }}>
              Risk Prediction & Resiliency
            </div>
          </div>
        )}
        {collapsed && (
          <Zap size={24} style={{ color: '#6a9f7d' }} />
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{
            background: '#edf7ef',
            border: '1px solid #d7e8da',
            borderRadius: '6px',
            color: '#6b8172',
            padding: '0.3rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, padding: '0.75rem 0.6rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: collapsed ? '0.75rem 0' : '0.65rem 0.85rem',
                justifyContent: collapsed ? 'center' : 'flex-start',
                borderRadius: '8px',
                border: isActive ? '1px solid rgba(2, 132, 199, 0.3)' : '1px solid transparent',
                background: isActive ? 'linear-gradient(90deg, rgba(2, 132, 199, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)' : 'transparent',
                color: isActive ? '#6a9f7d' : '#6b8172',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.18s ease'
              }}
              title={collapsed ? item.label : ''}
            >
              <Icon size={18} style={{ color: isActive ? '#6a9f7d' : '#6b8172', minWidth: '18px' }} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer Tagline */}
      {!collapsed && (
        <div style={{
          padding: '1rem',
          margin: '0.75rem',
          background: '#f4faf5',
          border: '1px solid #d7e8da',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#475569' }}>
            Predict disruption. Understand impact. Act before it happens.
          </div>
        </div>
      )}
    </aside>
  );
}

