import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // get all users
  users: [],
  pagination: null,
  stats: null,
  usersLoading: false,
  usersError: null,

  // get user by id
  fetchedUser: null,
  userLoading: false,
  userError: null,

  // add user
  addedUser: null,
  addUserLoading: false,
  addUserError: null,

  // update user by id
  updatedUser: null,
  updateUserLoading: false,
  updateUserError: null,

  // delete user by id
  deleteUserLoading: false,
  deleteUserError: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // ================= GET ALL USERS =================
    getAllUsersStart: (state) => {
      state.usersLoading = true;
      state.usersError = null;
    },

    getAllUsersSuccess: (state, action) => {
      state.users = action.payload.users;
      state.pagination = action.payload.pagination;
      state.stats = action.payload.stats;
      state.usersLoading = false;
    },

    getAllUsersFailure: (state, action) => {
      state.usersLoading = false;
      state.usersError = action.payload;
    },

    // ================= GET USER BY ID =================

    getUserByIdStart: (state) => {
      state.userLoading = true;
      state.userError = null;
    },

    getUserByIdSuccess: (state, action) => {
      state.fetchedUser = action.payload;
      state.userLoading = false;
    },

    getUserByIdFailure: (state, action) => {
      state.userLoading = false;
      state.userError = action.payload;
    },

    // ================= ADD USER =================

    addUserStart: (state) => {
      state.addUserLoading = true;
      state.addUserError = null;
    },

    addUserSuccess: (state, action) => {
      state.addUserLoading = false;
      state.addedUser = action.payload;

      // add new user to list (important)
      state.users.push(action.payload);
    },

    addUserFailure: (state, action) => {
      state.addUserLoading = false;
      state.addUserError = action.payload;
    },

    // ================= UPDATE USER BY ID =================

    updateUserByIdStart: (state) => {
      state.updateUserLoading = true;
      state.updateUserError = null;
    },

    updateUserByIdSuccess: (state, action) => {
      state.updateUserLoading = false;
      state.updatedUser = action.payload;

      // update user in list (important)
      state.users = state.users.map((user) =>
        user._id === action.payload._id ? action.payload : user,
      );
    },

    updateUserByIdFailure: (state, action) => {
      state.updateUserLoading = false;
      state.updateUserError = action.payload;
    },

    // ================= DELETE USER =================
    deleteUserByIdStart: (state) => {
      state.deleteUserLoading = true;
      state.deleteUserError = null;
    },

    deleteUserByIdSuccess: (state, action) => {
      state.deleteUserLoading = false;

      // Remove deleted user from list
      state.users = state.users.filter((user) => user._id !== action.payload);
    },

    deleteUserByIdFailure: (state, action) => {
      state.deleteUserLoading = false;
      state.deleteUserError = action.payload;
    },
  },
});

export const {
  getAllUsersStart,
  getAllUsersSuccess,
  getAllUsersFailure,
  getUserByIdStart,
  getUserByIdSuccess,
  getUserByIdFailure,
  addUserStart,
  addUserSuccess,
  addUserFailure,
  updateUserByIdStart,
  updateUserByIdSuccess,
  updateUserByIdFailure,
  deleteUserByIdStart,
  deleteUserByIdSuccess,
  deleteUserByIdFailure,
} = userSlice.actions;

export default userSlice.reducer;
