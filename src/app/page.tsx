"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useLiff } from "./components/LiffProvider";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { addToDoList, removeToDoList } from "@/lib/features/todo";

interface Profile {
  userId: string;
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
}
export default function Home() {
  // redux hooks
  const todo = useAppSelector((state) => state.todo.lists);
  const dispatch = useAppDispatch();

  // custom hooks
  const { liff } = useLiff();

  // local state
  const [profile, setProfile] = useState<Profile | null>(null);

  // functions
  function addItem() {
    dispatch(
      addToDoList({
        id: Math.random().toString(36).substr(2, 9),
        title: "New todo list",
        createdAt: new Date().toISOString(),
        createdUserId: profile?.userId || "",
        items: [],
      })
    );
  }

  // side effects
  useEffect(() => {
    if (liff) {
      liff.getProfile().then((profile) => {
        setProfile(profile as Profile);
      });
    }
  }, [liff]);
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 left-0 w-full">
        <nav className="w-full flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">LIFF TODO</h1>
          <div className="flex justify-end items-center gap-2">
            <p className="text-sm">{profile?.displayName || "Guest"}</p>
            <Image
              src={profile?.pictureUrl || "/icon-defaultUser.svg"}
              alt="profile image"
              width={40}
              height={40}
              className="rounded-full"
            />
          </div>
        </nav>
      </header>
      <main className="relative flex flex-col items-center justify-between p-2">
        {todo.length > 0 ? (
          <ul className="w-full max-w-lg">
            {todo.map((list) => (
              <li
                key={list.id}
                className="flex items-center justify-between p-4 bg-gray-100 rounded-lg mb-4"
              >
                <div>
                  <h2 className="text-lg font-bold">{list.title}</h2>
                </div>
                <button
                  className=""
                  onClick={() => dispatch(removeToDoList(list.id))}
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
            ))}
          </ul>
        ) : (
          <></>
        )}
        <button
          className="fixed flex items-center justify-start gap-2 rounded-lg max-w-full bg-green-500 bottom-5 py-2 pr-4 pl-2"
          onClick={addItem}
        >
          <img
            src="/icon-add.svg"
            alt="create new todo list"
            width={40}
            height={40}
          />
          <span className="text-white text-lg font-bold">
            Create new todo list
          </span>
        </button>
      </main>
      {/* <CreateToDoHalfModal /> */}
    </div>
  );
}
