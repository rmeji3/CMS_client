import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { attachAntiForgeryHeaders } from '../csrf';
import type { CarouselEntity } from '../types';

export const carouselApi = createApi({
  reducerPath: 'carouselApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://localhost:7108/api',
    credentials: 'include',
    prepareHeaders: (headers) => attachAntiForgeryHeaders(headers),
  }),
  tagTypes: ['Carousel'],
  endpoints: (builder) => ({
    fetchCarousel: builder.query<CarouselEntity, void>({
      query: () => ({ url: 'carousel', method: 'GET' }),
      providesTags: ['Carousel'],
    }),
  // POST /api/carousel/images (multipart upload)
  uploadCarouselImage: builder.mutation<{ imageUrl: string }, File>({
      query: (file) => {
        const form = new FormData();
        form.append('image', file); // must match backend's form field name
        return {
      url: 'carousel/images',
          method: 'POST',
          body: form,
        };
      },
    }),
    patchCarousel: builder.mutation<CarouselEntity, Partial<CarouselEntity>>({
      query: (body) => ({
        url: 'carousel',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Carousel'],
    }),
  }),
});

export const {
  useFetchCarouselQuery,
  usePatchCarouselMutation,
  useUploadCarouselImageMutation,
} = carouselApi;
