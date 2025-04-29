"use client";

// import refreshIcon from "@/icons/Property_2_Update_ojnsf7.svg";
// import uploadIcon from "@/icons/Property_2_Upload_cm42yb.svg";
import productImage from "@/images/empty_product.svg";
import { format } from "date-fns";
import debounce from "lodash.debounce";
// import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";

import { AnalyticsCard } from "~/app/(dashboard-pages)/_components/analytics-card/index";
import { Bar_Chart } from "~/app/(dashboard-pages)/_components/chart/bar-chart";
import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { orderColumns } from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
// import { SelectDropdown } from "~/app/(dashboard-pages)/_components/select-dropdown";
// import CustomButton from "~/components/common/common-button/common-button";
import { LoadingSpinner } from "~/components/miscellaneous/loading-spinner";
import { WithDependency } from "~/HOC/withDependencies";
import { useSession } from "~/hooks/use-session";
import { OrderService } from "~/services/orders.service";
import { ProductService } from "~/services/product/product.service";
import { dependencies } from "~/utils/dependencies";

const Analytics = ({
  productService,
  orderService,
}: {
  productService: ProductService;
  orderService: OrderService;
}) => {
  const [isPendingAnalytics, startTransitionAnalytics] = useTransition();
  const [analytics, setAnalytics] = useState<IDashboardAnalytics | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<IPaginationMeta | null>(null);
  // const [status, setStatus] = useState<string>("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [topProducts, setTopProducts] = useState<IOrder[]>([]);
  const router = useRouter();
  const { user } = useSession();

  // const debouncedStatusReference = useRef(
  //   debounce((value: string) => {
  //     setStatus(value);
  //   }, 300),
  // );

  const debounceDateRangeReference = useRef(
    debounce((value: DateRange) => {
      setDateRange(value);
    }, 300),
  );

  // const handleStatusChange = useCallback((value: string) => {
  //   debouncedStatusReference.current(value);
  //   setCurrentPage(1);
  // }, []);

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
    startTransitionAnalytics(async () => {
      const [analyticsData, ordersData] = await Promise.all([
        productService.getDashboardAnalytics(),
        orderService.getAllOrders(parameters),
      ]);

      setAnalytics(analyticsData?.data ?? null);
      setTopProducts(ordersData?.data || []);
      setPaginationMeta(ordersData?.meta || null);
    });
  }, [currentPage, dateRange?.from, dateRange?.to, orderService, productService]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <section className={`space-y-4`}>
        <section className="flex w-full flex-col gap-4 sm:items-center md:flex-row md:justify-between">
          <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
            <DateRangePicker onDateChange={handleDateRangeChange} />
            {/* <SelectDropdown
              options={statusOptions}
              value={status}
              onValueChange={handleStatusChange}
              placeholder="Filter by status"
            /> */}
          </div>
          {/* <div className="flex w-full flex-row gap-2 sm:w-auto sm:justify-start">
            <CustomButton
              className="w-full border-primary text-[16px] text-primary sm:w-auto"
              variant="outline"
              size="xl"
              isLeftIconVisible
              icon={<Image src={refreshIcon} width={16} height={16} alt="export" />}
            >
              Refresh
            </CustomButton>
            <CustomButton
              className="w-full border-primary text-[16px] text-primary sm:w-auto"
              variant="outline"
              size="xl"
              isLeftIconVisible
              icon={<Image src={uploadIcon} width={16} height={16} alt="export" />}
            >
              Export
            </CustomButton>
          </div> */}
        </section>

        <section className={`grid grid-cols-2 gap-4 lg:grid-cols-3`}>
          <AnalyticsCard title="Total Orders" value={isPendingAnalytics ? <LoadingSpinner /> : analytics?.new_orders} />
          <AnalyticsCard title="Views" value={isPendingAnalytics ? <LoadingSpinner /> : analytics?.views} />
          <AnalyticsCard
            title="Total Products"
            value={isPendingAnalytics ? <LoadingSpinner /> : analytics?.total_products}
          />
          <AnalyticsCard title="New Orders" value={isPendingAnalytics ? <LoadingSpinner /> : analytics?.new_orders} />
          <AnalyticsCard
            title="Customers"
            value={isPendingAnalytics ? <LoadingSpinner /> : analytics?.total_customers}
          />
          <AnalyticsCard
            title="Revenue"
            value={isPendingAnalytics ? <LoadingSpinner /> : `₦${analytics?.total_revenues?.toLocaleString()}`}
            className={`text-mid-success`}
          />
        </section>
      </section>
      <section className={`my-6`}>
        <Bar_Chart />
      </section>
      <section className={`mt-10`}>
        {topProducts.length > 0 ? (
          <>
            <h5 className="mb-4 text-h5 font-semibold">Top Products</h5>
            <DashboardTable
              data={topProducts}
              columns={orderColumns}
              showPagination
              onPageChange={handlePageChange}
              currentPage={paginationMeta?.current_page}
              totalPages={paginationMeta?.last_page}
              itemsPerPage={paginationMeta?.per_page}
              // eslint-disable-next-line no-console
              onRowClick={(row) => console.log("Row clicked:", row)}
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
              onClick: () => {
                router.push(`/dashboard/${user?.id}/products/new`);
              },
            }}
            className={"min-h-[236px] rounded-md bg-low-grey-III p-6 text-black"}
          />
        )}
      </section>
    </>
  );
};

const AnalyticsPage = WithDependency(Analytics, {
  productService: dependencies.PRODUCT_SERVICE,
  orderService: dependencies.ORDER_SERVICE,
});

export default AnalyticsPage;
