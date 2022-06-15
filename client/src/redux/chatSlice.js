import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const newChat = createAsyncThunk(
  "chat/newChat",
  async (info, { rejectWithValue, dispatch }) => {
    try {
      const result = await axios.post("/chatroom/", info, {
        headers: { token: localStorage.getItem("token") },
      });
      dispatch(getChats());
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data.msg)
        ? error.response.data.msg
        : error.response.data.errors.password.msg;
    }
  }
);

export const getChats = createAsyncThunk(
  "chat/getChats",
  async (info, { rejectWithValue }) => {
    try {
      const result = await axios.get("/chatroom/", {
        headers: { token: localStorage.getItem("token") },
      });
      return result.data;
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chats: [],
    loading: false,
    chatErrors: null,
    chatsErrors: null,
    chat: {},
  },

  extraReducers: {
    [newChat.pending]: (state) => {
      state.loading = true;
    },
    [newChat.fulfilled]: (state, action) => {
      state.loading = false;
      state.chatErrors = null;
    },
    [newChat.rejected]: (state, action) => {
      state.loading = false;
      state.errors = action.payload;
    },

    //getTodos
    [getChats.pending]: (state) => {
      state.loading = true;
    },
    [getChats.fulfilled]: (state, action) => {
      state.loading = false;
      state.chats = action.payload;
      state.chatsErrors = null;
    },
    [getChats.rejected]: (state, action) => {
      state.loading = false;
      state.chatsErrors = action.payload;
    },
  },
});

export default chatSlice.reducer;
