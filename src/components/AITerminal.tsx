"use client";
import { useEffect, useRef, useState } from "react";

export default function AITerminal() {
  const [logs, setLogs] = useState<string[]>(["AI terminal placeholder. Commands will run via system terminals."]);
  const [running, setRunning] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function append(line: string) {
    setLogs((prev) => [...prev, line]);
  }

  async function handleRun() {
    const cmd = inputRef.current?.value?.trim();
    if (!cmd) return;
    setRunning(true);
    append(`$ ${cmd}`);
    // Placeholder: in Electron, this would spawn system shell securely
    await new Promise((r) => setTimeout(r, 800));
    append(`(simulated) executed: ${cmd}`);
    setRunning(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="border rounded-xl bg-white/70 backdrop-blur">
      <div className="p-2 text-sm text-zinc-600 border-b">AI Terminal (system shell via Electron)</div>
      <div className="h-48 overflow-auto font-mono text-sm p-3 space-y-1">
        {logs.map((l, i) => (
          <div key={i}>{l}</div>
        ))}
      </div>
      <div className="flex gap-2 p-2 border-t">
        <input ref={inputRef} className="flex-1 px-2 py-1 rounded border" placeholder="type command..." />
        <button onClick={handleRun} disabled={running} className="px-3 py-1 rounded bg-zinc-900 text-white">
          {running ? "Running..." : "Run"}
        </button>
      </div>
    </div>
  );
}
