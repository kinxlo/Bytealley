/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceHooks } from "~/hooks/use-service-query";
import { dependencies } from "~/utils/dependencies";
import { OrderService } from "./orders.service";

export const useOrderService = () => {
  const { useServiceQuery } = createServiceHooks<OrderService>(dependencies.ORDER_SERVICE);

  // Queries
  const useGetAllOrders = (filters?: IFilters, options?: any) =>
    useServiceQuery(["orders", "list", filters], (service) => service.getAllOrders(filters), options);

  const useGetOrderById = (orderId: string, options?: any) =>
    useServiceQuery(["orders", "detail", orderId], (service) => service.getOrderById(orderId), options);

  const useDownloadOrders = (filters: IFilters, options?: any) =>
    useServiceQuery(["orders", "download", filters], (service) => service.downloadOrdersAsCSV(filters), options);

  return {
    // Queries
    useGetAllOrders,
    useGetOrderById,
    useDownloadOrders,

    // Mutations (add any order-related mutations here if needed)
  };
};
