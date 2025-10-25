"use client";
import { useEffect, useState } from "react";
import { getUrls, saveUrl } from "@/lib/storage";

export function useLocalUrls() {
  const [urls, setUrls] = useState<string[]>([]);
  useEffect(() => {
    getUrls().then(setUrls).catch(() => setUrls([]));
  }, []);
  async function add(url: string) {
    await saveUrl(url);
    setUrls(await getUrls());
  }
  return { urls, add };
}
