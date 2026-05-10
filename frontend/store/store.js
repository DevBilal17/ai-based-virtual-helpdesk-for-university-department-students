import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./services/authApi";
import { chatApi } from "./services/chatApi";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice"
import { voiceApi } from "./services/voiceApi";
export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat : chatReducer,
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath] : chatApi.reducer,
    [voiceApi.reducerPath] : voiceApi.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware,chatApi.middleware,voiceApi.middleware),
});