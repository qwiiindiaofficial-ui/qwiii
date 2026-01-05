import { LineChart, Brain, TrendingUp, Calendar, Zap, RefreshCw } from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import AreaChartCard from '@/components/charts/AreaChartCard';
import LineChartCard from '@/components/charts/LineChartCard';
import BarChartCard from '@/components/charts/BarChartCard';
import MetricCard from '@/components/charts/MetricCard';
import AnimatedCounter from '@/components/ai/AnimatedCounter';

const demandData = [
  { name: 'Jan', sarees: 4200, lehengas: 2800, kurtas: 3500 },
  { name: 'Feb', sarees: 4500, lehengas: 2600, kurtas: 3800 },
  { name: 'Mar', sarees: 5100, lehengas: 3200, kurtas: 4100 },
  { name: 'Apr', sarees: 4800, lehengas: 4500, kurtas: 3900 },
  { name: 'May', sarees: 5500, lehengas: 5800, kurtas: 4200 },
  { name: 'Jun', sarees: 6200, lehengas: 6500, kurtas: 4800 },
];

const seasonalData = [
  { name: 'Diwali', value: 8500 },
  { name: 'Wedding', value: 7200 },
  { name: 'Eid', value: 5400 },
  { name: 'Holi', value: 4100 },
  { name: 'Regular', value: 3200 },
];

const weeklyForecast = [
  { name: 'W1', value: 12500, value2: 11800 },
  { name: 'W2', value: 13200, value2: 13500 },
  { name: 'W3', value: 14100, value2: 14800 },
  { name: 'W4', value: 15800, value2: 16200 },
];

const DemandPrediction = () => {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="page-header">
          <h1 className="page-title">DEMAND PREDICTION</h1>
          <p className="page-subtitle">Multi-category AI forecasting • Seasonal trend analysis</p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="30-Day Forecast"
            value={<AnimatedCounter value={156000} duration={1500} />}
            change="+24%"
            changeType="positive"
            icon={<TrendingUp size={16} />}
          />
          <MetricCard
            title="Model Confidence"
            value="91.8%"
            change="+3.2%"
            changeType="positive"
            icon={<Brain size={16} />}
          />
          <MetricCard
            title="Categories Tracked"
            value="24"
            change="+2"
            changeType="positive"
            icon={<Calendar size={16} />}
          />
          <MetricCard
            title="Last Prediction"
            value="5 min ago"
            icon={<RefreshCw size={16} />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <LineChartCard
              data={demandData}
              lines={[
                { key: 'sarees', color: 'hsl(var(--chart-1))', name: 'Sarees' },
                { key: 'lehengas', color: 'hsl(var(--chart-2))', name: 'Lehengas' },
                { key: 'kurtas', color: 'hsl(var(--chart-3))', name: 'Kurtas' },
              ]}
              title="Category-wise Demand Trends"
              subtitle="6-month rolling analysis"
              height={300}
              showLegend
            />
          </div>

          <BarChartCard
            data={seasonalData}
            title="Seasonal Demand Peaks"
            subtitle="Expected units by event"
            height={300}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AreaChartCard
            data={weeklyForecast}
            title="Weekly Forecast"
            subtitle="Predicted vs Capacity"
            color="hsl(var(--chart-1))"
            color2="hsl(var(--chart-3))"
            height={250}
          />

          <div className="glass-card p-4">
            <h3 className="section-title">
              <Zap size={14} className="text-primary" />
              AI Insights
            </h3>
            <div className="space-y-4 mt-4">
              {[
                { title: 'Wedding Season Surge', desc: 'Lehenga demand expected to rise 45% in next 6 weeks', impact: 'High' },
                { title: 'Silk Price Impact', desc: 'Raw material costs may affect saree margins by 12%', impact: 'Medium' },
                { title: 'New SKU Potential', desc: 'Designer kurtas showing strong B2B buyer interest', impact: 'High' },
              ].map((insight, i) => (
                <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-sm font-medium text-foreground">{insight.title}</p>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      insight.impact === 'High' ? 'bg-primary/20 text-primary' : 'bg-warning/20 text-warning'
                    }`}>{insight.impact}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{insight.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DemandPrediction;
