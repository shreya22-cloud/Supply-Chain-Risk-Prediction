import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Download } from 'lucide-react';

export default function DataUploadPage() {
  const [file, setFile] = useState(null);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleProcessData = () => {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setUploaded(true);
    }, 1200);
  };

  const downloadSampleCSV = (type) => {
    let csvContent = "";
    if (type === 'POs') {
      csvContent = "po_id,supplier_id,product_id,quantity,value_usd,origin_port,destination_port,scheduled_arrival\nPO-9901,SUP-ALPHA02,PRD-CHIP01,5000,2100000,PORT-SHEN,PORT-HAM,2026-11-10\nPO-9902,SUP-MEXICO08,PRD-WIRE05,12000,1440000,PORT-CHI,PORT-CHI,2026-11-12";
    } else {
      csvContent = "supplier_id,name,country,reliability,risk_score,category\nSUP-TAIWAN01,Taiwan Semi,Taiwan,82,82,Semiconductors\nSUP-NORDIC05,Nordic Electronics,Germany,96,15,Sensors";
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `sample_supplyguard_${type.toLowerCase()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#294436', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <UploadCloud size={24} style={{ color: '#6a9f7d' }} /> Data Ingestion & ERP Integration
        </h1>
        <p style={{ color: '#6b8172', fontSize: '0.85rem', marginTop: '2px' }}>
          Upload custom CSV/JSON logistics manifests, purchase order ERP feeds, or supplier scorecards
        </p>
      </div>

      {/* Main Upload Box & Downloadable Templates Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        
        {/* Upload Drop Zone */}
        <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', border: '2px dashed #6a9f7d', background: '#ffffff' }}>
          <UploadCloud size={48} style={{ color: '#6a9f7d', marginBottom: '1rem' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#294436' }}>
            Drag & Drop Supply Chain Dataset
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6b8172', marginTop: '4px', marginBottom: '1.5rem' }}>
            Supports CSV, Excel (.xlsx), and JSON manifests
          </div>

          <label className="btn-primary" style={{ cursor: 'pointer' }}>
            Select CSV File
            <input type="file" accept=".csv,.json,.xlsx" onChange={handleFileChange} style={{ display: 'none' }} />
          </label>

          {file && (
            <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: '#5b9b70', fontWeight: 600 }}>
              Selected File: {file.name} ({(file.size/1024).toFixed(1)} KB)
            </div>
          )}

          <button
            onClick={handleProcessData}
            className="btn-secondary"
            disabled={!file && !uploaded}
            style={{ marginTop: '1.25rem', width: '220px', justifyContent: 'center' }}
          >
            {uploading ? 'Validating Dataset...' : 'PROCESS DATA'}
          </button>
        </div>

        {/* Downloadable Sample Templates */}
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#294436' }}>
            Download Pre-Formatted Sample Datasets
          </div>
          <div style={{ fontSize: '0.8rem', color: '#6b8172', lineHeight: 1.5 }}>
            Download realistic sample CSV files to test instant data ingestion:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button onClick={() => downloadSampleCSV('POs')} className="btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} style={{ color: '#6a9f7d' }} /> Purchase Orders Feed (CSV)
              </span>
              <Download size={14} />
            </button>

            <button onClick={() => downloadSampleCSV('Suppliers')} className="btn-secondary" style={{ justifyContent: 'space-between' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={16} style={{ color: '#5b9b70' }} /> Supplier Scorecard Data (CSV)
              </span>
              <Download size={14} />
            </button>
          </div>
        </div>

      </div>

      {/* Validation Summary & Preview Table */}
      {uploaded && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #d7e8da', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#5b9b70', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle2 size={20} /> Dataset Validation Passed (45 Records Ingested)
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', fontWeight: 700 }}>
              <span style={{ color: '#5b9b70' }}>Valid: 45</span>
              <span style={{ color: '#d97706' }}>Warnings: 0</span>
              <span style={{ color: '#dc2626' }}>Errors: 0</span>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#294436', marginBottom: '0.75rem' }}>
            Ingested Records Preview
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #d7e8da', color: '#6b8172' }}>
                  <th style={{ padding: '0.65rem' }}>Record ID</th>
                  <th style={{ padding: '0.65rem' }}>Data Type</th>
                  <th style={{ padding: '0.65rem' }}>Validation Status</th>
                  <th style={{ padding: '0.65rem' }}>Calculated Risk Score</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { id: "IMP-001", type: "Purchase Order Update", status: "VALIDATED", risk: "22%" },
                  { id: "IMP-002", type: "Port Telemetry AIS Ping", status: "VALIDATED", risk: "45%" },
                  { id: "IMP-003", type: "Supplier OTIF Scorecard", status: "VALIDATED", risk: "18%" },
                  { id: "IMP-004", type: "Inventory Stock Manifest", status: "VALIDATED", risk: "12%" }
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #edf7ef' }}>
                    <td style={{ padding: '0.65rem', fontWeight: 700, color: '#6a9f7d' }}>{row.id}</td>
                    <td style={{ padding: '0.65rem', color: '#294436' }}>{row.type}</td>
                    <td style={{ padding: '0.65rem', color: '#5b9b70', fontWeight: 700 }}>{row.status}</td>
                    <td style={{ padding: '0.65rem', fontWeight: 800, color: '#294436' }}>{row.risk}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}

