import dashboardImg from "@/images/external/dashboard_img.svg";

import { DualLayout } from "~/app/(external-pages)/_components/layout/dual-layout";
import { DualSectionLayoutList } from "~/app/(external-pages)/_components/layout/dual-section-layout";
import { BlurImage } from "~/components/miscellaneous/blur-image";

export const SectionTwo = () => {
  return (
    <DualLayout
      leftChild={
        <DualSectionLayoutList
          title="Create products with ease"
          headerClassName={`text-high-purple font-nr text-h1 sm:text-h1-sm md:text-h1-md`}
          subHeaderClassName={`text-high-purple xl:text-2xl`}
          subTitle="Products can be easily created on our platform without stress no matter what it is and how tech savvy or not you are."
          listItems={["Receive money from anywhere."]}
          iconColor="text-blue-500"
          shouldShowButton
          buttonText={`Get Started`}
          buttonClassName={`bg-mid-warning text-black w-full`}
        />
      }
      rightChild={
        <BlurImage width={500} height={500} src={dashboardImg} alt="img" className={"h-auto w-auto object-contain"} />
      }
      leftChildBgColor={"bg-low-purple"}
      rightChildBgColor={"bg-high-grey-II"}
      leftChildClassName={`flex items-center`}
      rightChildClassName={`items-center`}
    />
  );
};
