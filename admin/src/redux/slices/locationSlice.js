import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // get all locations
  locations: [],
  pagination: null,
  stats: null,
  locationsLoading: false,
  locationsError: null,

  // get location by id
  fetchedLocation: null,
  locationLoading: false,
  locationError: null,

  // add location
  addedLocation: null,
  addLocationLoading: false,
  addLocationError: null,

  // update location by id
  updatedLocation: null,
  updateLocationLoading: false,
  updateLocationError: null,

  // delete location by id
  deleteLocationLoading: false,
  deleteLocationError: null,

  // change location status
  changeStatusLoading: false,
  changeStatusError: null,
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    // ================= GET ALL LOCATIONS =================
    getAllLocationsStart: (state) => {
      state.locationsLoading = true;
      state.locationsError = null;
    },

    getAllLocationsSuccess: (state, action) => {
      state.locations = action.payload.locations || [];
      state.pagination = action.payload.pagination || null;
      state.stats = action.payload.stats || null;
      state.locationsLoading = false;
    },

    getAllLocationsFailure: (state, action) => {
      state.locationsLoading = false;
      state.locationsError = action.payload;
    },

    // ================= GET LOCATION BY ID =================

    getLocationByIdStart: (state) => {
      state.locationLoading = true;
      state.locationError = null;
    },

    getLocationByIdSuccess: (state, action) => {
      state.fetchedLocation = action.payload;
      state.locationLoading = false;
    },

    getLocationByIdFailure: (state, action) => {
      state.locationLoading = false;
      state.locationError = action.payload;
    },

    // ================= ADD LOCATION =================

    addLocationStart: (state) => {
      state.addLocationLoading = true;
      state.addLocationError = null;
    },

    addLocationSuccess: (state, action) => {
      state.addLocationLoading = false;

      state.addedLocation = action.payload;

      console.log("Added Location:", action.payload);

      if (!Array.isArray(state.locations)) {
        state.locations = [];
      }

      state.locations.unshift(action.payload);
    },

    addLocationFailure: (state, action) => {
      state.addLocationLoading = false;
      state.addLocationError = action.payload;
    },

    // ================= UPDATE LOCATION BY ID =================

    updateLocationByIdStart: (state) => {
      state.updateLocationLoading = true;
      state.updateLocationError = null;
    },

    updateLocationByIdSuccess: (state, action) => {
      state.updateLocationLoading = false;
      state.updatedLocation = action.payload;

      // update location in list (important)
      state.locations = state.locations.map((location) =>
        location._id === action.payload._id ? action.payload : location,
      );
    },

    updateLocationByIdFailure: (state, action) => {
      state.updateLocationLoading = false;
      state.updateLocationError = action.payload;
    },

    // ================= DELETE LOCATION BY ID =================
    deleteLocationByIdStart: (state) => {
      state.deleteLocationLoading = true;
      state.deleteLocationError = null;
    },

    deleteLocationByIdSuccess: (state, action) => {
      state.deleteLocationLoading = false;

      // Remove deleted location from list
      state.locations = state.locations.filter(
        (location) => location._id !== action.payload,
      );
    },

    deleteLocationByIdFailure: (state, action) => {
      state.deleteLocationLoading = false;
      state.deleteLocationError = action.payload;
    },

    // ================= CHANGE LOCATION STATUS =================
    changeLocationStatusStart: (state) => {
      state.changeStatusLoading = true;
      state.changeStatusError = null;
    },

    changeLocationStatusSuccess: (state, action) => {
      state.changeStatusLoading = false;

      // update status in list (important)
      state.locations = state.locations.map((location) =>
        location._id === action.payload._id ? action.payload : location,
      );
    },

    changeLocationStatusFailure: (state, action) => {
      state.changeStatusLoading = false;
      state.changeStatusError = action.payload;
    },
  },
});

export const {
  getAllLocationsStart,
  getAllLocationsSuccess,
  getAllLocationsFailure,
  getLocationByIdStart,
  getLocationByIdSuccess,
  getLocationByIdFailure,
  addLocationStart,
  addLocationSuccess,
  addLocationFailure,
  updateLocationByIdStart,
  updateLocationByIdSuccess,
  updateLocationByIdFailure,
  deleteLocationByIdStart,
  deleteLocationByIdSuccess,
  deleteLocationByIdFailure,
  changeLocationStatusStart,
  changeLocationStatusSuccess,
  changeLocationStatusFailure,
} = locationSlice.actions;

export default locationSlice.reducer;
