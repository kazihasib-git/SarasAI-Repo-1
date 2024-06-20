import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../utils/baseURL";

export const studentsApi = createApi({
    reducerPath : 'studentsApi',
    baseQuery : fetchBaseQuery({ baseUrl }),
    endpoints : (builder) => ({
        getStudents : builder.query({
            query : () => `/students`,
        }),
    })
})

export const  { useGetStudentsQuery } = studentsApi;