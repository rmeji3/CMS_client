import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { attachAntiForgeryHeaders } from '../csrf';
import type { Address } from '../types';

export const addressApi = createApi({
  reducerPath: 'addressApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7108/api',
    credentials: 'include',
    prepareHeaders: (headers) => attachAntiForgeryHeaders(headers),
  }),
  tagTypes: ['Address'],
  endpoints: (builder) => ({
    fetchAddress: builder.query<Address, void>({
      query: () => ({ url: 'address', method: 'GET' }),
      providesTags: ['Address'],
    }),
    patchAddress: builder.mutation<Address, Partial<Address>>({
      query: (body) => ({
        url: 'address',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Address'],
    }),
  }),
});

export const {
  useFetchAddressQuery,
  usePatchAddressMutation,
} = addressApi;
