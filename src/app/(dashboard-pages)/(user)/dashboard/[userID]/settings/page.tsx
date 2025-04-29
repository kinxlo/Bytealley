"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WithDependency } from "~/HOC/withDependencies";
import { AppService } from "~/services/app/app.service";
import { dependencies } from "~/utils/dependencies";
import { Account } from "./_views/account";
import { KYC } from "./_views/kyc";
import { Payment } from "./_views/payment";
import { Plans } from "./_views/plans";
import Billing from "./_views/plans/billing";

const Settings = ({ appService, params }: { appService: AppService; params: { userID: string } }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const currentTab = searchParameters.get("tab") || "account";

  const onTabChange = (value: string) => {
    const parameters = new URLSearchParams(searchParameters);
    parameters.set("tab", value);
    router.replace(`${pathname}?${parameters.toString()}`, { scroll: false });
  };

  const handlePlanClick = () => {
    const parameters = new URLSearchParams(searchParameters);
    parameters.set("tab", "plans");
    router.replace(`${pathname}?${parameters.toString()}`, { scroll: false });
  };

  const handleBillingClick = () => {
    const parameters = new URLSearchParams(searchParameters);
    parameters.set("tab", "billing");
    router.replace(`${pathname}?${parameters.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={currentTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="border-bottom mb-8 flex h-fit w-full flex-col-reverse gap-4 rounded-none bg-transparent p-0 sm:h-[58px] sm:flex-row sm:items-center sm:justify-between lg:h-[58px]">
        <section className="flex h-full w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:gap-0">
          <TabsTrigger
            value="account"
            className="relative h-full min-w-[100px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
          >
            Account
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
              data-state={currentTab === "account" ? "active" : "inactive"}
            />
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
          >
            Payment
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
              data-state={currentTab === "payment" ? "active" : "inactive"}
            />
          </TabsTrigger>
          <TabsTrigger
            value="kyc"
            className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
          >
            KYC
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
              data-state={currentTab === "kyc" ? "active" : "inactive"}
            />
          </TabsTrigger>
          <TabsTrigger
            onClick={handlePlanClick}
            value="plans"
            className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
          >
            Plans
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
              data-state={currentTab === "plans" || currentTab === "billing" ? "active" : "inactive"}
            />
          </TabsTrigger>
        </section>
      </TabsList>

      {/* tab content */}
      <TabsContent value="account">
        <Account service={appService} />
      </TabsContent>
      <TabsContent value="payment">
        <Payment />
      </TabsContent>
      <TabsContent value="kyc">
        <KYC />
      </TabsContent>
      <TabsContent value="plans">
        <Plans userID={params.userID} onBillingClick={handleBillingClick} />
      </TabsContent>
      <TabsContent value="billing">
        <Billing />
      </TabsContent>
    </Tabs>
  );
};

const SettingsPage = WithDependency(Settings, {
  appService: dependencies.APP_SERVICE,
});

export default SettingsPage;
