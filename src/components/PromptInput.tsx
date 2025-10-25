"use client";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalUrls } from "@/hooks/useLocalUrls";

export default function PromptInput({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [text, setText] = useState("");
  const { urls, add } = useLocalUrls();

  const highlightedText = useMemo(() => {
    let t = text;
    for (const u of urls) {
      if (u && t.includes(u)) {
        t = t.replaceAll(u, `<<${u}>>`);
      }
    }
    return t;
  }, [text, urls]);

  useEffect(() => {
    const urlMatch = text.match(/@url-\S+/);
    if (urlMatch) {
      try {
        const raw = urlMatch[0].replace("@url-", "");
        const val = raw.startsWith("http") ? raw : `https://${raw}`;
        new URL(val);
        add(val);
      } catch {}
    }
  }, [text, add]);

  return (
    <div className="w-full">
      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a prompt or @url-https://example.com"
          className="w-full h-28 p-4 rounded-xl border bg-white/70 backdrop-blur outline-none focus:ring-2 focus:ring-zinc-900/20"
        />
        <AnimatePresence>
          {text.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none">
              <div className="animate-pulse h-full w-full rounded-xl bg-gradient-to-br from-zinc-50 to-transparent" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="mt-2 flex justify-between items-center">
        <div className="text-xs text-zinc-500">Recent: {urls.slice(0, 3).join(" • ")}</div>
        <button onClick={() => onSubmit(text)} className="px-4 py-2 rounded-lg bg-zinc-900 text-white">Run</button>
      </div>
      <div className="sr-only" aria-hidden>
        {highlightedText}
      </div>
    </div>
  );
}
