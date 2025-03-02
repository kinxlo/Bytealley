"use client";

import { LucidePlusCircle } from "lucide-react";

import CustomButton from "~/components/common/common-button/common-button";
import { ReusableDialog } from "~/components/common/Dialog";
import { FunnelForm } from "./funnel-form";

export const FunnelFormModal = () => {
  return (
    <ReusableDialog
      trigger={
        <CustomButton
          isLeftIconVisible
          icon={<LucidePlusCircle />}
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
        >
          Save and Continue
        </CustomButton>
      }
      className={`lg:min-w-[600px] lg:p-8`}
      headerClassName={`text-2xl`}
      title={`Final Steps Before Publishing...`}
      description={`Fill the form below to complete your funnel creation`}
    >
      <FunnelForm />
    </ReusableDialog>
  );
};
