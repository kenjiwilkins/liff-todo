export interface IToDoList {
  id: string;
  title: string;
  createdAt: string;
  createdUserId: string;
  description: string;
  psuedo?: boolean;
}

export interface IToDoListItem {
  id: string;
  text: string;
  done: boolean;
  lastDoneFlippingDate: string;
  lastDoneFlippingUserId: string;
  list_id: string;
  psuedo?: boolean;
}

export interface IUser {
  id: string;
  name: string;
  pictureUrl: string;
}
