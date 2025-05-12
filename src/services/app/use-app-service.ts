/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceHooks } from "~/hooks/use-service-query";
import type { EmailIntegrationFormData, ExternalContactFormData, ProfileFormData } from "~/schemas";
import { dependencies } from "~/utils/dependencies";
import { AppService } from "./app.service";

export const useAppService = () => {
  const { useServiceQuery, useServiceMutation } = createServiceHooks<AppService>(dependencies.APP_SERVICE);

  // Queries
  const useGetProductCategory = (options?: any) =>
    useServiceQuery(["app", "product-categories"], (service) => service.getProductCategory(), options);

  const useGetAllProducts = (filters: IFilters = Object.create({ page: 1 }), options?: any) =>
    useServiceQuery(["app", "products", "list", filters], (service) => service.getAllProducts(filters), options);

  const useGetProductBySlug = (productSlug: string, options?: any) =>
    useServiceQuery(
      ["app", "products", "detail", productSlug],
      (service) => service.getProductBySlug(productSlug),
      options,
    );

  const useGetProductReviews = (productID: string, options?: any) =>
    useServiceQuery(
      ["app", "products", "reviews", productID],
      (service) => service.getProductReviews(productID),
      options,
    );

  const useGetUser = (options?: any) => useServiceQuery(["app", "user"], (service) => service.getUser(), options);

  const useGetProductsFromCart = (options?: any) =>
    useServiceQuery(["app", "cart"], (service) => service.getProductsFromCart(), options);

  // Mutations
  const useSearchProducts = () => useServiceMutation((service, data: { text: string }) => service.search(data));

  const useUpdateUser = () => useServiceMutation((service, data: ProfileFormData) => service.updateUser(data));

  const useSubscribeToPlan = () => useServiceMutation((service) => service.subscribeToPlan());

  const useIntegrateEmail = () =>
    useServiceMutation((service, data: EmailIntegrationFormData) => service.integrateEmail(data));

  const useUpdateUserNotifications = () =>
    useServiceMutation((service, data: object) => service.updateUserNotifications(data));

  const useContactUs = () => useServiceMutation((service, data: ExternalContactFormData) => service.contactUs(data));

  const useStoreProductsInCart = () =>
    useServiceMutation((service, data: { product_slug: string; quantity: number }) =>
      service.storeProductsInCart(data),
    );

  const useUpdateProductInCart = () =>
    useServiceMutation((service, { productID, data }: { productID: string; data: { quantity: number } }) =>
      service.updateProductInCart(productID, data),
    );

  const useDeleteProductInCart = () =>
    useServiceMutation((service, productID: string) => service.deleteProductInCart(productID));

  const usePurchaseProductInCart = () =>
    useServiceMutation(
      (
        service,
        data: {
          amount: number;
          products: {
            product_slug: string;
            quantity: number;
          }[];
        },
      ) => service.purchaseProductInCart(data),
    );

  return {
    // Queries
    useGetProductCategory,
    useGetAllProducts,
    useGetProductBySlug,
    useGetProductReviews,
    useGetUser,
    useGetProductsFromCart,

    // Mutations
    useSearchProducts,
    useUpdateUser,
    useSubscribeToPlan,
    useIntegrateEmail: useIntegrateEmail,
    useUpdateUserNotifications,
    useContactUs,
    useStoreProductsInCart,
    useUpdateProductInCart,
    useDeleteProductInCart,
    usePurchaseProductInCart,
  };
};
