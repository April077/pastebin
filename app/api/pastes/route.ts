import { NextResponse } from "next/server";
import { createPaste } from "@/lib/paste.service";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Request body:", body);

    if (!body.content || body.content.trim() === "") {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 },
      );
    }

    if (body.ttl_seconds !== undefined) {
      const ttl = Number(body.ttl_seconds);
      if (isNaN(ttl) || ttl <= 0) {
        return NextResponse.json(
          { error: "ttl_seconds must be a number greater than 0" },
          { status: 400 },
        );
      }
      body.ttl_seconds = ttl;
    }

    // Validate max_views if provided
    if (body.max_views !== undefined) {
      const maxViews = Number(body.max_views);
      if (isNaN(maxViews) || maxViews <= 0) {
        return NextResponse.json(
          { error: "max_views must be a number greater than 0" },
          { status: 400 },
        );
      }
      body.max_views = maxViews;
    }

    const paste = await createPaste(
      body.content,
      body.ttl_seconds,
      body.max_views,
    );

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const url = `${origin}/p/${paste.id}`;

    return NextResponse.json({
      id: paste.id,
      url,
    });
  } catch (error) {
    console.error("Error in POST /api/pastes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
