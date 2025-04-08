import empty1 from "@/images/empty_img_1.svg";
import empty2 from "@/images/empty_img_2.svg";
import { format } from "date-fns";
import debounce from "lodash.debounce";
// import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { DateRange } from "react-day-picker";

import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import Loading from "~/app/Loading";
import { FunnelService } from "~/features/funnel";
// import { useSession } from "~/hooks/use-session";
import FunnelCard from "../../_components/funnel-card";
import { SelectFunnelModal } from "../../_components/select-funnel-modal";

export const AllFunnels = ({ service }: { service: FunnelService }) => {
  // const router = useRouter();
  const [isPendingFunnels, startTransitionFunnels] = useTransition();
  const [funnels, setFunnels] = useState<IFunnel[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  // const [paginationMeta, setPaginationMeta] = useState<IPaginationMeta | null>(null);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [status] = useState<string>("all");
  // const { user } = useSession();

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
      ...(status !== "all" && {
        status: status as "published" | "draft",
      }),
    };

    startTransitionFunnels(async () => {
      const funnelData = await service.getAllFunnels(parameters);
      setFunnels(funnelData?.data || []);
      // setPaginationMeta(funnelData?.meta || null);
    });
  }, [currentPage, dateRange?.from, dateRange?.to, service, status]);

  // const handlePageChange = (page: number) => {
  //   setCurrentPage(page);
  // };

  return (
    <section className={`space-y-10`}>
      <section className={`space-y-4`}>
        <>
          <section className={`flex flex-col justify-between lg:flex-row lg:items-center`}>
            <div className={`flex flex-col gap-4 lg:flex-row lg:items-center`}>
              <DateRangePicker className={`w-full lg:w-auto`} onDateChange={handleDateRangeChange} />
            </div>
          </section>
          {isPendingFunnels ? (
            <Loading text={`Loading funnels...`} className={`w-fill h-fit p-20`} />
          ) : (
            <section>
              {funnels.length > 0 ? (
                <section className={`grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3`}>
                  {funnels.map((funnel) => {
                    return (
                      <FunnelCard
                        service={service}
                        key={funnel.id}
                        template={{
                          id: funnel.id,
                          title: funnel.title,
                          thumbnail: funnel.thumbnail,
                          created_at: funnel.created_at,
                          status: funnel.status,
                          url: funnel.url,
                          template: funnel.template,
                        }}
                      />
                    );
                  })}
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
                  images={[
                    { src: empty1.src, alt: "Empty product", width: 322, height: 220 },
                    { src: empty2.src, alt: "Empty product", width: 322, height: 220 },
                    { src: empty1.src, alt: "Empty product", width: 322, height: 220 },
                  ]}
                  title="Create your first Funnel."
                  description="Unlock your creative potential and take the first step towards success on our platform. Create your first Funnel today and join our vibrant community of digital creators. Your masterpiece is just a click away!"
                  actionButton={<SelectFunnelModal />}
                />
              )}
            </section>
          )}
        </>
      </section>
    </section>
  );
};
