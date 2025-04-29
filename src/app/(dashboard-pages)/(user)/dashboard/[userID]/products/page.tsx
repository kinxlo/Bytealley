"use client";

import { LucidePlusCircle } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import CustomButton from "~/components/common/common-button/common-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WithDependency } from "~/HOC/withDependencies";
import { ProductService } from "~/services/product/product.service";
import { dependencies } from "~/utils/dependencies";
import { AllProducts } from "./_views/all-products";
import { DeletedProducts } from "./_views/deleted-products";
import { DraftProducts } from "./_views/draft-products";
import { LiveProducts } from "./_views/live-products";

const Page = ({ productService, params }: { productService: ProductService; params: { userID: string } }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParameters = useSearchParams();

  const currentTab = searchParameters.get("tab") || "all-products";

  const onTabChange = (value: string) => {
    const parameters = new URLSearchParams(searchParameters);
    parameters.set("tab", value);
    router.replace(`${pathname}?${parameters.toString()}`, { scroll: false });
  };

  return (
    <Tabs value={currentTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="border-bottom mb-8 flex h-fit w-full flex-col-reverse gap-4 rounded-none bg-transparent p-0 sm:h-[58px] sm:flex-row sm:items-center sm:justify-between lg:h-[58px]">
        <section className="flex h-full w-full flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap sm:gap-0">
          <TabsTrigger
            value="all-products"
            className="relative h-full min-w-[100px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
          >
            All Product
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
              data-state={currentTab === "all-products" ? "active" : "inactive"}
            />
          </TabsTrigger>
          <TabsTrigger
            value="live"
            className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
          >
            Live
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
              data-state={currentTab === "live" ? "active" : "inactive"}
            />
          </TabsTrigger>
          <TabsTrigger
            value="drafts"
            className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
          >
            Drafts
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
              data-state={currentTab === "drafts" ? "active" : "inactive"}
            />
          </TabsTrigger>
          <TabsTrigger
            value="deleted"
            className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
          >
            Deleted
            <span
              className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
              data-state={currentTab === "deleted" ? "active" : "inactive"}
            />
          </TabsTrigger>
        </section>
        <section className="w-full sm:w-auto">
          <CustomButton
            isLeftIconVisible
            icon={<LucidePlusCircle />}
            variant="primary"
            size="xl"
            className="w-full sm:w-auto"
            href={`/dashboard/${params.userID}/products/new`}
          >
            New Product
          </CustomButton>
        </section>
      </TabsList>

      {/* tab content */}
      <TabsContent value="all-products">
        <AllProducts />
      </TabsContent>
      <TabsContent value="live">
        <LiveProducts productService={productService} />
      </TabsContent>
      <TabsContent value="drafts">
        <DraftProducts productService={productService} />
      </TabsContent>
      <TabsContent value="deleted">
        <DeletedProducts productService={productService} />
      </TabsContent>
    </Tabs>
  );
};

const ProductsPage = WithDependency(Page, {
  productService: dependencies.PRODUCT_SERVICE,
});

export default ProductsPage;
