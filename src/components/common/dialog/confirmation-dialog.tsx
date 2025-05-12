import React, { useState } from "react";

import CustomButton from "../common-button/common-button";
import { ReusableDialog } from "./Dialog";

export const ConfirmationDialog = ({
  children,
  action,
}: {
  children: React.ReactNode;
  action: {
    pending: boolean;
    onOpenChange?: (open: boolean) => void;
    title: string;
    description: string;
    onConfirm: () => void;
    buttonName: string;
    img?: string;
  };
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  return (
    <ReusableDialog
      open={isDialogOpen}
      onOpenChange={setIsDialogOpen}
      trigger={children}
      title={action.title}
      description={action.description}
      img={action.img}
      headerClassName={`text-center  font-semibold`}
      wrapperClassName={`flex flex-col items-center justify-center text-center`}
    >
      <div className="flex justify-center gap-4 pt-4">
        <CustomButton variant="outline" onClick={() => setIsDialogOpen(false)}>
          Cancel
        </CustomButton>
        <CustomButton
          isDisabled={action.pending}
          isLoading={action.pending}
          variant="destructive"
          onClick={() => {
            action.onConfirm();
            setIsDialogOpen(false);
            action.onOpenChange?.(false);
          }}
        >
          {action.buttonName}
        </CustomButton>
      </div>
    </ReusableDialog>
  );
};
