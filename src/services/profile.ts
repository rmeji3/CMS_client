import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { attachAntiForgeryHeaders } from './csrf';
import type { Profile } from './types';

export const profileApi = createApi({
  reducerPath: 'profileApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/',
  credentials: 'include', // Include cookies for authentication
  prepareHeaders: (headers) => attachAntiForgeryHeaders(headers),
  }),
  endpoints: (builder) => ({
    fetchProfile: builder.query<Profile, void>({
      query: () => ({
        url: 'Profile/me',
        method: 'GET',
      }),
    }),
  }),
});

export const { useFetchProfileQuery } = profileApi;
