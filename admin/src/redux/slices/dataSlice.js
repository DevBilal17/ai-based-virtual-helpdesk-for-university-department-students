import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // get all files
  files: [],
  pagination: null,
  stats: null,
  filesLoading: false,
  filesError: null,

  // add file
  addedFile: null,
  addFileLoading: false,
  addFileError: null,

  // delete file
  deleteFileLoading: false,
  deleteFileError: null,
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
      state.files = action.payload.files;
      state.pagination = action.payload.pagination;
      state.stats = action.payload.stats;
      state.filesLoading = false;
    },

    getAllDataFailure: (state, action) => {
      state.filesLoading = false;
      state.filesError = action.payload;
    },

    // ================= ADD DATA =================
    addDataStart: (state) => {
      state.addFileLoading = true;
      state.addFileError = null;
    },

    addDataSuccess: (state, action) => {
      state.addFileLoading = false;
      state.addedFile = action.payload;

      // add new file to list (important)
      state.files.push(action.payload);
    },

    addDataFailure: (state, action) => {
      state.addFileLoading = false;
      state.addFileError = action.payload;
    },

    // ================= DELETE DATA =================
    deleteDataByIdStart: (state) => {
      state.deleteFileLoading = true;
      state.deleteFileError = null;
    },

    deleteDataByIdSuccess: (state, action) => {
      state.deleteFileLoading = false;

      // Remove deleted file from list
      state.files = state.files.filter((file) => file._id !== action.payload);
    },

    deleteDataByIdFailure: (state, action) => {
      state.deleteFileLoading = false;
      state.deleteFileError = action.payload;
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
