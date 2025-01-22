"use client";

import onboardingImage from "@/images/home_banner_illustration.svg";
import { useRouter } from "next/navigation";

import { ActionBanner } from "../../_components/action-banner";
import { DashboardBanner } from "../../_components/home-banner";
import { ProgressBar } from "../../_components/progress-bar";

type OnboardingStep = {
  title: string;
  description: string;
  buttonLabel: string;
  icon: string;
  isCompleted: boolean;
  action: () => void;
};

export const Onboarding = () => {
  const router = useRouter();

  const ONBOARDING_STEPS: OnboardingStep[] = [
    {
      title: "Verify your email",
      description: "Verify your email address to secure your account",
      buttonLabel: "Verify email",
      icon: "/images/verify_email.svg",
      isCompleted: true,
      action: () => router.push("/settings/email-verification"),
    },
    {
      title: "Customize your profile",
      description: "Add your personal information and customize your store profile",
      buttonLabel: "Edit profile",
      icon: "/images/profile.svg",
      isCompleted: true,
      action: () => router.push("/settings/profile"),
    },
    {
      title: "Create your first product",
      description: "Start selling by adding your first product to the store",
      buttonLabel: "Add product",
      icon: "/images/first_product.svg",
      isCompleted: true,
      action: () => router.push("/products/new"),
    },
    {
      title: "Set up your payout",
      description: "Complete your profile to start getting your products published",
      buttonLabel: "Make money",
      icon: "/images/payout.svg",
      isCompleted: false,
      action: () => router.push("/settings/payout"),
    },
    {
      title: "Make your first sale",
      description: "Start promoting your products to make your first sale",
      buttonLabel: "View guide",
      icon: "/images/first_sale.svg",
      isCompleted: false,
      action: () => router.push("/guide/first-sale"),
    },
  ];

  const completedSteps = ONBOARDING_STEPS.filter((step) => step.isCompleted).length;

  return (
    <section>
      <DashboardBanner
        img={onboardingImage.src}
        title="Welcome to Byte Alley"
        desc="Complete your profile to start getting your products published."
      />
      <section className="my-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-lg font-semibold sm:text-xl md:text-2xl">Get Started Guide</h1>
          <p className="text-sm sm:text-base">Use this personalized guide to get your store up and running.</p>
        </div>
        <ProgressBar current={completedSteps} total={ONBOARDING_STEPS.length} />
      </section>
      <div className="flex flex-col gap-4">
        {ONBOARDING_STEPS.map((step) => (
          <ActionBanner
            key={step.title}
            title={step.title}
            description={step.description}
            button={{
              label: step.buttonLabel,
              onClick: step.action,
            }}
            icon={step.icon}
            isCompleted={step.isCompleted}
          />
        ))}
      </div>
    </section>
  );
};
