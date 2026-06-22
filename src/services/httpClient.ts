import { AppError, type BackendErrorPayload } from './apiError';
import { resolveHttpUrl } from './endpoint';

interface RequestOptions extends RequestInit {
  path: string;
}

export async function requestJson<T>(options: RequestOptions): Promise<T> {
  const response = await fetch(resolveHttpUrl(options.path), options);
  if (!response.ok) {
    throw await toHttpError(response);
  }
  return (await response.json()) as T;
}

export async function requestVoid(options: RequestOptions): Promise<void> {
  const response = await fetch(resolveHttpUrl(options.path), options);
  if (!response.ok) {
    throw await toHttpError(response);
  }
}

async function toHttpError(response: Response): Promise<AppError> {
  const fallbackMessage = `Request failed with status ${response.status}`;
  const contentType = response.headers.get('content-type') ?? '';
  if (!contentType.includes('application/json')) {
    return new AppError(fallbackMessage, {
      code: 'HTTP_ERROR',
      status: response.status
    });
  }

  try {
    const payload = (await response.json()) as Partial<BackendErrorPayload>;
    const message = typeof payload.message === 'string' && payload.message.trim().length > 0
      ? payload.message
      : fallbackMessage;
    const code = typeof payload.code === 'string' && payload.code.trim().length > 0
      ? payload.code
      : 'HTTP_ERROR';
    const details = Array.isArray(payload.details)
      ? payload.details.filter((detail): detail is string => typeof detail === 'string')
      : [];
    return new AppError(message, {
      code,
      status: response.status,
      details
    });
  } catch {
    return new AppError(fallbackMessage, {
      code: 'HTTP_ERROR',
      status: response.status
    });
  }
}
