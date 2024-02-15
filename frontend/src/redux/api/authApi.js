import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { userApi } from './userApi';

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({ baseUrl: "/api/v1" }),
    endpoints: (builder) => ({
        // post request so use mutation
        register: builder.mutation({
            query: (body) => ({
                url: "/register",
                method: "post",
                body,
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    await dispatch(userApi.endpoints.getMe.initiate(null))
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        login: builder.mutation({
            query: (body) => ({
                url: "/login",
                method: "post",
                body,
            }),
            async onQueryStarted(args, { dispatch, queryFulfilled }) {
                try {
                    await queryFulfilled;
                    await dispatch(userApi.endpoints.getMe.initiate(null))
                } catch (error) {
                    console.log(error)
                }
            }
        }),
        logout: builder.query({
            query: () => "/logout",
        })
    }),
});

export const { useLoginMutation, useRegisterMutation, useLazyLogoutQuery } = authApi;

// notes:
// keepUnusedDataFor :- data will remain in the cache for 60 seconds after the subscriber reference count hits zero.
// if you want to change the cache clear data timing
// ex:- keepUnusedDataFor:30  (put after baseQuery)