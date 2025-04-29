import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import CustomButton from "~/components/common/common-button/common-button";
import { ReusableDialog } from "~/components/common/dialog/Dialog";
import { FormField, StarRatingField } from "~/components/common/FormFields";
import { WithDependency } from "~/HOC/withDependencies";
import { ReviewFormData, reviewSchema } from "~/schemas";
import { DownloadService } from "~/services/download/download.service";
import { dependencies } from "~/utils/dependencies";
import { Toast } from "~/utils/notificationManager";

const BaseReviewModal = ({
  downloadService,
  downloadedProductID,
}: {
  downloadService: DownloadService;
  downloadedProductID: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const methods = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleSubmitForm = async (data: ReviewFormData) => {
    const response = await downloadService.reviewDownloadedProduct(downloadedProductID, data);
    try {
      if (response) {
        Toast.getInstance().showToast({
          title: "Thanks for reviewing this product!",
          description: "Review has been submitted successfully.",
          variant: "success",
        });
        reset();
        setIsOpen(false);
      }
    } finally {
      reset();
      setIsOpen(false);
    }
  };

  return (
    <ReusableDialog
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <CustomButton variant={`outline`} size={`xl`} className={`border-mid-purple text-mid-purple`}>
          Rate Product
        </CustomButton>
      }
      title={"How was the product ?"}
      description={""}
      className={`p-10 sm:max-w-[600px]`}
      headerClassName={`text-2xl text-center`}
    >
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <section className={`flex flex-col items-center space-y-4 text-center`}>
            <StarRatingField name={"rating"} size={`text-[4rem]`} className={`h-fit`} />
            <p className={`font-medium`}>Whats your opinion about this product (optional)</p>
          </section>
          <FormField
            name="comment"
            type="textarea"
            className={`h-[20rem] bg-low-grey-III`}
            placeholder={`Leave a review fot the creator`}
          />
          <section className={`flex items-center gap-4`}>
            <CustomButton
              onClick={(event) => {
                event?.preventDefault();
                reset();
              }}
              variant={`outline`}
              size={`lg`}
              className={`w-full border-mid-danger text-mid-danger`}
            >
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              variant={`primary`}
              size={`lg`}
              className={`w-full`}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Submit Review
            </CustomButton>
          </section>
        </form>
      </FormProvider>
    </ReusableDialog>
  );
};

export const ReviewModal = WithDependency(BaseReviewModal, {
  downloadService: dependencies.DOWNLOAD_SERVICE,
});
