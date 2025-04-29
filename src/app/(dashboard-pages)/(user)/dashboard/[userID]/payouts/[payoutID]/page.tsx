"use client";

import { BackNavigator } from "~/app/(dashboard-pages)/_components/back-navigator";
import { EmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import { TableHeaderInfo } from "~/app/(dashboard-pages)/_components/table-header-info";
import Loading from "~/app/Loading";
import { usePayoutService } from "~/services/payout/use-payout.service";

const PayoutDetailsPage = ({ params }: { params: { payoutID: string } }) => {
  const { useGetPayoutById } = usePayoutService();

  const { data: payout, isLoading, isError } = useGetPayoutById(params.payoutID);

  if (isLoading) {
    return <Loading text="Loading payout details..." className="w-fill h-fit p-20" />;
  }

  if (isError || !payout) {
    return (
      <EmptyState
        title="Payout details Not Found"
        description="The payout details you are looking for does not exist."
        images={[]}
        className="h-full"
      />
    );
  }

  return (
    <section className="space-y-6">
      <section className="flex flex-col justify-between space-y-4 md:flex-row md:space-y-0 lg:items-center">
        <BackNavigator text="Withdrawal Details" />
      </section>

      <section>
        <p className="mb-4 text-lg font-semibold">{}</p>
        <TableHeaderInfo headers={["Withdrawal Amount", "Status"]} product={payout} />
        <TableHeaderInfo headers={["Account Name", "Bank Account", "Bank Name"]} product={payout} />
        <TableHeaderInfo headers={["Time", "Paid On", "Reference"]} product={payout} />
      </section>
    </section>
  );
};

export default PayoutDetailsPage;
