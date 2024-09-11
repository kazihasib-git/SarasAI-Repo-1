import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { baseUrl } from '../../../utils/baseURL';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/httpService';

// login api
export const login = createAsyncThunk(
    'login',
    async (data, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(`${baseUrl}/login`, data);
            return response.data;
        } catch (error) {
            if (error) {
                if (error.response && error.response.data) {
                    return rejectWithValue(error.response.data.message);
                } else {
                    return rejectWithValue('An Error Occurred While Login');
                }
            }
        }
    }
);

// Logout api
export const logout = createAsyncThunk('logout', async rejectWithValue => {
    try {
        const response = await axiosInstance.post(`${baseUrl}/logout`);
        return response.data;
    } catch (error) {
        if (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue('An Error Occurred While Login');
            }
        }
    }
});

//forgot api
export const forgotPassword = createAsyncThunk(
    'forgotPassword',
    async ({ username, method }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/forgot-password`,
                {
                    username: username,
                    method: method,
                }
            );
            return response.data;
        } catch (error) {
            if (error) {
                if (error.response && error.response.data) {
                    return rejectWithValue(error.response.data.message);
                } else {
                    return rejectWithValue(
                        'An error occureded while forgot password'
                    );
                }
            }
        }
    }
);

//reset password
export const resetPassword = createAsyncThunk(
    'resetPassword',
    async (
        { username, otp, password, password_confirmation },
        { rejectWithValue }
    ) => {
        try {
            const response = await axiosInstance.post(
                `${baseUrl}/reset-password`,
                {
                    username: username,
                    otp: otp,
                    password: password,
                    password_confirmation: password_confirmation,
                }
            );
            return response.data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message);
            } else {
                return rejectWithValue(
                    'An error occureded while reset password'
                );
            }
        }
    }
);

const initialState = {
    userData: {},
    loginData: {},
    login: false,
    role: null,
    name: '',
    username: null,
    accessToken: null,
    timezoneId: null,
    loading: false,
    error: [],
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setLogin: (state, action) => {
            state.login = action.payload.login;
            state.role = action.payload.role;
            state.accessToken = action.payload.accessToken;
            state.timezoneId = action.payload.timezone_id;
        },
    },
    extraReducers: builder => {
        // user login
        builder.addCase(login.pending, state => {
            state.loading = true;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            toast.success(action.payload.message || 'Login Successfully');
            state.loading = false;
            state.loginData = action.payload;
            state.userData = action.payload.admin_user; // Update to use the correct user object
            state.login = true;
            state.name = action.payload.admin_user.name;
            state.role = action.payload.role;

            state.accessToken = action.payload.access_token;
            state.timezoneId = action.payload.admin_user.timezone_id;

            localStorage.setItem('name', action.payload.admin_user.name);
            localStorage.setItem('login', true);
            localStorage.setItem('accessToken', action.payload.access_token);
            localStorage.setItem('role', action.payload.role);
            localStorage.setItem(
                'timezone_id',
                action.payload.admin_user.timezone_id
            );
        });
        builder.addCase(login.rejected, (state, action) => {
            toast.error(action.payload || 'Failed To Login');
            state.loading = false;
            state.error = action.error.message;
            state.userData = {};
            state.loginData = {};

            state.login = false;
        });

        // user logout
        builder.addCase(logout.pending, state => {
            state.loading = true;
        });
        builder.addCase(logout.fulfilled, (state, action) => {
            toast.success(action.payload.message || 'Logout Successfully');
            state.loading = false;
            state.login = false;
            state.userData = [];
            state.timezoneId = null;

            localStorage.clear();
        });
        builder.addCase(logout.rejected, (state, action) => {
            toast.error(action.payload || 'Failed To Logout');
            state.loading = false;
        });

        //user forgot password
        builder.addCase(forgotPassword.pending, state => {
            state.loading = true;
        });
        builder.addCase(forgotPassword.fulfilled, (state, action) => {
            state.userData = action.payload.data;
            toast.success(action.payload.message || 'Forgot Password');
            state.loading = false;
        });

        builder.addCase(forgotPassword.rejected, (state, action) => {
            toast.error(action.payload || 'Failed To Forgot Password');
            state.loading = false;
        });

        //user reset password
        builder.addCase(resetPassword.pending, state => {
            state.loading = true;
        });
        builder.addCase(resetPassword.fulfilled, (state, action) => {
            toast.success(action.payload.message || 'Reset Password');
            state.loading = false;
        });

        builder.addCase(resetPassword.rejected, (state, action) => {
            toast.error(action.payload || 'Failed To Reset Password');
            state.loading = false;
        });
    },
});

export const { setLogin } = authSlice.actions;

export default authSlice.reducer;
