"use client";

import { useEffect, useState, useTransition } from "react";

import { AnalyticsCard } from "~/app/(dashboard-pages)/_components/analytics-card";
import { BackNavigator } from "~/app/(dashboard-pages)/_components/back-navigator";
import { EmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import { TableHeaderInfo } from "~/app/(dashboard-pages)/_components/table-header-info";
import Loading from "~/app/Loading";
import { WithDependency } from "~/HOC/withDependencies";
import { OrderService } from "~/services/order/orders.service";
import { dependencies } from "~/utils/dependencies";

const BaseOrderDetailsPage = ({
  params,
  orderService,
}: {
  params: { orderID: string };
  orderService: OrderService;
}) => {
  const [isPending, startTransition] = useTransition();
  const [order, setOrder] = useState<IOrder | null>(null);

  useEffect(() => {
    const fetchProductData = async () => {
      startTransition(async () => {
        const order = await orderService.getOrderById(params.orderID);
        setOrder(order?.data || null);
      });
    };

    fetchProductData();
  }, [params.orderID, orderService]);

  if (isPending) {
    return <Loading text={`Loading order details...`} className={`w-fill h-fit p-20`} />;
  }

  if (!order) {
    return (
      <EmptyState
        title="Order Not Found"
        description="The order you are looking for does not exist."
        images={[]}
        className="h-full"
      />
    );
  }

  return (
    <section className="space-y-6">
      <section className="flex flex-col justify-between space-y-4 md:flex-row md:space-y-0 lg:items-center">
        <BackNavigator text="Order Details" />
      </section>

      <section>
        <p className="mb-4 text-lg font-semibold">{order?.product?.title}</p>
        <TableHeaderInfo
          headers={["Publish Date", "Price", "Product Link"]}
          product={{ ...order?.product, updated_at: order?.created_at }}
        />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <AnalyticsCard title="Total Orders" value={order?.quantity} />
        <AnalyticsCard title="Total Sales" value={order?.product?.total_sales} />
        <AnalyticsCard
          className={`text-mid-success`}
          title="Total Value"
          value={`₦${order?.total_amount?.toLocaleString()}`}
        />
      </section>
    </section>
  );
};

const OrderDetailsPage = WithDependency(BaseOrderDetailsPage, {
  orderService: dependencies.ORDER_SERVICE,
});

export default OrderDetailsPage;
