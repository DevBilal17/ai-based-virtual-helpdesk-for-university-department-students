import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../utils/constants";

export const authApi = createApi({
  reducerPath: "authApi",

  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/`,

    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),

  endpoints: (builder) => ({
    // LOGIN
    login: builder.mutation({
      query: (body) => ({
        url: "auth/login",
        method: "POST",
        body,
      }),
    }),

    // SEND OTP
    sendOtp: builder.mutation({
      query: (body) => ({
        url: "auth/send-otp",
        method: "POST",
        body,
      }),
    }),

    // VERIFY OTP
    verifyOtp: builder.mutation({
      query: (body) => ({
        url: "auth/verify-otp",
        method: "POST",
        body,
      }),
    }),

    // RESET PASSWORD
    resetPassword: builder.mutation({
      query: (body) => ({
        url: "auth/reset-password",
        method: "POST",
        body,
      }),
    }),

    // New Password
    newPassword: builder.mutation({
      query: (body) => ({
        url: "auth/change-password",
        method: "POST",
        body,
      }),
    }),

     // ================= GET PROFILE =================
    getProfile: builder.query({
      query: () => ({
        url: "users/profile",
        method: "GET",
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetPasswordMutation,
  useNewPasswordMutation,
  useGetProfileQuery
} = authApi;
