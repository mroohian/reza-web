declare module 'pino-elasticsearch' {
  import { ClientOptions } from '@elastic/elasticsearch';

  interface PinoElasticsearchOptions {
    readonly index: string;
    readonly consistency: string;

    readonly node: ClientOptions['node'];
    readonly auth?: ClientOptions['auth'];
    readonly cloud?: ClientOptions['cloud'];
    readonly rejectUnauthorized?: boolean;

    readonly 'es-version': number;
    readonly 'trace-level'?: 'info' | 'debug' | 'trace' | 'error';
    readonly 'flush-bytes'?: number;
    readonly 'flush-interval'?: number;
  }

  type PinoElasticsearch = (options: PinoElasticsearchOptions) => NodeJS.WriteStream;

  const pinoElasticsearch: PinoElasticsearch;

  export = pinoElasticsearch;
}
