"use client";

import productImage from "@/images/empty_product.svg";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { DateRange } from "react-day-picker";

import { AnalyticsCard } from "~/app/(dashboard-pages)/_components/analytics-card/index";
import { Bar_Chart } from "~/app/(dashboard-pages)/_components/chart/bar-chart";
import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { orderColumns } from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import Loading from "~/app/Loading";
import { LoadingSpinner } from "~/components/miscellaneous/loading-spinner";
import { useSession } from "~/hooks/use-session";
import { useOrderService } from "~/services/order/use-order.service";
import { useProductService } from "~/services/product/use-product-service";

const Analytics = () => {
  const router = useRouter();
  const { user } = useSession();
  const { useGetAllOrders } = useOrderService();
  const { useGetDashboardAnalytics } = useProductService();

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

  // Analytics data query
  const { data: analyticsData, isLoading: isAnalyticsLoading, isError: isAnalyticsError } = useGetDashboardAnalytics();

  // Orders data query
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    isError: isOrdersError,
    isRefetching: isOrdersRefetching,
  } = useGetAllOrders({
    page: currentPage,
    ...(dateRange?.from && { start_date: format(dateRange.from, "yyyy-MM-dd") }),
    ...(dateRange?.to && { end_date: format(dateRange.to, "yyyy-MM-dd") }),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Error state
  if (isAnalyticsError || isOrdersError) {
    return (
      <EmptyState
        images={[{ src: productImage.src, alt: "Error", width: 102, height: 60 }]}
        title="Error loading data"
        description="Failed to fetch analytics data. Please try again later."
        className="min-h-[236px] rounded-md bg-low-grey-III p-6 text-black"
      />
    );
  }

  return (
    <>
      <section className="space-y-4">
        <section className="flex w-full flex-col gap-4 sm:items-center md:flex-row md:justify-between">
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <DateRangePicker onDateChange={handleDateRangeChange} />
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <AnalyticsCard
            title="Total Orders"
            value={isOrdersRefetching || isAnalyticsLoading ? <LoadingSpinner /> : analyticsData?.new_orders}
          />
          <AnalyticsCard title="Views" value={isOrdersRefetching ? <LoadingSpinner /> : analyticsData?.views} />
          <AnalyticsCard
            title="Total Products"
            value={isOrdersRefetching || isAnalyticsLoading ? <LoadingSpinner /> : analyticsData?.total_products}
          />
          <AnalyticsCard
            title="New Orders"
            value={isOrdersRefetching || isAnalyticsLoading ? <LoadingSpinner /> : analyticsData?.new_orders}
          />
          <AnalyticsCard
            title="Customers"
            value={isOrdersRefetching || isAnalyticsLoading ? <LoadingSpinner /> : analyticsData?.total_customers}
          />
          <AnalyticsCard
            title="Revenue"
            value={
              isOrdersRefetching || isAnalyticsLoading ? (
                <LoadingSpinner />
              ) : (
                `₦${analyticsData?.total_revenues?.toLocaleString()}`
              )
            }
            className="text-mid-success"
          />
        </section>
      </section>

      <section className="my-6">
        <Bar_Chart />
      </section>

      <section className="mt-10">
        {isOrdersLoading ? (
          <Loading text="Loading top products..." className="w-fill h-fit p-20" />
        ) : ordersData?.data?.length ? (
          <>
            <h5 className="mb-4 text-h5 font-semibold">Top Products</h5>
            <DashboardTable
              data={ordersData.data}
              columns={orderColumns}
              showPagination
              onPageChange={handlePageChange}
              currentPage={ordersData.meta?.current_page}
              totalPages={ordersData.meta?.last_page}
              itemsPerPage={ordersData.meta?.per_page}
              onRowClick={(row) => router.push(`/dashboard/${user?.id}/orders/${row.id}`)}
            />
          </>
        ) : dateRange?.from || dateRange?.to ? (
          <FilteredEmptyState
            onReset={() => {
              setDateRange(undefined);
              setCurrentPage(1);
            }}
          />
        ) : (
          <EmptyState
            images={[{ src: productImage.src, alt: "Empty product", width: 102, height: 60 }]}
            description="You do not have any sales activities yet."
            button={{
              text: "Create your first product",
              onClick: () => router.push(`/dashboard/${user?.id}/products/new`),
            }}
            className="min-h-[236px] rounded-md bg-low-grey-III p-6 text-black"
          />
        )}
      </section>
    </>
  );
};

export default Analytics;
