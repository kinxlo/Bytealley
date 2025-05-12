"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import CustomButton from "~/components/common/common-button/common-button";
import { FormField } from "~/components/common/FormFields";
import { WithDependency } from "~/HOC/withDependencies";
import { ExternalContactFormData, externalContactSchema } from "~/schemas";
import { AppService } from "~/services/app/app.service";
import { dependencies } from "~/utils/dependencies";
import { Toast } from "~/utils/notificationManager";

export const BaseContactUsForm = ({ appService }: { appService: AppService }) => {
  const methods = useForm<ExternalContactFormData>({
    resolver: zodResolver(externalContactSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleSubmitForm = async (data: ExternalContactFormData) => {
    const response = await appService.contactUs(data);
    if (response) {
      Toast.getInstance().showToast({
        title: "Your message has been sent successfully",
        description: "Byte alley will get back to you soon.",
        variant: "default",
      });
      reset();
    }
  };

  return (
    <section className={`rounded-lg border border-black bg-white p-8 shadow-neob`}>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
          <div className={`grid grid-cols-2 gap-4`}>
            <FormField name="firstname" placeholder="First Name" className={`transparent h-12 border-black`} required />
            <FormField name="lastname" placeholder="Last Name" className={`transparent h-12 border-black`} required />
          </div>
          <FormField
            name="email"
            type="email"
            placeholder="Email Address"
            className={`transparent h-12 border-black`}
            required
          />
          <FormField
            name="subject"
            placeholder="Type a subject for your message"
            className={`transparent h-12 border-black`}
            required
          />

          <FormField
            name="message"
            type="textarea"
            placeholder="Type your message"
            className={`transparent h-[10rem] border-black`}
            required
          />

          <div className={`flex items-center gap-4 pt-6`}>
            <CustomButton
              size={`xl`}
              variant={`primary`}
              type="submit"
              className="w-full bg-mid-warning font-bold text-black"
              isDisabled={isSubmitting}
              isLoading={isSubmitting}
            >
              Send Message
            </CustomButton>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export const ContactUsForm = WithDependency(BaseContactUsForm, {
  appService: dependencies.APP_SERVICE,
});
