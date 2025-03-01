"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { FunnelService } from "~/features/funnel";
import { WithDependency } from "~/HOC/withDependencies";
import { dependencies } from "~/utils/dependencies";
import { SelectFunnelModal } from "./_components/select-funnel-modal";
import { AllFunnels } from "./_views/all-funnels";

const Page = ({ funnelService }: { funnelService: FunnelService }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const currentTab = searchParameters.get("tab") || "all-funnels";

  const onTabChange = (value: string) => {
    const parameters = new URLSearchParams(searchParameters);
    parameters.set("tab", value);
    router.replace(`${pathname}?${parameters.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={currentTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="mb-8 flex h-fit w-full flex-col-reverse gap-4 rounded-none border-b bg-transparent p-0 sm:h-[58px] sm:flex-row sm:items-center sm:justify-between lg:h-[58px]">
        <section className="flex h-full w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:gap-0">
          <TabsTrigger
            value="all-funnels"
            className="relative h-full min-w-[100px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
          >
            All Funnels
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
              data-state={currentTab === "all-funnels" ? "active" : "inactive"}
            />
          </TabsTrigger>
          <TabsTrigger
            value="live"
            className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
          >
            Live
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
              data-state={currentTab === "live" ? "active" : "inactive"}
            />
          </TabsTrigger>
          <TabsTrigger
            value="drafts"
            className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
          >
            Drafts
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
              data-state={currentTab === "drafts" ? "active" : "inactive"}
            />
          </TabsTrigger>
          <TabsTrigger
            value="deleted"
            className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
          >
            Deleted
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
              data-state={currentTab === "deleted" ? "active" : "inactive"}
            />
          </TabsTrigger>
        </section>
        <section className="w-full sm:w-auto">
          <SelectFunnelModal />
        </section>
      </TabsList>

      {/* tab content */}
      <TabsContent value="all-funnels">
        <AllFunnels />
      </TabsContent>
      <TabsContent value="live">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Non similique qui, distinctio maxime necessitatibus sed
        commodi eveniet aut dolore alias, deleniti veritatis quo recusandae explicabo. Nesciunt illum perferendis neque
        illo?
      </TabsContent>
      <TabsContent value="drafts">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Nesciunt magnam debitis sunt maxime commodi, iusto
        tempora quis. Quidem deleniti temporibus esse eos fugiat voluptatum odio corrupti! Saepe ipsum consectetur
        rerum!
      </TabsContent>
      <TabsContent value="deleted">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Temporibus vero itaque veritatis quibusdam consectetur
        et sunt, quod aperiam eaque enim mollitia nesciunt reiciendis, similique iusto incidunt iure quis distinctio
        commodi?
      </TabsContent>
    </Tabs>
  );
};

const FunnelPage = WithDependency(Page, {
  funnelService: dependencies.FUNNEL_SERVICE,
});

export default FunnelPage;
