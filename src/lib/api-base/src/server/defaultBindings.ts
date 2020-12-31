import { injectable } from 'inversify';
import { Server } from '@hapi/hapi';

import { TYPES } from '..';
import { SetupServerContext } from './SetupServerContext';
import { ProjectConfig } from '../config';
import { getProjectConfig } from '../config/ProjectConfig';
import { ServerComponent } from '../components';
import { Route } from '../routes';

export const addDefaultBindings = (context: SetupServerContext): void => {
  context.container.bind<Server>(Server).toSelf().inSingletonScope();

  const projectConfig = getProjectConfig();
  context.container.bind<ProjectConfig>(TYPES.ProjectConfig).toConstantValue(projectConfig);

  @injectable()
  class DummyServerComponent implements ServerComponent {
    public async init(): Promise<void> {
      // Note: make multi injects work with zero imports
    }
    public async dispose(): Promise<void> {
      // Note: make multi injects work with zero imports
    }
  }
  context.registerServerComponent(DummyServerComponent);

  @injectable()
  class DummyRoute extends Route {
    public readonly prefix = '/[unused]';
    public readonly name = 'lib:dummy';

    public setup(): void {
      // Note: make multi injects work with zero imports
    }
  }
  context.registerRoute(DummyRoute);
};
