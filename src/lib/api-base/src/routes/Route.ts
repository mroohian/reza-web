import { injectable } from 'inversify';
import Hapi from '@hapi/hapi';

@injectable()
export abstract class Route {
  protected abstract readonly prefix: string;

  public abstract readonly name: string;
  public abstract setup(server: Hapi.Server): void;

  protected resolvePath(path: string): string {
    const prefix = this.prefix.endsWith('/') ? this.prefix.slice(0, -1) : this.prefix;
    const fullPath = prefix + (path.startsWith('/') ? path : `/${path}`);
    return fullPath.length > 1 && fullPath.endsWith('/') ? fullPath.slice(0, -1) : fullPath;
  }
}
