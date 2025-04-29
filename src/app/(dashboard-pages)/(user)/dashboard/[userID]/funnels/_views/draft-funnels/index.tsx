import empty4 from "@/images/empty_img_4.svg";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { useCallback, useRef, useState } from "react";
import { DateRange } from "react-day-picker";

import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import Loading from "~/app/Loading";
import { useFunnelService } from "~/features/funnel/services/use-funnel-service";
import FunnelCard from "../../_components/funnel-card";
import { SelectFunnelModal } from "../../_components/select-funnel-modal";

export const DraftFunnels = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const { useGetAllFunnels } = useFunnelService();

  const debounceDateRangeReference = useRef(
    debounce((value: DateRange) => {
      setDateRange(value);
    }, 300),
  );

  const handleDateRangeChange = useCallback((value: DateRange) => {
    debounceDateRangeReference.current(value);
    setCurrentPage(1);
  }, []);

  const filters = {
    page: currentPage,
    ...(dateRange?.from && { start_date: format(dateRange.from, "yyyy-MM-dd") }),
    ...(dateRange?.to && { end_date: format(dateRange.to, "yyyy-MM-dd") }),
    status: "draft",
  };

  const { data: funnelData, isLoading } = useGetAllFunnels(filters);
  const funnels = funnelData?.data || [];

  return (
    <section className="space-y-10">
      <section className="space-y-4">
        <section className="flex flex-col justify-between lg:flex-row lg:items-center">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <DateRangePicker className="w-full lg:w-auto" onDateChange={handleDateRangeChange} />
          </div>
        </section>
        {isLoading ? (
          <Loading text="Loading funnels..." className="w-fill h-fit p-20" />
        ) : (
          <section>
            {funnels.length > 0 ? (
              <section className="grid grid-cols-2 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {funnels.map((funnel) => (
                  <FunnelCard
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
                ))}
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
                images={[{ src: empty4.src, alt: "Empty draft product", width: 1136, height: 220 }]}
                title="Oops! Your draft is empty."
                description="Oops! It seems your draft is empty. No worries, we're here to help you bring your ideas to life. Start crafting your digital masterpiece, and when you're ready, let's turn that blank canvas into a work of art!"
                actionButton={<SelectFunnelModal />}
              />
            )}
          </section>
        )}
      </section>
    </section>
  );
};
