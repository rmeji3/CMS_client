import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { attachAntiForgeryHeaders } from '../csrf';
import type { About } from '../types';

export const aboutApi = createApi({
  reducerPath: 'aboutApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7108/api',
    credentials: 'include',
    prepareHeaders: (headers) => attachAntiForgeryHeaders(headers),
  }),
  tagTypes: ['About'],
  endpoints: (builder) => ({
    // GET /api/about
    fetchAbout: builder.query<About, void>({
      query: () => ({ url: 'about', method: 'GET' }),
      providesTags: ['About'],
    }),

    // PATCH /api/about  (text-only partial update)
    patchAbout: builder.mutation<About, Partial<Pick<About, 'title' | 'description'>>>({
      query: (body) => ({
        url: 'about',
        method: 'PATCH',
        body, // JSON with only changed fields
      }),
      invalidatesTags: ['About'],
    }),

    // POST /api/about/image  (multipart upload)
    uploadAboutImage: builder.mutation<{ imageUrl: string }, File>({
      query: (file) => {
        const form = new FormData();
        form.append('image', file); // must match [FromForm] IFormFile image
        return {
          url: 'about/image',
          method: 'POST',
          body: form, // don't set Content-Type manually
        };
      },
      invalidatesTags: ['About'],
    }),
  }),
});

export const {
  useFetchAboutQuery,
  usePatchAboutMutation,
  useUploadAboutImageMutation,
} = aboutApi;
