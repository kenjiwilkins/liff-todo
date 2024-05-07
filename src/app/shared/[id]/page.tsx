"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useLiff } from "@/app/components/LiffProvider";
import Link from "next/link";

enum Status {
  Loading = "loading",
  Verifying = "verifying",
  Error = "error",
  Success = "success",
}

export default function Component({ params }: { params: { id: string } }) {
  const { id } = params;
  // custom hooks
  const { liff } = useLiff();
  // local state
  const [status, setStatus] = useState<Status>(Status.Loading);
  const [error, setError] = useState<string | null>(null);
  // functions
  async function getSharedData() {
    setStatus(Status.Loading);
    try {
      const res = await axios.get(`/api/share?list_id=${id}`, {
        headers: {
          "x-liff-accesstoken": liff?.getAccessToken() || "",
        },
      });
      if (res.status === 200) {
        return Promise.resolve();
      }
    } catch (e: unknown) {
      const error = e as AxiosError;
      console.log(error);
      if (error.response?.data) {
        const { message } = error.response.data as { message: string };
        setError(message);
      }
      setStatus(Status.Error);
      return Promise.reject();
    }
  }
  async function postSharedData() {
    try {
      setStatus(Status.Verifying);
    } catch (e: unknown) {
      const error = e as Error;
    }
  }
  // side effects
  useEffect(() => {
    if (!liff) return;
    getSharedData().then(() => postSharedData());
  }, [liff]);

  return (
    <div className="flex flex-col gap-4 h-screen w-full items-center justify-center">
      <div className="animate-spin">
        {status === Status.Loading && (
          <LoaderIcon className="h-12 w-12 text-gray-500" />
        )}
        {status === Status.Success && (
          <Image src="/icon-done.svg" height={200} width={200} alt="done" />
        )}
        {status === Status.Error && (
          <Image src="/icon-error.svg" height={200} width={200} alt="error" />
        )}
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          {status === Status.Loading && <span>Loading...</span>}
          {status === Status.Verifying && <span>Verifying...</span>}
          {status === Status.Error && <span>Oops! Failed to verify</span>}
        </h1>
        {status === Status.Success && (
          <Link
            href={`/todo/${id}`}
            className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-6 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50"
          >
            Go to Shared ToDo List
          </Link>
        )}
        {status === Status.Error && (
          <p className="text-gray-500 max-w-[500px] md:text-lg">
            Something went wrong. Please try again later.
          </p>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
    </div>
  );
}

function LoaderIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="2" y2="6" />
      <line x1="12" x2="12" y1="18" y2="22" />
      <line x1="4.93" x2="7.76" y1="4.93" y2="7.76" />
      <line x1="16.24" x2="19.07" y1="16.24" y2="19.07" />
      <line x1="2" x2="6" y1="12" y2="12" />
      <line x1="18" x2="22" y1="12" y2="12" />
      <line x1="4.93" x2="7.76" y1="19.07" y2="16.24" />
      <line x1="16.24" x2="19.07" y1="7.76" y2="4.93" />
    </svg>
  );
}
