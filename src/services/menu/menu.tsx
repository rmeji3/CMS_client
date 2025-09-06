import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { MenuDto, MenuPatchDto } from "../types";

const API_BASE =  "https://localhost:7108/api";
export const menuApi = createApi({
  reducerPath: "menuApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE,
    credentials: "include",
    prepareHeaders: (headers) => {
      const tid = localStorage.getItem("tenant_id"); // dev-only, matches your other slices
      if (tid) headers.set("X-Tenant", tid);
      return headers;
    },
  }),
  tagTypes: ["Menu"],
  endpoints: (b) => ({
    getMenu: b.query<MenuDto, void>({
      query: () => "menu",
      providesTags: ["Menu"],
    }),
    patchMenu: b.mutation<MenuDto, MenuPatchDto>({
      query: (body) => ({
        url: "menu",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Menu"],
    }),
    uploadMenuImage: b.mutation<{ imageUrl: string }, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append("image", file);
        return {
          url: "menu/images",
          method: "POST",
          body: formData,
        };
      },
    }),
  }),
});

export const { useGetMenuQuery, usePatchMenuMutation, useUploadMenuImageMutation } = menuApi;