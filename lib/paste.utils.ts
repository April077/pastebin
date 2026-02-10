import { Paste } from "@prisma/client";

export function isPasteExpired(paste: Paste, req: Request): boolean {
  let now = new Date();

  if (process.env.TEST_MODE === "1") {
    const header = req.headers.get("x-test-now-ms");
    if (header) {
      const ms = Number(header);
      if (!Number.isNaN(ms)) {
        now = new Date(ms);
      }
    }
  }

  return paste.expiresAt !== null && now > paste.expiresAt;
}


export function isViewLimitReached(paste: Paste) {
  return paste.maxViews !== null && paste.viewCount >= paste.maxViews;
}
