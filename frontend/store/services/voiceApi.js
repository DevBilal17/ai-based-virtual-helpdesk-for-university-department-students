import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../utils/constants";

export const voiceApi = createApi({
  reducerPath: "voiceApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/voice/`,
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem("token");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
     
      return headers;
    },
  }),
  tagTypes: ["Voice","Chat"],

  endpoints: (builder) => ({
    // 1. PROCESS VOICE (Audio to Text & AI Reply)
    processVoice: builder.mutation({
      query: (body) => ({
        url: "process",
        method: "POST",
        body, // Expects FormData with 'audio' and 'chatId'
      }),
     
      invalidatesTags: ["Chat"], 
    }),

     // ----------------------------
    // 2. TEXT + INTERNET API (NEW)
    // ----------------------------
    processText: builder.mutation({
      query: (body) => ({
        url: "query/process",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const { useProcessVoiceMutation ,useProcessTextMutation} = voiceApi;