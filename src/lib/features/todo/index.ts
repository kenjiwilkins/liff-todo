import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { IToDoList } from "@/lib/types";

export interface ITodoState {
  lists: IToDoList[];
}

const initialState: ITodoState = {
  lists: [],
};

export const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    removeToDoList: (state, action: PayloadAction<string>) => {
      state.lists = state.lists.filter((list) => list.id !== action.payload);
    },
    addToDoList: (state, action: PayloadAction<IToDoList>) => {
      state.lists.push(action.payload);
    },
    setToDoLists: (state, action: PayloadAction<IToDoList[]>) => {
      state.lists = action.payload;
    },
    setToDoListPseudo: (state, action: PayloadAction<number>) => {
      state.lists[action.payload].psuedo = true;
    },
  },
});

export const { removeToDoList, addToDoList, setToDoLists, setToDoListPseudo } =
  todoSlice.actions;
export const selectTodoLists = (state: RootState) => state.todo.lists;
export default todoSlice.reducer;
