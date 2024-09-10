import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseUrl } from '../../../utils/baseURL';

export const platformsApi = createApi({
    reducerPath : 'platformsApi',
    baseQuery :  fetchBaseQuery({ baseUrl: baseUrl }),
    endpoints : builder => ({
        getPlatforms : builder.query({
            query : () => '/platform-tools',
        }),
    }),
});

export const { useGetPlatformsQuery } = platformsApi;