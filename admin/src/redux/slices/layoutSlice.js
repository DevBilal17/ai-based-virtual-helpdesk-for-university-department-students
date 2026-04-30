import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isSidebarCollapsed: false, // controls whether the sidebar is collapsed or expanded
};

const layoutSlice = createSlice({
  name: "layout",
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.isSidebarCollapsed = !state.isSidebarCollapsed;
    },
  },
});

export const { toggleSidebar } = layoutSlice.actions;

export default layoutSlice.reducer;
