import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from "../../../utils/baseURL";

// Create the API slice for timezones
export const timezonesApi = createApi({
    reducerPath: 'timezonesApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        getTimezones: builder.query({
            query: () => '/timezones',
        }),
    }),
});

// Export the auto-generated hook for the `getTimezones` query
export const { useGetTimezonesQuery } = timezonesApi;
