interface ApiErrorConfig {
  readonly headers: Record<string, string>;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly config?: ApiErrorConfig;

  public constructor(statusCode: number, message: string, config?: ApiErrorConfig) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.config = config;
  }
}
