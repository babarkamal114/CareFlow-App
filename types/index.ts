export type PageParams<T extends Record<string, string>> = {
  params: Promise<T>;
};

export * from "./components";
export * from "./staff-form";
export * from './reports';
export * from './report-components'