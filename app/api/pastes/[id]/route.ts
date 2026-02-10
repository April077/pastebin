import { NextResponse } from "next/server";
import {
  getPasteById,
  incrementPasteView,
} from "@/lib/paste.service";
import {
  isPasteExpired,
  isViewLimitReached,
} from "@/lib/paste.utils";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; 

    const paste = await getPasteById(id);

    if (!paste) {
      return NextResponse.json(
        { error: "Not found" },
        { status: 404 }
      );
    }

    if (isPasteExpired(paste, req) || isViewLimitReached(paste)) {
      return NextResponse.json(
        { error: "Not available" },
        { status: 404 }
      );
    }

    await incrementPasteView(paste.id);

    return NextResponse.json({
      content: paste.content,
      remaining_views:
        paste.maxViews === null
          ? null
          : paste.maxViews - paste.viewCount - 1,
      expires_at: paste.expiresAt,
    });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
