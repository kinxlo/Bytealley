"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import CustomButton from "~/components/common/common-button/common-button";
import { WithDependency } from "~/HOC/withDependencies";
import { useSession } from "~/hooks/use-session";
import { ProfileFormData, profileSchema } from "~/schemas";
import { AppService } from "~/services/app/app.service";
import { dependencies } from "~/utils/dependencies";
import { Toast } from "~/utils/notificationManager";
import { ProfileInformation } from "./_views/profile-infomation";
import { ProfilePicture } from "./_views/profile-picture";
import { SocialLink } from "./_views/social-link";

const BaseProfile = ({ appService }: { appService: AppService }) => {
  const { user, setUser } = useSession();
  const methods = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone_number: user?.phone_number || "",
      bio: user?.bio || "",
      logo: user?.logo,
      facebook_account: user?.facebook_account || "",
      twitter_account: user?.twitter_account || "",
      youtube_account: user?.youtube_account || "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const handleSubmitForm = async (data: ProfileFormData) => {
    if (data.logo instanceof File) {
      const response = await appService.updateUser(data);
      if (response) {
        Toast.getInstance().showToast({
          title: "Profile updated successfully",
          description: "Your profile information has been updated.",
          variant: "default",
        });
        setUser(response);
      }
    } else {
      const formData = {
        ...data,
        logo: null,
      };
      const response = await appService.updateUser(formData);
      if (response) {
        Toast.getInstance().showToast({
          title: "Profile updated successfully",
          description: "Your profile information has been updated.",
          variant: "default",
        });
        setUser(response);
      }
    }
  };
  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-4">
        <section className={`space-y-8`}>
          <section className={`grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-16`}>
            <div className={`col-span-2 space-y-4`}>
              <h5 className={`text-h5 font-semibold sm:text-h5-sm`}>Profile Information</h5>
              <p className={`text-sm text-mid-grey-II lg:text-[16px]`}>
                Update your profile info with the correct details.
              </p>
            </div>
            <div className={`col-span-3 space-y-4`}>
              <ProfileInformation />
            </div>
          </section>
          <section className={`grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-16`}>
            <div className={`col-span-2 space-y-4`}>
              <h5 className={`text-h5 font-semibold sm:text-h5-sm`}>Logo</h5>
              <p className={`text-sm text-mid-grey-II lg:text-[16px]`}>Update your profile picture.</p>
            </div>
            <div className={`col-span-3`}>
              <ProfilePicture initialValue={methods.getValues("logo")} />
            </div>
          </section>
          <section className={`grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-16`}>
            <div className={`col-span-2 space-y-4`}>
              <h5 className={`text-h5 font-semibold sm:text-h5-sm`}>Social Link</h5>
              <p className={`text-sm text-mid-grey-II lg:text-[16px]`}>Update your social presence online.</p>
            </div>
            <div className={`col-span-3 space-y-4`}>
              <SocialLink />
            </div>
          </section>
          <section className={`grid grid-cols-1 gap-4 lg:grid-cols-5 lg:gap-16`}>
            <div className={`col-span-2 space-y-4`}></div>
            <div className={`col-span-3`}>
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
                  Update Profile
                </CustomButton>
              </div>
            </div>
          </section>
        </section>
      </form>
    </FormProvider>
  );
};

const Profile = WithDependency(BaseProfile, {
  appService: dependencies.APP_SERVICE,
});

export default Profile;
