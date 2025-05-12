import { AddBankModal } from "~/app/(dashboard-pages)/_components/add-bank-modal";
import { BankCard } from "~/app/(dashboard-pages)/_components/bank-card";
import { LoadingSpinner } from "~/components/miscellaneous/loading-spinner";
import { useEarningsService } from "~/services/earnings/use-earnings.service";

const Payment = () => {
  const { useGetPaymentAccounts } = useEarningsService();
  const { data: accountsData, isLoading, refetch } = useGetPaymentAccounts();

  const listOfRegisteredAccounts = accountsData?.data || [];

  return (
    <section className="space-y-10">
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-16">
        <div className="col-span-2 space-y-2">
          <h5 className="text-h5 font-semibold sm:text-h5-sm">Payment Method</h5>
          <p className="text-sm text-mid-grey-II">Select your default payment method</p>
        </div>
        <div className="col-span-3 space-y-2">
          <p className="font-semibold text-high-purple">Gateway</p>
          <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {isLoading ? (
              <div className="flex min-h-[120px] max-w-[357px] items-center justify-center rounded-lg bg-low-grey-III">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                {listOfRegisteredAccounts.map((account) => (
                  <BankCard
                    key={account.id}
                    active={account.active}
                    bankName={account.bank_name}
                    accountNumber={account.account_number}
                    accountName={account.name}
                    accountID={account.id}
                  />
                ))}
                <AddBankModal getAccounts={refetch} />
              </>
            )}
          </section>
        </div>
      </section>
    </section>
  );
};

export default Payment;
