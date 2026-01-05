import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DataPoint {
  name: string;
  [key: string]: string | number;
}

interface LineData {
  key: string;
  color: string;
  name?: string;
}

interface LineChartCardProps {
  data: DataPoint[];
  lines: LineData[];
  title: string;
  subtitle?: string;
  showGrid?: boolean;
  height?: number;
  showLegend?: boolean;
}

const LineChartCard = ({
  data,
  lines,
  title,
  subtitle,
  showGrid = true,
  height = 200,
  showLegend = false,
}: LineChartCardProps) => {
  return (
    <div className="glass-card p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
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
          {showLegend && <Legend />}
          {lines.map((line) => (
            <Line
              key={line.key}
              type="monotone"
              dataKey={line.key}
              stroke={line.color}
              strokeWidth={2}
              dot={{ fill: line.color, strokeWidth: 0, r: 3 }}
              activeDot={{ r: 5, strokeWidth: 0 }}
              name={line.name || line.key}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LineChartCard;
