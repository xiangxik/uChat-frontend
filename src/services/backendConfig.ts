export interface BackendConfig {
  appName: string;
  defaultLocale: 'en' | 'zh';
  webSocketEndpoint: string;
  chatSendDestination: string;
  chatMessageSubscription: string;
  chatErrorSubscription: string;
}

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/$/, '');

const defaultConfig: BackendConfig = {
  appName: 'uChat',
  defaultLocale: 'en',
  webSocketEndpoint: '/ws',
  chatSendDestination: '/app/chat.send',
  chatMessageSubscription: '/user/queue/chat.messages',
  chatErrorSubscription: '/user/queue/chat.errors'
};

let backendConfigPromise: Promise<BackendConfig> | null = null;

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

export async function getBackendConfig(): Promise<BackendConfig> {
  if (!backendConfigPromise) {
    backendConfigPromise = fetch(resolveHttpUrl('/api/config'))
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Config request failed with status ${response.status}`);
        }
        return (await response.json()) as BackendConfig;
      })
      .catch((error: unknown) => {
        console.warn('Falling back to default backend config.', error);
        return defaultConfig;
      });
  }

  return backendConfigPromise;
}
