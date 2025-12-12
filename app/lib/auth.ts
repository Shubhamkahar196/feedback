
export function getAuthHeadersFromToken(token?: string | null) {
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}
