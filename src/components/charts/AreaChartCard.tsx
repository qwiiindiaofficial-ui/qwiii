import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  value2?: number;
}

interface AreaChartCardProps {
  data: DataPoint[];
  title: string;
  subtitle?: string;
  color?: string;
  color2?: string;
  showGrid?: boolean;
  height?: number;
}

const AreaChartCard = ({
  data,
  title,
  subtitle,
  color = 'hsl(185, 100%, 50%)',
  color2,
  showGrid = true,
  height = 200,
}: AreaChartCardProps) => {
  return (
    <div className="glass-card p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id={`gradient-${title}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            {color2 && (
              <linearGradient id={`gradient2-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color2} stopOpacity={0.3} />
                <stop offset="95%" stopColor={color2} stopOpacity={0} />
              </linearGradient>
            )}
          </defs>
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 20%, 12%)" />
          )}
          <XAxis
            dataKey="name"
            stroke="hsl(220, 15%, 40%)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(220, 15%, 40%)"
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(225, 30%, 5%)',
              border: '1px solid hsl(225, 20%, 12%)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelStyle={{ color: 'hsl(210, 40%, 96%)' }}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#gradient-${title})`}
          />
          {color2 && (
            <Area
              type="monotone"
              dataKey="value2"
              stroke={color2}
              strokeWidth={2}
              fill={`url(#gradient2-${title})`}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AreaChartCard;
