import api from "@/services/api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";



/* =========================
   LOGIN
========================= */

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `users?email=${encodeURIComponent(email)}`
      );

      const user = response.data[0];

      if (!user) {
        return rejectWithValue("User not found");
      }

      if (user.password !== password) {
        return rejectWithValue("Incorrect password");
      }

      if (!user.isActive) {
        return rejectWithValue("Your account has been deactivated");
      }

      return user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Login failed"
      );
    }
  }
);


/* =========================
   SIGNUP
========================= */

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async ({ name, email, password }, { rejectWithValue }) => {
    try {
      // Check if email already exists
      const existingUser = await api.get(
        `users?email=${encodeURIComponent(email)}`
      );

      if (existingUser.data.length > 0) {
        return rejectWithValue(
          "An account with this email already exists"
        );
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
        role: "customer",
        isActive: true,
      };
      const response = await api.post(
        `users`,
        newUser
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Signup failed"
      );
    }
  }
);

const savedUser = localStorage.getItem("solexUser");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,

  isAuthenticated: !!savedUser,

  isLoading: false,

  error: null,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;

      localStorage.removeItem("solexUser");
    },

    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* =========================
         LOGIN
      ========================= */

      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        state.user = action.payload;

        state.isAuthenticated = true;

        state.error = null;

        localStorage.setItem(
          "solexUser",
          JSON.stringify(action.payload)
        );
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload;

        state.isAuthenticated = false;
      })


      /* =========================
         SIGNUP
      ========================= */

      .addCase(signupUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })

      .addCase(signupUser.fulfilled, (state, action) => {
        state.isLoading = false;

        state.user = action.payload;

        state.isAuthenticated = true;

        state.error = null;

        localStorage.setItem(
          "solexUser",
          JSON.stringify(action.payload)
        );
      })

      .addCase(signupUser.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload;

        state.isAuthenticated = false;
      });
  },
});

export const {
  logout,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
