"use client";

import { useTransition } from "react";

import { WithDependency } from "~/HOC/withDependencies";
import { AppService } from "~/services/app/app.service";
import { dependencies } from "~/utils/dependencies";
import CustomButton from "../common-button/common-button";
import { ReusableDialog } from "../dialog/Dialog";

export const SubscriptionModal = ({ triggerStyle }: { triggerStyle?: string }) => {
  return (
    <ReusableDialog
      trigger={
        triggerStyle ? (
          <p className={triggerStyle}>Subscribe Now</p>
        ) : (
          <CustomButton variant={`primary`} size={`xl`}>
            Subscribe Now
          </CustomButton>
        )
      }
      className={`lg:min-w-[817px] lg:p-14`}
      headerClassName={`text-2xl text-center`}
    >
      <SubscriptionCard />
    </ReusableDialog>
  );
};

const BaseSubscriptionCard = ({ appService }: { appService: AppService }) => {
  const [isPending, startTransition] = useTransition();
  const handleSubscription = () => {
    startTransition(async () => {
      const response = await appService.subscribeToPlan();
      if (response) {
        window.location.href = response.authorization_url;
      }
    });
  };
  return (
    <section className={`w-full rounded-xl border border-black bg-low-purple p-10 shadow-neob`}>
      <div className={`space-y-2 text-center`}>
        <p className={`text-lg font-semibold text-mid-coral`}>Subscription Plan</p>
        <h2 className={`font-nr text-h2 sm:text-h2-sm md:text-h2-md`}>
          NGN 5000<span className={`text-sm text-mid-grey-II`}>/Per Month</span>
        </h2>
      </div>
      <div className={`my-10 space-y-8`}>
        <p className={`text-xs lg:text-[16px]`}>✔ Instantly accept payments</p>
        <p className={`text-xs lg:text-[16px]`}>✔ Access to existing features</p>
        <p className={`text-xs lg:text-[16px]`}>✔ Future releases each year</p>
        {/* <p className={`text-xs lg:text-[16px]`}>✔ When can I withdraw from my wallet</p>
        <p className={`text-xs lg:text-[16px]`}>✔ When can I withdraw from my wallet</p>
        <p className={`text-xs lg:text-[16px]`}>✔ When can I withdraw from my wallet</p> */}
      </div>
      <CustomButton
        onClick={handleSubscription}
        className={`h-[56px] w-full text-xl`}
        variant={`primary`}
        size={`xl`}
        isDisabled={isPending}
        isLoading={isPending}
      >
        Start Creating
      </CustomButton>
    </section>
  );
};

export const SubscriptionCard = WithDependency(BaseSubscriptionCard, {
  appService: dependencies.APP_SERVICE,
});
