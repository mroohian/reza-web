import { Container } from 'inversify';

import { INTERNAL_TYPES } from '../di/INTERNAL_TYPES';
import { Route } from './Route';
import { RegisterRouteParam } from './RegisterRouteParam';

export const registerRoute = <T extends Route>(container: Container, route: RegisterRouteParam<T>): void => {
  container.bind<T>(INTERNAL_TYPES.Route).to(route).inSingletonScope();
};
