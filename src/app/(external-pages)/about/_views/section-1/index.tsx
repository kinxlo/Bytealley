import people from "@/images/external/about_people.svg";

import { DualLayout } from "~/app/(external-pages)/_components/layout/dual-layout";
import { DualSectionLayoutList } from "~/app/(external-pages)/_components/layout/dual-section-layout";
import { BlurImage } from "~/components/miscellaneous/blur-image";

export const SectionOne = () => {
  return (
    <DualLayout
      leftChild={
        <DualSectionLayoutList
          title="Our Story"
          headerClassName={`font-nr text-high-warning text-h1 sm:text-h1-sm md:text-h1-md`}
          subHeaderClassName={`text-high-purple xl:text-2xl`}
          subTitle={
            <div className={`space-y-3`}>
              <p>
                ByteAlley began with a simple idea: to create a platform where digital creators could easily share their
                products with the world.
              </p>
              <p>
                Founded by a team of tech enthusiasts and digital innovators, we set out to empower individuals to turn
                their creative ideas into successful digital businesses.
              </p>
            </div>
          }
          iconColor="text-blue-500"
          shouldShowButton
          buttonText={`Get Started`}
          buttonClassName={`bg-mid-warning text-black w-full`}
          className={`px-4 lg:w-[530px] xl:px-0`}
        />
      }
      rightChild={
        <BlurImage width={500} height={500} src={people} alt="img" className={"h-auto w-auto object-contain"} />
      }
      leftChildBgColor={"bg-low-purple"}
      rightChildBgColor={"bg-low-coral"}
      leftChildClassName={`flex items-center text-center lg:text-left`}
      rightChildClassName={`items-end`}
    />
  );
};
