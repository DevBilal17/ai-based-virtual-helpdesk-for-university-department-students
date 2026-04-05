import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  pagination: null,
  stats: null,
  usersLoading: false,
  usersError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    getUsersStart: (state) => {
      state.usersLoading = true;
      state.usersError = null;
    },

    getUsersSuccess: (state, action) => {
      state.users = action.payload.users;
      state.pagination = action.payload.pagination;
      state.stats = action.payload.stats;
      state.usersLoading = false;
    },

    getUsersFailure: (state, action) => {
      state.usersLoading = false;
      state.usersError = action.payload;
    },
  },
});

export const { getUsersStart, getUsersSuccess, getUsersFailure } =
  userSlice.actions;

export default userSlice.reducer;
