import { NextResponse } from "next/server";
import { createPaste } from "@/lib/paste.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.content) {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 },
      );
    }

    const paste = await createPaste(
      body.content,
      body.ttl_seconds,
      body.max_views,
    );

    const origin = req.headers.get("origin");

    if (!origin) {
      return NextResponse.json(
        { error: "Cannot determine request origin" },
        { status: 500 },
      );
    }

    const url = `${origin}/p/${paste.id}`;

    return NextResponse.json({
      id: paste.id,
      url,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
