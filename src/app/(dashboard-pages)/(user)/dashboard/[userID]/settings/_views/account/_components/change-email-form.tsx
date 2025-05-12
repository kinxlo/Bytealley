"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import CustomButton from "~/components/common/common-button/common-button";
import { FormField } from "~/components/common/FormFields";
import { Checkbox } from "~/components/ui/checkbox";
import { useSession } from "~/hooks/use-session";
import { ChangeEmailFormData, changeEmailSchema } from "~/schemas";
import { AppService } from "~/services/app/app.service";
import { Toast } from "~/utils/notificationManager";
import { cn } from "~/utils/utils";

export const ChangeEmailForm = ({ service }: { service: AppService }) => {
  const { user } = useSession();
  const methods = useForm<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
    defaultValues: {
      email: user?.email,
      alt_email: user?.alt_email || "",
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleAltWEmailChange = async (data: ChangeEmailFormData) => {
    const response = await service.updateUserNotifications({
      alt_email: data.alt_email,
    });
    if (response) {
      Toast.getInstance().showToast({
        title: "Email Added",
        description: `Alternate email added successfully!`,
        variant: "default",
      });
    }
  };

  return (
    <>
      <div className={`max-w-[500px]`}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleAltWEmailChange)} className="space-y-6">
            <FormField
              disabled
              label="Account Email"
              name="email"
              type="email"
              placeholder="Current email"
              className={`h-12 bg-low-grey-III`}
              containerClassName={`space-x-8`}
              rightAddon={
                <Checkbox
                  checked={!!user?.email}
                  className={cn(
                    "h-6 w-6 rounded-full border-2",
                    user?.email ? "border-black bg-primary" : "border-primary",
                  )}
                />
              }
              required
            />

            <FormField
              label="Alternative Email"
              name="alt_email"
              type="email"
              placeholder="Enter alternative email"
              className={`h-12 bg-low-grey-III`}
              containerClassName={`space-x-8`}
              rightAddon={
                <Checkbox
                  checked={!!user?.alt_email}
                  className={cn(
                    "h-6 w-6 rounded-full border-2",
                    user?.alt_email ? "border-black bg-primary" : "border-primary",
                  )}
                />
              }
              required
            />
            <CustomButton
              size={`xl`}
              variant={`primary`}
              type="submit"
              className="w-full"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Update contact email
            </CustomButton>
          </form>
        </FormProvider>
      </div>
    </>
  );
};
