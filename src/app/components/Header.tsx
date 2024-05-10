"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useLiff } from "../providers/LiffProvider";

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
    <header className="sticky left-0 top-0 z-10 h-16 w-full bg-white">
      <nav className="flex w-full items-center justify-between p-4">
        <Link href="/">
          <h1 className="text-2xl font-bold">LIFF TODO</h1>
        </Link>
        <div className="flex items-center justify-end gap-2">
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
