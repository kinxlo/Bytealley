"use client";

import nairaIcon from "@/icons/naira.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

import { AddBankModal } from "~/app/(dashboard-pages)/_components/add-bank-modal";
import { AnalyticsCard } from "~/app/(dashboard-pages)/_components/analytics-card";
import { BackNavigator } from "~/app/(dashboard-pages)/_components/back-navigator";
import { BankCard } from "~/app/(dashboard-pages)/_components/bank-card";
import CustomButton from "~/components/common/common-button/common-button";
import { FormField } from "~/components/common/FormFields";
import { LoadingSpinner } from "~/components/miscellaneous/loading-spinner";
import { useSession } from "~/hooks/use-session";
import { WithdrawalData, withdrawalSchema } from "~/schemas";
import { useEarningsService } from "~/services/earnings/use-earnings.service";
import { Toast } from "~/utils/notificationManager";

const WithdrawEarnings = () => {
  const { useGetUserEarnings, useGetPaymentAccounts, useInitiateWithdrawal } = useEarningsService();

  const { data: earningsData, isLoading: isLoadingEarnings } = useGetUserEarnings();
  const { data: accountsData, isLoading: isLoadingAccounts } = useGetPaymentAccounts();
  const { mutate: initiateWithdrawal, isPending: isWithdrawing } = useInitiateWithdrawal();

  const { user } = useSession();
  const router = useRouter();

  const methods = useForm<WithdrawalData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleSubmitForm = (data: WithdrawalData) => {
    initiateWithdrawal(data, {
      onSuccess: (response) => {
        Toast.getInstance().showToast({
          title: response?.data,
          description: `A ${data.amount} naira withdrawal was successful`,
          variant: "success",
        });
        router.push(`/dashboard/${user?.id}/payouts`);
      },
    });
  };

  const availableEarnings = earningsData?.available_earnings || 0;
  const listOfRegisteredAccounts = accountsData?.data || [];

  return (
    <section className="space-y-12">
      <section className="flex flex-col justify-between space-y-4 md:flex-row md:space-y-0 lg:items-center">
        <BackNavigator text="Withdrawal Earnings" />
      </section>

      <section>
        <AnalyticsCard
          title="Available Earnings"
          value={isLoadingEarnings ? <LoadingSpinner /> : `₦${availableEarnings.toLocaleString()}`}
          icon={<Image src={nairaIcon} alt="naira" width={40} height={40} />}
          backgroundImage="/images/naira.svg"
          className="text-mid-success shadow-none"
        />
      </section>

      <section className="space-y-2">
        <h5 className="text-h5 font-semibold">Bank Accounts</h5>
        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {isLoadingAccounts ? (
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
              <AddBankModal />
            </>
          )}
        </section>
      </section>

      <section className="space-y-2">
        <h5 className="text-h5 font-semibold">Withdraw earnings</h5>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-10">
            <FormField
              label="Amount"
              name="amount"
              type="number"
              placeholder="₦0"
              className="h-[60px] border-none bg-transparent"
              containerClassName="bg-low-grey-III border-default rounded-md pr-3"
              required
              rightAddon={
                <p
                  onClick={() => methods.setValue("amount", availableEarnings)}
                  className="cursor-pointer text-mid-purple dark:text-white"
                >
                  Max
                </p>
              }
            />
            <CustomButton
              size="xl"
              variant="primary"
              type="submit"
              className="w-full"
              isDisabled={isSubmitting || isWithdrawing}
              isLoading={isSubmitting || isWithdrawing}
            >
              Initialize Withdrawal
            </CustomButton>
          </form>
        </FormProvider>
      </section>
    </section>
  );
};

export default WithdrawEarnings;
