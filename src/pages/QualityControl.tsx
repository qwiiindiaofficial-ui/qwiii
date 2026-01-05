import { useState } from 'react';
import { Shield, CheckCircle2, XCircle, AlertTriangle, Camera, Scan, FileText, Eye, ThumbsUp, ThumbsDown, RotateCcw, Filter, Search, Zap, Target, TrendingUp } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import DonutChartCard from '@/components/charts/DonutChartCard';
import LineChartCard from '@/components/charts/LineChartCard';
import { toast } from '@/hooks/use-toast';

const qualityData = [
  { name: 'Passed', value: 94 },
  { name: 'Minor Defects', value: 4 },
  { name: 'Rejected', value: 2 },
];

const trendData = [
  { name: 'W1', passRate: 92, defects: 8 },
  { name: 'W2', passRate: 93, defects: 7 },
  { name: 'W3', passRate: 91, defects: 9 },
  { name: 'W4', passRate: 94, defects: 6 },
  { name: 'W5', passRate: 95, defects: 5 },
];

const inspectionQueue = [
  { id: 'INS-4521', batch: 'B-4521', product: 'Banarasi Silk Saree - Red', quantity: 100, priority: 'high', status: 'pending', assignee: 'Priya S.' },
  { id: 'INS-4520', batch: 'B-4520', product: 'Designer Lehenga Set', quantity: 50, priority: 'medium', status: 'in_progress', assignee: 'Amit K.' },
  { id: 'INS-4519', batch: 'B-4519', product: 'Cotton Kurta Collection', quantity: 200, priority: 'low', status: 'pending', assignee: 'Unassigned' },
];

const recentInspections = [
  { id: 'INS-4518', batch: 'B-4518', product: 'Festive Saree', result: 'passed', passRate: 98, defects: 2, inspector: 'Priya S.', time: '1 hour ago' },
  { id: 'INS-4517', batch: 'B-4517', product: 'Bridal Lehenga', result: 'passed', passRate: 95, defects: 5, inspector: 'Amit K.', time: '3 hours ago' },
  { id: 'INS-4516', batch: 'B-4516', product: 'Silk Dupatta', result: 'rejected', passRate: 72, defects: 28, inspector: 'Meera R.', time: '5 hours ago' },
];

const defectCategories = [
  { name: 'Color Variation', count: 12, trend: 'down' },
  { name: 'Weaving Defect', count: 8, trend: 'up' },
  { name: 'Stitch Issues', count: 6, trend: 'down' },
  { name: 'Material Damage', count: 4, trend: 'same' },
  { name: 'Size Mismatch', count: 3, trend: 'down' },
];

type ViewTab = 'queue' | 'history' | 'defects';
type InspectionResult = 'pass' | 'fail' | 'rework';

const QualityControl = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('queue');
  const [selectedInspection, setSelectedInspection] = useState<typeof inspectionQueue[0] | null>(null);
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [inspectionForm, setInspectionForm] = useState({
    passed: 0,
    failed: 0,
    defectType: '',
    notes: '',
    images: [] as string[]
  });

  const handleStartInspection = (inspection: typeof inspectionQueue[0]) => {
    setSelectedInspection(inspection);
    setShowInspectionModal(true);
    toast({ title: "Inspection Started", description: `Starting QC for ${inspection.batch}` });
  };

  const handleSubmitInspection = (result: InspectionResult) => {
    toast({ 
      title: result === 'pass' ? "Batch Approved" : result === 'fail' ? "Batch Rejected" : "Sent for Rework",
      description: `${selectedInspection?.batch} has been ${result === 'pass' ? 'approved' : result === 'fail' ? 'rejected' : 'sent for rework'}`
    });
    setShowInspectionModal(false);
    setSelectedInspection(null);
    setInspectionForm({ passed: 0, failed: 0, defectType: '', notes: '', images: [] });
  };

  const handleAIDetection = () => {
    toast({ title: "AI Scan Complete", description: "Detected 2 potential defects in uploaded images" });
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">QUALITY CONTROL</h1>
            <p className="page-subtitle">AI-powered inspection • Defect detection • Batch approval</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
              <Scan size={16} />
              Quick Scan
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground">
              <FileText size={16} />
              QC Report
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Pass Rate" value="94.2%" change="+1.5%" changeType="positive" icon={<CheckCircle2 size={16} />} />
          <MetricCard title="Inspected Today" value="1,247" icon={<Shield size={16} />} subtitle="units" />
          <MetricCard title="Defects Found" value="48" icon={<AlertTriangle size={16} />} subtitle="minor + major" />
          <MetricCard title="Pending Queue" value="3" icon={<Target size={16} />} subtitle="batches" />
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 w-fit">
          {[
            { id: 'queue', label: 'Inspection Queue', icon: Target },
            { id: 'history', label: 'History', icon: FileText },
            { id: 'defects', label: 'Defect Analysis', icon: AlertTriangle },
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

        {activeTab === 'queue' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card">
              <div className="p-4 border-b border-border">
                <h3 className="section-title mb-0"><Target size={14} className="text-primary" /> Pending Inspections</h3>
              </div>
              <div className="divide-y divide-border/50">
                {inspectionQueue.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          item.priority === 'high' ? 'bg-destructive/20' :
                          item.priority === 'medium' ? 'bg-warning/20' :
                          'bg-muted'
                        }`}>
                          <Shield size={24} className={
                            item.priority === 'high' ? 'text-destructive' :
                            item.priority === 'medium' ? 'text-warning' :
                            'text-muted-foreground'
                          } />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-mono text-muted-foreground">{item.batch}</span>
                            <span className={`px-2 py-0.5 text-xs rounded-full ${
                              item.status === 'in_progress' ? 'bg-primary/20 text-primary' :
                              'bg-muted text-muted-foreground'
                            }`}>
                              {item.status.replace('_', ' ')}
                            </span>
                          </div>
                          <p className="text-sm font-medium text-foreground">{item.product}</p>
                          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                            <span>{item.quantity} units</span>
                            <span>Assigned: {item.assignee}</span>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleStartInspection(item)}
                        className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
                      >
                        {item.status === 'in_progress' ? 'Continue' : 'Start Inspection'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <DonutChartCard data={qualityData} title="Quality Distribution" centerValue="94%" centerLabel="Pass Rate" height={180} />
              
              <div className="glass-card p-4">
                <h3 className="section-title"><Zap size={14} className="text-primary" /> AI Quick Actions</h3>
                <div className="space-y-2 mt-4">
                  <button className="w-full p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 text-left transition-colors">
                    <div className="flex items-center gap-3">
                      <Camera size={20} className="text-primary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Scan Product</p>
                        <p className="text-xs text-muted-foreground">AI defect detection</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 text-left transition-colors">
                    <div className="flex items-center gap-3">
                      <Eye size={20} className="text-secondary" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Color Match</p>
                        <p className="text-xs text-muted-foreground">Compare with reference</p>
                      </div>
                    </div>
                  </button>
                  <button className="w-full p-3 rounded-lg bg-muted/50 hover:bg-muted border border-border/50 text-left transition-colors">
                    <div className="flex items-center gap-3">
                      <Scan size={20} className="text-accent" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Batch Verify</p>
                        <p className="text-xs text-muted-foreground">QR/Barcode scan</p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 glass-card">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="section-title mb-0"><FileText size={14} className="text-primary" /> Recent Inspections</h3>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 text-xs rounded-full bg-accent/20 text-accent">Passed</button>
                  <button className="px-3 py-1.5 text-xs rounded-full bg-muted text-muted-foreground">Rejected</button>
                  <button className="px-3 py-1.5 text-xs rounded-full bg-muted text-muted-foreground">All</button>
                </div>
              </div>
              <div className="divide-y divide-border/50">
                {recentInspections.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          item.result === 'passed' ? 'bg-accent/20' : 'bg-destructive/20'
                        }`}>
                          {item.result === 'passed' ? 
                            <CheckCircle2 size={20} className="text-accent" /> :
                            <XCircle size={20} className="text-destructive" />
                          }
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-mono text-muted-foreground">{item.batch}</span>
                            <span className="text-sm font-medium text-foreground">{item.product}</span>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                            <span>Pass Rate: <span className={item.passRate >= 90 ? 'text-accent' : 'text-destructive'}>{item.passRate}%</span></span>
                            <span>Defects: {item.defects}</span>
                            <span>By: {item.inspector}</span>
                            <span>{item.time}</span>
                          </div>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 text-xs border border-border rounded hover:bg-muted">
                        View Report
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <LineChartCard
              data={trendData}
              lines={[
                { key: 'passRate', color: 'hsl(var(--accent))', name: 'Pass Rate' },
                { key: 'defects', color: 'hsl(var(--destructive))', name: 'Defects' },
              ]}
              title="Quality Trends"
              subtitle="Last 5 weeks"
              height={300}
              showLegend
            />
          </div>
        )}

        {activeTab === 'defects' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-4">
              <h3 className="section-title"><AlertTriangle size={14} className="text-warning" /> Top Defect Categories</h3>
              <div className="space-y-3 mt-4">
                {defectCategories.map((defect, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                    <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center text-sm font-bold text-warning">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{defect.name}</p>
                      <div className="w-full h-2 bg-muted rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-warning rounded-full"
                          style={{ width: `${(defect.count / defectCategories[0].count) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-foreground">{defect.count}</p>
                      <div className={`flex items-center gap-1 text-xs ${
                        defect.trend === 'down' ? 'text-accent' : 
                        defect.trend === 'up' ? 'text-destructive' : 'text-muted-foreground'
                      }`}>
                        {defect.trend === 'down' ? <TrendingUp size={10} className="rotate-180" /> :
                         defect.trend === 'up' ? <TrendingUp size={10} /> : null}
                        {defect.trend}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="section-title"><Zap size={14} className="text-primary" /> Defect Prevention Actions</h3>
              <div className="space-y-3 mt-4">
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 size={16} className="text-accent" />
                    <span className="text-sm font-medium text-foreground">Color Calibration Scheduled</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Machine M-002 will be calibrated tomorrow to reduce color variations</p>
                </div>
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle size={16} className="text-warning" />
                    <span className="text-sm font-medium text-foreground">Training Required</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Schedule stitch quality training for new operators</p>
                  <button className="mt-2 text-xs text-primary hover:underline">Schedule Training</button>
                </div>
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Scan size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">AI Model Update</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Defect detection model updated with 500 new samples</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Inspection Modal */}
        {showInspectionModal && selectedInspection && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-card w-full max-w-2xl p-6 animate-scale-in max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Quality Inspection</h2>
                  <p className="text-sm text-muted-foreground">{selectedInspection.batch} - {selectedInspection.product}</p>
                </div>
                <button onClick={() => setShowInspectionModal(false)} className="p-2 rounded-lg hover:bg-muted">
                  <XCircle size={20} className="text-muted-foreground" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="text-sm text-muted-foreground">Units Passed</label>
                  <input
                    type="number"
                    value={inspectionForm.passed}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, passed: parseInt(e.target.value) || 0 })}
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    max={selectedInspection.quantity}
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Units Failed</label>
                  <input
                    type="number"
                    value={inspectionForm.failed}
                    onChange={(e) => setInspectionForm({ ...inspectionForm, failed: parseInt(e.target.value) || 0 })}
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    max={selectedInspection.quantity}
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm text-muted-foreground">Defect Type (if any)</label>
                <select
                  value={inspectionForm.defectType}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, defectType: e.target.value })}
                  className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">-- Select Defect Type --</option>
                  {defectCategories.map(d => <option key={d.name} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              <div className="mb-6">
                <label className="text-sm text-muted-foreground">Upload Images</label>
                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <Camera size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Click to upload or drag images</p>
                  <button 
                    onClick={handleAIDetection}
                    className="mt-3 px-4 py-2 text-xs bg-secondary text-secondary-foreground rounded-lg"
                  >
                    Run AI Detection
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <label className="text-sm text-muted-foreground">Notes</label>
                <textarea
                  value={inspectionForm.notes}
                  onChange={(e) => setInspectionForm({ ...inspectionForm, notes: e.target.value })}
                  rows={3}
                  className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                  placeholder="Additional observations..."
                />
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleSubmitInspection('pass')}
                  className="flex-1 py-3 rounded-lg bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 flex items-center justify-center gap-2"
                >
                  <ThumbsUp size={16} />
                  Approve Batch
                </button>
                <button 
                  onClick={() => handleSubmitInspection('rework')}
                  className="flex-1 py-3 rounded-lg bg-warning text-warning-foreground text-sm font-medium hover:bg-warning/90 flex items-center justify-center gap-2"
                >
                  <RotateCcw size={16} />
                  Send for Rework
                </button>
                <button 
                  onClick={() => handleSubmitInspection('fail')}
                  className="flex-1 py-3 rounded-lg bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 flex items-center justify-center gap-2"
                >
                  <ThumbsDown size={16} />
                  Reject Batch
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default QualityControl;