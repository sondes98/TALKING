import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const register = createAsyncThunk(
  "user/register",
  async (info, { rejectWithValue }) => {
    try {
      const res = await axios.post("/user/register", info);
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response.data.message
          ? error.response.data.message
          : error.response.data.errors.password.msg
      );
    }
  }
);

export const login = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post("/user/login", data);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: JSON.parse(localStorage.getItem("user")),
    loading: false,
    registerErrors: null,
    loginErrors: null,
    token: localStorage.getItem("token"),
    isAuth: Boolean(localStorage.getItem("isAuth")),
  },
  reducers: {
    logout: (state) => {
      state.isAuth = false;
      state.userInfo = {};
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAuth");
    },
    clearErrors: (state) => {
      state.registerErrors = null;
      state.loginErrors = null;
    },
  },
  extraReducers: {
    [register.pending]: (state) => {
      state.loading = true;
    },
    [register.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = true;
      state.errors = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("isAuth", true);
    },
    [register.rejected]: (state, action) => {
      state.registerErrors = action.payload;
      state.isAuth = false;
    },
    [login.pending]: (state) => {
      state.loading = true;
    },
    [login.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
      state.isAuth = true;
      state.errors = null;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("isAuth", true);
    },
    [login.rejected]: (state, action) => {
      state.loginErrors = action.payload;
      state.isAuth = false;
    },
  },
});

export default userSlice.reducer;
export const { logout, clearErrors } = userSlice.actions;
