"use client";

import emptyCart from "@/images/empty-cart.svg";
import { format } from "date-fns";
import debounce from "lodash.debounce";
import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { DateRange } from "react-day-picker";

import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { customerColumns } from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { DateRangePicker } from "~/app/(dashboard-pages)/_components/date-range-picker";
import { EmptyState, FilteredEmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import ExportAction from "~/app/(dashboard-pages)/_components/export-action";
import Loading from "~/app/Loading";
import { useSession } from "~/hooks/use-session";
import { useCustomerService } from "~/services/customer/use-customer.service";

const CustomerPage = () => {
  const router = useRouter();
  const { user } = useSession();
  const { useGetAllCustomers, useDownloadCustomers } = useCustomerService();
  const { refetch: downloadCustomers } = useDownloadCustomers({}, { enabled: false });

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

  // Customers query
  const {
    data: customersData,
    isLoading: isCustomersLoading,
    isRefetching: isCustomersRefetching,
    isError: isCustomersError,
  } = useGetAllCustomers({
    page: currentPage,
    ...(dateRange?.from && { start_date: format(dateRange.from, "yyyy-MM-dd") }),
    ...(dateRange?.to && { end_date: format(dateRange.to, "yyyy-MM-dd") }),
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isCustomersError) {
    return (
      <EmptyState
        images={[{ src: emptyCart, alt: "Error", width: 100, height: 100 }]}
        title="Error loading customers"
        description="Failed to fetch customer data. Please try again later."
      />
    );
  }

  return (
    <section className="space-y-10">
      <p className="text-2xl font-medium">{customersData?.data?.length || 0} Customers</p>

      <section className="flex w-full flex-col-reverse gap-4 sm:items-center md:flex-row md:justify-between">
        <div className="flex w-full flex-col gap-2 sm:flex-row md:w-auto">
          <DateRangePicker onDateChange={handleDateRangeChange} />
        </div>
        <div className="flex w-full flex-row gap-2 sm:w-auto sm:justify-start">
          <ExportAction
            downloadMutation={async (filters) => {
              const { data } = await downloadCustomers(filters);
              return data as Blob;
            }}
            currentPage={1}
            dateRange={dateRange}
            buttonText="Export Customers"
            fileName="customer"
            size="xl"
          />
        </div>
      </section>

      <section>
        {isCustomersLoading || isCustomersRefetching ? (
          <Loading text="Loading customer table..." className="w-fill h-fit p-20" />
        ) : (
          <>
            {customersData?.data?.length ? (
              <DashboardTable
                data={customersData.data}
                columns={customerColumns}
                showPagination
                onPageChange={handlePageChange}
                currentPage={customersData.meta?.current_page}
                totalPages={customersData.meta?.last_page}
                itemsPerPage={customersData.meta?.per_page}
                onRowClick={(customer) => {
                  router.push(`/dashboard/${user?.id}/customers/${customer.id}`);
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
                    src: emptyCart,
                    alt: "Empty cart",
                    width: 100,
                    height: 100,
                  },
                ]}
                title="No Customers found."
                description="You do not have any active customers yet."
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
  );
};

export default CustomerPage;
