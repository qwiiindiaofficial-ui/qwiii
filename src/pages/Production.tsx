import { useState } from 'react';
import { Factory, Boxes, Clock, TrendingUp, Calendar, Users, Settings, Play, Pause, CheckCircle2, AlertTriangle, RotateCcw, Zap, Target } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import BarChartCard from '@/components/charts/BarChartCard';
import LineChartCard from '@/components/charts/LineChartCard';
import ProgressRing from '@/components/charts/ProgressRing';
import AnimatedCounter from '@/components/ai/AnimatedCounter';

const productionData = [
  { name: 'Mon', planned: 450, actual: 420 },
  { name: 'Tue', planned: 480, actual: 510 },
  { name: 'Wed', planned: 520, actual: 490 },
  { name: 'Thu', planned: 490, actual: 530 },
  { name: 'Fri', planned: 510, actual: 480 },
];

const categoryData = [
  { name: 'Sarees', value: 4200 },
  { name: 'Lehengas', value: 3100 },
  { name: 'Kurtas', value: 2800 },
  { name: 'Suits', value: 1900 },
];

const machines = [
  { id: 'M-001', name: 'Weaving Loom A', status: 'running', efficiency: 94, currentBatch: 'B-4521', progress: 67, operator: 'Ramesh K.' },
  { id: 'M-002', name: 'Weaving Loom B', status: 'running', efficiency: 88, currentBatch: 'B-4522', progress: 45, operator: 'Suresh P.' },
  { id: 'M-003', name: 'Embroidery Unit', status: 'maintenance', efficiency: 0, currentBatch: '-', progress: 0, operator: 'Under Repair' },
  { id: 'M-004', name: 'Cutting Station', status: 'idle', efficiency: 0, currentBatch: '-', progress: 0, operator: 'Waiting' },
  { id: 'M-005', name: 'Finishing Unit', status: 'running', efficiency: 91, currentBatch: 'B-4520', progress: 89, operator: 'Priya M.' },
];

const activeBatches = [
  { id: 'B-4521', product: 'Banarasi Silk Saree', quantity: 100, completed: 67, startTime: '08:00 AM', eta: '04:30 PM', priority: 'high' },
  { id: 'B-4522', product: 'Designer Lehenga', quantity: 50, completed: 22, startTime: '09:30 AM', eta: '06:00 PM', priority: 'medium' },
  { id: 'B-4520', product: 'Cotton Kurta', quantity: 200, completed: 178, startTime: '06:00 AM', eta: '02:00 PM', priority: 'normal' },
];

const shifts = [
  { name: 'Morning Shift', time: '6:00 AM - 2:00 PM', workers: 45, status: 'active' },
  { name: 'Afternoon Shift', time: '2:00 PM - 10:00 PM', workers: 38, status: 'upcoming' },
  { name: 'Night Shift', time: '10:00 PM - 6:00 AM', workers: 22, status: 'inactive' },
];

const workers = [
  { name: 'Ramesh Kumar', role: 'Senior Operator', efficiency: 98, tasksCompleted: 24, status: 'active' },
  { name: 'Priya Sharma', role: 'Quality Inspector', efficiency: 95, tasksCompleted: 18, status: 'active' },
  { name: 'Suresh Patel', role: 'Machine Operator', efficiency: 88, tasksCompleted: 21, status: 'break' },
  { name: 'Meera Singh', role: 'Finishing Expert', efficiency: 92, tasksCompleted: 19, status: 'active' },
];

type ViewTab = 'overview' | 'machines' | 'batches' | 'workforce';

const Production = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">PRODUCTION PLANNING</h1>
            <p className="page-subtitle">AI-optimized scheduling • Real-time tracking</p>
          </div>
          
          <div className="flex items-center gap-3">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
            />
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90">
              <Calendar size={16} />
              Schedule Batch
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: Factory },
            { id: 'machines', label: 'Machines', icon: Settings },
            { id: 'batches', label: 'Batches', icon: Boxes },
            { id: 'workforce', label: 'Workforce', icon: Users },
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

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Today's Target"
            value={<AnimatedCounter value={520} duration={1500} />}
            icon={<Target size={16} />}
            subtitle="units planned"
          />
          <MetricCard
            title="Completed"
            value={<AnimatedCounter value={487} duration={1500} />}
            change="93.7%"
            changeType="positive"
            icon={<CheckCircle2 size={16} />}
            subtitle="of target"
          />
          <MetricCard
            title="Efficiency"
            value="96.2%"
            change="+2.1%"
            changeType="positive"
            icon={<TrendingUp size={16} />}
            subtitle="vs yesterday"
          />
          <MetricCard
            title="Next Batch"
            value="2h 15m"
            icon={<Clock size={16} />}
            subtitle="B-4523 starting"
          />
        </div>

        {/* Conditional Content Based on Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <LineChartCard
                data={productionData}
                lines={[
                  { key: 'planned', color: 'hsl(var(--chart-1))', name: 'Planned' },
                  { key: 'actual', color: 'hsl(var(--accent))', name: 'Actual' },
                ]}
                title="Weekly Production"
                subtitle="Planned vs Actual"
                height={280}
                showLegend
              />
              <BarChartCard
                data={categoryData}
                title="Production by Category"
                subtitle="Units this week"
                height={280}
              />
            </div>

            {/* Active Batches Summary */}
            <div className="glass-card p-4">
              <h3 className="section-title">
                <Zap size={14} className="text-primary" />
                Active Production Lines
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {activeBatches.map((batch) => (
                  <div key={batch.id} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono text-muted-foreground">{batch.id}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        batch.priority === 'high' ? 'bg-destructive/20 text-destructive' :
                        batch.priority === 'medium' ? 'bg-warning/20 text-warning' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {batch.priority}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-foreground mb-2">{batch.product}</p>
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>{batch.completed}/{batch.quantity} units</span>
                        <span>{Math.round((batch.completed / batch.quantity) * 100)}%</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full transition-all"
                          style={{ width: `${(batch.completed / batch.quantity) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Started: {batch.startTime}</span>
                      <span>ETA: {batch.eta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {activeTab === 'machines' && (
          <div className="glass-card">
            <div className="p-4 border-b border-border">
              <h3 className="section-title mb-0">
                <Settings size={14} className="text-primary" />
                Machine Status Dashboard
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Machine</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Efficiency</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Current Batch</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Progress</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Operator</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((machine) => (
                    <tr key={machine.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-3">
                        <div>
                          <p className="text-sm font-medium text-foreground">{machine.name}</p>
                          <p className="text-xs text-muted-foreground">{machine.id}</p>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                          machine.status === 'running' ? 'bg-accent/20 text-accent' :
                          machine.status === 'maintenance' ? 'bg-warning/20 text-warning' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {machine.status === 'running' ? <Play size={10} /> :
                           machine.status === 'maintenance' ? <AlertTriangle size={10} /> :
                           <Pause size={10} />}
                          {machine.status}
                        </span>
                      </td>
                      <td className="p-3">
                        {machine.efficiency > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${machine.efficiency >= 90 ? 'bg-accent' : machine.efficiency >= 80 ? 'bg-warning' : 'bg-destructive'}`}
                                style={{ width: `${machine.efficiency}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium">{machine.efficiency}%</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-3 text-sm font-mono text-foreground">{machine.currentBatch}</td>
                      <td className="p-3">
                        {machine.progress > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary rounded-full"
                                style={{ width: `${machine.progress}%` }}
                              />
                            </div>
                            <span className="text-sm">{machine.progress}%</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{machine.operator}</td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          {machine.status === 'running' ? (
                            <button className="p-1.5 rounded hover:bg-muted" title="Pause">
                              <Pause size={14} className="text-muted-foreground" />
                            </button>
                          ) : (
                            <button className="p-1.5 rounded hover:bg-muted" title="Start">
                              <Play size={14} className="text-accent" />
                            </button>
                          )}
                          <button className="p-1.5 rounded hover:bg-muted" title="Reset">
                            <RotateCcw size={14} className="text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'batches' && (
          <div className="space-y-6">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0">
                  <Boxes size={14} className="text-primary" />
                  Production Queue
                </h3>
                <button className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-lg">
                  Add Batch
                </button>
              </div>
              <div className="space-y-3">
                {activeBatches.map((batch, i) => (
                  <div key={batch.id} className="flex items-center gap-4 p-4 rounded-lg bg-muted/30 border border-border/50">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-lg font-bold text-primary">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-foreground">{batch.product}</p>
                        <span className="text-xs font-mono text-muted-foreground">{batch.id}</span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{batch.quantity} units</span>
                        <span>•</span>
                        <span>Started: {batch.startTime}</span>
                        <span>•</span>
                        <span>ETA: {batch.eta}</span>
                      </div>
                    </div>
                    <div className="w-32">
                      <ProgressRing 
                        value={Math.round((batch.completed / batch.quantity) * 100)} 
                        label={`${Math.round((batch.completed / batch.quantity) * 100)}%`}
                        size={60}
                        strokeWidth={4}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 rounded-lg hover:bg-muted">
                        <Pause size={16} className="text-muted-foreground" />
                      </button>
                      <button className="p-2 rounded-lg hover:bg-muted">
                        <Settings size={16} className="text-muted-foreground" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'workforce' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Shifts */}
            <div className="glass-card p-4">
              <h3 className="section-title">
                <Clock size={14} className="text-primary" />
                Shift Schedule
              </h3>
              <div className="space-y-3 mt-4">
                {shifts.map((shift, i) => (
                  <div key={i} className={`flex items-center gap-4 p-4 rounded-lg border ${
                    shift.status === 'active' ? 'bg-accent/10 border-accent/30' :
                    shift.status === 'upcoming' ? 'bg-warning/10 border-warning/30' :
                    'bg-muted/30 border-border'
                  }`}>
                    <div className={`w-3 h-3 rounded-full ${
                      shift.status === 'active' ? 'bg-accent animate-pulse' :
                      shift.status === 'upcoming' ? 'bg-warning' : 'bg-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{shift.name}</p>
                      <p className="text-xs text-muted-foreground">{shift.time}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{shift.workers}</p>
                      <p className="text-xs text-muted-foreground">workers</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workers */}
            <div className="glass-card p-4">
              <h3 className="section-title">
                <Users size={14} className="text-primary" />
                Top Performers Today
              </h3>
              <div className="space-y-3 mt-4">
                {workers.map((worker, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 border border-border/50">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-sm font-bold text-primary-foreground">
                      {worker.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{worker.name}</p>
                      <p className="text-xs text-muted-foreground">{worker.role}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-accent">{worker.efficiency}%</p>
                      <p className="text-xs text-muted-foreground">{worker.tasksCompleted} tasks</p>
                    </div>
                    <span className={`w-2 h-2 rounded-full ${
                      worker.status === 'active' ? 'bg-accent' :
                      worker.status === 'break' ? 'bg-warning' : 'bg-muted-foreground'
                    }`} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Production;