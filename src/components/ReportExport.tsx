"use client";
import { exportAsHTML, exportAsMarkdown, exportAsPDF } from "@/lib/exporters";
import { useRef } from "react";

export default function ReportExport() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <div className="font-medium">Report</div>
        <div className="group relative">
          <button className="px-3 py-1.5 rounded-md bg-zinc-900 text-white text-sm">Export</button>
          <div className="absolute mt-1 hidden group-hover:block bg-white rounded-md border shadow z-20">
            <button className="block w-full text-left px-3 py-2 hover:bg-zinc-50 text-sm" onClick={() => ref.current && exportAsPDF(ref.current)}>PDF</button>
            <button className="block w-full text-left px-3 py-2 hover:bg-zinc-50 text-sm" onClick={() => exportAsHTML(ref.current?.innerHTML || "")}>
              HTML
            </button>
            <button className="block w-full text-left px-3 py-2 hover:bg-zinc-50 text-sm" onClick={() => exportAsMarkdown("# Bug Bounty Report\n\nGenerated summary...")}>Markdown</button>
          </div>
        </div>
      </div>
      <div ref={ref} className="sr-only">
        <h1>Bug Bounty AI Report</h1>
        <p>Replace with generated report content.</p>
      </div>
    </div>
  );
}
