"use client";
import { useState } from "react";
import type { UploadedFileRef } from "@/lib/types";

export default function FileUpload({ onLoaded }: { onLoaded: (files: UploadedFileRef[]) => void }) {
  const [files, setFiles] = useState<UploadedFileRef[]>([]);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = Array.from(e.target.files || []);
    const mapped: UploadedFileRef[] = await Promise.all(
      f.map(async (file) => {
        const base: UploadedFileRef = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        };
        if (file.type.startsWith("text/") || file.name.endsWith(".md")) {
          const text = await file.text();
          base.content = text;
        }
        return base;
      })
    );
    setFiles(mapped);
    onLoaded(mapped);
  }

  return (
    <div className="border rounded-xl bg-white/70 backdrop-blur p-3">
      <div className="text-sm text-zinc-600 mb-2">Upload findings or recon files</div>
      <input type="file" multiple onChange={handleChange} />
      {files.length > 0 && (
        <ul className="mt-2 text-sm text-zinc-700 list-disc list-inside">
          {files.map((f) => (
            <li key={f.name}>{f.name} ({Math.round(f.size/1024)} KB)</li>
          ))}
        </ul>
      )}
    </div>
  );
}
