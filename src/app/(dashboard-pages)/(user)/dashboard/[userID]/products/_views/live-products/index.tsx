import empty4 from "@/images/empty_img_4.svg";
import { format } from "date-fns";
import { useEffect, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";

import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import Loading from "~/app/Loading";
import { useDebounce } from "~/hooks/use-debounce";
import { ProductService } from "~/services/product.service";
import { productColumns, RowActions } from "~/utils/constants";

export const LiveProducts = ({ productService }: { productService: ProductService }) => {
  const [isPendingPublishedProducts, startTransitionProducts] = useTransition();
  const [products, setProducts] = useState<IProduct[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<IPaginationMeta | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const debouncedDateRange = useDebounce(dateRange);

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    setCurrentPage(1);
  };

  useEffect(() => {
    const parameters: IProductFilters = {
      page: currentPage,
      ...(debouncedDateRange?.from && { start_date: format(debouncedDateRange.from, "yyyy-MM-dd") }),
      ...(debouncedDateRange?.to && { end_date: format(debouncedDateRange.to, "yyyy-MM-dd") }),
      status: "published",
    };

    startTransitionProducts(async () => {
      const productsData = await productService.getAllProducts(parameters);
      setProducts(productsData?.data || []);
      setPaginationMeta(productsData?.meta || null);
    });
  }, [currentPage, debouncedDateRange, productService]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className={`space-y-4`}>
      {isPendingPublishedProducts ? (
        <Loading text={`Loading published product table...`} className={`w-fill h-fit p-20`} />
      ) : (
        <>
          <section className={`flex flex-col justify-between lg:flex-row lg:items-center`}>
            <div className={`flex flex-col gap-4 lg:flex-row lg:items-center`}>
              <DateRangePicker className={`w-full lg:w-auto`} onDateChange={handleDateRangeChange} />
            </div>
          </section>
          {products.length > 0 ? (
            <section>
              <DashboardTable
                data={products}
                columns={productColumns}
                currentPage={paginationMeta?.current_page}
                totalPages={paginationMeta?.last_page}
                itemsPerPage={paginationMeta?.per_page}
                onPageChange={handlePageChange}
                rowActions={(product) => RowActions(product, productService)}
                showPagination
              />
            </section>
          ) : (
            <EmptyState
              images={[{ src: empty4.src, alt: "Empty published product", width: 1136, height: 220 }]}
              title="You’re yet to publish a product."
              description="it looks like you're yet to publish a product on our platform. Don't miss out on the opportunity to share your talents with the world. Get started today and showcase your creations to a global audience. Your digital journey begins now!"
              button={{ text: "Publish New Product", onClick: () => {} }}
            />
          )}
        </>
      )}
    </section>
  );
};
