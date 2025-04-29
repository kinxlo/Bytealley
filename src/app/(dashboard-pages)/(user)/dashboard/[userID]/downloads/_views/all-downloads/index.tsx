import downloadBox from "@/images/download_box.svg";
import emptyCart from "@/images/empty-cart.svg";
import { format } from "date-fns";
// import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";

import { PDBanner } from "~/app/(dashboard-pages)/_components/banner/pd-banner";
// import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import Loading from "~/app/Loading";
import { useSession } from "~/hooks/use-session";
import { ProductService } from "~/services/product/product.service";
import { DownloadCard } from "../../_components/download-card";

export const AllDownloads = ({ service }: { service: ProductService }) => {
  const [isDownloadPending, startDownloadTransition] = useTransition();
  const [downloads, setDownloads] = useState<IDownload[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const router = useRouter();
  const { user } = useSession();

  // const debounceDateRangeReference = useRef(
  //   debounce((value: DateRange) => {
  //     setDateRange(value);
  //   }, 300),
  // );

  // const handleDateRangeChange = useCallback((value: DateRange) => {
  //   debounceDateRangeReference.current(value);
  // }, []);

  useEffect(() => {
    const parameters: IFilters = {
      ...(dateRange?.from && { start_date: format(dateRange.from, "yyyy-MM-dd") }),
      ...(dateRange?.to && { end_date: format(dateRange.to, "yyyy-MM-dd") }),
    };

    startDownloadTransition(async () => {
      const productsData = await service.getPurchasedProducts(parameters);
      setDownloads(productsData || []);
    });
  }, [dateRange?.from, dateRange?.to, service]);

  return (
    <section className={`space-y-8`}>
      {/* <section className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
        <DateRangePicker onDateChange={handleDateRangeChange} />
      </section> */}
      {isDownloadPending ? (
        <Loading text={`Loading purchased products...`} className={`w-fill h-fit p-20`} />
      ) : (
        <>
          {downloads.length > 0 ? (
            <section className={`grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5`}>
              {downloads?.map((download) => (
                <DownloadCard
                  key={download?.id}
                  title={download.title}
                  author={download.publisher}
                  image={download.thumbnail}
                  price={download.price}
                  onClick={() => {
                    const author = encodeURIComponent(download.publisher);
                    const title = encodeURIComponent(download.title || "");
                    const type = encodeURIComponent(download.product_type);
                    router.push(
                      `/dashboard/${user?.id}/downloads/${download.id}?author=${author}&title=${title}&product_type=${type}`,
                    );
                  }}
                />
              ))}
            </section>
          ) : dateRange?.from || dateRange?.to ? (
            <FilteredEmptyState
              onReset={() => {
                setDateRange(undefined);
              }}
            />
          ) : (
            <section className={`space-y-8`}>
              <PDBanner
                title={"Rub minds with other creators"}
                description={
                  "All your downloads will show up here so you can download, watch, read or listen to all your purchases."
                }
                imageSrc={downloadBox}
                imageAlt={"download box"}
              />
              <EmptyState
                images={[{ src: emptyCart.src, alt: "Empty download", width: 100, height: 50 }]}
                description="You do not have any download yet"
                className={`min-h-[273px] rounded-lg bg-low-grey-III`}
                // button={{
                //   text: "Add New Product",
                //   onClick: () => {
                //     router.push(`/dashboard/${user?.id}/products/new`);
                //   },
                // }}
              />
            </section>
          )}
        </>
      )}
    </section>
  );
};
