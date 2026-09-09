const base = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

function getAuthHeader(init: RequestInit) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("gradecore_token")
      : null;

  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(init.headers || {}),
  };
}

export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = getAuthHeader(init);

  const res = await fetch(`${base}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    cache: "no-store",
  });

  const contentType = res.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? ((await res.json()) as T & { success?: boolean; message?: string })
    : null;

  if (!res.ok) {
    const message = body?.message || `Request failed (${res.status})`;

    if (res.status === 401 && typeof window !== "undefined") {
      const currentPath = window.location.pathname;
      if (currentPath !== "/login") {
        window.location.assign("/login");
      }
    }

    throw new Error(message);
  }

  if (!body) throw new Error("The server returned an invalid response");
  return body;
}
