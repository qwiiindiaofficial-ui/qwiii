import { useState } from 'react';
import { Factory, Boxes, Clock, CircleCheck as CheckCircle2, TriangleAlert as AlertTriangle, Play, Pause, Plus, X, Settings, ChevronLeft, ChevronRight } from 'lucide-react';

import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import BarChartCard from '@/components/charts/BarChartCard';
import { useProduction, CreateBatchInput, ProductionBatch } from '@/hooks/useProduction';

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-green-100 text-green-700',
  paused: 'bg-gray-100 text-gray-600',
  cancelled: 'bg-red-100 text-red-700',
};

const priorityColors: Record<string, string> = {
  low: 'bg-gray-100 text-gray-600',
  medium: 'bg-blue-100 text-blue-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const machineStatusColors: Record<string, string> = {
  running: 'text-green-600',
  idle: 'text-gray-500',
  maintenance: 'text-orange-500',
  offline: 'text-red-500',
};

export default function Production() {
  const { batches, machines, loading, stats, createBatch, updateBatch, updateMachineStatus } = useProduction();
  const [activeTab, setActiveTab] = useState<'batches' | 'machines'>('batches');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<ProductionBatch | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [formData, setFormData] = useState<CreateBatchInput>({
    product_name: '',
    quantity: 0,
    priority: 'medium',
    start_date: '',
    end_date: '',
    notes: '',
  });

  const filteredBatches = batches.filter(b => {
    const matchSearch = b.product_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.batch_number.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredBatches.length / 10));
  const paginatedBatches = filteredBatches.slice((currentPage - 1) * 10, currentPage * 10);

  const handleSearchChange = (val: string) => { setSearchQuery(val); setCurrentPage(1); };
  const handleStatusFilterChange = (val: string) => { setStatusFilter(val); setCurrentPage(1); };

  const efficiencyData = machines.map(m => ({ name: m.name, value: m.efficiency }));

  const batchStatusData = [
    { name: 'Scheduled', value: stats.scheduledBatches },
    { name: 'In Progress', value: stats.activeBatches },
    { name: 'Completed', value: stats.completedBatches },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createBatch(formData);
    if (result) {
      setShowAddModal(false);
      setFormData({ product_name: '', quantity: 0, priority: 'medium', start_date: '', end_date: '', notes: '' });
    }
  };

  const handleStatusChange = async (batchId: string, newStatus: string) => {
    await updateBatch(batchId, { status: newStatus });
    if (selectedBatch?.id === batchId) {
      setSelectedBatch(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="page-title">Production Planning</h1>
            <p className="page-subtitle">Manage production batches and machine operations</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Batch
          </button>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Active Batches" value={stats.activeBatches} icon={<Factory className="w-5 h-5" />} trend={0} />
          <MetricCard title="Scheduled" value={stats.scheduledBatches} icon={<Clock className="w-5 h-5" />} trend={0} />
          <MetricCard title="Completed" value={stats.completedBatches} icon={<CheckCircle2 className="w-5 h-5" />} trend={0} />
          <MetricCard title="Running Machines" value={stats.runningMachines} icon={<Settings className="w-5 h-5" />} trend={0} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarChartCard
            title="Machine Efficiency (%)"
            data={efficiencyData}
            dataKey="value"
            nameKey="name"
          />
          <BarChartCard
            title="Batch Status Overview"
            data={batchStatusData}
            dataKey="value"
            nameKey="name"
          />
        </div>

        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setActiveTab('batches')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'batches' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Production Batches
            </button>
            <button
              onClick={() => setActiveTab('machines')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'machines' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Machines ({machines.length})
            </button>
          </div>

          {activeTab === 'batches' && (
            <>
              <div className="flex gap-3 mb-4">
                <input
                  type="text"
                  placeholder="Search batches..."
                  value={searchQuery}
                  onChange={e => handleSearchChange(e.target.value)}
                  className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <select
                  value={statusFilter}
                  onChange={e => handleStatusFilterChange(e.target.value)}
                  className="px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none"
                >
                  <option value="all">All Status</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="paused">Paused</option>
                </select>
              </div>

              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading batches...</div>
              ) : filteredBatches.length === 0 ? (
                <div className="text-center py-12">
                  <Boxes className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No production batches found</p>
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="mt-3 text-sm text-primary hover:underline"
                  >
                    Schedule your first batch
                  </button>
                </div>
              ) : (
                <>
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                  <span>{filteredBatches.length} batch{filteredBatches.length !== 1 ? 'es' : ''}</span>
                  <span>Page {currentPage} of {totalPages}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Batch #</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Product</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Qty / Done</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Priority</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Status</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Start Date</th>
                        <th className="text-left py-3 px-2 text-muted-foreground font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedBatches.map(batch => (
                        <tr key={batch.id} className="border-b border-border/50 hover:bg-muted/30 cursor-pointer" onClick={() => setSelectedBatch(batch)}>
                          <td className="py-3 px-2 font-mono text-xs">{batch.batch_number}</td>
                          <td className="py-3 px-2 font-medium">{batch.product_name}</td>
                          <td className="py-3 px-2">
                            <div className="flex items-center gap-2">
                              <span>{batch.completed}/{batch.quantity}</span>
                              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-primary rounded-full"
                                  style={{ width: `${batch.quantity > 0 ? (batch.completed / batch.quantity) * 100 : 0}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${priorityColors[batch.priority] || priorityColors.medium}`}>
                              {batch.priority}
                            </span>
                          </td>
                          <td className="py-3 px-2">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[batch.status] || statusColors.scheduled}`}>
                              {batch.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-2 text-muted-foreground">{batch.start_date || '-'}</td>
                          <td className="py-3 px-2" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center gap-1">
                              {batch.status === 'scheduled' && (
                                <button
                                  onClick={() => handleStatusChange(batch.id, 'in_progress')}
                                  className="p-1 hover:bg-green-100 rounded text-green-600"
                                  title="Start"
                                >
                                  <Play className="w-3.5 h-3.5" />
                                </button>
                              )}
                              {batch.status === 'in_progress' && (
                                <>
                                  <button
                                    onClick={() => handleStatusChange(batch.id, 'paused')}
                                    className="p-1 hover:bg-yellow-100 rounded text-yellow-600"
                                    title="Pause"
                                  >
                                    <Pause className="w-3.5 h-3.5" />
                                  </button>
                                  <button
                                    onClick={() => handleStatusChange(batch.id, 'completed')}
                                    className="p-1 hover:bg-green-100 rounded text-green-600"
                                    title="Complete"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                  </button>
                                </>
                              )}
                              {batch.status === 'paused' && (
                                <button
                                  onClick={() => handleStatusChange(batch.id, 'in_progress')}
                                  className="p-1 hover:bg-green-100 rounded text-green-600"
                                  title="Resume"
                                >
                                  <Play className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-border/50">
                    <button
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setCurrentPage(p)}
                        className={`w-8 h-8 text-xs rounded-lg border transition-colors ${p === currentPage ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      className="p-1.5 rounded-lg border border-border hover:bg-muted disabled:opacity-40 transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
                </>
              )}
            </>
          )}

          {activeTab === 'machines' && (
            <>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">Loading machines...</div>
              ) : machines.length === 0 ? (
                <div className="text-center py-12">
                  <Factory className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No machines configured</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {machines.map(machine => (
                    <div key={machine.id} className="p-4 border border-border rounded-lg hover:border-primary/50 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="font-medium text-sm">{machine.name}</p>
                          <p className="text-xs text-muted-foreground font-mono">{machine.machine_id}</p>
                        </div>
                        <span className={`text-xs font-medium ${machineStatusColors[machine.status] || 'text-muted-foreground'}`}>
                          {machine.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Efficiency</span>
                          <span className="font-medium">{machine.efficiency}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${machine.efficiency}%` }} />
                        </div>
                        {machine.operator && (
                          <p className="text-xs text-muted-foreground">Operator: {machine.operator}</p>
                        )}
                      </div>
                      <div className="flex gap-2 mt-3">
                        {machine.status !== 'running' && (
                          <button
                            onClick={() => updateMachineStatus(machine.id, 'running')}
                            className="flex-1 py-1.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                          >
                            Set Running
                          </button>
                        )}
                        {machine.status !== 'idle' && (
                          <button
                            onClick={() => updateMachineStatus(machine.id, 'idle')}
                            className="flex-1 py-1.5 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                          >
                            Set Idle
                          </button>
                        )}
                        {machine.status !== 'maintenance' && (
                          <button
                            onClick={() => updateMachineStatus(machine.id, 'maintenance')}
                            className="flex-1 py-1.5 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition-colors"
                          >
                            Maintenance
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {selectedBatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedBatch(null)}>
          <div className="bg-background rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Batch Details</h2>
              <button onClick={() => setSelectedBatch(null)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Batch #</span>
                <span className="font-mono text-sm">{selectedBatch.batch_number}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Product</span>
                <span className="text-sm font-medium">{selectedBatch.product_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Progress</span>
                <span className="text-sm">{selectedBatch.completed} / {selectedBatch.quantity}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Status</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${statusColors[selectedBatch.status]}`}>
                  {selectedBatch.status.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Priority</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[selectedBatch.priority]}`}>
                  {selectedBatch.priority}
                </span>
              </div>
              {selectedBatch.start_date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Start Date</span>
                  <span className="text-sm">{selectedBatch.start_date}</span>
                </div>
              )}
              {selectedBatch.end_date && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">End Date</span>
                  <span className="text-sm">{selectedBatch.end_date}</span>
                </div>
              )}
              {selectedBatch.notes && (
                <div>
                  <span className="text-muted-foreground text-sm block mb-1">Notes</span>
                  <p className="text-sm bg-muted/50 rounded p-2">{selectedBatch.notes}</p>
                </div>
              )}
            </div>
            <div className="mt-4 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Update Status</p>
              <div className="flex flex-wrap gap-2">
                {['scheduled', 'in_progress', 'paused', 'completed', 'cancelled'].map(s => (
                  <button
                    key={s}
                    onClick={() => handleStatusChange(selectedBatch.id, s)}
                    className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${selectedBatch.status === s ? 'bg-primary text-primary-foreground border-primary' : 'border-border hover:bg-muted'}`}
                  >
                    {s.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-background rounded-xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Schedule New Batch</h2>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-muted rounded">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium block mb-1">Product Name *</label>
                <input
                  type="text"
                  required
                  value={formData.product_name}
                  onChange={e => setFormData(p => ({ ...p, product_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="e.g. Steel Rods 10mm"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Quantity *</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.quantity}
                  onChange={e => setFormData(p => ({ ...p, quantity: parseInt(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData(p => ({ ...p, priority: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium block mb-1">Start Date</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={e => setFormData(p => ({ ...p, start_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">End Date</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={e => setFormData(p => ({ ...p, end_date: e.target.value }))}
                    className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={e => setFormData(p => ({ ...p, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-border rounded-lg text-sm focus:outline-none resize-none"
                  placeholder="Additional notes..."
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-2 border border-border rounded-lg text-sm hover:bg-muted transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90 transition-colors">
                  Schedule Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
