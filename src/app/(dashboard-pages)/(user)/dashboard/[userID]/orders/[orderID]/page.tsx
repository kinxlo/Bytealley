"use client";

import { AnalyticsCard } from "~/app/(dashboard-pages)/_components/analytics-card";
import { BackNavigator } from "~/app/(dashboard-pages)/_components/back-navigator";
import { EmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import { TableHeaderInfo } from "~/app/(dashboard-pages)/_components/table-header-info";
import Loading from "~/app/Loading";
import { useOrderService } from "~/services/order/use-order.service";

const OrderDetailsPage = ({ params }: { params: { orderID: string } }) => {
  const { useGetOrderById } = useOrderService();
  const { data: order, isLoading, isError } = useGetOrderById(params.orderID);

  if (isLoading) {
    return <Loading text="Loading order details..." className="w-fill h-fit p-20" />;
  }

  if (isError || !order?.data) {
    return (
      <EmptyState
        title="Order Not Found"
        description="The order you are looking for does not exist."
        images={[]}
        className="h-full"
      />
    );
  }

  const orderData = order.data;

  return (
    <section className="space-y-6">
      <section className="flex flex-col justify-between space-y-4 md:flex-row md:space-y-0 lg:items-center">
        <BackNavigator text="Order Details" />
      </section>

      <section>
        <p className="mb-4 text-lg font-semibold">{orderData?.product?.title}</p>
        <TableHeaderInfo
          headers={["Publish Date", "Price", "Product Link"]}
          product={{ ...orderData?.product, updated_at: orderData?.created_at }}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AnalyticsCard title="Total Orders" value={orderData?.quantity} />
        <AnalyticsCard title="Total Sales" value={orderData?.product?.total_sales} />
        <AnalyticsCard
          className="text-mid-success"
          title="Total Value"
          value={`₦${orderData?.total_amount?.toLocaleString()}`}
        />
      </section>
    </section>
  );
};

export default OrderDetailsPage;
