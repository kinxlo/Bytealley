import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { SwitchField } from "~/components/common/FormFields";
import { useSession } from "~/hooks/use-session";
import { EmailNotificationSettingFormData, emailNotificationSettingSchema } from "~/schemas";
import { AppService } from "~/services/app/app.service";

export const EmailNotificationSettingsForm = ({ service }: { service: AppService }) => {
  const { user } = useSession();
  const methods = useForm<EmailNotificationSettingFormData>({
    resolver: zodResolver(emailNotificationSettingSchema),
    defaultValues: {
      purchase: user?.purchase_notification,
      news_updates: user?.news_and_update_notification,
      product_creation: user?.product_creation_notification,
      payout: user?.payout_notification,
    },
  });

  const handlePurchasedChange = async (checked: boolean) => {
    await service.updateUserNotifications({
      purchase_notification: checked,
    });
  };

  const handleNewsAndUpdatesChange = async (checked: boolean) => {
    await service.updateUserNotifications({
      news_and_update_notification: checked,
    });
  };

  const handleProductCreationChange = async (checked: boolean) => {
    await service.updateUserNotifications({
      product_creation_notification: checked,
    });
  };

  const handlePayoutChange = async (checked: boolean) => {
    await service.updateUserNotifications({
      payout_notification: checked,
    });
  };

  return (
    <FormProvider {...methods}>
      <form className="space-y-6">
        <SwitchField
          name={"purchase"}
          label={
            <div className={`space-y-2`}>
              <p className={`text-[16px] font-semibold text-high-purple`}>Purchase</p>
              {/* <p className={`text-xs text-mid-grey-II`}>Lorem ipsum dolor sit amet.</p> */}
            </div>
          }
          className={`flex items-center justify-between`}
          onChange={handlePurchasedChange}
        />
        <hr className={`border-border`} />
        <SwitchField
          name={"news_updates"}
          label={
            <div className={`space-y-2`}>
              <p className={`text-[16px] font-semibold text-high-purple`}>News & Updates</p>
              {/* <p className={`text-xs text-mid-grey-II`}>Lorem ipsum dolor sit amet.</p> */}
            </div>
          }
          className={`flex items-center justify-between`}
          onChange={handleNewsAndUpdatesChange}
        />
        <hr className={`border-border`} />
        <SwitchField
          name={"product_creation"}
          label={
            <div className={`space-y-2`}>
              <p className={`text-[16px] font-semibold text-high-purple`}>Product Creation</p>
              {/* <p className={`text-xs text-mid-grey-II`}>Lorem ipsum dolor sit amet.</p> */}
            </div>
          }
          className={`flex items-center justify-between`}
          onChange={handleProductCreationChange}
        />
        <hr className={`border-border`} />
        <SwitchField
          name={"payout"}
          label={
            <div className={`space-y-2`}>
              <p className={`text-[16px] font-semibold text-high-purple`}>Payout</p>
              {/* <p className={`text-xs text-mid-grey-II`}>Lorem ipsum dolor sit amet.</p> */}
            </div>
          }
          className={`flex items-center justify-between`}
          onChange={handlePayoutChange}
        />
        <hr className={`border-border`} />
      </form>
    </FormProvider>
  );
};
