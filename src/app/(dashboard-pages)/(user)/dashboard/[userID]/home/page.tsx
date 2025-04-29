"use client";

import { useRouter } from "next/navigation";

import { Wrapper } from "~/components/layout/wrapper";
import { WithDependency } from "~/HOC/withDependencies";
import { useSession } from "~/hooks/use-session";
import { AuthService } from "~/services/auth.service";
import { OrderService } from "~/services/orders.service";
import { ProductService } from "~/services/product/product.service";
import { dependencies } from "~/utils/dependencies";
import { ActiveUser } from "./_views/active-user";
import { NewUser } from "./_views/new-user";
import { Onboarding } from "./_views/onboarding";

const UserHomePage = ({
  productService,
  authService,
  orderService,
  params,
}: {
  productService: ProductService;
  authService: AuthService;
  orderService: OrderService;
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
    // {
    //   title: "Reset Password",
    //   description: "Kindly reset your password to a secure one that you can easily remember.",
    //   buttonLabel: "Reset Password",
    //   icon: "/images/verify_email.svg",
    //   // isCompleted: user?.password_is_set,
    //   isCompleted: false,
    //   action: () => router.push(`/dashboard/${params.userID}/settings`),
    // },
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
      action: () => router.push(`/dashboard/${params.userID}/settings?tab=payment`),
    },
    {
      title: "Make your first sale",
      description: "Start promoting your products to make your first sale",
      buttonLabel: "View guide",
      icon: "/images/first_sale.svg",
      isCompleted: user?.first_sale,
      action: () => router.push(`/dashboard/${params.userID}/products/new`),
    },
  ];

  const completedSteps = ONBOARDING_STEPS.filter((step) => step.isCompleted).length;

  // Less than 4 steps completed -> Onboarding
  if (completedSteps < 4) {
    return (
      <Wrapper className="max-w-[751px]">
        <Onboarding steps={ONBOARDING_STEPS} />
      </Wrapper>
    );
  }

  // Exactly 4 steps completed -> NewUser
  if (completedSteps >= 4 && completedSteps < ONBOARDING_STEPS.length) {
    return <NewUser steps={ONBOARDING_STEPS} completedSteps={completedSteps} orderService={orderService} />;
  }

  // All 5 steps completed -> ActiveUser
  return <ActiveUser productService={productService} orderService={orderService} />;
};

const HomePage = WithDependency(UserHomePage, {
  authService: dependencies.AUTH_SERVICE,
  productService: dependencies.PRODUCT_SERVICE,
  orderService: dependencies.ORDER_SERVICE,
});

export default HomePage;
