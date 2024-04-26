export interface IToDoItem {
  id: string;
  text: string;
  done: boolean;
  lastDoneFlippingDate: string;
  lastDoneFlippingUserId: string;
}

export interface IToDoList {
  id: string;
  title: string;
  items: IToDoItem[];
  createdAt: string;
  createdUserId: string;
}

export interface IUser {
  id: string;
  name: string;
  pictureUrl: string;
}
