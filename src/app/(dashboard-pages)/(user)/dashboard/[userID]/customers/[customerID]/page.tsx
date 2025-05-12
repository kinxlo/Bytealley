"use client";

import { AnalyticsCard } from "~/app/(dashboard-pages)/_components/analytics-card";
import { BackNavigator } from "~/app/(dashboard-pages)/_components/back-navigator";
import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { latestPurchaseColumns } from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { EmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import { TableHeaderInfo } from "~/app/(dashboard-pages)/_components/table-header-info";
import Loading from "~/app/Loading";
import { useCustomerService } from "~/services/customer/use-customer.service";

const CustomerDetailsPage = ({ params }: { params: { customerID: string } }) => {
  const { useGetCustomerById, useGetOrdersByCustomerId } = useCustomerService();

  // Fetch customer data
  const {
    data: customerData,
    isLoading: isLoadingCustomer,
    isError: isCustomerError,
  } = useGetCustomerById(params.customerID);

  // Fetch customer orders
  const { data: ordersData, isLoading: isLoadingOrders } = useGetOrdersByCustomerId(params.customerID);

  if (isLoadingCustomer || isLoadingOrders) {
    return <Loading text="Loading customer details..." className="w-fill h-fit p-20" />;
  }

  if (isCustomerError || !customerData?.data) {
    return (
      <EmptyState
        title="Customer Not Found"
        description="The customer you are looking for does not exist."
        images={[]}
        className="h-full"
      />
    );
  }

  const customer = customerData.data;
  const customerOrders = ordersData?.data || [];

  return (
    <section className="space-y-6">
      <section className="flex flex-col justify-between space-y-4 md:flex-row md:space-y-0 lg:items-center">
        <BackNavigator text="Customer Details" />
      </section>

      <p className="text-lg font-semibold">{customer.name}</p>
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <section>
          <TableHeaderInfo
            headers={["Email Address", "Joined"]}
            product={{
              email: customer?.email,
              joined: customer?.joined,
            }}
          />
          <section className="mt-2 grid h-fit grid-cols-1 gap-4 lg:grid-cols-2">
            <AnalyticsCard title="Total Orders" value={customer?.total_order} />
            <AnalyticsCard title="Total Transactions" value={`₦${customer?.total_transactions.toLocaleString()}`} />
          </section>
        </section>
        <DashboardTable data={customerOrders} columns={latestPurchaseColumns} />
      </section>
    </section>
  );
};

export default CustomerDetailsPage;
