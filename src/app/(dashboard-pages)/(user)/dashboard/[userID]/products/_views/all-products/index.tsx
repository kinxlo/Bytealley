import empty1 from "@/images/empty_img_1.svg";
import empty2 from "@/images/empty_img_2.svg";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { DateRange } from "react-day-picker";

import { AnalyticsCard } from "~/app/(dashboard-pages)/_components/analytics-card";
import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { productColumns, useProductRowActions } from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import ExportAction from "~/app/(dashboard-pages)/_components/export-action";
import { SelectDropdown } from "~/app/(dashboard-pages)/_components/select-dropdown";
import Loading from "~/app/Loading";
import { LoadingSpinner } from "~/components/miscellaneous/loading-spinner";
import { useSession } from "~/hooks/use-session";
import { useProductService } from "~/services/product/use-product-service";
import { statusOptions } from "~/utils/constants";

export const AllProducts = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [status, setStatus] = useState<string>("all");
  const { getRowActions } = useProductRowActions();
  const { user } = useSession();

  const { useGetAllProducts, useGetDashboardAnalytics, useDownloadProducts } = useProductService();
  const { refetch: downloadProducts } = useDownloadProducts({}, { enabled: false });

  // Create filters object
  const filters: IFilters = {
    page: currentPage,
    ...(dateRange?.from && { start_date: format(dateRange.from, "yyyy-MM-dd") }),
    ...(dateRange?.to && { end_date: format(dateRange.to, "yyyy-MM-dd") }),
    ...(status !== "all" && { status: status as "published" | "draft" }),
  };

  // Fetch products data
  const { data: productsData, isLoading: isProductsLoading } = useGetAllProducts(filters, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  // Fetch analytics data
  const { data: analytics, isLoading: isAnalyticsLoading } = useGetDashboardAnalytics();

  const debouncedStatusReference = useRef(
    debounce((value: string) => {
      setStatus(value);
    }, 300),
  );

  const debounceDateRangeReference = useRef(
    debounce((value: DateRange) => {
      setDateRange(value);
    }, 300),
  );

  const handleStatusChange = useCallback((value: string) => {
    debouncedStatusReference.current(value);
    setCurrentPage(1);
  }, []);

  const handleDateRangeChange = useCallback((value: DateRange) => {
    debounceDateRangeReference.current(value);
    setCurrentPage(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className={`space-y-10`}>
      <section className={`grid gap-8 sm:grid-cols-2 lg:grid-cols-4`}>
        <AnalyticsCard
          title={"Total Products"}
          value={isAnalyticsLoading ? <LoadingSpinner /> : analytics?.total_products?.toLocaleString()}
        />
        <AnalyticsCard
          title={"Total Sales"}
          value={isAnalyticsLoading ? <LoadingSpinner /> : analytics?.total_sales?.toLocaleString()}
        />
        <AnalyticsCard
          title={"Customers"}
          value={isAnalyticsLoading ? <LoadingSpinner /> : analytics?.total_customers?.toLocaleString()}
        />
        <AnalyticsCard
          title={"Total Revenue"}
          className={`text-mid-success`}
          value={isAnalyticsLoading ? <LoadingSpinner /> : `₦${analytics?.total_revenues?.toLocaleString()}`}
        />
      </section>
      <section className={`space-y-4`}>
        <section className={`flex flex-col-reverse justify-between gap-4 lg:flex-row lg:items-center`}>
          <div className={`flex flex-row gap-4 lg:items-center`}>
            <DateRangePicker className={`w-full lg:w-auto`} onDateChange={handleDateRangeChange} />
            <SelectDropdown
              options={statusOptions}
              value={status}
              onValueChange={handleStatusChange}
              placeholder="Filter by status"
              triggerClassName={`w-full lg:w-auto h-[48px] rounded-sm`}
            />
          </div>
          <ExportAction
            downloadMutation={async (filters) => {
              const { data } = await downloadProducts(filters);
              return data as Blob;
            }}
            currentPage={currentPage}
            dateRange={dateRange}
            status={status}
            buttonText="Export Products"
            fileName="Product"
            size={`xl`}
          />
        </section>
        {isProductsLoading ? (
          <Loading text={`Loading product table...`} className={`w-fill h-fit p-20`} />
        ) : (
          <section>
            {productsData?.data?.length ? (
              <section>
                <DashboardTable
                  data={productsData.data}
                  columns={productColumns}
                  currentPage={productsData.meta?.current_page}
                  totalPages={productsData.meta?.last_page}
                  itemsPerPage={productsData.meta?.per_page}
                  onPageChange={handlePageChange}
                  rowActions={getRowActions}
                  showPagination
                  onRowClick={(product) => {
                    router.push(`/dashboard/${user?.id}/products/${product.id}`);
                  }}
                />
              </section>
            ) : dateRange?.from || dateRange?.to || status !== "all" ? (
              <FilteredEmptyState
                onReset={() => {
                  setDateRange(undefined);
                  setStatus("all");
                  setCurrentPage(1);
                }}
              />
            ) : (
              <EmptyState
                images={[
                  { src: empty1.src, alt: "Empty product", width: 322, height: 220 },
                  { src: empty2.src, alt: "Empty product", width: 322, height: 220 },
                  { src: empty1.src, alt: "Empty product", width: 322, height: 220 },
                ]}
                title="Create your first product."
                description="Unlock your creative potential and take the first step towards success on our platform..."
                button={{
                  text: "Add New Product",
                  onClick: () => {
                    router.push(`/dashboard/${user?.id}/products/new`);
                  },
                }}
              />
            )}
          </section>
        )}
      </section>
    </section>
  );
};
