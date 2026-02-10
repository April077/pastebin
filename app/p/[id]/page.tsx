"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type PasteResponse = {
  content: string;
  remaining_views: number | null;
  expires_at: string | null;
};

export default function ViewPastePage() {
  const params = useParams();
  const id = params.id as string;

  const [data, setData] = useState<PasteResponse | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPaste() {
      try {
        const res = await fetch(`/api/pastes/${id}`);
        const json = await res.json();

        if (!res.ok) {
          setError("Paste not found or expired");
          return;
        }

        setData(json);
      } catch {
        setError("Server error");
      }
    }

    fetchPaste();
  }, [id]);

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-xl bg-white text-black rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Paste</h2>

        <pre className="whitespace-pre-wrap border rounded-md p-3 bg-gray-50 mb-4">
          {data.content}
        </pre>

        {data.remaining_views !== null && (
          <p className="text-sm text-gray-700">
            Remaining views:{" "}
            <span className="font-medium">
              {data.remaining_views}
            </span>
          </p>
        )}

        {data.expires_at && (
          <p className="text-sm text-gray-700 mt-1">
            Expires at:{" "}
            <span className="font-medium">
              {new Date(data.expires_at).toLocaleString()}
            </span>
          </p>
        )}
      </div>
    </main>
  );
}
