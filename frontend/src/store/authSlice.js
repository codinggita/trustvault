import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { setAuthToken } from '../../services/authService'

// Get base URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Async thunks
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password })
      // Save token to localStorage and set axios header
      localStorage.setItem('token', response.data.token)
      setAuthToken(response.data.token)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, firstName, lastName }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { 
        email, 
        password, 
        firstName, 
        lastName 
      })
      localStorage.setItem('token', response.data.token)
      setAuthToken(response.data.token)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_URL}/auth/logout`)
      localStorage.removeItem('token')
      setAuthToken(null)
      return {}
    } catch (error) {
      return rejectWithValue(error.response.data)
    }
  }
)

// Check if user is logged in (for persistence)
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    const token = localStorage.getItem('token')
    if (!token) {
      return rejectWithValue('No token found')
    }
    setAuthToken(token)
    try {
      const response = await axios.get(`${API_URL}/auth/me`)
      return response.data
    } catch (error) {
      localStorage.removeItem('token')
      setAuthToken(null)
      return rejectWithValue(error.response.data)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
    error: null,
    success: false
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearSuccess: (state) => {
      state.success = false
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.success = true
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.message || 'Login failed'
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
        state.token = action.payload.token
        state.success = true
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload.message || 'Registration failed'
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false
        state.user = null
        state.token = null
        state.isLoading = false
      })
      // Check auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload.user
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isLoading = false
        state.isAuthenticated = false
        state.user = null
        state.token = null
      })
  }
})

export const { clearError, clearSuccess } = authSlice.actions
export default authSlice.reducer