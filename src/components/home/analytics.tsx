import React from 'react';
import Graph from './graph';
import { useGetDailySummaryQuery } from '../../services/metrics/pageViews';

const AnalyticsCard: React.FC = () => {
  // defaults to last 7 days if your slice has days=7 (or pass { days: 7 } explicitly)
  const { data = [], isLoading, isError } = useGetDailySummaryQuery({ days: 7 });

  // Normalize + sort by day
  const rows = React.useMemo(() => {
    return [...data].sort((a: any, b: any) => {
      const ad = a.date ? +new Date(a.date) : +new Date(a.dayUtc ?? a.DayUtc);
      const bd = b.date ? +new Date(b.date) : +new Date(b.dayUtc ?? b.DayUtc);
      return ad - bd;
    });
  }, [data]);

  // Build labels (Mon, Tue, …) and counts aligned to the last 7 days
  const labels = React.useMemo(
    () =>
      rows.map((r: any) => {
        const d = r.date ? new Date(r.date) : new Date(r.dayUtc ?? r.DayUtc);
        return d.toLocaleDateString(undefined, { weekday: 'short' }); // e.g., "Mon"
      }),
    [rows]
  );

  const dailyViews = React.useMemo(
    () => rows.map((r: any) => Number(r.count ?? r.Count ?? 0)),
    [rows]
  );

  if (isLoading) return <div className="p-6 rounded-lg border">Loading…</div>;
  if (isError) return <div className="p-6 rounded-lg border text-red-600">Failed to load analytics.</div>;

  return <Graph dailyViews={dailyViews} labels={labels} />;
};

export default AnalyticsCard;
