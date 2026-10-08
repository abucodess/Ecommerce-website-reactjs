import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

const savedAdmin = localStorage.getItem("solexAdminUser");
const parsedAdmin = savedAdmin ? JSON.parse(savedAdmin) : null;

const initialState = {
  user: parsedAdmin,
  isAuthenticated: !!parsedAdmin,
  isLoading: false,
  error: null,
};
export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `users?email=${email}`,
      );
      console.log(response)

      if (response.data.length === 0) {
        return rejectWithValue("no account found");
      }

      let admin = response.data[0]
      if(admin.password!==password){
        return rejectWithValue("wrong password")
      }
      console.log(admin.role)
      if(admin.role !== "admin") {
        return rejectWithValue("user is not an admin")
      }
      return response.data[0];
    } catch (error) {
      return rejectWithValue(error);
    }
  },
);
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("solexAdminUser");
    },

    clearError: (state) => {
      state.error = null;
    }},
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        localStorage.setItem("solexAdminUser", JSON.stringify(action.payload));
      })
      .addCase(loginAdmin.rejected,(state,action)=>{
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
  },
});

export const {logout,clearError} =
  authSlice.actions;

export default authSlice.reducer;
