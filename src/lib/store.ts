import { configureStore } from "@reduxjs/toolkit";
import todo from "./features/todo";
import todoItem from "./features/todoItem";

export const makeStore = () =>
  configureStore({
    reducer: {
      todo,
      todoItem,
    },
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
