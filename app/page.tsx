"use client";

import { useState } from "react";

export default function HomePage() {
  const [content, setContent] = useState("");
  const [ttl, setTtl] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [resultUrl, setResultUrl] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    setError("");
    setResultUrl("");

    if (!content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/pastes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          ttl_seconds: ttl ? Number(ttl) : undefined,
          max_views: maxViews ? Number(maxViews) : undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      setResultUrl(data.url);
      setContent("");
      setTtl("");
      setMaxViews("");
    } catch {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl bg-white text-black rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-semibold mb-4">Create Paste</h1>

        <label className="block text-sm font-medium mb-1">
          Content
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-sm font-medium mb-1">
          TTL (seconds, optional)
        </label>
        <input
          value={ttl}
          onChange={(e) => setTtl(e.target.value)}
          className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <label className="block text-sm font-medium mb-1">
          Max views (optional)
        </label>
        <input
          value={maxViews}
          onChange={(e) => setMaxViews(e.target.value)}
          className="w-full border rounded-md p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleCreate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? "Creating..." : "Create Paste"}
        </button>

        {error && (
          <p className="text-red-600 mt-3 text-sm">
            {error}
          </p>
        )}

        {resultUrl && (
          <div className="mt-4 p-3 border border-green-300 bg-green-50 rounded-md">
            <p className="text-sm mb-1">Paste created:</p>
            <a
              href={resultUrl}
              className="text-blue-600 underline break-all"
            >
              {resultUrl}
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
