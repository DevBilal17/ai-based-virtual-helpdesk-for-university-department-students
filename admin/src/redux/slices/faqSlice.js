import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // get all faqs
  faqs: [],
  pagination: null,
  stats: null,
  faqsLoading: false,
  faqsError: null,

  // get faq by id
  fetchedFaq: null,
  faqLoading: false,
  faqError: null,

  // add faq
  addedFaq: null,
  addFaqLoading: false,
  addFaqError: null,

  // update faq by id
  updatedFaq: null,
  updateFaqLoading: false,
  updateFaqError: null,

  // delete faq by id
  deleteFaqLoading: false,
  deleteFaqError: null,

  // change faq status
  changeStatusLoading: false,
  changeStatusError: null,
};

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    // ================= GET ALL FAQS =================
    getAllFaqsStart: (state) => {
      state.faqsLoading = true;
      state.faqsError = null;
    },

    getAllFaqsSuccess: (state, action) => {
      state.faqs = action.payload.faqs;
      state.pagination = action.payload.pagination;
      state.stats = action.payload.stats;
      state.faqsLoading = false;
    },

    getAllFaqsFailure: (state, action) => {
      state.faqsLoading = false;
      state.faqsError = action.payload;
    },

    // ================= GET FAQ BY ID =================

    getFaqByIdStart: (state) => {
      state.faqLoading = true;
      state.faqError = null;
    },

    getFaqByIdSuccess: (state, action) => {
      state.fetchedFaq = action.payload;
      state.faqLoading = false;
    },

    getFaqByIdFailure: (state, action) => {
      state.faqLoading = false;
      state.faqError = action.payload;
    },

    // ================= ADD FAQ =================

    addFaqStart: (state) => {
      state.addFaqLoading = true;
      state.addFaqError = null;
    },

    addFaqSuccess: (state, action) => {
      state.addFaqLoading = false;
      state.addedFaq = action.payload;

      // add new faq to list (important)
      state.faqs.push(action.payload);
    },

    addFaqFailure: (state, action) => {
      state.addFaqLoading = false;
      state.addFaqError = action.payload;
    },

    // ================= UPDATE FAQ BY ID =================

    updateFaqByIdStart: (state) => {
      state.updateFaqLoading = true;
      state.updateFaqError = null;
    },

    updateFaqByIdSuccess: (state, action) => {
      state.updateFaqLoading = false;
      state.updatedFaq = action.payload;

      // update faq in list (important)
      state.faqs = state.faqs.map((faq) =>
        faq._id === action.payload._id ? action.payload : faq,
      );
    },

    updateFaqByIdFailure: (state, action) => {
      state.updateFaqLoading = false;
      state.updateFaqError = action.payload;
    },

    // ================= DELETE FAQ BY ID =================
    deleteFaqByIdStart: (state) => {
      state.deleteFaqLoading = true;
      state.deleteFaqError = null;
    },

    deleteFaqByIdSuccess: (state, action) => {
      state.deleteFaqLoading = false;

      // Remove deleted faq from list
      state.faqs = state.faqs.filter((faq) => faq._id !== action.payload);
    },

    deleteFaqByIdFailure: (state, action) => {
      state.deleteFaqLoading = false;
      state.deleteFaqError = action.payload;
    },

    // ================= CHANGE FAQ STATUS =================
    changeFaqStatusStart: (state) => {
      state.changeStatusLoading = true;
      state.changeStatusError = null;
    },

    changeFaqStatusSuccess: (state, action) => {
      state.changeStatusLoading = false;

      // update status in list (important)
      state.faqs = state.faqs.map((faq) =>
        faq._id === action.payload._id ? action.payload : faq,
      );
    },

    changeFaqStatusFailure: (state, action) => {
      state.changeStatusLoading = false;
      state.changeStatusError = action.payload;
    },
  },
});

export const {
  getAllFaqsStart,
  getAllFaqsSuccess,
  getAllFaqsFailure,
  getFaqByIdStart,
  getFaqByIdSuccess,
  getFaqByIdFailure,
  addFaqStart,
  addFaqSuccess,
  addFaqFailure,
  updateFaqByIdStart,
  updateFaqByIdSuccess,
  updateFaqByIdFailure,
  deleteFaqByIdStart,
  deleteFaqByIdSuccess,
  deleteFaqByIdFailure,
  changeFaqStatusStart,
  changeFaqStatusSuccess,
  changeFaqStatusFailure,
} = faqSlice.actions;

export default faqSlice.reducer;
