import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'

/**
 * Configure and create the Redux store
 * @type {import('@reduxjs/toolkit').EnhancedStore}
 */
export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

/**
 * Root state type - inferred from store.getState
 * @typedef {ReturnType<typeof store.getState>} RootState
 */

/**
 * App dispatch type - inferred from store.dispatch
 * @typedef {typeof store.dispatch} AppDispatch
 */
