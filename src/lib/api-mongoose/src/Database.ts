import debugLog from 'debug';
import { injectable, inject } from 'inversify';
import mongoose, { ConnectOptions, Mongoose } from 'mongoose';

import { TYPES } from './TYPES';

const log = debugLog('lib:api-mongoose');
const logError = debugLog('error:lib:api-mongoose');

@injectable()
export class Database {
  private readonly connectionString: string;
  private readonly connectOptions: mongoose.ConnectOptions;
  private _mongoose?: Mongoose;

  public constructor(
    @inject(TYPES.ConnectionString) connectionString: string,
    @inject(TYPES.ConnectOptions) connectOptions?: ConnectOptions,
  ) {
    this.connectionString = connectionString;
    this.connectOptions = connectOptions ?? {};
  }

  public get mongoose(): Mongoose | undefined {
    return this._mongoose;
  }

  public get isConnected(): boolean {
    return this._mongoose?.connection.readyState === 1;
  }

  public async init(): Promise<void> {
    const connectOptions: ConnectOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,

      ...this.connectOptions,
    };

    this._mongoose = await mongoose.connect(this.connectionString, connectOptions);

    this._mongoose.connection.on('error', () => {
      logError('MongoDB Connection error');
    });

    log(`Connected to DB. connected: ${this.isConnected}`);
  }

  public async dispose(): Promise<void> {
    if (this._mongoose) {
      this._mongoose.modelNames().forEach((modelName) => {
        this._mongoose?.deleteModel(modelName);
      });

      await this._mongoose.disconnect();
    }

    log(`Disconnected from db. connected: ${this.isConnected}`);
  }
}
