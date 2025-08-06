import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { userLoggedIn, userLoggedOut } from "../authSlice";


const user_api = "http://localhost:8080/api/v1/user/";


export const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: user_api,
        credentials: 'include'
    }),
    endpoints: (builder) => ({
        //for register
        registerUser: builder.mutation({
            query: (inputData) => ({
                url: "register",
                method: "POST",
                body: inputData
            })
        }),
        //for login
        loginUser: builder.mutation({
            query: (inputData) => ({
                url: "login",
                method: "POST",
                body: inputData
            }),
            async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({ user: result.data.user }));
                   
                } catch (error) {
                    console.log(error);
                }
            }
        }),
        //logout user
        loggedOutUser: builder.mutation({
            query: () => ({
                url: "logout",
                method: "GET",
            }),
             async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    
                    dispatch(userLoggedOut());
                } catch (error) {
                    console.log(error);
                }
            }
            
        }),
            //load user
            loadUser: builder.query({
                query: () => ({
                    url: "profile",
                    method: "GET",

                }),
                 async onQueryStarted(_, { queryFulfilled, dispatch }) {
                try {
                    const result = await queryFulfilled;
                    dispatch(userLoggedIn({ user: result.data.user }));
                } catch (error) {
                    console.log(error);
                }
            }
            }),
            //updateUser
            updateUser: builder.mutation({
                query: (formData) => ({
                    url: "profile/update",
                    method: "PUT",
                    body: formData
                })
            })
       
    })
})

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLoadUserQuery,
    useUpdateUserMutation,
    useLoggedOutUserMutation

} = authApi;

