import { injectable } from 'inversify';
import Hapi from '@hapi/hapi';
import * as apiBase from '@rw/api-base';

@injectable()
export class DefaultRoute extends apiBase.routes.Route {
  public readonly name = 'default';
  public readonly prefix = '';

  public setup(server: Hapi.Server): void {
    server.route({
      method: 'GET',
      path: super.resolvePath('/'),
      handler: (_request, h) => {
        return h.redirect('/api/v1/');
      },
    });
  }
}
