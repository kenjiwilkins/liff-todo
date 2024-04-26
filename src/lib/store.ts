import { configureStore } from "@reduxjs/toolkit";
import todo from "./features/todo";
import counterReducer from "./features/counter/counterSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      todo,
      counter: counterReducer,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
