export {};

declare global {
  export type Nullable<T> = T | null;
  export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
  export type Union<T> = T | (string & {});
  export type Keys<T extends object> = keyof T;
}
