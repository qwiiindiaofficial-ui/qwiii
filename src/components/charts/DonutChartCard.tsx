import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface DataPoint {
  name: string;
  value: number;
}

interface DonutChartCardProps {
  data: DataPoint[];
  title: string;
  subtitle?: string;
  centerValue?: string;
  centerLabel?: string;
  height?: number;
}

const DonutChartCard = ({
  data,
  title,
  subtitle,
  centerValue,
  centerLabel,
  height = 200,
}: DonutChartCardProps) => {
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

      <div className="relative">
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(225, 30%, 5%)',
                border: '1px solid hsl(225, 20%, 12%)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(210, 40%, 96%)' }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center text */}
        {centerValue && (
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className="text-2xl font-bold text-foreground">{centerValue}</span>
            {centerLabel && (
              <span className="text-xs text-muted-foreground">{centerLabel}</span>
            )}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mt-4 justify-center">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-xs text-muted-foreground">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonutChartCard;
