"use client";
import Image from "next/image";
import Router from "next/router";
import { useEffect, useState } from "react";
import InfoLabel from "@/app/components/texts/InfoLabel";
import InfoText from "@/app/components/texts/InfoText";
import axios, { AxiosError } from "axios";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  setToDoItems,
  addToDoItem,
  setToDoItemPseudo,
  flipToDoItem,
} from "@/lib/features/todoItem";
import { useLiff } from "@/app/providers/LiffProvider";
import { sanitize } from "@/lib/helpers";

export default function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  // redux hooks
  const todoItems = useAppSelector((state) => state.todoItem.items);
  const dispatch = useAppDispatch();

  // custom hooks
  const { liff } = useLiff();

  // local state
  const [newItemText, setNewItemText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");

  // functions
  async function getTodoItems() {
    axios
      .get(`/api/todo/${id}`, {
        headers: {
          "x-liff-accesstoken": liff?.getAccessToken() || "",
        },
      })
      .then((res) => {
        dispatch(setToDoItems(res.data.todoListItems));
        setTitle(res.data.todoList.title);
      });
  }
  async function postTodoItem() {
    const text = sanitize(newItemText.trim());
    if (!text) return;
    setNewItemText("");
    await axios.post(
      `/api/todo/${id}`,
      {
        text,
      },
      {
        headers: {
          "x-liff-accesstoken": liff?.getAccessToken() || "",
        },
      }
    );
  }

  async function deleteTodoItem(id: string, list_id: string) {
    await axios
      .delete(`/api/todo/${id}`, {
        headers: {
          "x-liff-accesstoken": liff?.getAccessToken() || "",
        },
        data: {
          list_id,
        },
      })
      .then(() => {
        getTodoItems();
      });
  }
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    if (newItemText.trim()) addPsuedoTodoItem(newItemText);
    await postTodoItem();
    getTodoItems();
    setSubmitting(false);
  }
  async function handleDelete(e: React.FormEvent, index: number) {
    e.preventDefault();
    dispatch(setToDoItemPseudo(index));
    deleteTodoItem(todoItems[index].id, todoItems[index].list_id);
  }

  function addPsuedoTodoItem(text: string) {
    dispatch(
      addToDoItem({
        id: "psuedo",
        text: sanitize(text),
        list_id: "",
        done: false,
        psuedo: true,
        lastDoneFlippingDate: new Date().toISOString(),
        lastDoneFlippingUserId: "0",
      })
    );
  }
  async function flipItem(
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) {
    dispatch(flipToDoItem({ index, isDone: e.target.checked }));
    await axios.put(
      `/api/todo/${todoItems[index].id}`,
      {
        done: e.target.checked,
      },
      {
        headers: {
          "x-liff-accesstoken": liff?.getAccessToken() || "",
        },
      }
    );
    getTodoItems();
  }

  async function shareTodo(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    try {
      const result = await axios.post(
        "/api/share",
        {
          list_id: id,
        },
        {
          headers: {
            "x-liff-accesstoken": liff?.getAccessToken() || "",
          },
        }
      );
      if (result) {
        const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/shared/${result.data.sharedId}`;
        const lineShareUrl = `https://api.line.me/social-plugin/metrics?url=${encodeURIComponent(
          shareUrl
        )}`;
        window.history.pushState({}, "", shareUrl);
      }
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.log(error);
    }
  }

  // side effects
  useEffect(() => {
    if (!liff?.isLoggedIn()) return;
    getTodoItems();
  }, [liff]);

  return (
    <div className="relative h-full box-border">
      {title && (
        <InfoLabel>
          <InfoText text={title} />
        </InfoLabel>
      )}
      <main className="relative min-h-screen max-h-full flex flex-col items-center justify-between p-2">
        <ul className="w-full flex flex-col gap-2">
          {todoItems.length > 0 ? (
            todoItems.map((item, index) => (
              <li
                key={item.id}
                className={`w-full rounded-lg p-4 flex gap-2 justify-between items-center ${
                  item.psuedo ? "bg-gray-500" : "bg-gray-50"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!item.done}
                  onChange={(e) => flipItem(e, index)}
                />
                <p className="font-bold w-full text-lg">{item.text}</p>
                <button onClick={(e) => handleDelete(e, index)}>
                  <Image
                    src="/icon-delete.svg"
                    alt="delete todo list"
                    width={30}
                    height={30}
                  />
                  <span className="sr-only">Delete</span>
                </button>
              </li>
            ))
          ) : (
            <li className="list-none">
              <InfoLabel>
                <InfoText text="No ToDo list item yet" />
              </InfoLabel>
            </li>
          )}
        </ul>
      </main>
      <form
        className="fixed bottom-0 w-full p-2 bg-gray-950 flex items-center gap-2"
        onSubmit={handleSubmit}
      >
        <button type="button" onClick={shareTodo}>
          <Image
            src="/icon-share.svg"
            alt="share ToDo"
            width={28}
            height={28}
          />
          <span className="sr-only">Share ToDo</span>
        </button>
        <input
          type="text"
          placeholder="Add new item"
          className="w-full px-2 rounded-xl text-gray-50 bg-gray-700"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          readOnly={submitting}
        />
        <button type="submit" disabled={submitting}>
          <Image
            src="/icon-publish.svg"
            alt="add new item"
            width={36}
            height={36}
          />
          <span className="sr-only">Add new item</span>
        </button>
      </form>
    </div>
  );
}
