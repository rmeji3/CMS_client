import { configureStore } from '@reduxjs/toolkit'
// Or from '@reduxjs/toolkit/query/react'
import { setupListeners } from '@reduxjs/toolkit/query'
import { profileApi } from './services/profile';
import { authApi } from './services/auth';
import { antiforgeryApi } from './services/antiforgery';
import { aboutApi } from './services/about';
import { socialsApi } from './services/socials';
import { addressApi } from './services/address';

export const store = configureStore({
  reducer: {
    // Add the generated reducer as a specific top-level slice
    [profileApi.reducerPath]: profileApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [antiforgeryApi.reducerPath]: antiforgeryApi.reducer,
    [aboutApi.reducerPath]: aboutApi.reducer,
    [socialsApi.reducerPath]: socialsApi.reducer,
  },
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      profileApi.middleware,
      authApi.middleware,
      antiforgeryApi.middleware,
      aboutApi.middleware,
      socialsApi.middleware,
    ),
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)