import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // get dashboard data
  // dashboardData: [],
  // pagination: null,
  stats: null,
  dashboardDataLoading: false,
  dashboardDataError: null,
};

const dashboardSlice = createSlice({
  name: "dashboardData",
  initialState,
  reducers: {
    // ================= GET DASHBOARD DATA =================
    getDashboardDataStart: (state) => {
      state.dashboardDataLoading = true;
      state.dashboardDataError = null;
    },

    getDashboardDataSuccess: (state, action) => {
      // state.users = action.payload.users;
      // state.pagination = action.payload.pagination;
      state.stats = action.payload.stats;
      state.dashboardDataLoading = false;
    },

    getDashboardDataFailure: (state, action) => {
      state.dashboardDataLoading = false;
      state.dashboardDataError = action.payload;
    },
  },
});

export const {
  getDashboardDataStart,
  getDashboardDataSuccess,
  getDashboardDataFailure,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
