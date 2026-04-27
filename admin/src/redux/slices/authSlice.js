import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  loading: false,
  error: null,

  // logout
  logoutLoading: false,
  logoutError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    signInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
    },

    signInFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    signOutSuccess: (state) => {
      state.currentUser = null;
      state.logoutLoading = false;
      state.logoutError = null;
    },

    signOutFailure: (state, action) => {
      state.logoutLoading = false;
      state.logoutError = action.payload;
    },
  },
});

export const {
  signInStart,
  signInSuccess,
  signInFailure,
  signOutSuccess,
  signOutFailure,
} = authSlice.actions;

export default authSlice.reducer;
