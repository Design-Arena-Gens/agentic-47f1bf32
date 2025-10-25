"use client";
import { useState } from "react";

export default function HeaderMenu() {
  const [active, setActive] = useState<string>("");
  const menus = ["File", "Edit", "View", "Terminal", "Help"];
  return (
    <div className="flex items-center gap-6 px-4 h-12 border-b border-zinc-200 bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 sticky top-0 z-40">
      <div className="text-lg font-semibold tracking-tight">Bug Bounty AI</div>
      {menus.map((m) => (
        <button
          key={m}
          onClick={() => setActive(m)}
          className={`text-sm text-zinc-600 hover:text-black transition ${active === m ? "font-semibold text-black" : ""}`}
        >
          {m}
        </button>
      ))}
    </div>
  );
}
