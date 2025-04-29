/* eslint-disable no-console */
"use client";

import { LucidePlusCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState, useTransition } from "react";

import Loading from "~/app/Loading";
import CustomButton from "~/components/common/common-button/common-button";
import { ReusableDialog } from "~/components/common/dialog/Dialog";
import { template } from "~/features/funnel";
import { WithDependency } from "~/HOC/withDependencies";
import { useSession } from "~/hooks/use-session";
import { fetchAllTemplates } from "~/lib/funnel";
import { ProductService } from "~/services/product/product.service";
import { dependencies } from "~/utils/dependencies";
import { TemplateCard } from "./template-card";

const BaseSelectFunnelModal = ({ productService }: { productService: ProductService }) => {
  const [isPending, startTransition] = useTransition();
  const { user } = useSession();
  const [isProduct, setProduct] = useState(false);
  const [templates, setTemplates] = useState<template[]>([]);

  useEffect(() => {
    startTransition(async () => {
      const response = await productService.getAllProducts({ status: `published` });
      if (response) {
        setProduct(response?.data?.length > 0);
      }
    });
  }, [productService]);

  useEffect(() => {
    startTransition(async () => {
      try {
        const data = await fetchAllTemplates();
        setTemplates(data);
      } catch (error) {
        console.error("Error fetching templates:", error);
      }
    });
  }, []);

  return (
    <ReusableDialog
      trigger={
        <CustomButton
          isLeftIconVisible
          icon={<LucidePlusCircle />}
          variant="primary"
          size="xl"
          className="w-full sm:w-auto"
        >
          New Funnel
        </CustomButton>
      }
      className="lg:min-w-[817px] lg:p-8"
      headerClassName="text-3xl"
      title={isProduct ? `Choose a Template` : ""}
      description={isProduct ? `Select a template to continue` : ""}
    >
      {isPending ? (
        <Loading text={`Loading templates...`} className={`w-fill h-fit p-20`} />
      ) : isProduct ? (
        <section className="grid w-full grid-cols-1 justify-between gap-4 p-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              templateID={template.id}
              image={template.thumbnail as unknown as string}
              text={`${template.id} template`}
            />
          ))}
        </section>
      ) : (
        <section className="text-center">
          <Image className="mx-auto" src="/images/alert.png" alt="alert" width={70} height={70} />
          <h4 className={`text-h3`}>You Haven’t Created any Product yet</h4>
          <p className="my-3 text-mid-grey-II">You must create a product in order to create a funnel</p>
          <CustomButton
            href={`/dashboard/${user?.id}/products/new`}
            variant="outline"
            size="xl"
            className="w-full border-primary text-xl text-mid-purple"
          >
            Create A Product
          </CustomButton>
        </section>
      )}
    </ReusableDialog>
  );
};

export const SelectFunnelModal = WithDependency(BaseSelectFunnelModal, {
  funnelService: dependencies.FUNNEL_SERVICE,
  productService: dependencies.PRODUCT_SERVICE,
});
