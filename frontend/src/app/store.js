import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "../features/citizen/citizenSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
  },
});
