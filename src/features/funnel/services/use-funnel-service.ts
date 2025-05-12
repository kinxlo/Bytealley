/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createServiceHooks } from "~/hooks/use-service-query";
import { FunnelFormData } from "~/schemas";
import { container, dependencies } from "~/utils/dependencies";
import type { FunnelService } from "./funnel.service";

export const useFunnelService = () => {
  const queryClient = useQueryClient();
  const { useServiceQuery, useServiceMutation } = createServiceHooks<FunnelService>(dependencies.FUNNEL_SERVICE);

  // Queries
  const useGetAllFunnels = (filters: IFilters = Object.create({ page: 1 }), options?: any) =>
    useServiceQuery(["funnels", "list", filters], (service) => service.getAllFunnels(filters), options);

  const useGetFunnelById = (funnelId: string, options?: any) =>
    useServiceQuery(["funnels", "detail", funnelId], (service) => service.getFunnelByID(funnelId), options);

  // Mutations
  const useSaveFunnelToDraft = () =>
    useServiceMutation((service, data: FunnelFormData & { funnel: string }) => service.saveFunnelToDraft(data), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["funnels", "list"] });
      },
    });

  const usePublishFunnel = () =>
    useServiceMutation((service, data: FunnelFormData & { funnel: string }) => service.publishFunnel(data), {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["funnels", "list"] });
      },
    });

  const useUpdateFunnel = () =>
    useServiceMutation((service, data: IFunnel) => service.updateFunnel(data), {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ["funnels", "list", { page: 1 }] });
        queryClient.invalidateQueries({ queryKey: ["funnels", "detail", variables.id] });
      },
    });

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
