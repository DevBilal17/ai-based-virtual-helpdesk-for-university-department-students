import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { chatApi } from "./services/chatApi";
import authReducer from "./slices/authSlice";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath] : chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,chatApi.middleware),
});