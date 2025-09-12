import { getAppDataSource } from "@repo/db"; // Import the new function

let dataSourcePromise: Promise<any> | null = null;

export const getDataSource = () => {
  if (!dataSourcePromise) {
    dataSourcePromise = getAppDataSource(); // Call the new function
  }
  return dataSourcePromise;
};
