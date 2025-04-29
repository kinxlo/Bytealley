/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceHooks } from "~/hooks/use-service-query";
import { dependencies } from "~/utils/dependencies";
import { AnalyticsService } from "./analytics.service";

export const useAnalyticsService = () => {
  const { useServiceQuery } = createServiceHooks<AnalyticsService>(dependencies.ANALYTICS_SERVICE);

  // Queries
  const useGetAllDownloads = (filters: IFilters, options?: any) =>
    useServiceQuery(["analytics", "downloads", "list", filters], (service) => service.getAllDownload(filters), options);

  const useGetDownloadById = (downloadId: string, options?: any) =>
    useServiceQuery(
      ["analytics", "downloads", "detail", downloadId],
      (service) => service.getDownloadById(downloadId),
      options,
    );

  const useGetDailyRevenueData = (monthIndex: string, options?: any) =>
    useServiceQuery(
      ["analytics", "revenue", "daily", monthIndex],
      (service) => service.getDailyRevenueData(monthIndex),
      options,
    );

  return {
    // Queries
    useGetAllDownloads,
    useGetDownloadById,
    useGetDailyRevenueData,

    // Mutations can be added here if needed
  };
};
