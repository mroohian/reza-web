import { Container } from 'inversify';

import { LibContainer } from '../di/LibContainer';
import { INTERNAL_TYPES } from '../di/INTERNAL_TYPES';
import { registerServerComponent } from '../components/registerServerComponent';
import { registerRoute } from '../routes/registerRoute';

import { addDefaultBindings } from './defaultBindings';
import { SetupServerContext } from './SetupServerContext';

export const setupServer = (setupFn: (context: SetupServerContext) => void): void => {
  const container = LibContainer.createChild();

  LibContainer.bind<Container>(INTERNAL_TYPES.ServiceContainer).toConstantValue(container);

  const context: SetupServerContext = {
    container,
    registerServerComponent: (serverComponent) => registerServerComponent(container, serverComponent),
    registerRoute: (route) => registerRoute(container, route),
  };

  addDefaultBindings(context);

  setupFn(context);
};
