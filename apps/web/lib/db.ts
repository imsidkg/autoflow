import { AppDataSource } from "@repo/db";

let dataSourcePromise: Promise<any> | null = null;

export const getDataSource = () => {
  if (!dataSourcePromise) {
    dataSourcePromise = (async () => {
      if (AppDataSource.isInitialized) {
        return AppDataSource;
      }
      return AppDataSource.initialize();
    })();
  }
  return dataSourcePromise;
};
