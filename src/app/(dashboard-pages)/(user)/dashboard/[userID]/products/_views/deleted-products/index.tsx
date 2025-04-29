"use client";

import empty4 from "@/images/empty_img_4.svg";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";

import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import {
  deletedProductColumns,
  DeletedProductRowActions,
} from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import Loading from "~/app/Loading";
import { ProductService } from "~/services/product/product.service";

import "~/utils/constants";

export const DeletedProducts = ({ productService }: { productService: ProductService }) => {
  const [isPendingDeletedProducts, startTransitionDeletedProducts] = useTransition();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<IPaginationMeta | null>(null);
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

  useEffect(() => {
    const parameters: IFilters = {
      page: currentPage,
      ...(dateRange?.from && { start_date: format(dateRange.from, "yyyy-MM-dd") }),
      ...(dateRange?.to && { end_date: format(dateRange.to, "yyyy-MM-dd") }),
      status: "deleted",
    };

    startTransitionDeletedProducts(async () => {
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
      <>
        <section className={`flex flex-col justify-between lg:flex-row lg:items-center`}>
          <div className={`flex flex-col gap-4 lg:flex-row lg:items-center`}>
            <DateRangePicker className={`w-full lg:w-auto`} onDateChange={handleDateRangeChange} />
          </div>
        </section>
        {isPendingDeletedProducts ? (
          <Loading text={`Loading deleted product table...`} className={`w-fill h-fit p-20`} />
        ) : (
          <section>
            {products.length > 0 ? (
              <section>
                <DashboardTable
                  data={products}
                  columns={deletedProductColumns}
                  currentPage={paginationMeta?.current_page}
                  totalPages={paginationMeta?.last_page}
                  itemsPerPage={paginationMeta?.per_page}
                  onPageChange={handlePageChange}
                  rowActions={(product) => DeletedProductRowActions(product, productService)}
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
                title="No deleted products yet."
                description="No deleted products to be found! Your creations are safe and sound on our platform. If you need any assistance or have questions, please don't hesitate to reach out. We're here to support you and your digital journey!"
              />
            )}
          </section>
        )}
      </>
    </section>
  );
};
