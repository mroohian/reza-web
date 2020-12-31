import { Container } from 'inversify';

import { INTERNAL_TYPES } from '../di/INTERNAL_TYPES';
import { RegisterServerComponentParam } from './RegisterServerComponentParam';
import { ServerComponent } from './ServerComponent';

export const registerServerComponent = <T extends ServerComponent>(
  container: Container,
  serverComponent: RegisterServerComponentParam<T>,
): void => {
  container.bind<T>(serverComponent).toSelf().inSingletonScope();
  container.bind<T>(INTERNAL_TYPES.ServerComponent).toService(serverComponent);
};
