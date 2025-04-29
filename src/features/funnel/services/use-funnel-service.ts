/* eslint-disable @typescript-eslint/no-explicit-any */
// ~/hooks/services/use-funnel-service.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createServiceHooks } from "~/hooks/use-service-query";
import { FunnelFormData } from "~/schemas";
import { container, dependencies } from "~/utils/dependencies";
import { FunnelService } from "./funnel.service";

export const useFunnelService = () => {
  const { useServiceQuery } = createServiceHooks<FunnelService>(dependencies.FUNNEL_SERVICE);
  const queryClient = useQueryClient();

  // Queries
  const useGetAllFunnels = (filters: IFilters, options?: any) =>
    useServiceQuery<IPaginatedResponse<IFunnel>>(
      ["funnels", "list", filters],
      async (service) => {
        const result = await service.getAllFunnels(filters);
        if (!result) {
          throw new Error("Failed to fetch funnels");
        }
        return result;
      },
      {
        keepPreviousData: true,
        ...options,
      },
    );

  const useGetFunnelById = (funnelId: string, options?: any) =>
    useServiceQuery<{ data: IFunnel }>(
      ["funnels", "detail", funnelId],
      async (service) => {
        const result = await service.getFunnelByID(funnelId);
        if (!result) {
          throw new Error("Funnel not found");
        }
        return result;
      },
      options,
    );

  // Mutations
  const useSaveFunnelToDraft = () => {
    return useMutation({
      mutationFn: (data: FunnelFormData & { funnel: string }) => {
        const service = container.get<FunnelService>(dependencies.FUNNEL_SERVICE);
        return service.saveFunnelToDraft(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["funnels", "list"] });
      },
    });
  };

  const usePublishFunnel = () => {
    return useMutation({
      mutationFn: (data: FunnelFormData & { funnel: string }) => {
        const service = container.get<FunnelService>(dependencies.FUNNEL_SERVICE);
        return service.publishFunnel(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["funnels", "list"] });
      },
    });
  };

  const useUpdateFunnel = () => {
    return useMutation({
      mutationFn: (data: IFunnel) => {
        const service = container.get<FunnelService>(dependencies.FUNNEL_SERVICE);
        return service.updateFunnel(data);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["funnels", "list"] });
        queryClient.invalidateQueries({ queryKey: ["funnels", "detail", variables.id] });
      },
    });
  };

  const useDeleteFunnel = () => {
    return useMutation({
      mutationFn: (funnelId: string) => {
        const service = container.get<FunnelService>(dependencies.FUNNEL_SERVICE);
        return service.deleteFunnel(funnelId);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["funnels", "list"] });
      },
    });
  };

  return {
    // Queries
    useGetAllFunnels,
    useGetFunnelById,

    // Mutations
    useSaveFunnelToDraft,
    usePublishFunnel,
    useUpdateFunnel,
    useDeleteFunnel,
  };
};
