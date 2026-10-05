import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setCredentials,
  logout,
  setLoading,
  setError,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
