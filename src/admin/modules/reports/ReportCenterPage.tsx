// ─── DMOS Report Center v7 — Live Firestore Export Engine ─────────────────────

import React, { useState } from 'react';
import { FileText, Download, Printer, Calendar, Clock, TrendingUp, BarChart2, Zap, Shield } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { Card, Button, Badge, PageHeader, SectionHeader, Tabs } from '../../design-system/components';

const REPORT_TYPES = [
  { id: 'crm_pipeline',  label: 'CRM Lead Pipeline Export', icon: BarChart2,   desc: 'Live export of all CRM leads from Firestore' },
  { id: 'blogs_audit',   label: 'Blog Content Inventory',   icon: FileText,    desc: 'Export all published and draft articles' },
  { id: 'projects_list', label: 'Portfolio Projects List',  icon: TrendingUp,  desc: 'Export portfolio showcase project metadata' },
  { id: 'system_health', label: 'System Health Log',        icon: Shield,      desc: 'Export system telemetry and API health metrics' },
];

export const ReportCenterPage: React.FC = () => {
  const [generating, setGenerating] = useState(false);
  const [selectedReport, setSelectedReport] = useState('crm_pipeline');
  const [activeTab, setActiveTab] = useState('generate');

  const handleGenerateReport = async (format: 'pdf' | 'csv') => {
    setGenerating(true);

    try {
      let reportRows: { key: string; val: string }[] = [];
      let collectionName = 'crm';

      if (selectedReport === 'crm_pipeline') collectionName = 'crm';
      else if (selectedReport === 'blogs_audit') collectionName = 'blogs';
      else if (selectedReport === 'projects_list') collectionName = 'projects';
      else collectionName = 'notifications';

      if (db) {
        const snap = await getDocs(collection(db, collectionName));
        snap.docs.forEach(doc => {
          const d = doc.data();
          reportRows.push({
            key: d.title || d.name || doc.id,
            val: d.email || d.category || d.status || d.createdAt || 'N/A',
          });
        });
      }

      if (format === 'csv') {
        let csvStr = `Item,Detail,Timestamp\n`;
        if (reportRows.length === 0) {
          csvStr += `No data available,N/A,${new Date().toISOString()}\n`;
        } else {
          reportRows.forEach(r => {
            csvStr += `"${r.key.replace(/"/g, '""')}","${r.val.replace(/"/g, '""')}",${new Date().toISOString()}\n`;
          });
        }

        const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvStr);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `DMOS_${selectedReport}_${new Date().toISOString().substring(0, 10)}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        const pw = window.open('', '_blank');
        if (pw) {
          const tableRows = reportRows.length === 0
            ? `<tr><td colspan="2" style="text-align:center;color:#64748b;">No data available in Firestore collection: ${collectionName}</td></tr>`
            : reportRows.map(r => `<tr><td>${r.key}</td><td>${r.val}</td></tr>`).join('');

          pw.document.write(`
            <html><head><title>DMOS Live Report — ${selectedReport}</title>
            <style>body{font-family:system-ui,sans-serif;padding:40px;color:#0f172a}h1{color:#2E5AFF}
            .card{border:1px solid #cbd5e1;border-radius:8px;padding:20px;margin-bottom:16px;background:#f8fafc}
            table{width:100%;border-collapse:collapse}th,td{border:1px solid #cbd5e1;padding:10px 14px;font-size:13px}
            th{background:#e2e8f0;text-align:left}</style></head><body>
            <h1>DMOS Live Enterprise Report</h1>
            <p style="color:#64748b">Report Type: ${selectedReport} · Firestore Collection: ${collectionName} · Generated: ${new Date().toLocaleString()}</p>
            <div class="card">
              <h2>Data Records (${reportRows.length})</h2>
              <table>
                <tr><th>Item Name / Title</th><th>Metadata / Status</th></tr>
                ${tableRows}
              </table>
            </div>
            <script>window.onload=function(){window.print();}</script></body></html>
          `);
          pw.document.close();
        }
      }
    } catch (e: any) {
      alert(`Report export error: ${e.message}`);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="dmos-page-shell">
      <PageHeader
        title="Report & Intelligence Center"
        subtitle="Dynamic PDF & CSV export engine powered by live Firestore collections"
        badge={<Badge variant="success">Live Firestore Export</Badge>}
      />

      <Tabs
        tabs={[
          { id: 'generate', label: 'Generate Report' },
        ]}
        active={activeTab}
        onChange={setActiveTab}
        style={{ marginBottom: 24 }}
      />

      {activeTab === 'generate' && (
        <>
          {/* Report Type Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12, marginBottom: 24 }}>
            {REPORT_TYPES.map(rt => (
              <div
                key={rt.id}
                onClick={() => setSelectedReport(rt.id)}
                style={{
                  padding: 18, borderRadius: 'var(--dmos-radius-md)', cursor: 'pointer',
                  background: selectedReport === rt.id ? 'linear-gradient(135deg, rgba(46,90,255,0.18), rgba(46,90,255,0.08))' : 'var(--dmos-card)',
                  border: `1px solid ${selectedReport === rt.id ? 'rgba(46,90,255,0.4)' : 'var(--dmos-border)'}`,
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: selectedReport === rt.id ? 'rgba(46,90,255,0.25)' : 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <rt.icon size={16} color={selectedReport === rt.id ? 'var(--dmos-primary-light)' : 'var(--dmos-text-muted)'} />
                  </div>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: selectedReport === rt.id ? 'var(--dmos-primary-light)' : 'var(--dmos-text)' }}>{rt.label}</span>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--dmos-text-subtle)' }}>{rt.desc}</div>
              </div>
            ))}
          </div>

          {/* Export Buttons */}
          <Card style={{ padding: 24 }}>
            <SectionHeader
              title={`Generating Live Report: ${REPORT_TYPES.find(r => r.id === selectedReport)?.label}`}
              subtitle="Select export format. PDF opens a print dialog with live Firestore records. CSV downloads directly."
              style={{ marginBottom: 20 }}
            />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button variant="primary" onClick={() => handleGenerateReport('pdf')} loading={generating} leftIcon={<Printer size={16} />}>
                Export as PDF
              </Button>
              <Button variant="secondary" onClick={() => handleGenerateReport('csv')} loading={generating} leftIcon={<Download size={16} />}>
                Download CSV
              </Button>
            </div>
          </Card>
        </>
      )}
    </div>
  );
};

export default ReportCenterPage;
