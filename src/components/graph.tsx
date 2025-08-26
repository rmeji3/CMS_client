import { LineChart } from '@mui/x-charts';

const margin = { right: 24 };
const xLabels = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

type GraphProps = { weeklyViews?: number[] };
const defaultViews = [10, 20, 30, 40, 50, 60, 70];

export default function Graph({ weeklyViews }: GraphProps) {
  const data = Array.isArray(weeklyViews) ? weeklyViews : defaultViews;
  return (
    <LineChart
      height={350}
      width={950}
      series={[
        { data, area: true, color: '#3b82f6', showMark: false },
      ]}
      xAxis={[{ scaleType: 'point', data: xLabels }]}
      yAxis={[{ width: 50 }]}
      margin={margin}
      sx={{
        // Hide the data line (keep underglow only)
          '& .MuiLineElement-root': {
          stroke: 'url(#lineGradient)',
          strokeWidth: 2,
        },
        '& .MuiAreaElement-root': {
          fill: 'url(#areaGradient)', // gradient underglow
          fillOpacity: 1,
        },
        // Axis styling to gray
        '& .MuiChartsAxis-line': {
          stroke: '#707f90',
        },
        '& .MuiChartsAxis-tick': {
          stroke: '#707f90',
        },
        '& .MuiChartsAxis-tickLabel': {
          fill: '#707f90',
        },
        '& .MuiChartsGrid-line': {
          stroke: '#e5e7eb', // optional lighter grid (gray-200)
        },
      }}
      >
      <defs>
        {/* Gradient for the area under the line (scales with the filled path) */}
        <linearGradient id="areaGradient" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
        </linearGradient>
        {/* Left-to-right gradient for the line stroke */}
        <linearGradient id="lineGradient" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
      </defs>
    </LineChart>
  );
}