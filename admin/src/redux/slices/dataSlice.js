import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // get all files
  files: [],
  pagination: null,
  filesLoading: false,
  filesError: null,

  // add file
  loading: false,
  error: null,
  addedFile: null,

  // delete file
  deleteLoading: false,
  deleteError: null,
};

const dataSlice = createSlice({
  name: "data",
  initialState,

  reducers: {
    // ================= GET ALL DATA =================
    getAllDataStart: (state) => {
      state.filesLoading = true;
      state.filesError = null;
    },

    getAllDataSuccess: (state, action) => {
      state.filesLoading = false;
      state.files = action.payload.files;
      state.pagination = action.payload.pagination;
    },

    getAllDataFailure: (state, action) => {
      state.filesLoading = false;
      state.filesError = action.payload;
    },

    // ================= ADD DATA =================
    addDataStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    addDataSuccess: (state, action) => {
      state.loading = false;
      state.addedFile = action.payload;
    },

    addDataFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // ================= DELETE DATA =================
    deleteDataByIdStart: (state) => {
      state.deleteLoading = true;
      state.deleteError = null;
    },

    deleteDataByIdSuccess: (state, action) => {
      state.deleteLoading = false;

      state.files = state.files.filter((file) => file._id !== action.payload);
    },

    deleteDataByIdFailure: (state, action) => {
      state.deleteLoading = false;
      state.deleteError = action.payload;
    },
  },
});

export const {
  getAllDataStart,
  getAllDataSuccess,
  getAllDataFailure,
  addDataStart,
  addDataSuccess,
  addDataFailure,
  deleteDataByIdStart,
  deleteDataByIdSuccess,
  deleteDataByIdFailure,
} = dataSlice.actions;

export default dataSlice.reducer;
