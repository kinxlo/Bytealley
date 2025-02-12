"use client";

import { useRouter } from "next/navigation";

import { Wrapper } from "~/components/layout/wrapper";
import { WithDependency } from "~/HOC/withDependencies";
import { useSession } from "~/hooks/use-session";
import { AuthService } from "~/services/auth.service";
import { ProductService } from "~/services/product.service";
import { dependencies } from "~/utils/dependencies";
import { ActiveUser } from "./_views/active-user";
import { NewUser } from "./_views/new-user";
import { Onboarding } from "./_views/onboarding";

const UserHomePage = ({
  productService,
  authService,
  params,
}: {
  productService: ProductService;
  authService: AuthService;
  params: { userID: string };
}) => {
  const router = useRouter();
  const { user } = useSession();

  const ONBOARDING_STEPS: OnboardingStep[] = [
    {
      title: "Verify your email",
      description: "Verify your email address to secure your account",
      buttonLabel: "Verify email",
      icon: "/images/verify_email.svg",
      isCompleted: user?.email_verified,
      action: () => authService.verifyEmail(),
    },
    {
      title: "Customize your profile",
      description: "Add your personal information and customize your store profile",
      buttonLabel: "Edit profile",
      icon: "/images/profile.svg",
      isCompleted: user?.profile_completed,
      action: () => router.push(`/dashboard/${params.userID}/profile`),
    },
    {
      title: "Create your first product",
      description: "Start selling by adding your first product to the store",
      buttonLabel: "Add product",
      icon: "/images/first_product.svg",
      isCompleted: user?.first_product_created,
      action: () => router.push(`/dashboard/${params.userID}/products/new`),
    },
    {
      title: "Set up your payout",
      description: "Complete your profile to start getting your products published",
      buttonLabel: "Make money",
      icon: "/images/payout.svg",
      isCompleted: user?.payout_setup,
      action: () => router.push(`/dashboard/${params.userID}/settings/payout`),
    },
    {
      title: "Make your first sale",
      description: "Start promoting your products to make your first sale",
      buttonLabel: "View guide",
      icon: "/images/first_sale.svg",
      isCompleted: user?.first_sale,
      action: () => router.push(`/dashboard/${params.userID}/guide/first-sale`),
    },
  ];

  const completedSteps = ONBOARDING_STEPS.filter((step) => step.isCompleted).length;

  // Less than 4 steps completed -> Onboarding
  if (completedSteps < 3) {
    return (
      <Wrapper className="max-w-[751px]">
        <Onboarding steps={ONBOARDING_STEPS} />
      </Wrapper>
    );
  }

  // Exactly 4 steps completed -> NewUser
  if (completedSteps > 3 || completedSteps < 5) {
    return <NewUser steps={ONBOARDING_STEPS} completedSteps={completedSteps} />;
  }

  // All 5 steps completed -> ActiveUser
  return <ActiveUser productService={productService} />;
};

const HomePage = WithDependency(UserHomePage, {
  authService: dependencies.AUTH_SERVICE,
  productService: dependencies.PRODUCT_SERVICE,
});

export default HomePage;
