declare type Modify<T, R> = Omit<T, keyof R> & R;

declare type Prefix<T, P extends string | number | bigint | boolean | null | undefined> = {
  [K in keyof T as `${P}${Capitalize<string & K>}`]: T[K];
};

declare type Nullable<T> = T | null | undefined;

declare type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

declare type AllowNull<T, Condition = true> = Condition extends true ? T | null : T;
