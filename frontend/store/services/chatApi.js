import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../utils/constants";

export const chatApi = createApi({
  reducerPath: "chatApi",
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
  // TagTypes help in "Auto-refetching" history when a new message is sent
  tagTypes: ["Chat"],

  endpoints: (builder) => ({
    // 1. ASK QUESTION (The main RAG query)
    askQuestion: builder.mutation({
      query: (body) => ({
        url: "chat/ask",
        method: "POST",
        body, // Expects { query, chatId }
      }),
      // Invalidates tags to refresh the history list if needed
      invalidatesTags: ["Chat"],
    }),

    // 2. GET CHAT HISTORY (To show previous messages)
    getChatHistory: builder.query({
      query: (chatId) => `chat/history/${chatId}`,
      providesTags: ["Chat"],
    }),

    // 3. GET ALL USER CONVERSATIONS (For a sidebar or list view)
    getUserChats: builder.query({
      query: () => "chat/all",
      providesTags: ["Chat"],
    }),

    // 4. DELETE CHAT
    deleteChat: builder.mutation({
      query: (chatId) => ({
        url: `chat/${chatId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Chat"],
    }),
  }),
});

export const {
  useAskQuestionMutation,
  useGetChatHistoryQuery,
  useGetUserChatsQuery,
  useDeleteChatMutation,
} = chatApi;