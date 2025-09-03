import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { attachAntiForgeryHeaders } from './csrf';
import type { About, Socials, Address } from './types';
// Helper: send only changed keys
export function diffOnly<T extends Record<string, any>>(prev: T | undefined, next: T): Partial<T> {
  const out: Partial<T> = {};
  for (const k in next) {
    if ((prev?.[k] ?? null) !== (next as any)[k]) {
      (out as any)[k] = (next as any)[k];
    }
  }
  return out;
}

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7108/api',
    credentials: 'include',
    prepareHeaders: (headers) => attachAntiForgeryHeaders(headers),
  }),
  tagTypes: ['About', 'Socials', 'Address'],
  endpoints: (b) => ({
    // ----- ABOUT -----
    getAbout: b.query<About, void>({
      query: () => 'about',
      providesTags: ['About'],
    }),

    // JSON patch for text fields only
    patchAbout: b.mutation<About, Partial<Pick<About, 'title' | 'description'>>>({
      query: (body) => ({
        url: 'about',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['About'],
    }),

    // Separate multipart upload for image
    uploadAboutImage: b.mutation<{ imageUrl: string }, File>({
      query: (file) => {
        const form = new FormData();
        form.append('image', file); // matches [FromForm] IFormFile image
        return {
          url: 'about/image',
          method: 'POST',
          body: form,
        };
      },
      invalidatesTags: ['About'],
    }),

    // ----- SOCIALS -----
    getSocials: b.query<Socials, void>({
      query: () => 'socials',
      providesTags: ['Socials'],
    }),
    patchSocials: b.mutation<Socials, Partial<Socials>>({
      query: (body) => ({
        url: 'socials',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Socials'],
    }),

    // ----- ADDRESS -----
    getAddress: b.query<Address, void>({
      query: () => 'address',
      providesTags: ['Address'],
    }),
    patchAddress: b.mutation<Address, Partial<Address>>({
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
  // About
  useGetAboutQuery,
  usePatchAboutMutation,
  useUploadAboutImageMutation,

  // Socials
  useGetSocialsQuery,
  usePatchSocialsMutation,

  // Address
  useGetAddressQuery,
  usePatchAddressMutation,
} = api;