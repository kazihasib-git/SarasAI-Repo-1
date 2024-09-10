import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { baseUrl } from '../../../utils/baseURL';

export const timezonesApi = createApi({
    reducerPath: 'timezonesApi',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: builder => ({
        getTimezones: builder.query({
            query: () => '/timezones',
        }),
    }),
});

// Export the auto-generated hook for the `getTimezones` query
export const { useGetTimezonesQuery } = timezonesApi;
