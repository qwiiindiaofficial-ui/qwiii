import { useState } from 'react';
import { Globe, TrendingUp, MapPin, DollarSign, Plus, Search, Target, Users, BarChart3, ArrowUpRight, ArrowDownRight, Filter, Eye, Edit2, Zap, Building2 } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import BarChartCard from '@/components/charts/BarChartCard';
import DonutChartCard from '@/components/charts/DonutChartCard';
import { toast } from '@/hooks/use-toast';

const marketData = [
  { name: 'North India', value: 4500 },
  { name: 'South India', value: 3800 },
  { name: 'West India', value: 3200 },
  { name: 'East India', value: 2100 },
  { name: 'Export', value: 1800 },
];

const channelData = [
  { name: 'Retail', value: 45 },
  { name: 'Wholesale', value: 35 },
  { name: 'Online', value: 15 },
  { name: 'Export', value: 5 },
];

const regions = [
  { id: 'R001', name: 'North India', cities: ['Delhi', 'Jaipur', 'Lucknow'], revenue: 4500000, buyers: 85, growth: 18.5, potential: 'high', marketShare: 32 },
  { id: 'R002', name: 'South India', cities: ['Chennai', 'Bangalore', 'Hyderabad'], revenue: 3800000, buyers: 72, growth: 22.3, potential: 'high', marketShare: 27 },
  { id: 'R003', name: 'West India', cities: ['Mumbai', 'Ahmedabad', 'Pune'], revenue: 3200000, buyers: 68, growth: 15.2, potential: 'medium', marketShare: 23 },
  { id: 'R004', name: 'East India', cities: ['Kolkata', 'Patna', 'Guwahati'], revenue: 2100000, buyers: 45, growth: 28.7, potential: 'high', marketShare: 15 },
  { id: 'R005', name: 'Export', cities: ['UAE', 'USA', 'UK'], revenue: 1800000, buyers: 18, growth: 35.4, potential: 'high', marketShare: 3 },
];

const competitors = [
  { name: 'Brand A', marketShare: 28, strength: 'Distribution Network', weakness: 'Premium Pricing' },
  { name: 'Brand B', marketShare: 22, strength: 'Online Presence', weakness: 'Limited Range' },
  { name: 'Brand C', marketShare: 15, strength: 'Value Pricing', weakness: 'Quality Issues' },
  { name: 'Our Brand', marketShare: 18, strength: 'Quality & Design', weakness: 'Distribution' },
];

const expansionOpportunities = [
  { city: 'Indore', state: 'Madhya Pradesh', population: '2.5M', potential: '₹15L/month', competition: 'Low', priority: 'high' },
  { city: 'Chandigarh', state: 'Punjab', population: '1.2M', potential: '₹12L/month', competition: 'Medium', priority: 'medium' },
  { city: 'Kochi', state: 'Kerala', population: '2.1M', potential: '₹18L/month', competition: 'Low', priority: 'high' },
];

type ViewTab = 'overview' | 'regions' | 'competitors' | 'expansion';

const Markets = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [showExpansionModal, setShowExpansionModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<typeof regions[0] | null>(null);
  const [expansionForm, setExpansionForm] = useState({
    city: '',
    state: '',
    budget: '',
    timeline: '3m',
    strategy: 'dealer'
  });

  const handlePlanExpansion = () => {
    toast({ title: "Expansion Plan Created", description: `Plan for ${expansionForm.city} has been created` });
    setShowExpansionModal(false);
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">MARKET INTELLIGENCE</h1>
            <p className="page-subtitle">Regional analytics • Competitor analysis • Expansion planning</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowExpansionModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90"
            >
              <Plus size={16} />
              Plan Expansion
            </button>
            <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:text-foreground">
              <Globe size={16} />
              Market Report
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Active Markets" value="12" icon={<Globe size={16} />} subtitle="regions" />
          <MetricCard title="Top Region" value="North" icon={<MapPin size={16} />} subtitle="by revenue" />
          <MetricCard title="Export Share" value="12%" change="+3%" changeType="positive" icon={<TrendingUp size={16} />} />
          <MetricCard title="Total Market" value="₹15.4Cr" icon={<DollarSign size={16} />} subtitle="annual" />
        </div>

        {/* View Tabs */}
        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 w-fit">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'regions', label: 'Regions', icon: MapPin },
            { id: 'competitors', label: 'Competitors', icon: Users },
            { id: 'expansion', label: 'Expansion', icon: Target },
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

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BarChartCard data={marketData} title="Regional Performance" subtitle="Sales by region (₹ in Thousands)" height={300} />
            </div>
            <DonutChartCard data={channelData} title="Channel Mix" centerValue="100%" centerLabel="Total" height={200} />
            
            <div className="lg:col-span-3 glass-card p-4">
              <h3 className="section-title"><Zap size={14} className="text-primary" /> Market Insights</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowUpRight size={16} className="text-accent" />
                    <span className="text-sm font-medium text-foreground">Fastest Growing</span>
                  </div>
                  <p className="text-2xl font-bold text-accent">East India</p>
                  <p className="text-xs text-muted-foreground">+28.7% YoY growth</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">Highest Potential</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">Export</p>
                  <p className="text-xs text-muted-foreground">Untapped international markets</p>
                </div>
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={16} className="text-warning" />
                    <span className="text-sm font-medium text-foreground">Market Opportunity</span>
                  </div>
                  <p className="text-2xl font-bold text-warning">Tier 2 Cities</p>
                  <p className="text-xs text-muted-foreground">15+ cities identified</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'regions' && (
          <div className="glass-card">
            <div className="p-4 border-b border-border">
              <h3 className="section-title mb-0"><MapPin size={14} className="text-primary" /> Regional Analysis</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/30">
                  <tr>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Region</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Key Cities</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Revenue</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Buyers</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Growth</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Market Share</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Potential</th>
                    <th className="p-3 text-left text-xs font-semibold text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {regions.map((region) => (
                    <tr key={region.id} className="border-b border-border/50 hover:bg-muted/20">
                      <td className="p-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                            <MapPin size={18} className="text-primary" />
                          </div>
                          <span className="text-sm font-medium text-foreground">{region.name}</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{region.cities.join(', ')}</td>
                      <td className="p-3 text-sm font-medium text-foreground">₹{(region.revenue / 100000).toFixed(1)}L</td>
                      <td className="p-3 text-sm text-foreground">{region.buyers}</td>
                      <td className="p-3">
                        <span className="flex items-center gap-1 text-sm font-medium text-accent">
                          <ArrowUpRight size={14} />
                          +{region.growth}%
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${region.marketShare}%` }} />
                          </div>
                          <span className="text-sm">{region.marketShare}%</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          region.potential === 'high' ? 'bg-accent/20 text-accent' : 'bg-warning/20 text-warning'
                        }`}>
                          {region.potential}
                        </span>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-1">
                          <button 
                            onClick={() => setSelectedRegion(region)}
                            className="p-1.5 rounded hover:bg-muted"
                          >
                            <Eye size={14} className="text-muted-foreground" />
                          </button>
                          <button className="p-1.5 rounded hover:bg-muted">
                            <Edit2 size={14} className="text-muted-foreground" />
                          </button>
                          <button className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90">
                            Expand
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

        {activeTab === 'competitors' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-4">
              <h3 className="section-title"><Users size={14} className="text-primary" /> Competitor Landscape</h3>
              <div className="space-y-4 mt-4">
                {competitors.map((comp, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${
                    comp.name === 'Our Brand' ? 'bg-primary/10 border-primary/30' : 'bg-muted/30 border-border'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          comp.name === 'Our Brand' ? 'bg-primary' : 'bg-secondary/20'
                        }`}>
                          <span className={`text-sm font-bold ${comp.name === 'Our Brand' ? 'text-primary-foreground' : 'text-secondary'}`}>
                            {comp.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{comp.name}</p>
                          <p className="text-xs text-muted-foreground">Market Share: {comp.marketShare}%</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="w-24 h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${comp.name === 'Our Brand' ? 'bg-primary' : 'bg-secondary'}`}
                            style={{ width: `${(comp.marketShare / 30) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div>
                        <p className="text-muted-foreground">Strength</p>
                        <p className="text-accent">{comp.strength}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weakness</p>
                        <p className="text-destructive">{comp.weakness}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="section-title"><Target size={14} className="text-primary" /> Competitive Strategy</h3>
              <div className="space-y-4 mt-4">
                <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                  <h4 className="text-sm font-medium text-foreground mb-2">Our Advantages</h4>
                  <ul className="space-y-2">
                    {['Premium quality products', 'Strong brand recognition', 'Customer loyalty program', 'Innovative designs'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                  <h4 className="text-sm font-medium text-foreground mb-2">Areas to Improve</h4>
                  <ul className="space-y-2">
                    {['Expand distribution network', 'Increase online presence', 'Competitive pricing tiers', 'Faster delivery times'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-warning" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90">
                  Generate Competitive Analysis
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'expansion' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0"><Target size={14} className="text-primary" /> Expansion Opportunities</h3>
                <button 
                  onClick={() => setShowExpansionModal(true)}
                  className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Add City
                </button>
              </div>
              <div className="space-y-3">
                {expansionOpportunities.map((opp, i) => (
                  <div key={i} className={`p-4 rounded-lg border ${
                    opp.priority === 'high' ? 'bg-accent/5 border-accent/30' : 'bg-muted/30 border-border'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{opp.city}, {opp.state}</p>
                        <p className="text-xs text-muted-foreground">Population: {opp.population}</p>
                      </div>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        opp.priority === 'high' ? 'bg-accent/20 text-accent' : 'bg-warning/20 text-warning'
                      }`}>
                        {opp.priority} priority
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Potential: <span className="text-accent font-medium">{opp.potential}</span></span>
                      <span>Competition: {opp.competition}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button className="flex-1 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90">
                        Start Planning
                      </button>
                      <button className="flex-1 py-1.5 text-xs border border-border rounded hover:bg-muted">
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-4">
              <h3 className="section-title"><Zap size={14} className="text-primary" /> Quick Expansion Planner</h3>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">City</label>
                    <input
                      type="text"
                      placeholder="Enter city name"
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">State</label>
                    <input
                      type="text"
                      placeholder="Enter state"
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Expansion Strategy</label>
                  <select className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
                    <option value="dealer">Dealer Network</option>
                    <option value="franchise">Franchise Model</option>
                    <option value="direct">Direct Sales</option>
                    <option value="online">Online First</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Initial Budget (₹)</label>
                    <input
                      type="text"
                      placeholder="e.g., 500000"
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Timeline</label>
                    <select className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary">
                      <option value="1m">1 Month</option>
                      <option value="3m">3 Months</option>
                      <option value="6m">6 Months</option>
                      <option value="1y">1 Year</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Additional details..."
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <button 
                  onClick={handlePlanExpansion}
                  className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                >
                  Create Expansion Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Markets;