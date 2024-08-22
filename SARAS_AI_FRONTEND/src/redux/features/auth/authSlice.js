import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { baseUrl } from '../../../utils/baseURL';
import { toast } from 'react-toastify';

import axiosInstance from '../../services/httpService';

// login api
export const login = createAsyncThunk('login', async data => {
    const response = await axiosInstance.post(`${baseUrl}/login`, data);
    return response.data;
});

export const logout = createAsyncThunk('logout', async () => {
    const response = await axiosInstance.post(`${baseUrl}/logout`);
    return response.data;
});

const initialState = {
    userData: {},
    login: false,
    role: null,
    name: '',
    accessToken: null,
    timezone_id: null,
    loading: false,
    error: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            // console.log('action.payload :', action.payload);
            state.login = action.payload.login;
            state.role = action.payload.role;
            state.accessToken = action.payload.accessToken;
        },
    },
    extraReducers: builder => {
        // user login
        builder.addCase(login.pending, state => {
            state.loading = true;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.loading = false;
            state.userData = action.payload.admin_user; // Update to use the correct user object
            state.login = true;
            state.name = action.payload.admin_user.name;
            state.role = action.payload.role;
            state.accessToken = action.payload.access_token;
            state.timezone_id = action.payload.admin_user.timezone_id;

            localStorage.setItem('name', action.payload.admin_user.name);
            localStorage.setItem('login', true);
            localStorage.setItem('accessToken', action.payload.access_token);
            localStorage.setItem('role', action.payload.role);
            localStorage.setItem(
                'timezone_id',
                action.payload.admin_user.timezone_id
            ); // Store timezone_id
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
            state.userData = [];
            state.login = false;
        });

        // user logout
        builder.addCase(logout.pending, state => {
            state.loading = true;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            state.loading = false;
            state.login = false;
            state.userData = [];
            state.timezone_id = null; // Clear timezone_id in state

            localStorage.setItem('login', false);
            localStorage.setItem('accessToken', '');
            localStorage.setItem('role', '');
            localStorage.removeItem('timezone_id'); // Remove timezone_id from localStorage
            localStorage.removeItem('name', '');
        });
    },
});

export const { setLogin } = authSlice.actions;

export default authSlice.reducer;
