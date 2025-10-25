"use client";
import { useState } from "react";

export default function GuidelinesEditor({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  const [text, setText] = useState(value || "");
  return (
    <div className="border rounded-xl bg-white/70 backdrop-blur">
      <div className="p-2 text-sm text-zinc-600 border-b">Program Guidelines</div>
      <textarea
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Paste program rules, scope, exclusions, safe-harbor..."
        className="w-full h-40 p-3 outline-none"
      />
    </div>
  );
}
