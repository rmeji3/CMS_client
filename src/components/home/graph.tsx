import { LineChart } from '@mui/x-charts';

type GraphProps = {
  dailyViews?: number[];
  labels?: string[]; // dynamic weekday labels matching the data length
};

const defaultViews = [10, 20, 30, 40, 50, 60, 70];

export default function Graph({ dailyViews, labels }: GraphProps) {
  const src = Array.isArray(dailyViews) && dailyViews.length ? dailyViews : defaultViews;

  // Normalize to exactly 7 points (left-pad with zeros if fewer)
  const data = src.slice(-7);
  while (data.length < 7) data.unshift(0);

  // If labels not provided, fall back to generic Mon..Sun for 7 points
  const fallback = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const xLabels =
    Array.isArray(labels) && labels.length === data.length ? labels : fallback;

  return (
    <LineChart
      height={350}
      width={950}
      series={[{ data, area: true, color: '#3b82f6', showMark: false }]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[{ width: 50 }]}
      margin={{ right: 24 }}
      sx={{
        '& .MuiLineElement-root': { stroke: 'url(#lineGradient)', strokeWidth: 2 },
        '& .MuiAreaElement-root': { fill: 'url(#areaGradient)', fillOpacity: 1 },
        '& .MuiChartsAxis-line, & .MuiChartsAxis-tick': { stroke: '#707f90' },
        '& .MuiChartsAxis-tickLabel': { fill: '#707f90' },
        '& .MuiChartsGrid-line': { stroke: '#e5e7eb' },
      }}
    >
      <defs>
        <linearGradient id="areaGradient" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
        </linearGradient>
        <linearGradient id="lineGradient" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </LineChart>
  );
}
