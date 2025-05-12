"use client";

import { AppService } from "~/services/app/app.service";
import { ChangeEmailForm } from "./_components/change-email-form";
import { ChangePasswordForm } from "./_components/change-password-form";
import { DeleteAccount } from "./_components/delete-account";
import { EmailNotificationSettingsForm } from "./_components/email-notification-settings-form";

export const Account = ({ service }: { service: AppService }) => {
  return (
    <section className={`space-y-10`}>
      <section className={`grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-16`}>
        <div className={`col-span-2 space-y-2`}>
          <h5 className={`text-h5 font-semibold sm:text-h5-sm`}>Email Notification</h5>
          <p className={`text-sm text-mid-grey-II`}>Select which settings works best for you.</p>
        </div>
        <div className={`col-span-3`}>
          <EmailNotificationSettingsForm service={service} />
        </div>
      </section>
      <section className={`grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-16`}>
        <div className={`col-span-2 space-y-4`}>
          <h5 className={`text-h5 font-semibold sm:text-h5-sm`}>Security</h5>
          {/* <p className={`text-sm text-mid-grey-II`}>Lorem, ipsum dolor sit amet consectetur adipisicing elit.</p> */}
        </div>
        <div className={`col-span-3`}>
          <ChangePasswordForm service={service} />
        </div>
      </section>
      <section className={`grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-16`}>
        <div className={`col-span-2 space-y-4`}>
          <h5 className={`text-h5 font-semibold sm:text-h5-sm`}>Contact Email</h5>
          <p className={`text-sm text-mid-grey-II`}>Provide your contact email for your payout invoices.</p>
        </div>
        <div className={`col-span-3`}>
          <ChangeEmailForm service={service} />
        </div>
      </section>
      <section className={`grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-16`}>
        <div className={`col-span-2 space-y-4`}>
          <h5 className={`text-h5 font-semibold sm:text-h5-sm`}>Delete Account</h5>
          <p className={`text-sm text-mid-grey-II`}>This is an ireversible process</p>
        </div>
        <div className={`col-span-3`}>
          <DeleteAccount />
        </div>
      </section>
    </section>
  );
};
