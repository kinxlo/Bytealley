/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createServiceHooks } from "~/hooks/use-service-query";
import { BankFormData, WithdrawalData } from "~/schemas";
import { container, dependencies } from "~/utils/dependencies";
import { EarningService } from "./earnings.service";

export const useEarningsService = () => {
  // Create service hooks using the dependency symbol
  const { useServiceQuery } = createServiceHooks<EarningService>(dependencies.EARNINGS_SERVICE);
  const queryClient = useQueryClient();

  // Queries
  const useGetUserEarnings = (options?: any) =>
    useServiceQuery(["earnings", "user"], (service) => service.getUserEarnings(), options);

  const useGetBankList = (options?: any) =>
    useServiceQuery(["earnings", "banks"], (service) => service.getListOfPaystackApproveBanks(), {
      staleTime: Infinity,
      ...options,
    });

  const useGetPaymentAccounts = (options?: any) =>
    useServiceQuery(["earnings", "payment-accounts"], (service) => service.getAllRegisteredPaymentAccount(), options);

  // Mutations
  const useRegisterPaymentAccount = () => {
    return useMutation({
      mutationFn: (data: BankFormData) => {
        const service = container.get<EarningService>(dependencies.EARNINGS_SERVICE);
        return service.registerPaymentAccount(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["earnings", "payment-accounts"] });
      },
    });
  };

  const useInitiateWithdrawal = () => {
    return useMutation({
      mutationFn: (data: WithdrawalData) => {
        const service = container.get<EarningService>(dependencies.EARNINGS_SERVICE);
        return service.initiateWithdrawal(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["earnings", "user"] });
      },
    });
  };

  return {
    // Queries
    useGetUserEarnings,
    useGetBankList,
    useGetPaymentAccounts,

    // Mutations
    useRegisterPaymentAccount,
    useInitiateWithdrawal,
  };
};
