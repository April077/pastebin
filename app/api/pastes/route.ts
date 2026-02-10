import { NextResponse } from "next/server";
import { createPaste } from "@/lib/paste.service";

export async function POST(req: Request) {
  try {
    const { content, ttl_seconds, max_views } = await req.json();
    console.log("POST /api/pastes request:", {
      content,
      ttl_seconds,
      max_views,
    });

    // Validate required content
    if (!content || content.trim() === "") {
      return NextResponse.json(
        { error: "content is required" },
        { status: 400 },
      );
    }

    // Validate optional TTL
    let ttl: number | undefined;
    if (ttl_seconds !== undefined) {
      ttl = Number(ttl_seconds);
      if (isNaN(ttl) || ttl <= 0) {
        return NextResponse.json(
          { error: "ttl_seconds must be a number greater than 0" },
          { status: 400 },
        );
      }
    }

    // Validate optional max_views
    let maxViews: number | undefined;
    if (max_views !== undefined) {
      maxViews = Number(max_views);
      if (isNaN(maxViews) || maxViews <= 0) {
        return NextResponse.json(
          { error: "max_views must be a number greater than 0" },
          { status: 400 },
        );
      }
    }

    // Create the paste
    const paste = await createPaste(content, ttl, maxViews);
    console.log("Paste created:", paste);

    // Determine origin for URL
    const origin = req.headers.get("origin");
    const url = `${origin}/p/${paste.id}`;

    return NextResponse.json({ id: paste.id, url });
  } catch (error) {
    console.error("Error in POST /api/pastes:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
