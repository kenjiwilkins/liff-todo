"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setToDoLists,
  addToDoList,
  setToDoListPseudo,
} from "@/lib/features/todo";
import { useLiff } from "./components/LiffProvider";
import axios from "axios";
import xss from "xss";

export default function Home() {
  // redux hooks
  const todo = useAppSelector((state) => state.todo.lists);
  const dispatch = useAppDispatch();

  // custom hooks
  const { liff } = useLiff();

  // local state
  const [title, setTitle] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  // functions
  async function getTodoList() {
    axios
      .get("/api/todos", {
        headers: {
          "x-liff-accesstoken": liff?.getAccessToken() || "",
        },
      })
      .then((res) => {
        dispatch(setToDoLists(res.data.todos.rows));
      });
  }
  async function postTodoList() {
    const text = xss(title.trim());
    if (!text) return;
    setTitle("");
    await axios.post(
      "/api/todos",
      {
        title: text,
        description: text,
      },
      {
        headers: {
          "x-liff-accesstoken": liff?.getAccessToken() || "",
        },
      }
    );
  }
  async function deleteTodoList(id: string) {
    await axios
      .delete(`/api/todos`, {
        headers: {
          "x-liff-accesstoken": liff?.getAccessToken() || "",
        },
        data: {
          id,
        },
      })
      .then((res) => {
        getTodoList();
      });
  }
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    if (title) addPsuedoTodoList(title);
    await postTodoList();
    setSubmitting(false);
    getTodoList();
  }
  async function handleDelete(e: React.FormEvent, index: number) {
    e.preventDefault();
    dispatch(setToDoListPseudo(index));
    deleteTodoList(todo[index].id);
  }

  function addPsuedoTodoList(title: string) {
    dispatch(
      addToDoList({
        id: "0",
        title: xss(title),
        description: xss(title),
        createdAt: new Date().toISOString(),
        createdUserId: "0",
        psuedo: true,
      })
    );
  }

  // side effects
  useEffect(() => {
    if (!liff?.isLoggedIn()) return;
    getTodoList();
  }, [liff]);

  return (
    <div className="min-h-screen box-border">
      <main className="relative flex flex-col items-center justify-between p-2">
        {todo.length > 0 ? (
          <ul className="w-full max-w-lg">
            {todo.map((list, index) => (
              <Link key={list.id} href={`/todo/${list.id}`}>
                <li
                  className={`flex items-center justify-between p-4 rounded-lg mb-4 ${
                    list.psuedo ? "bg-gray-500" : "bg-gray-50"
                  }`}
                >
                  <div>
                    <h2 className="text-lg font-bold">{list.title}</h2>
                  </div>
                  <button
                    className=""
                    onClick={(e) => handleDelete(e, index)}
                    disabled={list.psuedo}
                  >
                    <Image
                      src="/icon-delete.svg"
                      alt="delete todo list"
                      width={30}
                      height={30}
                    />
                    <span className="sr-only">Delete</span>
                  </button>
                </li>
              </Link>
            ))}
          </ul>
        ) : (
          <li className="rounded-xl p-2 flex justify-center">
            <h1 className="bg-white bg-opacity-30 px-2 font-normal text-sm rounded-full text-gray-800">
              No ToDo list yet
            </h1>
          </li>
        )}
        <form
          className="fixed bottom-0 w-full p-2 bg-gray-950 flex items-center gap-2"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            className="w-full p-2 rounded-xl text-gray-50 bg-gray-700"
            placeholder="Create new todo list"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            readOnly={submitting}
          />
          <button type="submit" disabled={submitting}>
            <Image
              src="/icon-add.svg"
              alt="create new todo list"
              width={36}
              height={36}
            />
            <span className="sr-only">Create new todo list</span>
          </button>
        </form>
      </main>
    </div>
  );
}
