export interface BackendErrorPayload {
  code: string;
  message: string;
  timestamp?: string;
  path?: string;
  details?: string[];
}

export class AppError extends Error {
  readonly code: string;
  readonly status: number | undefined;
  readonly details: string[];

  constructor(message: string, options?: { code?: string; status?: number; details?: string[] }) {
    super(message);
    this.name = 'AppError';
    this.code = options?.code ?? 'APP_ERROR';
    this.status = options?.status;
    this.details = options?.details ?? [];
  }
}

export function toAppError(error: unknown, fallbackMessage: string): AppError {
  if (error instanceof AppError) {
    return error;
  }
  if (error instanceof Error) {
    return new AppError(error.message, { code: 'UNEXPECTED_ERROR' });
  }
  return new AppError(fallbackMessage, { code: 'UNEXPECTED_ERROR' });
}
