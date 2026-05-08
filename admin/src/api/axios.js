import axios from "axios";
import { store, persistor } from "../redux/store.js";
import { signOutSuccess } from "../redux/slices/authSlice.js";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

// REQUEST INTERCEPTOR
axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth?.currentUser?.data?.token;

  console.log("Request Interceptor - Token:", token);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.log("Unauthorized / Token expired");

      // Clear Redux state
      // store.dispatch(signOutSuccess());

      // Clear persisted storage (PROFESSIONAL WAY)
      // await persistor.purge();

      // Redirect to login
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
