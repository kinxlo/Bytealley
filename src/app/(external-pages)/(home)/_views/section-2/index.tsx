import moneyTree from "@/images/external/money_tree.svg";

import {
  DualSectionLayout,
  DualSectionLayoutList,
} from "~/app/(external-pages)/_components/layout/dual-section-layout";

export const SectionTwo = () => {
  return (
    <DualSectionLayout
      img={moneyTree}
      imgClassName={`relative right-[5rem] xl:top-[5rem] 2xl:top-0`}
      height="xl:h-[641px]"
      leftSectionClassName="bg-high-purple items-center justify-end lg:pr-24 py-10 text-center lg:text-left"
      rightSectionClassName="bg-mid-purple"
    >
      <DualSectionLayoutList
        title="Everyone can Buy & Sell on ByteAlley"
        headerClassName={`text-white nr-font text-5xl xl:text-7xl`}
        subHeaderClassName={`text-white xl:text-2xl`}
        subTitle="Not really tech-savvy or just looking for a way to share that knowledge you think will be valuable to others, ByteAlley is here to cater to whatever your needs may be."
        iconColor="text-blue-500"
        className={`px-4 lg:w-[530px] xl:px-0`}
      />
    </DualSectionLayout>
  );
};
