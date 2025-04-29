"use client";

import empty4 from "@/images/empty_img_4.svg";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { DateRange } from "react-day-picker";

import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { productColumns, useProductRowActions } from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import Loading from "~/app/Loading";
import { useSession } from "~/hooks/use-session";
import { useProductService } from "~/services/product/use-product-service";

export const LiveProducts = () => {
  const router = useRouter();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<IPaginationMeta | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { user } = useSession();
  const { useGetAllProducts } = useProductService();
  const { getRowActions } = useProductRowActions();

  const debounceDateRangeReference = useRef(
    debounce((value: DateRange) => {
      setDateRange(value);
    }, 300),
  );

  const handleDateRangeChange = useCallback((value: DateRange) => {
    debounceDateRangeReference.current(value);
    setCurrentPage(1);
  }, []);

  // Create filters object
  const filters: IFilters = {
    page: currentPage,
    ...(dateRange?.from && { start_date: format(dateRange.from, "yyyy-MM-dd") }),
    ...(dateRange?.to && { end_date: format(dateRange.to, "yyyy-MM-dd") }),
    status: "published",
  };

  // Use the product service hook
  const { data: productsData, isLoading: isProductsLoading } = useGetAllProducts(filters, {
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  useEffect(() => {
    if (productsData) {
      setProducts(productsData.data || []);
      setPaginationMeta(productsData.meta || null);
    }
  }, [productsData]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className={`space-y-4`}>
      <section className={`flex flex-col justify-between lg:flex-row lg:items-center`}>
        <div className={`flex flex-col gap-4 lg:flex-row lg:items-center`}>
          <DateRangePicker className={`w-full lg:w-auto`} onDateChange={handleDateRangeChange} />
        </div>
      </section>
      {isProductsLoading ? (
        <Loading text={`Loading published product table...`} className={`w-fill h-fit p-20`} />
      ) : (
        <>
          {products.length > 0 ? (
            <section>
              <DashboardTable
                data={products}
                columns={productColumns}
                currentPage={paginationMeta?.current_page}
                totalPages={paginationMeta?.last_page}
                itemsPerPage={paginationMeta?.per_page}
                onPageChange={handlePageChange}
                rowActions={getRowActions}
                showPagination
                onRowClick={(product) => {
                  router.push(`/dashboard/${user?.id}/products/${product.id}`);
                }}
              />
            </section>
          ) : dateRange?.from || dateRange?.to ? (
            <FilteredEmptyState
              onReset={() => {
                setDateRange(undefined);
                setCurrentPage(1);
              }}
            />
          ) : (
            <EmptyState
              images={[{ src: empty4.src, alt: "Empty published product", width: 1136, height: 220 }]}
              title="You're yet to publish a product."
              description="It looks like you're yet to publish a product on our platform. Don't miss out on the opportunity to share your talents with the world. Get started today and showcase your creations to a global audience. Your digital journey begins now!"
              button={{
                text: "Add New Product",
                onClick: () => {
                  router.push(`/dashboard/${user?.id}/products/new`);
                },
              }}
            />
          )}
        </>
      )}
    </section>
  );
};
