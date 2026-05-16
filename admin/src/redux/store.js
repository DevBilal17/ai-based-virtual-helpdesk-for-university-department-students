import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js";
import userReducer from "./slices/userSlice.js";
import dataReducer from "./slices/dataSlice.js";
import layoutReducer from "./slices/layoutSlice.js";
import faqReducer from "./slices/faqSlice.js";
import dashboardReducer from "./slices/dashboardSlice.js";
import locationReducer from "./slices/locationSlice.js";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
  data: dataReducer,
  layout: layoutReducer,
  faq: faqReducer,
  dashboardData: dashboardReducer,
  locationData: locationReducer,
});

const persistConfig = {
  key: "root",
  storage,
  version: 1,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
