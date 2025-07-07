// Simple API utility for authenticated requests
export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  // Jika url diawali /api/sessions, arahkan ke backend Flask
  const backendUrl = url.startsWith("/api/sessions")
    ? `http://localhost:5000${url}`
    : url;
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };
  const res = await fetch(backendUrl, { ...options, headers });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
