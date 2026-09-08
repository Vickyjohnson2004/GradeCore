const base = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${base}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...(init.headers || {}) },
    cache: "no-store",
  });
  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? ((await res.json()) as T & { success?: boolean; message?: string })
    : null;
  if (!res.ok)
    throw new Error(body?.message || `Request failed (${res.status})`);
  if (!body) throw new Error("The server returned an invalid response");
  return body;
}
