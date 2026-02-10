import prisma from "./prisma";

export async function createPaste(
  content: string,
  ttlSeconds?: number,
  maxViews?: number
) {
  const expiresAt = ttlSeconds
    ? new Date(Date.now() + ttlSeconds * 1000)
    : null;

  return prisma.paste.create({
    data: {
      content,
      expiresAt,
      maxViews: maxViews ?? null,
    },
  });
}

export async function getPasteById(id: string) {
  return prisma.paste.findUnique({
    where: { id },
  });
}

export async function incrementPasteView(id: string) {
  return prisma.paste.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
  });
}
