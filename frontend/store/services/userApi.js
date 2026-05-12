import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BASE_URL } from "../../utils/constants";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/api/user/`, // Base URL path for users
    prepareHeaders: async (headers) => {
      const token = await AsyncStorage.getItem("token");
      
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }

      return headers;
    },
  }),
  tagTypes: ["User"], 
  endpoints: (builder) => ({
    
    // UPDATE PROFILE (Student)
    updateStudentProfile: builder.mutation({
      query: ({ id, formData }) => ({
        url: `update-student-profile/${id}`,
        method: "PUT",
        body: formData, 
      }),
      invalidatesTags: ["User"], 
    }),

   
  }),
});

export const { useUpdateStudentProfileMutation } = userApi;