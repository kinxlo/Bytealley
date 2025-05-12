/* eslint-disable @typescript-eslint/no-explicit-any */
// ~/hooks/services/use-download-service.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createServiceHooks } from "~/hooks/use-service-query";
import { container, dependencies } from "~/utils/dependencies";
import { DownloadService } from "./download.service";

export const useDownloadService = () => {
  const { useServiceQuery } = createServiceHooks<DownloadService>(dependencies.DOWNLOAD_SERVICE);
  const queryClient = useQueryClient();

  // Queries
  const useGetAllDownloads = (filters: IFilters, options?: any) =>
    useServiceQuery(["downloads", "list", filters], (service) => service.getAllDownload(filters), options);

  const useGetDownloadById = (downloadId: string, isSkillSelling?: boolean, options?: any) =>
    useServiceQuery(
      ["downloads", "detail", downloadId, { isSkillSelling }],
      (service) => service.getDownloadById(downloadId, isSkillSelling),
      options,
    );

  // Mutations
  const useReviewDownloadedProduct = () => {
    return useMutation({
      mutationFn: ({ downloadId, review }: { downloadId: string; review: IReview }) => {
        const service = container.get<DownloadService>(dependencies.DOWNLOAD_SERVICE);
        return service.reviewDownloadedProduct(downloadId, review);
      },
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: ["downloads", "detail", variables.downloadId],
        });
      },
    });
  };

  return {
    // Queries
    useGetAllDownloads,
    useGetDownloadById,

    // Mutations
    useReviewDownloadedProduct,
  };
};
