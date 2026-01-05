import { useState } from 'react';
import { FileText, Download, Calendar, Filter, Plus, Clock, Mail, Eye, Trash2, Play, Pause, Edit2, Share2, CheckCircle2, Settings, BarChart3, PieChart, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import { toast } from '@/hooks/use-toast';

const reports = [
  { id: 'RPT-001', name: 'Monthly Sales Report', date: 'Dec 2024', type: 'Sales', size: '2.4 MB', status: 'ready', scheduled: false },
  { id: 'RPT-002', name: 'Production Summary', date: 'Dec 2024', type: 'Operations', size: '1.8 MB', status: 'ready', scheduled: true },
  { id: 'RPT-003', name: 'Inventory Analysis', date: 'Dec 2024', type: 'Inventory', size: '3.1 MB', status: 'generating', scheduled: false },
  { id: 'RPT-004', name: 'Financial Statement', date: 'Q4 2024', type: 'Finance', size: '4.2 MB', status: 'ready', scheduled: true },
  { id: 'RPT-005', name: 'Buyer Performance', date: 'Dec 2024', type: 'CRM', size: '1.5 MB', status: 'ready', scheduled: false },
];

const scheduledReports = [
  { name: 'Weekly Sales Summary', frequency: 'Every Monday', recipients: 3, nextRun: 'Tomorrow 9:00 AM', active: true },
  { name: 'Monthly Inventory', frequency: '1st of month', recipients: 5, nextRun: 'Jan 1, 2025', active: true },
  { name: 'Production KPIs', frequency: 'Daily', recipients: 2, nextRun: 'Today 6:00 PM', active: false },
];

const reportTemplates = [
  { id: 'T001', name: 'Sales Report', icon: TrendingUp, description: 'Revenue, orders, top products', color: 'from-primary to-secondary' },
  { id: 'T002', name: 'Inventory Report', icon: BarChart3, description: 'Stock levels, reorder alerts', color: 'from-accent to-primary' },
  { id: 'T003', name: 'Buyer Analysis', icon: PieChart, description: 'Customer segments, LTV', color: 'from-secondary to-neon-pink' },
  { id: 'T004', name: 'Production Report', icon: Settings, description: 'Output, efficiency, quality', color: 'from-warning to-neon-orange' },
];

type ViewTab = 'reports' | 'scheduled' | 'builder';

const Reports = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('reports');
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  
  const [generateForm, setGenerateForm] = useState({
    template: '',
    dateRange: '30d',
    format: 'pdf',
    includeCharts: true
  });

  const [scheduleForm, setScheduleForm] = useState({
    reportName: '',
    template: '',
    frequency: 'weekly',
    recipients: '',
    time: '09:00'
  });

  const handleGenerateReport = () => {
    toast({ title: "Report Generating", description: "Your report will be ready in a few seconds" });
    setShowGenerateModal(false);
  };

  const handleScheduleReport = () => {
    toast({ title: "Report Scheduled", description: `${scheduleForm.reportName} has been scheduled` });
    setShowScheduleModal(false);
  };

  const handleDownload = (reportId: string) => {
    toast({ title: "Download Started", description: `Downloading ${reportId}` });
  };

  const handleShare = (reportId: string) => {
    toast({ title: "Share Link Copied", description: "Report link copied to clipboard" });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">REPORTS</h1>
            <p className="page-subtitle">Automated report generation • Schedule & distribute</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowGenerateModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              <Plus size={16} />
              Generate Report
            </button>
            <button 
              onClick={() => setShowScheduleModal(true)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground"
            >
              <Clock size={16} />
              Schedule
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Generated" value="48" subtitle="This month" icon={<FileText size={16} />} />
          <MetricCard title="Scheduled" value="12" subtitle="Active" icon={<Calendar size={16} />} />
          <MetricCard title="Downloads" value="156" icon={<Download size={16} />} />
          <MetricCard title="Templates" value="24" icon={<Filter size={16} />} />
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 w-fit">
          {[
            { id: 'reports', label: 'All Reports', icon: FileText },
            { id: 'scheduled', label: 'Scheduled', icon: Clock },
            { id: 'builder', label: 'Report Builder', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ViewTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'reports' && (
          <div className="glass-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="section-title mb-0"><FileText size={14} className="text-primary" /> Recent Reports</h3>
              <div className="flex items-center gap-2">
                {['All', 'Sales', 'Operations', 'Finance'].map((type) => (
                  <button key={type} className="px-3 py-1.5 text-xs rounded-full bg-muted/50 text-muted-foreground hover:text-foreground">
                    {type}
                  </button>
                ))}
              </div>
            </div>
            <div className="divide-y divide-border/50">
              {reports.map((report) => (
                <div key={report.id} className="p-4 hover:bg-muted/20 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/20 flex items-center justify-center">
                        <FileText size={24} className="text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{report.name}</p>
                          {report.scheduled && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-accent/20 text-accent">Scheduled</span>
                          )}
                          {report.status === 'generating' && (
                            <span className="px-2 py-0.5 text-xs rounded-full bg-warning/20 text-warning animate-pulse">Generating...</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <span>{report.date}</span>
                          <span>{report.type}</span>
                          <span>{report.size}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => toast({ title: "Preview", description: "Opening report preview..." })}
                        className="p-2 rounded-lg hover:bg-muted transition-colors" title="Preview"
                      >
                        <Eye size={16} className="text-muted-foreground" />
                      </button>
                      <button 
                        onClick={() => handleDownload(report.id)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors" title="Download"
                        disabled={report.status === 'generating'}
                      >
                        <Download size={16} className={report.status === 'generating' ? 'text-muted' : 'text-primary'} />
                      </button>
                      <button 
                        onClick={() => handleShare(report.id)}
                        className="p-2 rounded-lg hover:bg-muted transition-colors" title="Share"
                      >
                        <Share2 size={16} className="text-muted-foreground" />
                      </button>
                      <button 
                        onClick={() => toast({ title: "Email Sent", description: "Report sent via email" })}
                        className="p-2 rounded-lg hover:bg-muted transition-colors" title="Email"
                      >
                        <Mail size={16} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'scheduled' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card">
              <div className="p-4 border-b border-border">
                <h3 className="section-title mb-0"><Clock size={14} className="text-primary" /> Scheduled Reports</h3>
              </div>
              <div className="divide-y divide-border/50">
                {scheduledReports.map((report, i) => (
                  <div key={i} className="p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          report.active ? 'bg-accent/20' : 'bg-muted'
                        }`}>
                          {report.active ? <Play size={18} className="text-accent" /> : <Pause size={18} className="text-muted-foreground" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{report.name}</p>
                          <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                            <span>{report.frequency}</span>
                            <span>•</span>
                            <span>{report.recipients} recipients</span>
                          </div>
                          <p className="text-xs text-primary mt-1">Next: {report.nextRun}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 rounded hover:bg-muted">
                          <Edit2 size={14} className="text-muted-foreground" />
                        </button>
                        <button 
                          onClick={() => toast({ title: report.active ? "Paused" : "Activated", description: `Schedule ${report.active ? 'paused' : 'activated'}` })}
                          className="p-1.5 rounded hover:bg-muted"
                        >
                          {report.active ? <Pause size={14} className="text-warning" /> : <Play size={14} className="text-accent" />}
                        </button>
                        <button className="p-1.5 rounded hover:bg-destructive/10">
                          <Trash2 size={14} className="text-destructive" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="section-title"><Calendar size={14} className="text-primary" /> Quick Schedule</h3>
              <div className="space-y-4 mt-4">
                <div>
                  <label className="text-sm text-muted-foreground">Report Template</label>
                  <select className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
                    <option>-- Select Template --</option>
                    {reportTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Frequency</label>
                  <select className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Recipients (emails, comma separated)</label>
                  <input
                    type="text"
                    placeholder="email1@example.com, email2@example.com"
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Delivery Time</label>
                  <input
                    type="time"
                    defaultValue="09:00"
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                  Schedule Report
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'builder' && (
          <div className="space-y-6">
            <div className="glass-card p-4">
              <h3 className="section-title"><Settings size={14} className="text-primary" /> Report Templates</h3>
              <p className="text-sm text-muted-foreground mb-4">Select a template to customize and generate your report</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {reportTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => { setSelectedTemplate(template.id); setShowGenerateModal(true); }}
                    className={`p-4 rounded-lg border-2 text-left transition-all hover:scale-105 ${
                      selectedTemplate === template.id ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-3`}>
                      <template.icon size={24} className="text-primary-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">{template.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="section-title"><Filter size={14} className="text-primary" /> Custom Report Builder</h3>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Select Data Sources</label>
                  <div className="space-y-2">
                    {['Sales Data', 'Inventory Levels', 'Production Stats', 'Buyer Analytics', 'Financial Data'].map((source) => (
                      <label key={source} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50">
                        <input type="checkbox" className="w-4 h-4 accent-primary" />
                        <span className="text-sm text-foreground">{source}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Date Range</label>
                  <select className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm mb-4">
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="custom">Custom Range</option>
                  </select>
                  
                  <label className="text-sm text-muted-foreground block mb-2">Include Charts</label>
                  <div className="space-y-2">
                    {['Bar Charts', 'Line Charts', 'Pie Charts', 'Tables'].map((chart) => (
                      <label key={chart} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50">
                        <input type="checkbox" defaultChecked className="w-4 h-4 accent-primary" />
                        <span className="text-sm text-foreground">{chart}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">Output Format</label>
                  <div className="space-y-2 mb-4">
                    {['PDF', 'Excel', 'CSV', 'PowerPoint'].map((format) => (
                      <label key={format} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 cursor-pointer hover:bg-muted/50">
                        <input type="radio" name="format" className="w-4 h-4 accent-primary" />
                        <span className="text-sm text-foreground">{format}</span>
                      </label>
                    ))}
                  </div>
                  <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2">
                    <FileText size={16} />
                    Generate Custom Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generate Modal */}
        {showGenerateModal && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-md p-6 animate-scale-in">
              <h2 className="text-lg font-bold text-foreground mb-4">Generate Report</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-muted-foreground">Report Template</label>
                  <select 
                    value={generateForm.template}
                    onChange={(e) => setGenerateForm({ ...generateForm, template: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="">-- Select Template --</option>
                    {reportTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Date Range</label>
                  <select 
                    value={generateForm.dateRange}
                    onChange={(e) => setGenerateForm({ ...generateForm, dateRange: e.target.value })}
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="7d">Last 7 days</option>
                    <option value="30d">Last 30 days</option>
                    <option value="90d">Last 90 days</option>
                    <option value="1y">Last year</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Format</label>
                  <div className="flex items-center gap-2 mt-2">
                    {['pdf', 'excel', 'csv'].map((format) => (
                      <button
                        key={format}
                        onClick={() => setGenerateForm({ ...generateForm, format })}
                        className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                          generateForm.format === format
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted/50 text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {format.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
                <label className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={generateForm.includeCharts}
                    onChange={(e) => setGenerateForm({ ...generateForm, includeCharts: e.target.checked })}
                    className="w-4 h-4 accent-primary" 
                  />
                  <span className="text-sm text-foreground">Include Charts & Visualizations</span>
                </label>
              </div>
              <div className="flex items-center gap-3 mt-6">
                <button onClick={() => setShowGenerateModal(false)} className="flex-1 py-2 rounded-lg border border-border text-sm hover:bg-muted">Cancel</button>
                <button onClick={handleGenerateReport} className="flex-1 py-2 rounded-lg bg-primary text-primary-foreground text-sm hover:bg-primary/90 flex items-center justify-center gap-2">
                  <FileText size={16} />
                  Generate
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Reports;