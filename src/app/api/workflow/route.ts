import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  url: z.string().url(),
  fingerprint: z.any().optional(),
  guidelines: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, fingerprint, guidelines } = schema.parse(body);

    // Simple placeholder workflow based on inputs
    const steps = [
      { id: "collect-info", title: "Initial Recon", description: `Fetch robots.txt, sitemap.xml for ${url}`, status: "pending" },
      { id: "tech-stack", title: "Technology Fingerprinting", description: "Analyze headers, HTML, and JS assets", status: "pending" },
      { id: "enumerate", title: "Content Enumeration", description: "Crawl common paths, discover endpoints", status: "pending" },
      { id: "authz", title: "AuthZ Testing", description: "Test IDOR and permission boundaries", status: "pending" },
      { id: "inputs", title: "Input Validation", description: "Probe for XSS, SSTI, SQLi with safe payload sets", status: "pending" },
      { id: "report", title: "Reporting", description: "Summarize findings and export", status: "pending" },
    ];

    if (fingerprint?.technologies?.length) {
      steps.splice(2, 0, {
        id: "stack-specific",
        title: "Stack-Specific Checks",
        description: `Apply checks for ${fingerprint.technologies.map((t: any) => t.name).join(", ")}`,
        status: "pending",
      });
    }

    if (guidelines && guidelines.trim().length > 0) {
      steps.unshift({ id: "guidelines", title: "Program Guidelines", description: "Apply user-provided rules and scope", status: "pending" });
    }

    return NextResponse.json({ ok: true, data: { steps } });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 400 });
  }
}
