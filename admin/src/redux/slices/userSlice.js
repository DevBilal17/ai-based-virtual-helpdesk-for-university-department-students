import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // get all users
  users: [],
  pagination: null,
  stats: null,
  usersLoading: false,
  usersError: null,

  // get user by id, update user, delete user, create user
  thisUser: null,
  loading: false,
  error: null,
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

    getUserByIdStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    getUserByIdSuccess: (state, action) => {
      state.thisUser = action.payload;
      state.loading = false;
    },

    getUserByIdFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // createUserStart: (state) => {
    //   state.loading = true;
    //   state.error = null;
    // },

    // createUserSuccess: (state, action) => {
    //   state.thisUser = action.payload;
    //   state.loading = false;
    // },

    // createUserFailure: (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // },

    // updateUserByIdStart: (state) => {
    //   state.loading = true;
    //   state.error = null;
    // },

    // updateUserByIdSuccess: (state, action) => {
    //   state.thisUser = action.payload;
    //   state.loading = false;
    // },

    // updateUserByIdFailure: (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // },

    // deleteUserByIdStart: (state) => {
    //   state.loading = true;
    //   state.error = null;
    // },

    // deleteUserByIdSuccess: (state, action) => {
    //   state.thisUser = action.payload;
    //   state.loading = false;
    // },

    // deleteUserByIdFailure: (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // },
  },
});

export const {
  getUsersStart,
  getUsersSuccess,
  getUsersFailure,
  getUserByIdStart,
  getUserByIdSuccess,
  getUserByIdFailure,
  // createUserStart,
  // createUserSuccess,
  // createUserFailure,
  // updateUserByIdStart,
  // updateUserByIdSuccess,
  // updateUserByIdFailure,
  // deleteUserByIdStart,
  // deleteUserByIdSuccess,
  // deleteUserByIdFailure,
} = userSlice.actions;

export default userSlice.reducer;
