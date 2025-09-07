import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE = import.meta.env.VITE_API_BASE ?? 'https://localhost:7108/api';

type Primitive = string | number | boolean | null | undefined;
const qs = (obj?: Record<string, Primitive>) => {
  const p = new URLSearchParams();
  if (obj) {
    for (const [k, v] of Object.entries(obj)) {
      if (v !== undefined && v !== null && v !== '') p.set(k, String(v));
    }
  }
  const s = p.toString();
  return s ? `?${s}` : '';
};

// Raw shapes as they may come from the API (PascalCase or camelCase)
type DailySummaryRaw = { DayUtc?: string; dayUtc?: string; Path?: string | null; path?: string | null; Count?: number; count?: number; };
type WeeklySummaryRaw = { WeekStartUtc?: string; weekStartUtc?: string; Path?: string | null; path?: string | null; Count?: number; count?: number; };

// Normalized shapes used by the app
export interface DailySummaryRow {
  dayUtc: string;          // ISO string
  path: string | null;
  count: number;
  date: Date;              // convenience
}

export interface WeeklySummaryRow {
  weekStartUtc: string;    // ISO string (Monday 00:00 UTC)
  path: string | null;
  count: number;
  weekStart: Date;         // convenience
}

export interface GetDailyParams { days?: number; path?: string; }
export interface GetWeeklyParams { weeks?: number; path?: string; groupByPath?: boolean; }

export const cmsMetricsApi = createApi({
  reducerPath: 'cmsMetricsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Dev-only: header fallback if tenant isn’t resolved by Host
      const tid = localStorage.getItem('tenant_id');
      if (tid) headers.set('X-Tenant', tid);
      return headers;
    },
  }),
  tagTypes: ['Metrics'],
  endpoints: (builder) => ({
    getDailySummary: builder.query<DailySummaryRow[], GetDailyParams | void>({
      query: (args) => {
        const { days = 7, path } = args ?? {};
        return `metrics/summary${qs({ days, path })}`;
      },
      transformResponse: (rows: DailySummaryRaw[] = []): DailySummaryRow[] =>
        rows.map((r) => {
          const dayUtc = r.DayUtc ?? r.dayUtc ?? '';
          const path = (r.Path ?? r.path ?? null) as string | null;
          const count = (r.Count ?? r.count ?? 0) as number;
          return { dayUtc, path, count, date: new Date(dayUtc) };
        }),
      providesTags: ['Metrics'],
    }),

    getWeeklySummary: builder.query<WeeklySummaryRow[], GetWeeklyParams | void>({
      query: (args) => {
        const { weeks = 8, path, groupByPath = false } = args ?? {};
        return `metrics/summary-weekly${qs({ weeks, path, groupByPath })}`;
      },
      transformResponse: (rows: WeeklySummaryRaw[] = []): WeeklySummaryRow[] =>
        rows.map((r) => {
          const weekStartUtc = r.WeekStartUtc ?? r.weekStartUtc ?? '';
          const path = (r.Path ?? r.path ?? null) as string | null;
          const count = (r.Count ?? r.count ?? 0) as number;
          return { weekStartUtc, path, count, weekStart: new Date(weekStartUtc) };
        }),
      providesTags: ['Metrics'],
    }),
  }),
});

export const {
  useGetDailySummaryQuery,
  useGetWeeklySummaryQuery,
} = cmsMetricsApi;
