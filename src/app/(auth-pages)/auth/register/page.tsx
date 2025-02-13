"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FcGoogle } from "react-icons/fc";

import CustomButton from "~/components/common/common-button/common-button";
import { FormField } from "~/components/common/FormFields";
import { Logo } from "~/components/common/logo";
import { useSession } from "~/hooks/use-session";
import { RegisterFormData, registerSchema } from "~/schemas";

const RegisterPage = () => {
  const [isPending, startTransition] = useTransition();
  const [isGooglePending, startGoogleTransition] = useTransition();
  const { register, googleSignIn } = useSession();

  const methods = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: "",
      email: "",
      password: "",
      password_confirmation: "",
    },
  });

  const handleSubmit = async (data: RegisterFormData) => {
    startTransition(async () => {
      await register(data);
    });
  };

  const handleGoogleSignIn = () => {
    startGoogleTransition(async () => {
      await googleSignIn();
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-[547px] rounded-xl bg-white p-12 shadow-lg">
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <h1 className="text-2xl font-bold text-high-grey-III">
          Welcome to Productize - Where Creativity Meets Opportunity!
        </h1>

        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(handleSubmit)} className="mt-[56px] space-y-4">
            {methods.formState.errors.root && (
              <p className="text-sm text-red-500">{methods.formState.errors.root.message}</p>
            )}

            <FormField
              label="Full Name"
              name="full_name"
              type="text"
              placeholder="Enter full name"
              className={`h-12 bg-low-grey-III`}
              required
            />

            <FormField
              label="Email"
              name="email"
              type="email"
              placeholder="Enter email"
              className={`h-12 bg-low-grey-III`}
              required
            />

            <FormField
              label="Password"
              name="password"
              type="password"
              placeholder="Enter Password"
              className={`h-12 bg-low-grey-III`}
              required
            />

            <FormField
              label="Confirm Password"
              name="password_confirmation"
              type="password"
              placeholder="Re-enter Password"
              className={`h-12 bg-low-grey-III`}
              required
            />

            <div className="pt-8">
              <div className="mb-4 text-center text-sm text-muted-foreground">
                <p>
                  You agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms Of Use
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>

              <CustomButton
                type="submit"
                variant="primary"
                isDisabled={isPending}
                isLoading={isPending}
                className="w-full"
                size="xl"
              >
                Create Account
              </CustomButton>
            </div>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-muted-foreground">or continue with</span>
            </div>
          </div>

          <CustomButton
            type="button"
            isLeftIconVisible
            icon={<FcGoogle />}
            size="xl"
            variant="outline"
            className="w-full"
            isDisabled={isGooglePending}
            isLoading={isGooglePending}
            onClick={handleGoogleSignIn}
          >
            Continue with Google
          </CustomButton>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Have an account already?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign In
            </Link>
          </p>
        </FormProvider>
      </div>
    </div>
  );
};

export default RegisterPage;
