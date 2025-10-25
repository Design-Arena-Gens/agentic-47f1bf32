import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fingerprintUrl } from "@/lib/fingerprint";

const schema = z.object({ url: z.string().url() });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url } = schema.parse(body);
    const data = await fingerprintUrl(url);
    return NextResponse.json({ ok: true, data });
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err?.message ?? "Unknown error" }, { status: 400 });
  }
}
