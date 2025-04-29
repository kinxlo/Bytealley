"use client";

import payoutImg from "@/images/payout_tree.svg";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { DateRange } from "react-day-picker";

import { AnalyticsCard } from "~/app/(dashboard-pages)/_components/analytics-card";
import { PDBanner } from "~/app/(dashboard-pages)/_components/banner/pd-banner";
import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { payoutColumns } from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import ExportAction from "~/app/(dashboard-pages)/_components/export-action";
import Loading from "~/app/Loading";
import CustomButton from "~/components/common/common-button/common-button";
import { LoadingSpinner } from "~/components/miscellaneous/loading-spinner";
import { useSession } from "~/hooks/use-session";
import { useEarningsService } from "~/services/earnings/use-earnings.service";
import { usePayoutService } from "~/services/payout/use-payout.service";
import { cn } from "~/utils/utils";

const PayoutsPage = () => {
  const router = useRouter();
  const { user } = useSession();
  const { useGetAllPayouts, useDownloadPayouts } = usePayoutService();
  const { useGetUserEarnings } = useEarningsService();
  const { refetch: downloadProducts } = useDownloadPayouts({}, { enabled: false });

  const [currentPage, setCurrentPage] = useState(1);
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

  // Earnings query
  const { data: earningsData, isLoading: isEarningsLoading, isError: isEarningsError } = useGetUserEarnings();

  // Payouts query with proper typing
  const {
    data: payoutsResponse,
    isLoading: isPayoutsLoading,
    isRefetching: isPayoutsRefetching,
    isError: isPayoutsError,
  } = useGetAllPayouts({
    page: currentPage,
    ...(dateRange?.from && { start_date: format(dateRange.from, "yyyy-MM-dd") }),
    ...(dateRange?.to && { end_date: format(dateRange.to, "yyyy-MM-dd") }),
  });

  // Extract data with fallbacks
  const payoutsData = payoutsResponse?.data || [];
  const paginationMeta = payoutsResponse?.meta || {
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isEarningsError || isPayoutsError) {
    return (
      <EmptyState
        images={[{ src: "/images/coins.svg", alt: "Error", width: 125, height: 78 }]}
        title="Error loading data"
        description="Failed to fetch payout information. Please try again later."
        className="min-h-[254px] rounded-md bg-low-grey-III p-[32px]"
      />
    );
  }

  return (
    <section className="space-y-10">
      <PDBanner
        title="Grow communities and get paid."
        description="Make as much as ₦10,000 sale for your first withdraw"
        imageSrc={payoutImg}
        imageAlt="Payout Tree"
      />

      <section className="space-y-4">
        <section className="flex w-full flex-col gap-4 sm:items-center md:flex-row md:justify-between">
          <div className="flex w-full flex-col-reverse gap-2 sm:flex-row md:w-auto">
            <DateRangePicker onDateChange={handleDateRangeChange} />
            <ExportAction
              downloadMutation={async (filters) => {
                const { data } = await downloadProducts(filters);
                return data as Blob;
              }}
              currentPage={currentPage}
              dateRange={dateRange}
              buttonText="Export Table Info"
              fileName="payout"
              size="xl"
            />
          </div>
          <div className="mt-4 flex w-full flex-row justify-end gap-2 sm:w-auto md:mt-0">
            <CustomButton
              className="w-full text-[16px] sm:w-auto"
              variant="primary"
              size="xl"
              isLeftIconVisible
              icon={<PlusCircle />}
              isDisabled={!earningsData?.available_earnings}
              href={`/dashboard/${user?.id}/payouts/withdraw-earnings`}
            >
              Withdraw Earnings
            </CustomButton>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <AnalyticsCard
            title="Total Earnings"
            value={isEarningsLoading ? <LoadingSpinner /> : `₦${earningsData?.total_earnings?.toLocaleString() || 0}`}
          />
          <AnalyticsCard
            title="Withdrawals Earnings"
            value={
              isEarningsLoading ? <LoadingSpinner /> : `₦${earningsData?.withdrawn_earnings?.toLocaleString() || 0}`
            }
          />
          <AnalyticsCard
            title="Pending"
            value={isEarningsLoading ? <LoadingSpinner /> : `₦${earningsData?.pending?.toLocaleString() || 0}`}
          />
          <AnalyticsCard
            className={cn(earningsData?.available_earnings ? "text-mid-success" : "text-mid-danger")}
            title="Available Earnings"
            value={
              isEarningsLoading ? <LoadingSpinner /> : `₦${earningsData?.available_earnings?.toLocaleString() || 0}`
            }
          />
        </section>

        <section className="space-y-4">
          <h4 className="mt-10 text-h4">Payout History</h4>
          {isPayoutsLoading || isPayoutsRefetching ? (
            <Loading text="Loading payout table..." className="w-fill h-fit p-20" />
          ) : (
            <>
              {payoutsData.length > 0 ? (
                <DashboardTable
                  data={payoutsData}
                  columns={payoutColumns}
                  showPagination
                  onPageChange={handlePageChange}
                  currentPage={paginationMeta.current_page}
                  totalPages={paginationMeta.last_page}
                  itemsPerPage={paginationMeta.per_page}
                  onRowClick={(payout) => {
                    router.push(`/dashboard/${user?.id}/payouts/${payout.id}`);
                  }}
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
                      src: "/images/coins.svg",
                      alt: "Payout Tree",
                      width: 125,
                      height: 78,
                    },
                  ]}
                  description="You do not have any sales yet"
                  className="min-h-[254px] rounded-md bg-low-grey-III p-[32px]"
                  button={{
                    text: "Create Your First Product",
                    onClick: () => router.push(`/dashboard/${user?.id}/products/new`),
                  }}
                />
              )}
            </>
          )}
        </section>
      </section>
    </section>
  );
};

export default PayoutsPage;
