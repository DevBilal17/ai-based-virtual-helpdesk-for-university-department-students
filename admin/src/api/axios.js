import axios from "axios";
import { store } from "../redux/store.js";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.user?.currentUser?.token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosInstance;
