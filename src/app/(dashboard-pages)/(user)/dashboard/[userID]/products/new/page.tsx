"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";

import CustomButton from "~/components/common/common-button/common-button";
import { ViewProductLayout } from "~/components/common/view-product-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { WithDependency } from "~/HOC/withDependencies";
import { ProductFormSchema } from "~/schemas";
import { ProductService } from "~/services/product/product.service";
import { useProductService } from "~/services/product/use-product-service";
import { dependencies } from "~/utils/dependencies";
import { Toast } from "~/utils/notificationManager";
import { cn } from "~/utils/utils";
import { ProductForm } from "./_views/product-form";
import { ShareProductView } from "./_views/share-product";

const Page = ({ params, productService }: { params: { userID: string }; productService: ProductService }) => {
  const router = useRouter();
  const searchParameters = useSearchParams();
  const [isPublishing, startTransition] = useTransition();
  const { useCreateProduct, useUpdateProduct, usePublishProduct } = useProductService();

  const currentTab = searchParameters.get("tab") || "product-details";
  const productID = searchParameters.get("product_id") || "";
  const productStatus = searchParameters.get("status") || "";

  const methods = useForm<IProduct>({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      product_type: "digital_product",
      title: "",
      category: "Product",
      price: 0,
      discount_price: 0,
      description: "",
      assets: [],
      cover_photos: [],
      highlights: [],
      thumbnail: null,
      resource_link: [],
      portfolio_link: "",
      tags: [],
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting, isValid },
  } = methods;

  const { mutate: createProduct } = useCreateProduct();

  const { mutate: updateProduct } = useUpdateProduct();

  const publishMutation = usePublishProduct();

  const onSubmit = (data: IProduct) => {
    const filterFiles = (items: (string | File | { extension?: string; size?: string })[]): File[] => {
      return items.filter((item) => item instanceof File) as File[];
    };

    const commonFields = {
      product_type: data.product_type,
      title: data.title,
      category: data.category,
      price: data.price,
      discount_price: data.discount_price,
      description: data.description,
      cover_photos: filterFiles(data.cover_photos),
      thumbnail: data.thumbnail instanceof File ? data.thumbnail : null,
      highlights: data.highlights,
      tags: data.tags,
    };

    const productSpecificFields =
      data.product_type === "digital_product"
        ? { assets: filterFiles(data.assets || []) }
        : {
            resource_link: data.resource_link,
            portfolio_link: data.portfolio_link,
          };

    const productData = { ...commonFields, ...productSpecificFields };

    if (productID) {
      updateProduct({ data: productData, productId: productID });
      Toast.getInstance().showToast({
        title: "Success",
        description: `Product updated successfully! You can now preview and publish it.`,
        variant: "success",
      });
      router.push(`/dashboard/${params.userID}/products/new?tab=preview&product_id=${productID}`);
    } else {
      createProduct(productData);
      Toast.getInstance().showToast({
        title: "Success",
        description: `Product created successfully! You can now preview and publish it.`,
        variant: "success",
      });
      router.push(`/dashboard/${params.userID}/products/new?tab=preview&product_id=${productID}`);
    }
  };

  const handlePublish = () => {
    startTransition(async () => {
      const product = await publishMutation.mutateAsync(productID);
      Toast.getInstance().showToast({
        title: "Success",
        description: `Product "${product?.title}" published successfully!`,
        variant: "success",
      });
      router.push(
        `/dashboard/${params.userID}/products/new?tab=share&product_id=${product?.id}&status=${product?.status}`,
      );
    });
  };

  const handleUnpublish = () => {
    startTransition(async () => {
      const product = await publishMutation.mutateAsync(productID);
      Toast.getInstance().showToast({
        title: "Success",
        description: `Product "${product?.title}" unpublished successfully!`,
        variant: "success",
      });
      router.push(
        `/dashboard/${params.userID}/products/new?tab=share&product_id=${product?.id}&status=${product?.status}`,
      );
    });
  };

  return (
    <section>
      <FormProvider {...methods}>
        <Tabs value={currentTab} className="w-full">
          <TabsList className="border-bottom z-10 mb-8 flex h-fit w-full flex-col-reverse gap-4 rounded-none bg-transparent p-0 sm:flex-row sm:items-center sm:justify-between lg:h-[58px]">
            <section className="flex w-full flex-wrap items-center gap-2 sm:h-[5rem] sm:w-auto sm:flex-nowrap sm:gap-0 xl:h-full">
              <TabsTrigger
                value="product-details"
                className="relative h-full min-w-[100px] shrink-0 rounded-none border-transparent px-3 text-sm disabled:text-black data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
              >
                Product Details
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
                  data-state={currentTab === "product-details" ? "active" : "inactive"}
                />
              </TabsTrigger>
              <TabsTrigger
                value="preview"
                className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
              >
                Preview
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
                  data-state={currentTab === "preview" ? "active" : "inactive"}
                />
              </TabsTrigger>
              <TabsTrigger
                value="share"
                className="relative h-full min-w-[80px] shrink-0 rounded-none border-transparent px-3 text-sm data-[state=active]:bg-transparent data-[state=active]:shadow-none sm:px-4"
              >
                Share
                <span
                  className="absolute bottom-0 left-0 right-0 h-[2px] scale-x-0 bg-primary transition-transform duration-200 data-[state=active]:scale-x-100"
                  data-state={currentTab === "share" ? "active" : "inactive"}
                />
              </TabsTrigger>
            </section>
            <section className="flex w-full items-center justify-end gap-4 sm:w-auto">
              {currentTab === "product-details" && (
                <>
                  <CustomButton
                    size="xl"
                    variant="outline"
                    className="w-full border-destructive text-destructive sm:w-auto"
                    onClick={() => {
                      methods.reset();
                    }}
                    isDisabled={isSubmitting}
                  >
                    Cancel
                  </CustomButton>
                  {productID ? (
                    <CustomButton
                      variant="primary"
                      size="xl"
                      className="w-full sm:w-auto"
                      onClick={handleSubmit(onSubmit)}
                      isDisabled={isSubmitting}
                      isLoading={isSubmitting}
                    >
                      Update & Continue
                    </CustomButton>
                  ) : (
                    <CustomButton
                      variant="primary"
                      size="xl"
                      className="w-full sm:w-auto"
                      onClick={handleSubmit(onSubmit)}
                      isDisabled={isSubmitting || !isValid}
                      isLoading={isSubmitting}
                    >
                      Save & Continue
                    </CustomButton>
                  )}
                </>
              )}
              {currentTab === "preview" && (
                <>
                  <CustomButton
                    variant="outline"
                    size="xl"
                    className="w-full border-destructive text-destructive sm:w-auto"
                    onClick={() => {
                      router.push(`/dashboard/${params.userID}/products?tab=drafts`);
                    }}
                    isDisabled={isSubmitting}
                  >
                    Cancel
                  </CustomButton>
                  {productStatus === "published" ? (
                    <CustomButton
                      variant="primary"
                      size="xl"
                      className="w-full sm:w-auto"
                      onClick={handleUnpublish}
                      isDisabled={isPublishing}
                      isLoading={isPublishing}
                    >
                      Unpublish & Continue
                    </CustomButton>
                  ) : (
                    <CustomButton
                      variant="primary"
                      size="xl"
                      className="w-full sm:w-auto"
                      onClick={handlePublish}
                      isDisabled={isPublishing || !productID}
                      isLoading={isPublishing}
                    >
                      Publish & Continue
                    </CustomButton>
                  )}
                </>
              )}
              {currentTab === "share" && (
                <>
                  <CustomButton
                    variant="outline"
                    size="xl"
                    className={cn(
                      "w-full sm:w-auto",
                      productStatus === `published` && "border-danger text-danger",
                      productStatus === `unpublished` && "border-primary text-primary",
                    )}
                    onClick={productStatus === `published` ? handleUnpublish : handlePublish}
                    isDisabled={isSubmitting}
                    isLoading={isPublishing}
                  >
                    {productStatus === `published` ? "Unpublish" : "Publish"}
                  </CustomButton>
                  <CustomButton
                    variant="primary"
                    size="xl"
                    className="w-full sm:w-auto"
                    isDisabled={isSubmitting}
                    isLoading={isSubmitting}
                    onClick={() => {
                      router.push(`/dashboard/${params.userID}/products?tab=all-products`);
                    }}
                  >
                    Close
                  </CustomButton>
                </>
              )}
            </section>
          </TabsList>

          {/* Tab Content */}
          <TabsContent value="product-details">
            <ProductForm methods={methods} service={productService} />
          </TabsContent>
          <TabsContent value="preview">
            <ViewProductLayout productService={productService} />
          </TabsContent>
          <TabsContent value="share">
            <ShareProductView productId={productID} productService={productService} />
          </TabsContent>
        </Tabs>
      </FormProvider>
    </section>
  );
};

const NewProductsPage = WithDependency(Page, {
  productService: dependencies.PRODUCT_SERVICE,
});

export default NewProductsPage;
