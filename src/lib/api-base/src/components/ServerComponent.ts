export interface ServerComponent {
  readonly init: () => Promise<void>;
  readonly dispose: () => Promise<void>;
}
