import { Bot, UserCheck, FileText, Mail, CreditCard, TrendingUp, ArrowRight, CircleCheck as CheckCircle2, RefreshCw } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import BarChartCard from '@/components/charts/BarChartCard';
import DonutChartCard from '@/components/charts/DonutChartCard';
import AnimatedCounter from '@/components/ai/AnimatedCounter';
import { useB2BAgent } from '@/hooks/useB2BAgent';

const fmtCurrency = (n: number) => {
  if (n >= 10000000) return `₹${(n / 10000000).toFixed(1)}Cr`;
  if (n >= 100000) return `₹${(n / 100000).toFixed(1)}L`;
  if (n >= 1000) return `₹${(n / 1000).toFixed(0)}K`;
  return `₹${n.toFixed(0)}`;
};

const automationIcons = [UserCheck, FileText, Mail, CreditCard];

const B2BAgent = () => {
  const { data, loading, refresh } = useB2BAgent();

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="page-header mb-0">
            <h1 className="page-title">B2B AI AGENT</h1>
            <p className="page-subtitle">Virtual sales executive • Lead-to-payment automation</p>
          </div>
          <button
            onClick={refresh}
            className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground transition-all"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Pipeline Value"
                value={fmtCurrency(data?.metrics.pipelineValue || 0)}
                icon={<TrendingUp size={16} />}
                subtitle="leads + quotes"
              />
              <MetricCard
                title="Active Deals"
                value={<AnimatedCounter value={data?.metrics.activeDeals || 0} duration={1500} />}
                icon={<FileText size={16} />}
                subtitle="in progress"
              />
              <MetricCard
                title="Conversion Rate"
                value={`${(data?.metrics.conversionRate || 0).toFixed(1)}%`}
                icon={<Bot size={16} />}
                subtitle={`${data?.metrics.wonDeals || 0} won deals`}
              />
              <MetricCard
                title="Total Leads"
                value={<AnimatedCounter value={data?.metrics.totalLeads || 0} duration={1500} />}
                icon={<CheckCircle2 size={16} />}
                subtitle={`${data?.metrics.qualifiedLeads || 0} qualified`}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <BarChartCard
                data={data?.pipelineData || []}
                title="Sales Pipeline"
                subtitle="Deals by stage"
                height={280}
                horizontal
              />

              <DonutChartCard
                data={data?.dealStages?.filter(d => d.value > 0) || [{ name: 'No data', value: 1 }]}
                title="Deal Status"
                subtitle="Current distribution"
                centerValue={String(data?.metrics.activeDeals || 0)}
                centerLabel="Active"
                height={180}
              />

              <div className="glass-card p-4">
                <h3 className="section-title">
                  <TrendingUp size={14} className="text-primary" />
                  Hot Deals
                </h3>
                <div className="space-y-3 mt-3">
                  {(data?.recentDeals || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">No active deals yet</p>
                  ) : (
                    (data?.recentDeals || []).map((deal, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border border-border/50">
                        <div className={`w-2 h-2 rounded-full ${
                          deal.status === 'hot' ? 'bg-destructive animate-pulse' :
                          deal.status === 'new' ? 'bg-accent' : 'bg-primary'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">{deal.name}</p>
                          <p className="text-xs text-muted-foreground">{deal.stage}</p>
                        </div>
                        <p className="text-sm font-bold text-accent shrink-0">{deal.value}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="section-title">
                <Bot size={14} className="text-primary" />
                Activity Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
                {(data?.automationStats || []).map((auto, i) => {
                  const Icon = automationIcons[i] || Bot;
                  return (
                    <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                      <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                        <Icon size={20} className="text-primary" />
                      </div>
                      <p className="text-sm font-medium text-foreground">{auto.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{auto.desc}</p>
                      <p className="text-lg font-bold text-accent mt-2">{auto.count}</p>
                      <p className="text-xs text-muted-foreground">total records</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="section-title">
                <ArrowRight size={14} className="text-primary" />
                Automated Workflow
              </h3>
              <div className="flex items-center justify-between mt-4 overflow-x-auto pb-2">
                {[
                  { icon: UserCheck, title: 'Lead Capture', desc: 'Auto-qualify' },
                  { icon: FileText, title: 'Quote Gen', desc: 'AI pricing' },
                  { icon: Mail, title: 'Follow-up', desc: 'Email/WhatsApp' },
                  { icon: FileText, title: 'Agreement', desc: 'E-signature' },
                  { icon: CreditCard, title: 'Invoice', desc: 'Auto-generate' },
                  { icon: CheckCircle2, title: 'Collection', desc: 'Reminders' },
                ].map((step, i, arr) => (
                  <div key={i} className="flex items-center">
                    <div className="text-center px-4">
                      <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-2">
                        <step.icon size={20} className="text-primary" />
                      </div>
                      <p className="text-xs font-medium text-foreground whitespace-nowrap">{step.title}</p>
                      <p className="text-xs text-muted-foreground">{step.desc}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <ArrowRight size={20} className="text-border mx-2 shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default B2BAgent;
