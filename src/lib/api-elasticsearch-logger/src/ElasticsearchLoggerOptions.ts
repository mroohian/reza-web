export interface ElasticsearchLoggerOptions {
  readonly active: boolean;

  readonly connectionUrl: string;
  readonly index: string;

  readonly 'es-version'?: number;
  readonly 'trace-level'?: 'info' | 'debug' | 'trace' | 'error';
}
