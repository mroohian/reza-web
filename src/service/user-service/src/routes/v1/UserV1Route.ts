import { injectable } from 'inversify';
import * as Joi from 'joi';
import { Server } from '@hapi/hapi';
import * as apiBase from '@rw/api-base';

interface User {
  readonly id: string;
  readonly name: string;
}

const UserSchema = Joi.object<User>().label('user').keys({
  id: Joi.string().required(),
  name: Joi.string().required(),
});

@injectable()
export class UserV1Route extends apiBase.routes.Route {
  public readonly name = 'userV1';
  public readonly prefix = '/api/v1/user';

  public setup(server: Server): void {
    server.route({
      path: super.resolvePath('/'),
      method: 'GET',
      options: {
        description: 'Get all user infos',
        notes: 'Returns all user info',
        tags: ['api', 'v1'],
        response: {
          schema: apiBase.rest.getApiResponseSchema(Joi.array().label('userList').items(UserSchema)).label('userListApiResponse'),
        },
      },
      handler: () => {
        const response: apiBase.rest.ApiResponse<User[]> = {
          success: true,
          value: [
            {
              id: 'ea6b35e3e06e46e582f9a8a4148992ab',
              name: 'reza',
            },
          ],
          status: apiBase.rest.HttpStatusCodes.get(200),
        };

        return response;
      },
    });
  }
}
