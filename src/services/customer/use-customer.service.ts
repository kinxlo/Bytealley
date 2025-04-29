/* eslint-disable @typescript-eslint/no-explicit-any */
import { createServiceHooks } from "~/hooks/use-service-query";
import { dependencies } from "~/utils/dependencies";
import { CustomerService } from "./customer.service";

export const useCustomerService = () => {
  const { useServiceQuery } = createServiceHooks<CustomerService>(dependencies.CUSTOMER_SERVICE);

  // Queries
  const useGetAllCustomers = (filters: IFilters, options?: any) =>
    useServiceQuery(["customers", "list", filters], (service) => service.getAllCustomers(filters), options);

  const useGetCustomerById = (customerId: string, options?: any) =>
    useServiceQuery(["customers", "detail", customerId], (service) => service.getCustomerById(customerId), options);

  const useGetOrdersByCustomerId = (customerId: string, options?: any) =>
    useServiceQuery(
      ["customers", "orders", customerId],
      (service) => service.getOrdersByCustomerId(customerId),
      options,
    );

  const useDownloadCustomers = (filters: IFilters, options?: any) =>
    useServiceQuery(
      ["customers", "download", filters],
      (service) => service.downloadCustomersAsCSV(filters),
      { ...options, enabled: false }, // Disabled by default for manual triggering
    );

  return {
    // Queries
    useGetAllCustomers,
    useGetCustomerById,
    useGetOrdersByCustomerId,
    useDownloadCustomers,

    // Mutations can be added here if needed
  };
};
