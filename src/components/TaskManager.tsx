"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { WorkflowStep } from "@/lib/types";

export default function TaskManager({ tasks }: { tasks: WorkflowStep[] }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border rounded-xl bg-white/70 backdrop-blur">
      <div className="flex items-center justify-between p-3 border-b">
        <div className="font-medium">Tasks</div>
        <button onClick={() => setOpen((v) => !v)} className="text-sm text-zinc-600">{open ? "Hide" : "Show"}</button>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.ul initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            {tasks.map((t) => (
              <li key={t.id} className="p-3 border-b last:border-b-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{t.title}</div>
                    <div className="text-xs text-zinc-500">{t.description}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    t.status === "running" ? "bg-blue-100 text-blue-700" :
                    t.status === "success" ? "bg-green-100 text-green-700" :
                    t.status === "error" ? "bg-red-100 text-red-700" : "bg-zinc-100 text-zinc-700"}
                  `}>{t.status}</span>
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
