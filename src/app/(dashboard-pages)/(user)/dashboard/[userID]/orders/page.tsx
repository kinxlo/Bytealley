"use client";

// import refreshIcon from "@/icons/Property_2_Update_ojnsf7.svg";
import emptyCart from "@/images/empty-cart.svg";
import { format } from "date-fns";
import debounce from "lodash.debounce";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";

import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { orderColumns } from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import ExportAction from "~/app/(dashboard-pages)/_components/export-action";
import Loading from "~/app/Loading";
// import CustomButton from "~/components/common/common-button/common-button";
import { WithDependency } from "~/HOC/withDependencies";
import { useSession } from "~/hooks/use-session";
import { OrderService } from "~/services/order/orders.service";
import { dependencies } from "~/utils/dependencies";

const BaseOrderPage = ({ orderService }: { orderService: OrderService }) => {
  const [isPendingOrders, startTransitionOrders] = useTransition();
  // const [isPendingRefresh, startTransitionRefresh] = useTransition();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<IPaginationMeta | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { user } = useSession();
  const router = useRouter();

  const debounceDateRangeReference = useRef(
    debounce((value: DateRange) => {
      setDateRange(value);
    }, 300),
  );

  const handleDateRangeChange = useCallback((value: DateRange) => {
    debounceDateRangeReference.current(value);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const parameters: IFilters = {
      page: currentPage,
      ...(dateRange?.from && { start_date: format(dateRange.from, "yyyy-MM-dd") }),
      ...(dateRange?.to && { end_date: format(dateRange.to, "yyyy-MM-dd") }),
    };

    startTransitionOrders(async () => {
      const ordersData = await orderService.getAllOrders(parameters);
      setOrders(ordersData?.data || []);
      setPaginationMeta(ordersData?.meta || null);
    });
  }, [orderService, currentPage, dateRange?.from, dateRange?.to]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className={`space-y-10`}>
      <section className="flex w-full flex-col-reverse gap-4 sm:items-center md:flex-row md:justify-between">
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <DateRangePicker onDateChange={handleDateRangeChange} />
        </div>
        <div className="flex w-full flex-row gap-2 sm:w-auto sm:justify-start">
          <ExportAction
            serviceMethod={(filters) => orderService.downloadOrdersAsCSV(filters)}
            currentPage={1}
            dateRange={dateRange}
            buttonText="Export Orders"
            fileName="orders"
            size={`xl`}
          />
        </div>
      </section>
      <section>
        {isPendingOrders ? (
          <Loading text={`Loading order table...`} className={`w-fill h-fit p-20`} />
        ) : (
          <>
            {orders.length > 0 ? (
              <DashboardTable
                data={orders}
                columns={orderColumns}
                showPagination
                onPageChange={handlePageChange}
                currentPage={paginationMeta?.current_page}
                totalPages={paginationMeta?.last_page}
                itemsPerPage={paginationMeta?.per_page}
                onRowClick={(order) => {
                  router.push(`/dashboard/${user?.id}/orders/${order.id}`);
                }}
              />
            ) : dateRange?.from || dateRange?.to ? (
              <FilteredEmptyState
                onReset={() => {
                  setDateRange(undefined);
                  setCurrentPage(1);
                }}
              />
            ) : (
              <EmptyState
                images={[
                  {
                    src: emptyCart,
                    alt: "Empty cart",
                    width: 100,
                    height: 100,
                  },
                ]}
                title="No orders found."
                description="You do not have any active orders yet."
                button={{
                  text: "Create New Order",
                  onClick: () => {
                    router.push(`/dashboard/${user?.id}/products/new`);
                  },
                }}
                className={`rounded-lg bg-low-grey-III`}
              />
            )}
          </>
        )}
      </section>
    </section>
  );
};

const OrderPage = WithDependency(BaseOrderPage, {
  orderService: dependencies.ORDER_SERVICE,
});

export default OrderPage;
