"use client";

import React from "react";

import { Wrapper } from "~/components/layout/wrapper";
import { homeSteps } from "~/utils/constants";
import { StepCard } from "./_components/step-card";

export const SectionThree: React.FC = () => {
  return (
    <section className="bg-mid-coral py-24">
      <Wrapper>
        <Wrapper className={`max-w-[800px] text-center`}>
          <h1 className="mb-4 font-nr text-h1 text-white sm:text-h1-sm md:text-h1-md">
            Start monetizing in 4 simple steps
          </h1>

          <p className="text-lg font-light text-white lg:text-2xl">
            You can easily reach a broader audience, increase your sales, and build your brand. Monetize everything with
            ByteAlley and unleash your full potential!
          </p>
        </Wrapper>
        <Wrapper className="px-4 py-20 xl:px-0">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            {homeSteps.map((step, index) => (
              <StepCard key={index} title={step.title} description={step.description} imageSrc={step.imageSrc} />
            ))}
          </div>
        </Wrapper>
      </Wrapper>
    </section>
  );
};
