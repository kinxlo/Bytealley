import dashboardImg from "@/images/external/home_dashboard_img.svg";
import heroImg from "@/images/external/home_hero_img.svg";

import { Hero } from "~/app/(external-pages)/_components/hero-layout";
import { Wrapper } from "~/components/layout/wrapper";
import { BlurImage } from "~/components/miscellaneous/blur-image";

export const HomeHero = () => {
  return (
    <Hero height="h-[530px] md:h-[674px]" bgImg={heroImg.src} bgColor="bg-mid-purple">
      <Wrapper className={`max-w-3xl space-y-8 py-8 text-center text-white`}>
        <h1 className="font-nr text-h1 text-white sm:text-h1-sm md:text-h1-md">Monetize your skills with ease</h1>
        <p className={`text-lg lg:text-2xl`}>
          With ByteAlley, selling your products online is hassle-free. You can showcase your work and let us handle the
          backend tasks, allowing you to concentrate on what you do best.
        </p>
      </Wrapper>
      <Wrapper>
        <BlurImage priority alt={`dashboard`} width={1053} height={53} className={`h-auto w-auto`} src={dashboardImg} />
      </Wrapper>
    </Hero>
  );
};
