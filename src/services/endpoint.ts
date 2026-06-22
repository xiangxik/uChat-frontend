const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8080').replace(/\/$/, '');

export function resolveHttpUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl}${normalizedPath}`;
}

export function resolveWebSocketUrl(path: string) {
  if (/^wss?:\/\//.test(path)) {
    return path;
  }

  if (/^https?:\/\//.test(path)) {
    return path.replace(/^http/, 'ws');
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl.replace(/^http/, 'ws')}${normalizedPath}`;
}
