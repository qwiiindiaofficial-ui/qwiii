import { useState } from 'react';
import { Shield, CircleCheck as CheckCircle2, Circle as XCircle, TriangleAlert as AlertTriangle, Plus, X, Eye } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import DonutChartCard from '@/components/charts/DonutChartCard';
import { useQualityControl, CreateInspectionInput, SubmitInspectionInput, QualityInspection } from '@/hooks/useQualityControl';

const resultColors: Record<string, string> = {
  passed: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  rework: 'bg-orange-100 text-orange-700',
  pending: 'bg-gray-100 text-gray-600',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

export default function QualityControl() {
  const { queue, history, loading, stats, createInspection, submitInspection, startInspection } = useQualityControl();
  const [activeTab, setActiveTab] = useState<'queue' | 'history'>('queue');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState<QualityInspection | null>(null);
  const [formData, setFormData] = useState<CreateInspectionInput>({
    batch_number: '',
    product_name: '',
    quantity: 0,
    priority: 'medium',
  });
  const [submitData, setSubmitData] = useState<SubmitInspectionInput>({
    passed: 0,
    failed: 0,
    result: 'passed',
  });

  const donutData = [
    { name: 'Passed', value: history.filter(i => i.result === 'passed').length },
    { name: 'Rework', value: history.filter(i => i.result === 'rework').length },
    { name: 'Rejected', value: history.filter(i => i.result === 'rejected').length },
  ];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createInspection(formData);
    if (result) {
      setShowAddModal(false);
      setFormData({ batch_number: '', product_name: '', quantity: 0, priority: 'medium' });
    }
  };

  const handleSubmitInspection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showSubmitModal) return;
    const ok = await submitInspection(showSubmitModal.id, submitData);
    if (ok) {
      setShowSubmitModal(null);
      setSubmitData({ passed: 0, failed: 0, result: 'passed' });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Quality Control</h1>
            <p className="page-subtitle">Inspect and track production quality</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
          >
            <Plus className="w-4 h-4" />
            New Inspection
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Pending Inspections" value={stats.pending} icon={<AlertTriangle className="w-5 h-5" />} trend={0} />
          <MetricCard title="Completed" value={stats.completed} icon={<CheckCircle2 className="w-5 h-5" />} trend={0} />
          <MetricCard title="Pass Rate" value={`${stats.passRate}%`} icon={<Shield className="w-5 h-5" />} trend={0} />
          <MetricCard title="Total Inspected" value={stats.totalInspected} icon={<Eye className="w-5 h-5" />} trend={0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass-card p-6">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => setActiveTab('queue')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'queue' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                Inspection Queue ({queue.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'history' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              >
                History ({history.length})
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : activeTab === 'queue' ? (
              queue.length === 0 ? (
                <div className="text-center py-12">
                  <Shield className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No pending inspections</p>
                  <button onClick={() => setShowAddModal(true)} className="mt-3 text-sm text-primary hover:underline">Create new inspection</button>
                </div>
              ) : (
                <div className="space-y-3">
                  {queue.map(item => (
                    <div key={item.id} className="p-4 border border-border rounded-lg hover:border-primary/40 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{item.product_name}</p>
                          <p className="text-xs text-muted-foreground">Batch: {item.batch_number} · #{item.inspection_number}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[item.priority] || priorityColors.medium}`}>
                            {item.priority}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>
                            {item.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span>Qty: {item.quantity}</span>
                        {item.assignee && <span>Assignee: {item.assignee}</span>}
                      </div>
                      <div className="flex gap-2">
                        {item.status === 'pending' && (
                          <button
                            onClick={() => startInspection(item.id)}
                            className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                          >
                            Start Inspection
                          </button>
                        )}
                        {item.status === 'in_progress' && (
                          <button
                            onClick={() => {
                              setShowSubmitModal(item);
                              setSubmitData({ passed: item.quantity, failed: 0, result: 'passed' });
                            }}
                            className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                          >
                            Submit Results
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              history.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No completed inspections yet</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Inspection #</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Product</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Qty</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Passed/Failed</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Result</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map(item => (
                        <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30">
                          <td className="py-3 px-2 font-mono text-xs">{item.inspection_number}</td>
                          <td className="py-3 px-2 font-medium">{item.product_name}</td>
                          <td className="py-3 px-2">{item.quantity}</td>
                          <td className="py-3 px-2">
                            <span className="text-green-600">{item.passed}</span>
                            <span className="text-muted-foreground mx-1">/</span>
                            <span className="text-red-500">{item.failed}</span>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${resultColors[item.result] || resultColors.pending}`}>
                              {item.result}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground">{item.inspected_at ? new Date(item.inspected_at).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
            )}
          </div>

          <div>
            <DonutChartCard
              title="Inspection Results"
              data={donutData}
              dataKey="value"
              nameKey="name"
            />
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-background rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">New Inspection</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-muted rounded"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Batch Number *</label>
                <input type="text" required value={formData.batch_number} onChange={e => setFormData(p => ({ ...p, batch_number: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" placeholder="e.g. B-001234" />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Product Name *</label>
                <input type="text" required value={formData.product_name} onChange={e => setFormData(p => ({ ...p, product_name: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Quantity *</label>
                  <input type="number" required min={1} value={formData.quantity} onChange={e => setFormData(p => ({ ...p, quantity: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Priority</label>
                  <select value={formData.priority} onChange={e => setFormData(p => ({ ...p, priority: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Assignee</label>
                <input type="text" value={formData.assignee || ''} onChange={e => setFormData(p => ({ ...p, assignee: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" placeholder="Inspector name" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">Create Inspection</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowSubmitModal(null)}>
          <div className="bg-background rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Submit Inspection Results</h2>
              <button onClick={() => setShowSubmitModal(null)} className="p-1 hover:bg-muted rounded"><X className="w-5 h-5" /></button>
            </div>
            <div className="mb-4 p-3 bg-muted/50 rounded-lg text-sm">
              <p className="font-medium">{showSubmitModal.product_name}</p>
              <p className="text-muted-foreground">Batch: {showSubmitModal.batch_number} · Total: {showSubmitModal.quantity} units</p>
            </div>
            <form onSubmit={handleSubmitInspection} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Units Passed</label>
                  <input type="number" min={0} max={showSubmitModal.quantity} value={submitData.passed} onChange={e => setSubmitData(p => ({ ...p, passed: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Units Failed</label>
                  <input type="number" min={0} max={showSubmitModal.quantity} value={submitData.failed} onChange={e => setSubmitData(p => ({ ...p, failed: parseInt(e.target.value) || 0 }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Final Result</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['passed', 'rework', 'rejected'] as const).map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setSubmitData(p => ({ ...p, result: r }))}
                      className={`py-2 rounded-lg text-sm font-medium capitalize border transition-colors ${submitData.result === r ? (r === 'passed' ? 'bg-green-600 text-white border-green-600' : r === 'rejected' ? 'bg-red-600 text-white border-red-600' : 'bg-orange-500 text-white border-orange-500') : 'border-border hover:bg-muted'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Defect Type</label>
                <input type="text" value={submitData.defect_type || ''} onChange={e => setSubmitData(p => ({ ...p, defect_type: e.target.value }))} className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none" placeholder="e.g. Surface cracks, dimensional" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowSubmitModal(null)} className="flex-1 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">Submit Results</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
