import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; // Ensure the correct import
import { baseUrl } from '../../../utils/baseURL'; // Correct path for baseURL

export const hostsApi = createApi({
    reducerPath: 'hostsApi',
    baseQuery: fetchBaseQuery({ baseUrl: baseUrl }), // Correct key for baseUrl
    endpoints: (builder) => ({
        getHosts: builder.query({
            query: () => '/admin/zoom',
        }),
    }),
});

export const { useGetHostsQuery } = hostsApi;
