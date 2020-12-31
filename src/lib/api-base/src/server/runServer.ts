import { Container } from 'inversify';
import Hapi from '@hapi/hapi';

import { LibContainer } from '../di/LibContainer';
import { INTERNAL_TYPES } from '../di/INTERNAL_TYPES';
import { ProjectConfig } from '../config';
import { Server } from './Server';

type PreStartHook = (server: Hapi.Server, projectConfig: ProjectConfig) => Promise<void>;

export const runServer = async (preStartHook?: PreStartHook): Promise<void> => {
  const container = LibContainer.get<Container>(INTERNAL_TYPES.ServiceContainer);

  const server = container.resolve(Server);

  if (preStartHook) {
    await preStartHook(server.hapiServer, server.projectConfig);
  }

  await server.run();
};
