import { ServerComponent } from './ServerComponent';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegisterServerComponentParam<T extends ServerComponent> = new (...args: readonly any[]) => T;
