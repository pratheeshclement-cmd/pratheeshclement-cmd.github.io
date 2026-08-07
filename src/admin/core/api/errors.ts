// ─── DMOS API Gateway: Errors ─────────────────────────────────────────────

export class ApiError extends Error {
  public readonly provider: string;
  public readonly statusCode: number;
  public readonly rateLimitReset?: number;
  public readonly isNetworkError: boolean;

  constructor(
    message: string,
    provider: string,
    statusCode: number = 500,
    rateLimitReset?: number,
    isNetworkError: boolean = false
  ) {
    super(message);
    this.name = 'ApiError';
    this.provider = provider;
    this.statusCode = statusCode;
    this.rateLimitReset = rateLimitReset;
    this.isNetworkError = isNetworkError;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export function parseApiError(error: unknown, provider: string): ApiError {
  if (error instanceof ApiError) return error;

  if (error instanceof Error) {
    return new ApiError(error.message, provider, 500);
  }

  return new ApiError('An unknown API error occurred', provider, 500);
}
