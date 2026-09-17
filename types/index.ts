/** App-wide shared types (branded IDs, pagination, etc.). */

export type PageParams<T extends Record<string, string>> = {
  params: Promise<T>;
};

export * from "./components";
