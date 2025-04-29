"use client";

import emptyCart from "@/images/empty-cart.svg";
import onboardingImage from "@/images/home_banner_illustration.svg";
import { useEffect, useState, useTransition } from "react";

import { DashboardTable } from "~/app/(dashboard-pages)/_components/dashboard-table";
import { orderColumns } from "~/app/(dashboard-pages)/_components/dashboard-table/table-data";
import { EmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import Loading from "~/app/Loading";
import { OrderService } from "~/services/order/orders.service";
import { ActionBanner } from "../../_components/action-banner";
import { DashboardBanner } from "../../_components/home-banner";
import { OnboardingHeader } from "../onboarding/onboarding-header";

interface NewUserProperties {
  steps: OnboardingStep[];
  completedSteps: number;
  orderService: OrderService;
}

export const NewUser = ({ steps, completedSteps, orderService }: NewUserProperties) => {
  // Find the first incomplete step
  const nextStep = steps.find((step) => !step.isCompleted);
  const [isPendingOrders, startTransitionOrders] = useTransition();
  // const [isPendingRefresh, startTransitionRefresh] = useTransition();
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<IPaginationMeta | null>(null);

  useEffect(() => {
    const parameters: IFilters = {
      page: currentPage,
    };
    startTransitionOrders(async () => {
      const ordersData = await orderService.getAllOrders(parameters);
      setOrders(ordersData?.data.slice(0, 5) || []);
      setPaginationMeta(ordersData?.meta || null);
    });
  }, [orderService, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <section className="space-y-10">
      <div className="step-1 flex flex-col gap-4 lg:flex-row">
        <DashboardBanner
          img={onboardingImage.src}
          title="Welcome to Byte Alley"
          desc="Complete your profile to start getting your products published."
        />
        <div className="space-y-6">
          <OnboardingHeader completedSteps={completedSteps} totalSteps={steps.length} />
          {nextStep && (
            <ActionBanner
              title={nextStep.title}
              description={nextStep.description}
              button={{
                label: nextStep.buttonLabel,
                onClick: nextStep.action,
              }}
              icon={nextStep.icon}
              isCompleted={nextStep.isCompleted}
            />
          )}
        </div>
      </div>
      <div className="step-2 space-y-4">
        <h4 className="text-h4">Sales</h4>
        <section>
          {isPendingOrders ? (
            <Loading text={`Loading sales table...`} className={`w-fill h-fit p-20`} />
          ) : (
            <>
              {orders.length > 0 ? (
                <DashboardTable
                  data={orders}
                  columns={orderColumns}
                  showPagination
                  onPageChange={handlePageChange}
                  currentPage={paginationMeta?.current_page}
                  totalPages={paginationMeta?.last_page}
                  itemsPerPage={paginationMeta?.per_page}
                />
              ) : (
                <EmptyState
                  images={[
                    {
                      src: emptyCart,
                      alt: "Empty Cart",
                      width: 100,
                      height: 100,
                    },
                  ]}
                  title="No sales found."
                  description="You do not have any sales yet."
                  button={{ text: "Create New Order", onClick: () => {} }}
                />
              )}
            </>
          )}
        </section>
      </div>
    </section>
  );
};
