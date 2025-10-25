"use client";
import { useEffect, useRef } from "react";

export default function LivePreview({ url }: { url?: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  useEffect(() => {
    if (iframeRef.current && url) {
      iframeRef.current.src = url;
    }
  }, [url]);
  return (
    <div className="rounded-xl border overflow-hidden bg-white/70 backdrop-blur">
      <div className="p-2 text-sm text-zinc-600 border-b">Live Preview</div>
      <div className="h-[360px]">
        {url ? (
          <iframe ref={iframeRef} className="w-full h-full" src={url} />
        ) : (
          <div className="h-full flex items-center justify-center text-zinc-400">No URL loaded</div>
        )}
      </div>
    </div>
  );
}
