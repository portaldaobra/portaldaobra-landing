const API_BASE = import.meta.env.VITE_API_BASE ?? "http://localhost:8011/api/v1";

export async function apiGet<T>(
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  const qs =
    params
      ? "?" +
        new URLSearchParams(
          Object.entries(params)
            .filter(([, v]) => v != null)
            .map(([k, v]) => [k, String(v)]),
        ).toString()
      : "";
  const res = await fetch(`${API_BASE}${path}${qs}`);
  if (!res.ok) {
    if (res.status === 404)
      throw Object.assign(new Error("not found"), { status: 404 });
    throw new Error(`API ${res.status} ${path}`);
  }
  const body = await res.json();
  return (body?.data ?? body) as T;
}
