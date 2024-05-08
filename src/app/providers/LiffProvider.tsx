"use client";
import {
  FC,
  PropsWithChildren,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { usePathname } from "next/navigation";
import { Liff } from "@line/liff";

const LiffContext = createContext<{
  liff: Liff | null;
  liffError: string | null;
}>({
  liff: null,
  liffError: null,
});

export const useLiff = () => useContext(LiffContext);

export const LiffProvider: FC<PropsWithChildren<{ liffId: string }>> = ({
  children,
  liffId,
}) => {
  const [liff, setLiff] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const pathname = usePathname();
  const redirectUri = `${process.env.NEXT_PUBLIC_BASE_URL || ""}${pathname}`;
  const initLiff = useCallback(async () => {
    try {
      const liffModule = await import("@line/liff");
      const liff = liffModule.default;
      await liff.init({ liffId });
      setLiff(liff);
      if (!liff.isLoggedIn()) {
        liff.login({
          redirectUri,
        });
      }
    } catch (error) {
      console.log("LIFF init failed.");
      setLiffError((error as Error).toString());
    }
  }, []);
  useEffect(() => {
    console.log("LIFF init start.");
    initLiff();
  }, []);
  return (
    <LiffContext.Provider value={{ liff, liffError }}>
      {children}
    </LiffContext.Provider>
  );
};
