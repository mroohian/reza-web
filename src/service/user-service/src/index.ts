import '@rw/api-base/lib/polyfill';

import config from 'config';
import debugLog from 'debug';
import Hapi from '@hapi/hapi';
import * as apiBase from '@rw/api-base';
import * as apiMongoose from '@rw/api-mongoose';
import * as apiElasticsearchLogger from '@rw/api-elasticsearch-logger';

import { DefaultRoute } from './routes/DefaultRoute';
import { ApiV1Route } from './routes/v1/ApiV1Route';
import { UserV1Route } from './routes/v1/UserV1Route';

const log = debugLog('service:user-service');
const logError = debugLog('error:service:user-service');

apiBase.server.setupServer((context) => {
  // Components
  context.registerServerComponent(apiMongoose.Database);

  // Routes
  context.registerRoute(DefaultRoute);
  context.registerRoute(ApiV1Route);
  context.registerRoute(UserV1Route);

  // Misc.
  const connectionString = config.has('dbConfig.connectionString')
    ? config.get<string>('dbConfig.connectionString')
    : 'mongodb://localhost/reza-web';
  context.container.bind<string>(apiMongoose.TYPES.ConnectionString).toConstantValue(connectionString);

  const connectOptions: apiMongoose.ConnectOptions = {};
  context.container.bind<apiMongoose.ConnectOptions>(apiMongoose.TYPES.ConnectOptions).toConstantValue(connectOptions);
});

export const preStartHook = async (server: Hapi.Server, projectConfig: apiBase.config.ProjectConfig): Promise<void> => {
  // Plugins
  const connectionUrl = config.has('elasticsearch.connectionUrl')
    ? config.get<string>('elasticsearch.connectionUrl')
    : 'http://elasticsearch:9200';

  await server.register({
    plugin: apiElasticsearchLogger.ElasticsearchLoggerPlugin,
    options: {
      active: process.env.NODE_ENV === 'production',
      connectionUrl,
      index: `pino-${projectConfig.name}`,
    },
  });
};

log('Starting service...');

apiBase.server.runServer(preStartHook).catch((error) => {
  logError(error);
  process.exit(1);
});
