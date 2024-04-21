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
  const initLiff = useCallback(async () => {
    try {
      const liffModule = await import("@line/liff");
      const liff = liffModule.default;
      await liff.init({ liffId });
      console.log("LIFF init success.");
      setLiff(liff);
      if (!liff.isLoggedIn()) {
        liff.login();
      }
    } catch (error) {
      console.log("LIFF init failed.");
      setLiffError((error as Error).toString());
    }
  }, [liffId]);
  useEffect(() => {
    console.log("LIFF init start.");
    initLiff();
  }, [initLiff]);
  return (
    <LiffContext.Provider value={{ liff, liffError }}>
      {children}
    </LiffContext.Provider>
  );
};
