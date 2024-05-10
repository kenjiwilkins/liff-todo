import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/lib/store";
import { IToDoListItem } from "@/lib/types";

export interface ITodoItemState {
  items: IToDoListItem[];
}

const initialState: ITodoItemState = {
  items: [],
};

export const todoItemSlice = createSlice({
  name: "todoItem",
  initialState,
  reducers: {
    removeToDoItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    addToDoItem: (state, action: PayloadAction<IToDoListItem>) => {
      state.items.push(action.payload);
    },
    setToDoItems: (state, action: PayloadAction<IToDoListItem[]>) => {
      state.items = action.payload;
    },
    setToDoItemPseudo: (state, action: PayloadAction<number>) => {
      state.items[action.payload].psuedo = true;
    },
    flipToDoItem: (
      state,
      action: PayloadAction<{ isDone: boolean; index: number }>,
    ) => {
      state.items[action.payload.index].done = action.payload.isDone;
      console.log(state.items[action.payload.index].done);
    },
    resetToDoItems: (state) => {
      state.items = [];
    },
  },
});

export const {
  removeToDoItem,
  addToDoItem,
  setToDoItems,
  setToDoItemPseudo,
  flipToDoItem,
  resetToDoItems,
} = todoItemSlice.actions;
export const selectTodoItems = (state: RootState) => state.todoItem.items;
export default todoItemSlice.reducer;
