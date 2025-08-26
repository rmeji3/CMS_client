// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { attachAntiForgeryHeaders } from './csrf';
import type { Auth } from './types';

// Define a service using a base URL and expected endpoints
export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7108',
    credentials: 'include', // Include cookies for authentication
    prepareHeaders: (headers) => attachAntiForgeryHeaders(headers),
  }),
  endpoints: (builder) => ({
    login: builder.mutation<Auth, { email: string; password: string }>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    register: builder.mutation<Auth, { email: string; password: string }>({
      query: (credentials) => ({
        url: 'auth/register',
        method: 'POST',
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { 
  useLoginMutation, 
  useRegisterMutation, 
  useLogoutMutation,
} = authApi;