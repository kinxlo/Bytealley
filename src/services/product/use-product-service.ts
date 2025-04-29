/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createServiceHooks } from "~/hooks/use-service-query";
import { container, dependencies } from "~/utils/dependencies";
import type { ProductService } from "./product.service";

export const useProductService = () => {
  const queryClient = useQueryClient();
  const { useServiceQuery, useServiceMutation } = createServiceHooks<ProductService>(dependencies.PRODUCT_SERVICE);

  // Queries
  const useGetAllProducts = (filters: IFilters = Object.create({ page: 1 }), options?: any) =>
    useServiceQuery(["products", "list", filters], (service) => service.getAllProducts(filters), options);

  const useGetDashboardAnalytics = (options?: any) =>
    useServiceQuery(["products", "analytics"], (service) => service.getDashboardAnalytics(), options);

  const useGetPurchasedProducts = (filters: IFilters, options?: any) =>
    useServiceQuery(["products", "purchased", filters], (service) => service.getPurchasedProducts(filters), options);

  const useGetProductTypesAndCategories = (options?: any) =>
    useServiceQuery(["products", "types"], (service) => service.getProductTypesAndCategories(), options);

  const useGetProductTags = (options?: any) =>
    useServiceQuery(["products", "tags"], (service) => service.getProductTags(), options);

  const useDownloadProducts = (filters: IFilters, options?: any) =>
    useServiceQuery(["products", "download", filters], (service) => service.downloadProducts(filters), options);

  const useGetProductById = (productId: string, options?: any) =>
    useServiceQuery(["products", "detail", productId], (service) => service.getProductById(productId), options);

  const useGetProductOrders = (productId: string, options?: any) =>
    useServiceQuery(
      ["products", "orders", productId],
      (service) => service.getProductOrderByProductId(productId),
      options,
    );

  // Mutations
  const useCreateProduct = () => useServiceMutation((service, data: ProductFormValues) => service.createProduct(data));

  const useUpdateProduct = () =>
    useServiceMutation((service, { data, productId }: { data: any; productId: string }) =>
      service.updateProduct(data, productId),
    );

  const useSoftDeleteProduct = () => {
    return useMutation({
      mutationFn: (data: string) => {
        const service = container.get<ProductService>(dependencies.PRODUCT_SERVICE);
        return service.softDeleteProduct(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products", "list"] });
      },
    });
  };

  const useRestoreDeleteProduct = () => {
    return useMutation({
      mutationFn: (data: string) => {
        const service = container.get<ProductService>(dependencies.PRODUCT_SERVICE);
        return service.restoreDeleteProduct(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products", "list"] });
      },
    });
  };

  const useDeleteProductPermanently = () => {
    return useMutation({
      mutationFn: (data: string) => {
        const service = container.get<ProductService>(dependencies.PRODUCT_SERVICE);
        return service.deleteProductPermanently(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products", "list"] });
      },
    });
  };

  const usePublishProduct = () => {
    return useMutation({
      mutationFn: (data: string) => {
        const service = container.get<ProductService>(dependencies.PRODUCT_SERVICE);
        return service.publishProduct(data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["products", "list"] });
        queryClient.invalidateQueries({ queryKey: ["products", "detail"] });
      },
    });
  };

  return {
    // Querie
    useGetAllProducts,
    useGetDashboardAnalytics,
    useGetPurchasedProducts,
    useGetProductTypesAndCategories,
    useGetProductTags,
    useDownloadProducts,
    useGetProductById,
    useGetProductOrders,

    // Mutations
    useCreateProduct,
    useUpdateProduct,
    useSoftDeleteProduct,
    useRestoreDeleteProduct,
    useDeleteProductPermanently,
    usePublishProduct,
  };
};
