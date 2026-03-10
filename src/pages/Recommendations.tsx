import { useState } from 'react';
import { Target, ShoppingBag, Repeat, TrendingUp, RefreshCw, ArrowUpRight, Clock, Zap, Users, IndianRupee, Star } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import NeuralNetwork from '@/components/ai/NeuralNetwork';
import AIBadge from '@/components/ai/AIBadge';
import AIAvatar from '@/components/ai/AIAvatar';
import MetricCard from '@/components/charts/MetricCard';
import { useRecommendations } from '@/hooks/useRecommendations';
import { format, parseISO } from 'date-fns';

const fmtCurrency = (n: number) => {
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n}`;
};

const priorityColor = {
  high: 'bg-destructive/20 text-destructive border-destructive/30',
  medium: 'bg-warning/20 text-warning border-warning/30',
  low: 'bg-muted/50 text-muted-foreground border-border',
};

type Tab = 'cross-sell' | 'repeat';

const Recommendations = () => {
  const { crossSell, repeatOrders, stats, loading, refresh } = useRecommendations();
  const [activeTab, setActiveTab] = useState<Tab>('cross-sell');

  return (
    <DashboardLayout>
      <div className="relative min-h-full">
        <NeuralNetwork className="opacity-10" nodeCount={25} />
        <div className="relative z-10 p-6 space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <AIBadge variant="powered" size="md" />
              <h1 className="text-3xl font-bold gradient-text">Product Recommendations</h1>
              <p className="text-muted-foreground max-w-xl text-sm">
                AI-powered cross-sell suggestions and repeat order predictions based on your actual client purchase history.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={refresh}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all"
              >
                <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
              </button>
              <AIAvatar size="md" />
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Cross-Sell Opps"
              value={String(stats.totalCrossSell)}
              icon={<ShoppingBag size={16} />}
              subtitle="clients to target"
            />
            <MetricCard
              title="Repeat Orders"
              value={String(stats.totalRepeatOrder)}
              icon={<Repeat size={16} />}
              subtitle="due / overdue"
            />
            <MetricCard
              title="Revenue Potential"
              value={fmtCurrency(stats.estimatedRevenuePotential)}
              icon={<IndianRupee size={16} />}
              subtitle="estimated"
            />
            <MetricCard
              title="High Priority"
              value={String(stats.highPriorityCount)}
              icon={<Star size={16} />}
              subtitle="urgent actions"
            />
          </div>

          <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 w-fit">
            {[
              { id: 'cross-sell', label: 'Cross-Sell', icon: ShoppingBag },
              { id: 'repeat', label: 'Repeat Orders', icon: Repeat },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as Tab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <tab.icon size={14} />
                {tab.label}
                <span className="ml-1 px-1.5 py-0.5 text-xs rounded-full bg-primary/20 text-primary">
                  {tab.id === 'cross-sell' ? stats.totalCrossSell : stats.totalRepeatOrder}
                </span>
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24">
              <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          ) : (
            <>
              {activeTab === 'cross-sell' && (
                <div className="space-y-4">
                  {crossSell.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                      <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Recommendations Yet</h3>
                      <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Add clients and create invoices with line items to get AI-powered cross-sell recommendations.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {crossSell.map((rec, i) => (
                        <div key={rec.clientId} className="glass-card p-5 hover:border-primary/30 transition-colors">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                                {rec.clientName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">{rec.clientName}</p>
                                <p className="text-xs text-muted-foreground">{rec.company}</p>
                              </div>
                            </div>
                            <span className={`px-2 py-0.5 text-xs rounded-full border ${priorityColor[rec.priority]}`}>
                              {rec.priority}
                            </span>
                          </div>

                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1">Already purchased:</p>
                            <div className="flex flex-wrap gap-1">
                              {rec.boughtProducts.map((p, j) => (
                                <span key={j} className="px-2 py-0.5 text-xs rounded-full bg-muted/50 text-muted-foreground">
                                  {p.length > 25 ? p.slice(0, 25) + '…' : p}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                              <Zap size={10} className="text-primary" />
                              Suggest offering:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {rec.suggestedProducts.map((p, j) => (
                                <span key={j} className="px-2 py-0.5 text-xs rounded-full bg-primary/20 text-primary border border-primary/30">
                                  {p}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-3 border-t border-border/50">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock size={12} />
                              {rec.lastOrderDate ? format(parseISO(rec.lastOrderDate), 'dd MMM yyyy') : 'No date'}
                            </div>
                            <div className="flex items-center gap-1 text-sm font-bold text-accent">
                              <TrendingUp size={14} />
                              {fmtCurrency(rec.estimatedValue)} potential
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{rec.reason}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'repeat' && (
                <div className="space-y-4">
                  {repeatOrders.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                      <Repeat className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-foreground mb-2">No Repeat Order Predictions Yet</h3>
                      <p className="text-muted-foreground text-sm max-w-md mx-auto">
                        Repeat order predictions appear when clients have 2+ invoices, allowing us to detect ordering patterns.
                      </p>
                    </div>
                  ) : (
                    <div className="glass-card">
                      <div className="p-4 border-b border-border">
                        <h3 className="section-title mb-0">
                          <Repeat size={14} className="text-primary" />
                          Clients Due for Reorder
                        </h3>
                      </div>
                      <div className="divide-y divide-border/50">
                        {repeatOrders.map((rec) => (
                          <div key={rec.clientId} className="p-4 hover:bg-muted/20 transition-colors">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                                {rec.clientName.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="text-sm font-semibold text-foreground">{rec.clientName}</p>
                                  {rec.overdueBy > 14 && (
                                    <span className="px-1.5 py-0.5 text-xs rounded-full bg-destructive/20 text-destructive">Overdue</span>
                                  )}
                                  {rec.overdueBy >= 0 && rec.overdueBy <= 14 && (
                                    <span className="px-1.5 py-0.5 text-xs rounded-full bg-warning/20 text-warning">Due Now</span>
                                  )}
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{rec.product.length > 40 ? rec.product.slice(0, 40) + '…' : rec.product}</p>
                              </div>
                              <div className="text-right shrink-0">
                                <p className="text-sm font-bold text-accent">{fmtCurrency(rec.estimatedValue)}</p>
                                <p className="text-xs text-muted-foreground">
                                  Every ~{rec.avgFrequencyDays}d · {rec.daysSinceLast}d ago
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Recommendations;
