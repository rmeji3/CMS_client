import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { attachAntiForgeryHeaders } from '../csrf';
import type { Socials } from '../types';

export const socialsApi = createApi({
  reducerPath: 'socialsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7108/api',
    credentials: 'include',
    prepareHeaders: (headers) => attachAntiForgeryHeaders(headers),
  }),
  tagTypes: ['Socials'],
  endpoints: (builder) => ({
    // GET /api/socials
    fetchSocials: builder.query<Socials, void>({
      query: () => ({ url: 'socials', method: 'GET' }),
      providesTags: ['Socials'],
    }),
    // PATCH /api/socials
    patchSocials: builder.mutation<Socials, Partial<Socials>>({
      query: (body) => ({
        url: 'socials',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Socials'],
    }),
  }),
});

export const {
  useFetchSocialsQuery,
  usePatchSocialsMutation,
} = socialsApi;
