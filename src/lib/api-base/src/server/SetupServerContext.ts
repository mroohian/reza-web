import { Container } from 'inversify';

import { ServerComponent } from '../components';
import { RegisterServerComponentParam } from '../components/RegisterServerComponentParam';
import { Route } from '../routes';
import { RegisterRouteParam } from '../routes/RegisterRouteParam';

export interface SetupServerContext {
  readonly container: Container;
  readonly registerServerComponent: <T extends ServerComponent>(serverComponent: RegisterServerComponentParam<T>) => void;
  readonly registerRoute: <T extends Route>(route: RegisterRouteParam<T>) => void;
}
