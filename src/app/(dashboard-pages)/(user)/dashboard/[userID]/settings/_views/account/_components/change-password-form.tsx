"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import CustomButton from "~/components/common/common-button/common-button";
import { FormField } from "~/components/common/FormFields";
import { ChangePasswordFormData, changePasswordSchema } from "~/schemas";
import { SettingsService } from "~/services/settings.service";
import { cn } from "~/utils/utils";

export const ChangePasswordForm = ({ service }: { service: SettingsService }) => {
  const [showForm, setShowForm] = useState(false);
  const methods = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleSubmitForm = async (data: ChangePasswordFormData) => {
    console.log(data);
  };

  return (
    <>
      <div className={cn(showForm ? `hidden` : `flex items-start justify-between`)}>
        <div className={`space-y-2`}>
          <p className={`text-high-purple`}>Password</p>
          <p className={`text-xs text-mid-grey-II`}>********************</p>
          <p className={`text-sm text-mid-grey-II`}>Last changed</p>
        </div>
        <div>
          <p
            onClick={() => {
              setShowForm(true);
            }}
            className={`cursor-pointer text-sm text-mid-purple`}
          >
            {showForm ? `Cancel` : `Change Password`}
          </p>
        </div>
      </div>
      <div className={cn(showForm ? `max-w-[444px]` : `hidden`)}>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
            <FormField
              label="Current Password"
              name="current_password"
              type="password"
              placeholder="Enter current password"
              className={`h-12 bg-low-grey-III`}
              required
            />

            <FormField
              label="New Password"
              name="new_password"
              type="password"
              placeholder="Enter new password"
              className={`h-12 bg-low-grey-III`}
              required
            />

            <FormField
              label="Confirm New Password"
              name="new_password_confirmation"
              type="password"
              placeholder="Enter current password"
              className={`h-12 bg-low-grey-III`}
              required
            />

            <div className={`flex items-center gap-4 pt-6`}>
              <CustomButton
                size={`xl`}
                variant={`outline`}
                className="w-full border-mid-danger text-mid-danger"
                onClick={(event) => {
                  event.preventDefault();
                  setShowForm(false);
                  reset();
                }}
              >
                Cancel
              </CustomButton>
              <CustomButton
                size={`xl`}
                variant={`primary`}
                type="submit"
                className="w-full"
                isDisabled={isSubmitting}
                isLoading={isSubmitting}
              >
                Save Changes
              </CustomButton>
            </div>
          </form>
        </FormProvider>
      </div>
    </>
  );
};
