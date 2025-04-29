"use client";

import empty4 from "@/images/empty_img_4.svg";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";

import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { productColumns, ProductRowActions } from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import Loading from "~/app/Loading";
import { useSession } from "~/hooks/use-session";
import { ProductService } from "~/services/product/product.service";

import "~/utils/constants";

export const DraftProducts = ({ productService }: { productService: ProductService }) => {
  const router = useRouter();
  const [isPendingDraftProducts, startTransitionDraftProducts] = useTransition();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<IPaginationMeta | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
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
      status: "draft",
    };

    startTransitionDraftProducts(async () => {
      const productsData = await productService.getAllProducts(parameters);
      setProducts(productsData?.data || []);
      setPaginationMeta(productsData?.meta || null);
    });
  }, [currentPage, dateRange?.from, dateRange?.to, productService]);

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
      {isPendingDraftProducts ? (
        <Loading text={`Loading draft product table...`} className={`w-fill h-fit p-20`} />
      ) : (
        <>
          <section>
            {products.length > 0 ? (
              <section>
                <DashboardTable
                  data={products}
                  columns={productColumns}
                  currentPage={paginationMeta?.current_page}
                  totalPages={paginationMeta?.last_page}
                  itemsPerPage={paginationMeta?.per_page}
                  onPageChange={handlePageChange}
                  rowActions={(product) => ProductRowActions(product, productService)}
                  showPagination
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
                title="Ops! Your draft is empty."
                description="Oops! It seems your draft is empty. No worries, we're here to help you bring your ideas to life. Start crafting your digital masterpiece, and when you're ready, let's turn that blank canvas into a work of art!"
                button={{
                  text: "Publish New Product",
                  onClick: () => {
                    router.push(`/dashboard/${user?.id}/products/new`);
                  },
                }}
              />
            )}
          </section>
        </>
      )}
    </section>
  );
};
