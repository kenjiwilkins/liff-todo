"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLiff } from "./LiffProvider";

interface Profile {
  userId: string;
  displayName: string;
  pictureUrl: string;
  statusMessage: string;
}

export default function Header() {
  // custom hooks
  const { liff } = useLiff();

  // local state
  const [profile, setProfile] = useState<Profile | null>(null);

  // side effects
  useEffect(() => {
    if (liff) {
      liff.getProfile().then((profile) => {
        setProfile(profile as Profile);
      });
    }
  }, [liff]);

  return (
    <header className="sticky top-0 left-0 w-full h-16 z-10 bg-white">
      <nav className="w-full flex items-center justify-between p-4">
        <Link href="/">
          <h1 className="text-2xl font-bold">LIFF TODO</h1>
        </Link>
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
  );
}
