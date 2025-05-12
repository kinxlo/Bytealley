/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceHooks } from "~/hooks/use-service-query";
import { dependencies } from "~/utils/dependencies";
import { PayoutService } from "./payout.service";

export const usePayoutService = () => {
  const { useServiceQuery } = createServiceHooks<PayoutService>(dependencies.PAYOUT_SERVICE);

  // Queries
  const useGetAllPayouts = (filters: IFilters, options?: any) =>
    useServiceQuery(["payouts", "list", filters], (service) => service.getAllPayouts(filters), options);

  const useGetPayoutById = (payoutId: string, options?: any) =>
    useServiceQuery(["payouts", "detail", payoutId], (service) => service.getPayoutById(payoutId), options);

  const useDownloadPayouts = (filters: IFilters, options?: any) =>
    useServiceQuery(
      ["payouts", "download", filters],
      (service) => service.downloadPayoutAsCSV(filters),
      { ...options, enabled: false }, // Disabled by default for manual triggering
    );

  return {
    // Queries
    useGetAllPayouts,
    useGetPayoutById,
    useDownloadPayouts,

    // Mutations can be added here if needed
  };
};
