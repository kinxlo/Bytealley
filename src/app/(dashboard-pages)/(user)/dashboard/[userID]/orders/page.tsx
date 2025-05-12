"use client";

import emptyCart from "@/images/empty-cart.svg";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { DateRange } from "react-day-picker";

import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { orderColumns } from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import ExportAction from "~/app/(dashboard-pages)/_components/export-action";
import Loading from "~/app/Loading";
import { useSession } from "~/hooks/use-session";
import { useOrderService } from "~/services/order/use-order.service";

const OrderPage = () => {
  const router = useRouter();
  const { user } = useSession();
  const { useGetAllOrders, useDownloadOrders } = useOrderService();
  const { refetch: downloadOrders } = useDownloadOrders({}, { enabled: false });

  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const debounceDateRangeReference = useRef(
    debounce((value: DateRange) => {
      setDateRange(value);
    }, 300),
  );

  const handleDateRangeChange = useCallback((value: DateRange) => {
    debounceDateRangeReference.current(value);
    setCurrentPage(1);
  }, []);

  // Query for orders data
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isRefetching: isOrdersRefetching,
  } = useGetAllOrders({
    page: currentPage,
    ...(dateRange?.from && { start_date: format(dateRange.from, "yyyy-MM-dd") }),
    ...(dateRange?.to && { end_date: format(dateRange.to, "yyyy-MM-dd") }),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="space-y-10">
      <section className="flex w-full flex-col-reverse gap-4 sm:items-center md:flex-row md:justify-between">
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <DateRangePicker onDateChange={handleDateRangeChange} />
        </div>
        <div className="flex w-full flex-row gap-2 sm:w-auto sm:justify-start">
          <ExportAction
            downloadMutation={async (filters) => {
              const { data } = await downloadOrders(filters);
              return data as Blob;
            }}
            currentPage={1}
            dateRange={dateRange}
            buttonText="Export Orders"
            fileName="orders"
            size="xl"
          />
        </div>
      </section>

      <section>
        {isOrdersLoading || isOrdersRefetching ? (
          <Loading text="Loading order table..." className="w-fill h-fit p-20" />
        ) : (
          <>
            {ordersData?.data?.length ? (
              <DashboardTable
                data={ordersData.data}
                columns={orderColumns}
                showPagination
                onPageChange={handlePageChange}
                currentPage={ordersData.meta?.current_page}
                totalPages={ordersData.meta?.last_page}
                itemsPerPage={ordersData.meta?.per_page}
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
                  onClick: () => router.push(`/dashboard/${user?.id}/products/new`),
                }}
                className="rounded-lg bg-low-grey-III"
              />
            )}
          </>
        )}
      </section>
    </section>
  );
};

export default OrderPage;
