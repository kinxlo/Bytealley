"use client";

import { SectionLayout } from "~/app/(external-pages)/_components/layout/section-layout";
import CustomButton from "~/components/common/common-button/common-button";
import { BlurImage } from "~/components/miscellaneous/blur-image";
import { Card, CardContent } from "~/components/ui/card";
import { useSession } from "~/hooks/use-session";
import { cards } from "~/utils/constants";

export const SectionOne = () => {
  const { user } = useSession();

  return (
    <SectionLayout bgColor="bg-low-warning">
      <div className="py-10 md:py-28 lg:pb-48 lg:pt-72">
        <div className="flex flex-col gap-10 sm:gap-20 lg:flex-row">
          {/* Left Section */}
          <div className="flex flex-col justify-between text-center lg:w-[40%] lg:text-left">
            <h1 className="font-nr text-h1 text-high-warning sm:text-h1-sm md:text-h1-md">
              You can monetize everything
            </h1>
            <p className="mb-8 mt-8 text-lg font-light xl:text-2xl">
              Are you a digital artist, designer, writer, or developer looking to share your creations with the world
              and earn from your passion? Look no further! ByteAlley is the ultimate platform for creators like you.
            </p>
            {!user && (
              <div className="hidden lg:block">
                <CustomButton href="/auth" className={`w-full`} size={`xl`} variant={`primary`}>
                  Get Started
                </CustomButton>
              </div>
            )}
          </div>

          {/* Right Section - Cards */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:w-[60%]">
            {cards.map((card, index) => (
              <Card key={index} className="min-h-[248px] rounded-xl border border-black bg-white shadow-neob">
                <CardContent className="p-6">
                  <BlurImage
                    src={card.image}
                    alt={card.title}
                    width={100}
                    height={100}
                    className="h-auto w-auto rounded-lg"
                  />
                  <h2 className="mt-4 text-h4 font-semibold">{card.title}</h2>
                  <p className="mt-2 text-mid-grey-II">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </SectionLayout>
  );
};
