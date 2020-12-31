import { injectable, inject } from 'inversify';
import * as Joi from 'joi';
import Hapi from '@hapi/hapi';
import * as apiBase from '@rw/api-base';
import { Database } from '@rw/api-mongoose';

@injectable()
export class ApiV1Route extends apiBase.routes.Route {
  public readonly name = 'apiV1';
  protected readonly prefix = '/api/v1';

  private readonly database: Database;
  private readonly projectConfig: apiBase.config.ProjectConfig;

  public constructor(database: Database, @inject(apiBase.TYPES.ProjectConfig) projectConfig: apiBase.config.ProjectConfig) {
    super();
    this.database = database;
    this.projectConfig = projectConfig;
  }

  public setup(server: Hapi.Server): void {
    server.route({
      method: 'GET',
      path: super.resolvePath('/'),
      options: {
        description: 'Get service information',
        notes: 'Returns the service build information',
        tags: ['api', 'v1'],
        response: {
          schema: apiBase.rest
            .getApiResponseSchema(
              Joi.object().label('serviceInfo').keys({
                name: Joi.string().required(),
                version: Joi.string().required(),
              }),
            )
            .label('serviceInfoResponse')
            .required(),
        },
      },
      handler: () => {
        const response: apiBase.rest.ApiResponse<unknown> = {
          success: true,
          value: {
            name: this.projectConfig.name,
            version: this.projectConfig.version,
          },
          status: apiBase.rest.HttpStatusCodes.get(200),
        };

        return response;
      },
    });

    server.route({
      method: 'GET',
      path: super.resolvePath('/healthcheck'),
      options: {
        description: 'Get the health status of the service',
        notes: 'Returns whether or not the service is healthy',
        tags: ['api', 'v1'],
        response: {
          schema: apiBase.rest.getApiResponseSchema().label('healthCheckResponse').required(),
        },
      },
      handler: () => {
        // check the status of service. e.g. DB is connected
        const success = this.database.isConnected;

        const response: apiBase.rest.ApiResponse = {
          success,
          status: apiBase.rest.HttpStatusCodes.get(success ? 200 : 503),
        };

        return response;
      },
    });
  }
}
