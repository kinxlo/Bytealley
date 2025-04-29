"use client";

import nairaIcon from "@/icons/naira.svg";
import emptyCart from "@/images/empty-cart.svg";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";

import { AnalyticsCard } from "~/app/(dashboard-pages)/_components/analytics-card/index";
import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { orderColumns } from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import ExportAction from "~/app/(dashboard-pages)/_components/export-action";
import Loading from "~/app/Loading";
import { LoadingSpinner } from "~/components/miscellaneous/loading-spinner";
import { useSession } from "~/hooks/use-session";
import { OrderService } from "~/services/orders.service";
import { ProductService } from "~/services/product/product.service";

export const ActiveUser = ({
  productService,
  orderService,
}: {
  productService: ProductService;
  orderService: OrderService;
}) => {
  const [isPendingAnalytics, startTransitionAnalytics] = useTransition();
  const [analytics, setAnalytics] = useState<IDashboardAnalytics | null>(null);
  const [isPendingOrders, startTransitionOrders] = useTransition();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<IPaginationMeta | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const router = useRouter();
  const { user } = useSession();

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
      setOrders(ordersData?.data.slice(0, 5) || []);
      setPaginationMeta(ordersData?.meta || null);
    });
  }, [orderService, currentPage, dateRange?.from, dateRange?.to]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    startTransitionAnalytics(async () => {
      const analyticsData = await productService.getDashboardAnalytics();
      setAnalytics(analyticsData?.data ?? null);
    });
  }, [productService]);

  return (
    <>
      <section className={`space-y-4`}>
        <section className="flex w-full flex-col gap-4 sm:items-center md:flex-row md:justify-between">
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <DateRangePicker onDateChange={handleDateRangeChange} />
            {/* <SelectDropdown options={[]} /> */}
          </div>
          <div className="flex w-full flex-row gap-2 sm:w-auto sm:justify-start">
            <ExportAction
              serviceMethod={(filters) => orderService.downloadOrdersAsCSV(filters)}
              currentPage={1}
              dateRange={dateRange}
              buttonText="Export Sales"
              fileName="orders"
              size={`xl`}
            />
          </div>
        </section>

        <section className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12`}>
          <AnalyticsCard
            title="Total Sales"
            value={isPendingAnalytics ? <LoadingSpinner /> : analytics?.total_sales?.toLocaleString()}
            icon={<Image src={nairaIcon} alt="naira" width={40} height={40} />}
            backgroundImage={"/images/naira.svg"}
            className={`col-span-1 sm:col-span-2 lg:col-span-6`}
          />
          <AnalyticsCard
            title="Total Revenue"
            value={isPendingAnalytics ? <LoadingSpinner /> : analytics?.total_revenues?.toLocaleString()}
            valuePrefix={`₦`}
            icon={<Image src={nairaIcon} alt="naira" width={40} height={40} />}
            backgroundImage={"/images/hook.svg"}
            className={`col-span-1 text-mid-success sm:col-span-2 lg:col-span-6`}
          />
          <AnalyticsCard
            title="New Orders"
            value={isPendingAnalytics ? <LoadingSpinner /> : analytics?.new_orders?.toLocaleString()}
            className={`col-span-1 lg:col-span-4`}
          />
          <AnalyticsCard
            title="New Orders Revenue"
            value={isPendingAnalytics ? <LoadingSpinner /> : analytics?.new_orders_revenue?.toLocaleString()}
            className={`col-span-1 lg:col-span-4`}
          />
          <AnalyticsCard
            title="Total Products"
            value={isPendingAnalytics ? <LoadingSpinner /> : analytics?.total_products?.toLocaleString()}
            className={`col-span-1 lg:col-span-4`}
          />
        </section>
      </section>
      <section className={`mt-10 space-y-4`}>
        <h4 className="text-h4">Sales</h4>
        <section>
          {isPendingOrders ? (
            <Loading text={`Loading sales table...`} className={`w-fill h-fit p-20`} />
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
                      alt: "Empty Cart",
                      width: 100,
                      height: 100,
                    },
                  ]}
                  title="No sales found."
                  description="You do not have any sales yet."
                  button={{
                    text: "Create New product",
                    onClick: () => {
                      router.push(`/dashboard/${user?.id}/products/new`);
                    },
                  }}
                />
              )}
            </>
          )}
        </section>
      </section>
    </>
  );
};
