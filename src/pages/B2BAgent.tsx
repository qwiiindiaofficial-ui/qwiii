import { Bot, UserCheck, FileText, Mail, CreditCard, TrendingUp, ArrowRight, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import BarChartCard from '@/components/charts/BarChartCard';
import DonutChartCard from '@/components/charts/DonutChartCard';
import AnimatedCounter from '@/components/ai/AnimatedCounter';

const pipelineData = [
  { name: 'Leads', value: 124 },
  { name: 'Qualified', value: 89 },
  { name: 'Quoted', value: 67 },
  { name: 'Negotiation', value: 34 },
  { name: 'Closed', value: 28 },
];

const dealStages = [
  { name: 'New Leads', value: 35 },
  { name: 'In Progress', value: 42 },
  { name: 'Won', value: 18 },
  { name: 'Lost', value: 5 },
];

const recentDeals = [
  { name: 'Sharma Textiles', value: '₹8.5L', stage: 'Quoted', status: 'active' },
  { name: 'Delhi Emporium', value: '₹12.2L', stage: 'Negotiation', status: 'hot' },
  { name: 'Gujarat Traders', value: '₹5.8L', stage: 'Follow-up', status: 'active' },
  { name: 'Royal Fabrics', value: '₹15.0L', stage: 'Closing', status: 'hot' },
  { name: 'Sunrise Retail', value: '₹3.2L', stage: 'New Lead', status: 'new' },
];

const automations = [
  { title: 'Lead Scoring', desc: 'Automatically qualify & rank new leads', count: 124, icon: UserCheck },
  { title: 'Auto Quotations', desc: 'Generate quotes based on buyer history', count: 67, icon: FileText },
  { title: 'Email Campaigns', desc: 'Personalized follow-up sequences', count: 892, icon: Mail },
  { title: 'Payment Reminders', desc: 'Automated collection notifications', count: 45, icon: CreditCard },
];

const B2BAgent = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="page-header">
          <h1 className="page-title">B2B AI AGENT</h1>
          <p className="page-subtitle">Virtual sales executive • Lead-to-payment automation</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Pipeline Value"
            value="₹45.2L"
            change="+18%"
            changeType="positive"
            icon={<TrendingUp size={16} />}
          />
          <MetricCard
            title="Active Deals"
            value={<AnimatedCounter value={42} duration={1500} />}
            icon={<FileText size={16} />}
          />
          <MetricCard
            title="Automation Rate"
            value="82%"
            change="+5%"
            changeType="positive"
            icon={<Bot size={16} />}
          />
          <MetricCard
            title="Conversion"
            value="28%"
            change="+4%"
            changeType="positive"
            icon={<CheckCircle2 size={16} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Pipeline Funnel */}
          <BarChartCard
            data={pipelineData}
            title="Sales Pipeline"
            subtitle="Deals by stage"
            height={280}
            horizontal
          />

          {/* Deal Distribution */}
          <DonutChartCard
            data={dealStages}
            title="Deal Status"
            subtitle="Current distribution"
            centerValue="42"
            centerLabel="Active"
            height={180}
          />

          {/* Recent Deals */}
          <div className="glass-card p-4">
            <h3 className="section-title">
              <TrendingUp size={14} className="text-primary" />
              Hot Deals
            </h3>
            <div className="space-y-3 mt-3">
              {recentDeals.map((deal, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border border-border/50">
                  <div className={`w-2 h-2 rounded-full ${
                    deal.status === 'hot' ? 'bg-destructive animate-pulse' :
                    deal.status === 'new' ? 'bg-accent' : 'bg-primary'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{deal.name}</p>
                    <p className="text-xs text-muted-foreground">{deal.stage}</p>
                  </div>
                  <p className="text-sm font-bold text-accent">{deal.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Automation Cards */}
        <div className="glass-card p-4">
          <h3 className="section-title">
            <Bot size={14} className="text-primary" />
            AI Automations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {automations.map((auto, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:border-primary/30 transition-colors">
                <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                  <auto.icon size={20} className="text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">{auto.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{auto.desc}</p>
                <p className="text-lg font-bold text-accent mt-2">{auto.count}</p>
                <p className="text-xs text-muted-foreground">actions this month</p>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow */}
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
      </div>
    </DashboardLayout>
  );
};

export default B2BAgent;
