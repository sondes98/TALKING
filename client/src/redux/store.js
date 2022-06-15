import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import chatReducer from "./chatSlice";
import postReducer from "./postSlice";

const store = configureStore({
  reducer: { user: userReducer, chat: chatReducer, post: postReducer },
});
export default store;
