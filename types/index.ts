export type PageParams<T extends Record<string, string>> = {
  params: Promise<T>;
};

export * from "./components";
export * from './compliance'
export * from "./staff-form";
export * from './finance'
export * from './reports';
export * from './report-components'
export * from './medication';
