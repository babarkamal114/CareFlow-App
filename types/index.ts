export type PageParams<T extends Record<string, string>> = {
  params: Promise<T>;
};

export * from "./components";
export * from "./patients";
export * from "./patient-forms";
export * from "./patient-records";
