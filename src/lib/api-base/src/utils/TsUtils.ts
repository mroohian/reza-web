export type MakeRequired<T, K extends keyof T> = Omit<T, K> &
  {
    readonly [MK in K]-?: NonNullable<T[MK]>;
  };

export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  {
    readonly [MK in K]?: T[MK] | undefined;
  };
