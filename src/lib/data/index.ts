import { sql } from "@vercel/postgres";

export async function createToDoListTable() {
  const create = await sql`
    create table todo_list (
      id uuid primary key default gen_random_uuid(),
      title text,
      created_at timestamp default current_timestamp,
      created_user_id text,
      description text
    )
  `;
  return create;
}

export async function dropToDoListTable() {
  const drop = await sql`
    drop table todo_list
  `;
  return drop;
}

export async function createSharedTable() {
  const create = await sql`
    create table shared (
      id uuid primary key default gen_random_uuid(),
      todo_list_id uuid references todo_list(id),
      is_shared boolean default false,
      shared_user_id text
    )
  `;
  return create;
}

export async function dropSharedTable() {
  const drop = await sql`
    drop table shared
  `;
  return drop;
}

export async function createToDoItemTable() {
  const create = await sql`
    create table todo_item (
      id uuid primary key default gen_random_uuid(),
      text text,
      done boolean default false,
      last_done_flipping_date timestamp,
      last_done_flipping_user_id text,
      list_id uuid references todo_list(id)
    )
  `;
  return create;
}

export async function dropToDoItemTable() {
  const drop = await sql`
    drop table todo_item
  `;
  return drop;
}

export async function checkToDoListTable() {
  const check = await sql`
    select * from information_schema.tables
    where table_name = 'todo_list'
  `;
  return check;
}

export async function checkSharedTable() {
  const check = await sql`
    select * from information_schema.tables
    where table_name = 'shared'
  `;
  return check;
}

export async function checkToDoItemTable() {
  const check = await sql`
    select * from information_schema.tables
    where table_name = 'todo_item'
  `;
  return check;
}

export async function getToDoListTable() {
  const get = await sql`
    select * from todo_list
  `;
  return get;
}

export async function addToDoListTable(
  title: string,
  description: string,
  createdUserId: string
) {
  const add = await sql`
    insert into todo_list (title, created_user_id, description)
    values (${title}, ${createdUserId}, ${description})
  `;
  return add;
}

export async function deleteToDoListById(id: string) {
  const del = await sql`
    delete from todo_list
    where id = ${id}
  `;
  return del;
}

export async function findToDoListByCreatedUserId(createdUserId: string) {
  const find = await sql`
    select * from todo_list
    where created_user_id = ${createdUserId}
  `;
  return find;
}

export async function findToDoListById(id: string) {
  const find = await sql`
    select * from todo_list
    where id = ${id}
  `;
  return find;
}

export async function getSharedUserIdsByToDoListId(todoListId: string) {
  const find = await sql`
    select shared_user_ids from todo_list
    where id = ${todoListId}
  `;
  return find;
}

export async function addTodoItem(
  text: string,
  listId: string,
  lastDoneFlippingUserId: string
) {
  const add = await sql`
    insert into todo_item (text, list_id, last_done_flipping_user_id)
    values (${text}, ${listId}, ${lastDoneFlippingUserId})
  `;
  return add;
}

export async function getTodoItemsByListId(listId: string) {
  const get = await sql`
    select * from todo_item
    where list_id = ${listId}
  `;
  return get;
}

export async function setTodoItemDone(
  id: string,
  done: boolean,
  userId: string
) {
  const set = await sql`
    update todo_item
    set done = ${done}, last_done_flipping_date = current_timestamp, last_done_flipping_user_id = ${userId}
    where id = ${id}
  `;
  return set;
}

export async function deleteTodoItem(id: string) {
  const del = await sql`
    delete from todo_item
    where id = ${id}
  `;
  return del;
}

export async function deleteAllTodoItems(id: string) {
  const del = await sql`
    delete from todo_item
    where list_id = ${id}
  `;
  return del;
}

export async function deleteAllTodoItemsByListId(listId: string) {
  const del = await sql`
    delete from todo_item
    where list_id = ${listId}
  `;
  return del;
}

export async function getShared(id: string) {
  const get = await sql`
    select * from shared
    where todo_list_id = ${id}
  `;
  return get;
}

export async function deleteShared(id: string) {
  const del = await sql`
    delete from shared
    where id = ${id}
  `;
  return del;
}

export async function addShared(todoListId: string) {
  // add shared todo list and return the id
  const add = await sql`
    insert into shared (todo_list_id)
    values (${todoListId})
    returning id
  `;
  return add;
}

export async function addSharedUserId(id: string, userId: string) {
  const add = await sql`
    update shared
    set shared_user_id = ${userId}
    where id = ${id}
  `;
  return add;
}
