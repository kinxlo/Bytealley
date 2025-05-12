import React from "react";

import CustomButton from "~/components/common/common-button/common-button";
import { Wrapper } from "~/components/layout/wrapper";
import { cn } from "~/utils/utils";

interface SharedSectionProperties {
  title: string;
  desc: string;
  btnText: string;
}

export const SharedSection: React.FC<SharedSectionProperties> = ({ title, desc, btnText }) => {
  return (
    <div className="bg-mid-purple py-20">
      <Wrapper className="mx-auto max-w-[70rem] text-center text-low-purple">
        <h2 className="font-nr text-h2 text-white sm:text-h2-sm md:text-h2-md lg:text-5xl">{title}</h2>
        <p className="mx-auto my-5 max-w-[45rem] text-lg font-light text-white lg:text-2xl">{desc}</p>
        <CustomButton
          className={cn("h-14 w-full rounded-md bg-mid-warning text-sm text-black xl:w-fit xl:text-xl", {
            "cursor-not-allowed opacity-50": btnText.includes("Join"),
          })}
          isDisabled={btnText.includes("Join")}
          variant="primary"
          href="/auth/login"
        >
          {btnText}
        </CustomButton>
      </Wrapper>
    </div>
  );
};
