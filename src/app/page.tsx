"use client";
import HeaderMenu from "@/components/HeaderMenu";
import PromptInput from "@/components/PromptInput";
import TaskManager from "@/components/TaskManager";
import LivePreview from "@/components/LivePreview";
import GuidelinesEditor from "@/components/GuidelinesEditor";
import AITerminal from "@/components/AITerminal";
import ReportExport from "@/components/ReportExport";
import FileUpload from "@/components/FileUpload";
import { useState } from "react";
import type { WorkflowStep } from "@/lib/types";

export default function Home() {
  const [steps, setSteps] = useState<WorkflowStep[]>([]);
  const [url, setUrl] = useState<string | undefined>(undefined);
  const [guidelines, setGuidelines] = useState<string>("");
  const [thinking, setThinking] = useState<boolean>(false);
  const [useGeneratedAsIs, setUseGeneratedAsIs] = useState<boolean>(true);
  const [uploads, setUploads] = useState<any[]>([]);

  async function handleSubmit(text: string) {
    setThinking(true);
    // Extract URL via @url-
    const match = text.match(/@url-\S+/);
    const extractedUrl = match ? match[0].replace("@url-", "") : undefined;
    const normalizedUrl = extractedUrl ? (extractedUrl.startsWith("http") ? extractedUrl : `https://${extractedUrl}`) : undefined;
    setUrl(normalizedUrl);
    let fingerprint: any = undefined;
    if (normalizedUrl) {
      const resp = await fetch("/api/fingerprint", { method: "POST", body: JSON.stringify({ url: normalizedUrl }) });
      const data = await resp.json();
      if (data.ok) fingerprint = data.data;
    }
    const wfResp = await fetch("/api/workflow", { method: "POST", body: JSON.stringify({ url: normalizedUrl || "", fingerprint, guidelines }) });
    const wf = await wfResp.json();
    if (wf.ok) {
      setSteps(wf.data.steps);
    }
    setThinking(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-white">
      <HeaderMenu />
      <main className="mx-auto max-w-6xl p-4 space-y-4">
        <div className="flex flex-wrap gap-4 items-stretch">
          <div className="flex-1 min-w-[320px] space-y-3">
            <PromptInput onSubmit={handleSubmit} />
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input type="checkbox" checked={useGeneratedAsIs} onChange={(e) => setUseGeneratedAsIs(e.target.checked)} />
                Use generated workflow as-is
              </label>
              <ReportExport />
            </div>
            <FileUpload onLoaded={setUploads} />
            <GuidelinesEditor value={guidelines} onChange={setGuidelines} />
            <TaskManager tasks={steps} />
          </div>
          <div className="flex-1 min-w-[320px] space-y-3">
            <LivePreview url={url} />
            <AITerminal />
          </div>
        </div>
        {thinking && (
          <div className="h-16 flex items-center justify-center">
            <div className="w-2 h-2 bg-zinc-900 rounded-full animate-bounce [animation-delay:-0.3s] mr-1" />
            <div className="w-2 h-2 bg-zinc-900 rounded-full animate-bounce mr-1" />
            <div className="w-2 h-2 bg-zinc-900 rounded-full animate-bounce [animation-delay:0.3s]" />
          </div>
        )}
      </main>
    </div>
  );
}
