import { load, type CheerioAPI } from "cheerio";

export type Fingerprint = {
  url: string;
  headers: Record<string, string>;
  technologies: Array<{ name: string; category?: string; confidence: number; evidence: string[] }>;
  meta: Record<string, string>;
};

const techSignatures: Array<{
  name: string;
  category?: string;
  confidence: number;
  match: (args: { html: string; $: CheerioAPI; headers: Record<string, string> }) => string[];
}> = [
  {
    name: "Next.js",
    category: "Framework",
    confidence: 0.9,
    match: ({ html, $ }) => {
      const evidence: string[] = [];
      if (html.includes("__NEXT_DATA__")) evidence.push("__NEXT_DATA__ JSON script present");
      $("script[src]").each((_, el) => {
        const src = $(el).attr("src") || "";
        if (/\/_next\//.test(src)) evidence.push(`script ${src}`);
      });
      if ($("meta[name='next-head-count']").length) evidence.push("next-head-count meta");
      return evidence;
    },
  },
  {
    name: "React",
    category: "Library",
    confidence: 0.7,
    match: ({ html }) => {
      const evidence: string[] = [];
      if (/data-reactroot|data-react-helmet|__REACT_DEVTOOLS_GLOBAL_HOOK__/.test(html)) {
        evidence.push("react markers present");
      }
      return evidence;
    },
  },
  {
    name: "Tailwind CSS",
    category: "CSS",
    confidence: 0.6,
    match: ({ html, $ }) => {
      const evidence: string[] = [];
      $("style").each((_, el) => {
        const text = $(el).text();
        if (/--tw-/.test(text)) evidence.push("--tw- variables in style");
      });
      $("*[class]").each((_, el) => {
        const cls = ($(el).attr("class") || "").split(/\s+/);
        if (cls.some((c) => /^bg-|^text-|^flex|^grid|^rounded|^p-\d|^m-\d/.test(c))) {
          evidence.push("utility classes");
          return false;
        }
      });
      return evidence;
    },
  },
  {
    name: "Cloudflare",
    category: "CDN",
    confidence: 0.6,
    match: ({ headers }) => {
      const evidence: string[] = [];
      const server = headers["server"] || "";
      if (/cloudflare/i.test(server)) evidence.push(`server: ${server}`);
      if (headers["cf-ray"]) evidence.push("cf-ray header");
      return evidence;
    },
  },
  {
    name: "Nginx",
    category: "Server",
    confidence: 0.5,
    match: ({ headers }) => {
      const server = headers["server"] || "";
      return /nginx/i.test(server) ? [server] : [];
    },
  },
  {
    name: "Apache",
    category: "Server",
    confidence: 0.5,
    match: ({ headers }) => {
      const server = headers["server"] || "";
      return /apache/i.test(server) ? [server] : [];
    },
  },
  {
    name: "WordPress",
    category: "CMS",
    confidence: 0.8,
    match: ({ html, $ }) => {
      const evidence: string[] = [];
      if (/wp-content|wp-includes/.test(html)) evidence.push("wp-content|wp-includes paths");
      if ($("meta[name='generator'][content*='WordPress']").length) evidence.push("generator WordPress");
      return evidence;
    },
  },
  {
    name: "Google Analytics",
    category: "Analytics",
    confidence: 0.6,
    match: ({ html }) => {
      const evidence: string[] = [];
      if (/www.google-analytics.com|gtag\(\'config\'/.test(html)) evidence.push("ga script");
      return evidence;
    },
  },
  {
    name: "Bootstrap",
    category: "CSS",
    confidence: 0.5,
    match: ({ html }) => (/bootstrap(\.min)?\.css|class=\".*container.*\"/i.test(html) ? ["bootstrap markers"] : []),
  },
];

export async function fingerprintUrl(targetUrl: string): Promise<Fingerprint> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  let headers: Record<string, string> = {};
  let html = "";
  let meta: Record<string, string> = {};
  try {
    const headResp = await fetch(targetUrl, { method: "HEAD", redirect: "follow", signal: controller.signal });
    headResp.headers.forEach((v, k) => (headers[k.toLowerCase()] = v));
  } catch {}
  try {
    const resp = await fetch(targetUrl, { redirect: "follow", signal: controller.signal });
    const buf = await resp.text();
    html = buf;
  } finally {
    clearTimeout(timeout);
  }
  const $ = load(html || "<html></html>");
  $("meta").each((_, el) => {
    const name = $(el).attr("name") || $(el).attr("property");
    const content = $(el).attr("content");
    if (name && content) meta[name] = content;
  });
  const technologies: Fingerprint["technologies"] = [];
  for (const sig of techSignatures) {
    const evidence = sig.match({ html, $, headers });
    if (evidence.length) {
      technologies.push({ name: sig.name, category: sig.category, confidence: sig.confidence, evidence });
    }
  }
  return { url: targetUrl, headers, technologies, meta };
}
