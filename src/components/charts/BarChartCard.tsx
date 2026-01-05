import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DataPoint {
  name: string;
  value: number;
  color?: string;
}

interface BarChartCardProps {
  data: DataPoint[];
  title: string;
  subtitle?: string;
  color?: string;
  showGrid?: boolean;
  height?: number;
  horizontal?: boolean;
}

const BarChartCard = ({
  data,
  title,
  subtitle,
  color = 'hsl(185, 100%, 50%)',
  showGrid = true,
  height = 200,
  horizontal = false,
}: BarChartCardProps) => {
  const colors = [
    'hsl(185, 100%, 50%)',
    'hsl(265, 85%, 55%)',
    'hsl(155, 100%, 45%)',
    'hsl(330, 100%, 60%)',
    'hsl(38, 100%, 50%)',
  ];

  return (
    <div className="glass-card p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={horizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 5, right: 5, left: horizontal ? 60 : -20, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(225, 20%, 12%)" />
          )}
          {horizontal ? (
            <>
              <XAxis type="number" stroke="hsl(220, 15%, 40%)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke="hsl(220, 15%, 40%)" fontSize={10} tickLine={false} axisLine={false} />
            </>
          ) : (
            <>
              <XAxis dataKey="name" stroke="hsl(220, 15%, 40%)" fontSize={10} tickLine={false} axisLine={false} />
              <YAxis stroke="hsl(220, 15%, 40%)" fontSize={10} tickLine={false} axisLine={false} />
            </>
          )}
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(225, 30%, 5%)',
              border: '1px solid hsl(225, 20%, 12%)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            labelStyle={{ color: 'hsl(210, 40%, 96%)' }}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color || colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BarChartCard;
