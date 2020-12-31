import debugLog from 'debug';
import Hapi from '@hapi/hapi';
import * as HapiPino from 'hapi-pino';
import PinoElasticsearch from 'pino-elasticsearch';

import { ElasticsearchLoggerOptions } from './ElasticsearchLoggerOptions';

const log = debugLog('lib:api-elasticsearch-logger');

export const ElasticsearchLoggerPlugin: Hapi.Plugin<ElasticsearchLoggerOptions> = {
  name: 'elasticsearchLoggerPlugin',
  version: '1.0.0',
  async register(server, options) {
    log(`Registering plugin. active: ${options.active}`);

    const stream = options.active
      ? PinoElasticsearch({
          index: options.index,
          consistency: 'one',
          node: options.connectionUrl,
          'es-version': options['es-version'] ?? 7,
          'trace-level': options['trace-level'],

          'flush-bytes': 1000,
          'flush-interval': 30000,
        })
      : undefined;

    await server.register({
      plugin: HapiPino,
      options: {
        prettyPrint: !options.active,
        redact: ['req.headers.authorization'],
        level: 'info',
        stream,
      },
    });
  },
};
