"use client";

import kyc from "@/images/kyc.svg";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";

import { EmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import CustomButton from "~/components/common/common-button/common-button";
import { FormField, ThumbNailUpload } from "~/components/common/FormFields";
import { WithDependency } from "~/HOC/withDependencies";
import { useSession } from "~/hooks/use-session";
import { KycFormData, kycSchema } from "~/schemas";
import { AppService } from "~/services/app/app.service";
import { SettingsService } from "~/services/settings.service";
import { countries, documentType } from "~/utils/constants";
import { dependencies } from "~/utils/dependencies";
import { Toast } from "~/utils/notificationManager";

const BaseKYCForm = ({ settingsService }: { service: AppService; settingsService: SettingsService }) => {
  const { user } = useSession();
  const router = useRouter();
  const methods = useForm<KycFormData>({
    resolver: zodResolver(kycSchema),
    defaultValues: {
      country: "",
      document_type: "",
      document_image: null,
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleSubmitForm = async (data: KycFormData) => {
    const response = await settingsService.submitKYCDocument(data);
    if (response) {
      Toast.getInstance().showToast({
        title: "KYC Update",
        description: `Your KYC information has been uploaded successfully.`,
        variant: "default",
      });
      reset();
    }
  };

  if (user?.kyc_complete) {
    return (
      <EmptyState
        images={[
          {
            src: kyc,
            alt: "kyc",
            width: 100,
            height: 100,
          },
        ]}
        title="You have completed your KYC verification successfully!"
        description={``}
        button={{
          text: "Create New Product",
          onClick: () => {
            router.push(`/dashboard/${user?.id}/products/new`);
          },
        }}
      />
    );
  }

  return (
    <div className={`max-w-[444px]`}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
          <FormField
            label="Country"
            name="country"
            type="select"
            placeholder="Select a country"
            className={`h-12 bg-low-grey-III`}
            options={countries}
            required
          />

          <FormField
            label="Document Type"
            name="document_type"
            type="select"
            placeholder="Select document type"
            className={`h-12 bg-low-grey-III`}
            options={documentType}
            required
          />

          <ThumbNailUpload
            label={`Document Image`}
            labelText={`Upload a screenshot of your document type`}
            name="document_image"
            acceptedFormats="image/jpeg, image/png"
            maxFileSize={2 * 1024 * 1024}
          />

          <div className={`flex items-center gap-4 pt-6`}>
            <CustomButton
              size={`xl`}
              variant={`outline`}
              className="w-full border-mid-danger text-mid-danger"
              onClick={(event) => {
                event.preventDefault();
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
  );
};

export const KYCForm = WithDependency(BaseKYCForm, {
  settingsService: dependencies.SETTINGS_SERVICE,
});
