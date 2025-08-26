import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { attachAntiForgeryHeaders } from './csrf';

export const antiforgeryApi = createApi({
  reducerPath: 'antiforgeryApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7108',
    credentials: 'include', // Include cookies for authentication
  prepareHeaders: (headers) => attachAntiForgeryHeaders(headers),
  }),
  endpoints: (builder) => ({
    fetchAntiforgeryToken: builder.query<{ token?: string } | null, void>({
      query: () => ({
        url: 'antiforgery/token',
        method: 'GET',
      }),
      transformResponse: (response: any, meta): { token?: string } | null => {
        try {
          // Try common header names first
          const h = meta?.response?.headers;
          let token: string | undefined =
            h?.get('X-CSRF-TOKEN') ||
            h?.get('X-XSRF-TOKEN') ||
            h?.get('RequestVerificationToken') ||
            undefined;

          // Try body as JSON or text
          if (!token && response) {
            if (typeof response === 'string') token = response;
            else if (typeof response === 'object') {
              token =
                response?.token ||
                response?.requestToken ||
                response?.csrfToken ||
                response?.value ||
                undefined;
            }
          }

          if (token) {
            // Persist for header attachment later
            try {
              localStorage.setItem('XSRF-TOKEN', token);
              localStorage.setItem('RequestVerificationToken', token);
            } catch {}
            return { token };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  }),
});

export const { useFetchAntiforgeryTokenQuery } = antiforgeryApi;
