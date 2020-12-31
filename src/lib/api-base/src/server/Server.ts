import { injectable, inject, multiInject } from 'inversify';
import debugLog from 'debug';
import * as Hapi from '@hapi/hapi';
import { Boom, badRequest } from '@hapi/boom';
import * as Inert from '@hapi/inert';
import * as Vision from '@hapi/vision';
import * as HapiSwagger from 'hapi-swagger';

import { TYPES } from '..';
import { INTERNAL_TYPES } from '../di/INTERNAL_TYPES';
import { ApiError, ApiResponse, HttpStatusCodes } from '../rest';
import { ProjectConfig } from '../config';
import { Route } from '../routes';
import { ServerComponent } from '../components';

const log = debugLog('lib:api-base');
const logError = debugLog('error:lib:api-base');

@injectable()
export class Server {
  private readonly routes: Route[];
  private readonly serverComponents: ServerComponent[];
  private readonly registeredRoutes: string[] = [];

  public readonly projectConfig: ProjectConfig;
  public readonly hapiServer: Hapi.Server;

  public constructor(
    @inject(TYPES.ProjectConfig) projectConfig: ProjectConfig,
    @multiInject(INTERNAL_TYPES.Route) routes: Route[],
    @multiInject(INTERNAL_TYPES.ServerComponent) serverComponents: ServerComponent[],
  ) {
    this.projectConfig = projectConfig;
    this.routes = routes;
    this.serverComponents = serverComponents;

    this.hapiServer = Hapi.server({
      port: projectConfig.config.port,
      host: '::0',
      routes: {
        validate: {
          failAction: (request, _h, error): Hapi.Lifecycle.ReturnValue => {
            request.log(['error'], `ValidationError: ${error?.message ?? 'Unknown error'}`);

            if (process.env.NODE_ENV === 'production') {
              throw badRequest(`Failed to validate the request`);
            }

            throw error;
          },
        },
      },
    });

    this.setupOnPreResponse();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isApiResponse(response: any): response is ApiResponse<unknown> {
    return typeof response === 'object' && 'success' in response && 'status' in response;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isBoom(response: any): response is Boom {
    return response instanceof Boom && response.isBoom;
  }

  private setupOnPreResponse(): void {
    this.hapiServer.ext('onPreResponse', (request: Hapi.Request, h: Hapi.ResponseToolkit) => {
      const response = request.response;

      if (this.isBoom(response)) {
        let statusCode: number;
        let message: string;
        let headers: Record<string, string> = {};

        if (response instanceof ApiError) {
          statusCode = response.statusCode;
          message = response.message;
          if (response?.config?.headers) {
            headers = response.config.headers;
          }
        } else {
          statusCode = response.output.statusCode;
          message = response.message ? response.toString() : response.output.payload.message;
        }

        const errorResponse: ApiResponse = {
          success: false,
          status: HttpStatusCodes.get(statusCode),
          messages: [message],
        };

        const output = h.response(errorResponse).code(statusCode);

        Object.entries(headers).forEach(([name, value]) => output.header(name, value));

        return output;
      }

      if (this.isApiResponse(response.source)) {
        response.code(response.source.status.code);
      }

      return h.continue;
    });
  }

  private async registerPlugins(): Promise<void> {
    await this.hapiServer.register([Inert, Vision]);

    await this.hapiServer.register({
      plugin: HapiSwagger,
      options: {
        info: {
          title: `API Doc: ${this.projectConfig.name}`,
          version: this.projectConfig.version,
        },
      },
    });
  }

  private async startServer(): Promise<void> {
    process.on('unhandledRejection', (error) => {
      logError(error);
      this.hapiServer.log(['error'], `${error}`);
      process.exit(1);
    });

    process.on('SIGTERM', () => {
      log('SIGTERM signal received.');
      this.stopServer().catch(() => {
        process.exit(1);
      });
    });

    process.on('SIGINT', () => {
      log('SIGINT signal received.');
      this.stopServer().catch(() => {
        process.exit(1);
      });
    });

    await this.hapiServer.start();
    log(`Server running on ${this.hapiServer.info.uri}`);
  }

  private async stopServer(): Promise<void> {
    log('Stopping server...');

    try {
      await this.hapiServer.stop();

      for (const serverComponent of this.serverComponents) {
        await serverComponent.dispose();
      }

      process.exit(0);
    } catch (error) {
      logError(error);
      this.hapiServer.log(['error'], `${error}`);
      process.exit(1);
    }
  }

  private checkAndRegisterRoute(route: Route): void {
    const { name } = route;

    if (name in this.registeredRoutes) {
      throw new Error(`Route '${name}' is registered more than once.`);
    }

    route.setup(this.hapiServer);

    this.registeredRoutes.push(name);
  }

  public async run(): Promise<void> {
    await this.registerPlugins();

    for (const serverComponent of this.serverComponents) {
      await serverComponent.init();
    }

    for (const route of this.routes) {
      this.checkAndRegisterRoute(route);
    }

    await this.startServer();
  }
}
