import { useState } from 'react';
import { Globe, TrendingUp, MapPin, DollarSign, Plus, Target, Users, ChartBar as BarChart3, ArrowUpRight, Eye, Zap, Building2, Sparkles, X } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import MetricCard from '@/components/charts/MetricCard';
import BarChartCard from '@/components/charts/BarChartCard';
import DonutChartCard from '@/components/charts/DonutChartCard';
import OpportunitiesTab from '@/components/markets/OpportunitiesTab';
import { useMarketRegions } from '@/hooks/useMarketRegions';
import { useMarketCompetitors } from '@/hooks/useMarketCompetitors';
import { useMarketExpansion } from '@/hooks/useMarketExpansion';
import type { MarketOpportunity } from '@/hooks/useMarketOpportunities';

type ViewTab = 'overview' | 'regions' | 'competitors' | 'expansion' | 'opportunities';

const Markets = () => {
  const [activeTab, setActiveTab] = useState<ViewTab>('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [expansionForm, setExpansionForm] = useState({
    city: '',
    state: '',
    population: '',
    monthly_potential: '',
    competition_level: 'Medium',
    priority: 'medium' as 'high' | 'medium' | 'low',
    strategy: 'dealer',
    budget: 0,
    timeline: '3m',
    notes: '',
    status: 'planned' as 'planned' | 'active' | 'completed',
  });

  const { regions, isLoading: regionsLoading, totalRevenue, topRegion, chartData, channelData } = useMarketRegions();
  const { competitors, ownBrand, isLoading: competitorsLoading } = useMarketCompetitors();
  const { targets, isLoading: targetsLoading, addTarget, isAdding } = useMarketExpansion();

  const exportRegion = regions.find((r) => r.name.toLowerCase().includes('export'));
  const exportShare = exportRegion ? Math.round((exportRegion.revenue / totalRevenue) * 100) : 0;
  const fastestGrowing = [...regions].sort((a, b) => b.growth - a.growth)[0];

  const handlePlanExpansion = () => {
    if (!expansionForm.city || !expansionForm.state) return;
    addTarget(expansionForm);
    setShowAddModal(false);
    setExpansionForm({
      city: '', state: '', population: '', monthly_potential: '',
      competition_level: 'Medium', priority: 'medium', strategy: 'dealer',
      budget: 0, timeline: '3m', notes: '', status: 'planned',
    });
  };

  const handleOpportunityAction = (opportunity: MarketOpportunity) => {
    if (opportunity.action_type === 'expand') setActiveTab('expansion');
    else if (opportunity.action_type === 'view_competitors') setActiveTab('competitors');
    else if (opportunity.action_type === 'view_region') setActiveTab('regions');
    else if (opportunity.action_type === 'contact_buyers') setActiveTab('regions');
  };

  const formatRevenue = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="page-header mb-0">
            <h1 className="page-title">MARKET INTELLIGENCE</h1>
            <p className="page-subtitle">Regional analytics • Competitor analysis • Expansion planning</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
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

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Active Markets"
            value={regionsLoading ? '—' : String(regions.length)}
            icon={<Globe size={16} />}
            subtitle="regions"
          />
          <MetricCard
            title="Top Region"
            value={regionsLoading ? '—' : (topRegion?.name.replace(' India', '').replace(' Markets', '') ?? '—')}
            icon={<MapPin size={16} />}
            subtitle="by revenue"
          />
          <MetricCard
            title="Export Share"
            value={regionsLoading ? '—' : `${exportShare}%`}
            change={exportRegion ? `+${exportRegion.growth.toFixed(1)}%` : undefined}
            changeType="positive"
            icon={<TrendingUp size={16} />}
          />
          <MetricCard
            title="Total Market"
            value={regionsLoading ? '—' : formatRevenue(totalRevenue)}
            icon={<DollarSign size={16} />}
            subtitle="annual"
          />
        </div>

        <div className="flex items-center gap-1 bg-muted/30 rounded-lg p-1 w-fit flex-wrap">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'regions', label: 'Regions', icon: MapPin },
            { id: 'competitors', label: 'Competitors', icon: Users },
            { id: 'expansion', label: 'Expansion', icon: Target },
            { id: 'opportunities', label: 'AI Opportunities', icon: Sparkles },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as ViewTab)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon size={14} className={tab.id === 'opportunities' ? 'text-primary' : ''} />
              {tab.label}
              {tab.id === 'opportunities' && activeTab !== 'opportunities' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <BarChartCard
                data={chartData}
                title="Regional Performance"
                subtitle="Sales by region (₹ in Thousands)"
                height={300}
              />
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
                  <p className="text-2xl font-bold text-accent">
                    {regionsLoading ? '—' : (fastestGrowing?.name.replace(' India', '') ?? '—')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {fastestGrowing ? `+${fastestGrowing.growth}% YoY growth` : ''}
                  </p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Target size={16} className="text-primary" />
                    <span className="text-sm font-medium text-foreground">Highest Potential</span>
                  </div>
                  <p className="text-2xl font-bold text-primary">
                    {regionsLoading ? '—' : (exportRegion?.name.replace(' Markets', '') ?? 'Export')}
                  </p>
                  <p className="text-xs text-muted-foreground">Untapped international markets</p>
                </div>
                <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Building2 size={16} className="text-warning" />
                    <span className="text-sm font-medium text-foreground">Market Opportunity</span>
                  </div>
                  <p className="text-2xl font-bold text-warning">Tier 2 Cities</p>
                  <p className="text-xs text-muted-foreground">
                    {targetsLoading ? '—' : `${targets.length} cities identified`}
                  </p>
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
            {regionsLoading ? (
              <div className="flex items-center justify-center py-16">
                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
              </div>
            ) : (
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
                        <td className="p-3 text-sm font-medium text-foreground">{formatRevenue(region.revenue)}</td>
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
                              <div className="h-full bg-primary rounded-full" style={{ width: `${region.market_share}%` }} />
                            </div>
                            <span className="text-sm">{region.market_share}%</span>
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
                            <button className="p-1.5 rounded hover:bg-muted">
                              <Eye size={14} className="text-muted-foreground" />
                            </button>
                            <button
                              onClick={() => { setActiveTab('expansion'); setShowAddModal(true); }}
                              className="px-2 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
                            >
                              Expand
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'competitors' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-4">
              <h3 className="section-title"><Users size={14} className="text-primary" /> Competitor Landscape</h3>
              {competitorsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {competitors.map((comp) => (
                    <div key={comp.id} className={`p-4 rounded-lg border ${
                      comp.is_own_brand ? 'bg-primary/10 border-primary/30' : 'bg-muted/30 border-border'
                    }`}>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            comp.is_own_brand ? 'bg-primary' : 'bg-secondary/20'
                          }`}>
                            <span className={`text-sm font-bold ${comp.is_own_brand ? 'text-primary-foreground' : 'text-secondary'}`}>
                              {comp.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-foreground">{comp.name}</p>
                            <p className="text-xs text-muted-foreground">Market Share: {comp.market_share}%</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="w-24 h-3 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${comp.is_own_brand ? 'bg-primary' : 'bg-secondary'}`}
                              style={{ width: `${(comp.market_share / 30) * 100}%` }}
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
              )}
            </div>

            <div className="glass-card p-4">
              <h3 className="section-title"><Target size={14} className="text-primary" /> Competitive Strategy</h3>
              <div className="space-y-4 mt-4">
                {ownBrand && (
                  <>
                    <div className="p-4 rounded-lg bg-accent/10 border border-accent/30">
                      <h4 className="text-sm font-medium text-foreground mb-2">Our Advantages</h4>
                      <p className="text-sm text-accent">{ownBrand.strength}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-warning/10 border border-warning/30">
                      <h4 className="text-sm font-medium text-foreground mb-2">Area to Improve</h4>
                      <p className="text-sm text-warning">{ownBrand.weakness}</p>
                    </div>
                  </>
                )}
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <h4 className="text-sm font-medium text-foreground mb-3">Recommended Actions</h4>
                  <ul className="space-y-2">
                    {['Expand distribution to tier 2 cities', 'Increase online presence & D2C', 'Introduce competitive mid-tier pricing', 'Faster order-to-delivery pipeline'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90"
                  onClick={() => setActiveTab('opportunities')}>
                  View AI Opportunities
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <OpportunitiesTab onActionClick={handleOpportunityAction} />
        )}

        {activeTab === 'expansion' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="glass-card p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="section-title mb-0"><Target size={14} className="text-primary" /> Expansion Targets</h3>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90"
                >
                  Add City
                </button>
              </div>
              {targetsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {targets.map((target) => (
                    <div key={target.id} className={`p-4 rounded-lg border ${
                      target.priority === 'high' ? 'bg-accent/5 border-accent/30' : 'bg-muted/30 border-border'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-sm font-medium text-foreground">{target.city}, {target.state}</p>
                          <p className="text-xs text-muted-foreground">Pop: {target.population || '—'}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            target.priority === 'high' ? 'bg-accent/20 text-accent' :
                            target.priority === 'medium' ? 'bg-warning/20 text-warning' : 'bg-muted text-muted-foreground'
                          }`}>
                            {target.priority} priority
                          </span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            target.status === 'active' ? 'bg-primary/20 text-primary' :
                            target.status === 'completed' ? 'bg-accent/20 text-accent' : 'bg-muted text-muted-foreground'
                          }`}>
                            {target.status}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                        <span>Potential: <span className="text-accent font-medium">{target.monthly_potential || '—'}</span></span>
                        <span>Competition: {target.competition_level}</span>
                      </div>
                      {target.notes && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{target.notes}</p>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Strategy: {target.strategy}</span>
                        <span className="text-xs text-muted-foreground">·</span>
                        <span className="text-xs text-muted-foreground">Timeline: {target.timeline}</span>
                      </div>
                    </div>
                  ))}
                  {targets.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      No expansion targets yet. Click "Add City" to get started.
                    </div>
                  )}
                </div>
              )}
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
                      value={expansionForm.city}
                      onChange={(e) => setExpansionForm((f) => ({ ...f, city: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">State</label>
                    <input
                      type="text"
                      placeholder="Enter state"
                      value={expansionForm.state}
                      onChange={(e) => setExpansionForm((f) => ({ ...f, state: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Population</label>
                    <input
                      type="text"
                      placeholder="e.g. 2.5M"
                      value={expansionForm.population}
                      onChange={(e) => setExpansionForm((f) => ({ ...f, population: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Monthly Potential</label>
                    <input
                      type="text"
                      placeholder="e.g. ₹10L/month"
                      value={expansionForm.monthly_potential}
                      onChange={(e) => setExpansionForm((f) => ({ ...f, monthly_potential: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Expansion Strategy</label>
                  <select
                    value={expansionForm.strategy}
                    onChange={(e) => setExpansionForm((f) => ({ ...f, strategy: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                  >
                    <option value="dealer">Dealer Network</option>
                    <option value="franchise">Franchise Model</option>
                    <option value="direct">Direct Sales</option>
                    <option value="online">Online First</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Priority</label>
                    <select
                      value={expansionForm.priority}
                      onChange={(e) => setExpansionForm((f) => ({ ...f, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Timeline</label>
                    <select
                      value={expansionForm.timeline}
                      onChange={(e) => setExpansionForm((f) => ({ ...f, timeline: e.target.value }))}
                      className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="1m">1 Month</option>
                      <option value="3m">3 Months</option>
                      <option value="6m">6 Months</option>
                      <option value="1y">1 Year</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Initial Budget (₹)</label>
                  <input
                    type="number"
                    placeholder="e.g. 500000"
                    value={expansionForm.budget || ''}
                    onChange={(e) => setExpansionForm((f) => ({ ...f, budget: Number(e.target.value) }))}
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Notes</label>
                  <textarea
                    rows={3}
                    placeholder="Additional details..."
                    value={expansionForm.notes}
                    onChange={(e) => setExpansionForm((f) => ({ ...f, notes: e.target.value }))}
                    className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary resize-none"
                  />
                </div>
                <button
                  onClick={handlePlanExpansion}
                  disabled={isAdding || !expansionForm.city || !expansionForm.state}
                  className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isAdding ? 'Saving...' : 'Create Expansion Plan'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-card rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-foreground">New Expansion Target</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 rounded hover:bg-muted">
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">City *</label>
                <input
                  type="text"
                  placeholder="City name"
                  value={expansionForm.city}
                  onChange={(e) => setExpansionForm((f) => ({ ...f, city: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">State *</label>
                <input
                  type="text"
                  placeholder="State"
                  value={expansionForm.state}
                  onChange={(e) => setExpansionForm((f) => ({ ...f, state: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Population</label>
                <input
                  type="text"
                  placeholder="e.g. 2.5M"
                  value={expansionForm.population}
                  onChange={(e) => setExpansionForm((f) => ({ ...f, population: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Monthly Potential</label>
                <input
                  type="text"
                  placeholder="₹10L/month"
                  value={expansionForm.monthly_potential}
                  onChange={(e) => setExpansionForm((f) => ({ ...f, monthly_potential: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Priority</label>
                <select
                  value={expansionForm.priority}
                  onChange={(e) => setExpansionForm((f) => ({ ...f, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                  className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Strategy</label>
                <select
                  value={expansionForm.strategy}
                  onChange={(e) => setExpansionForm((f) => ({ ...f, strategy: e.target.value }))}
                  className="w-full mt-1 px-3 py-2 bg-muted/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
                >
                  <option value="dealer">Dealer Network</option>
                  <option value="franchise">Franchise Model</option>
                  <option value="direct">Direct Sales</option>
                  <option value="online">Online First</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2 border border-border rounded-lg text-sm text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                onClick={() => { handlePlanExpansion(); setShowAddModal(false); }}
                disabled={isAdding || !expansionForm.city || !expansionForm.state}
                className="flex-1 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isAdding ? 'Saving...' : 'Add Target'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default Markets;
