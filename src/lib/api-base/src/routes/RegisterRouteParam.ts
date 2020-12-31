import { Route } from './Route';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegisterRouteParam<T extends Route> = new (...args: readonly any[]) => T;
