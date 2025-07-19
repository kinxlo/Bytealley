/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";

import CustomButton from "~/components/common/common-button/common-button";
import { FileUpload, FormField, ThumbNailUpload } from "~/components/common/FormFields";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { FunnelService } from "~/features/funnel";
import { WithDependency } from "~/HOC/withDependencies";
import { useSession } from "~/hooks/use-session";
import { FunnelFormData, funnelSchema } from "~/schemas";
import { ProductService } from "~/services/product/product.service";
import { dependencies } from "~/utils/dependencies";
import { Toast } from "~/utils/notificationManager";
import { cn } from "~/utils/utils";

const BaseFunnelForm = ({
  funnelService,
  productService,
  editor,
}: {
  funnelService: FunnelService;
  productService: ProductService;
  editor: any;
}) => {
  const router = useRouter();
  const { user } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPublishPending, startPublishTransition] = useTransition();
  const [isDraftPending, startDraftTransition] = useTransition();
  const [funnel, setFunnel] = useState<any>();
  const [formatedData, setFormattedData] = useState<any>();
  const [products, setProducts] = useState<{ value: string; label: string; thumbnail: string | File | null }[]>([]);
  const [isSingleProductTemplate, setIsSingleProductTemplate] = useState(false);

  // Check template ID from URL params
  useEffect(() => {
    const searchParameters = new URLSearchParams(window.location.search);
    const templateID = searchParameters.get("templateID");
    setIsSingleProductTemplate(templateID === "single-product-sale");
  }, []);

  const methods = useForm<FunnelFormData>({
    resolver: zodResolver(funnelSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      product_id: "",
      thumbnail: null,
      assets: [],
      upsell_funnel_id: "",
      bump_up_products: "",
    },
  });

  const {
    handleSubmit,
    reset,
    formState: { isValid },
  } = methods;

  useEffect(() => {
    const pages = editor.Pages.getAll();
    if (pages.length === 0) return;
    const templates = pages.map((page: any) => {
      const pageId = page.getId();
      const pageName = page.get("name") || `Page ${pageId}`;
      editor.Pages.select(pageId);
      const html = editor.getHtml();
      const css = editor.getCss();
      return {
        id: pageId,
        name: pageName,
        content: `<!DOCTYPE html>
                <html lang="en">
                <head><style>${css}</style></head>
                <body>${html}</body>
                </html>`,
        style: ``,
      };
    });
    const result = { pages: templates.filter(Boolean) };
    setFunnel(result);
  }, []);

  useEffect(() => {
    const doProductExist = async () => {
      const response = await productService.getAllProducts({ status: `published` });
      if (response) {
        const formatedProduct = response.data.map((product) => {
          return {
            value: product.id,
            label: product.title,
            thumbnail: product.thumbnail,
          };
        });
        setProducts(formatedProduct);
      }
    };
    doProductExist();
  }, [productService]);

  const handleSubmitForm = async (data: FunnelFormData & { upsell_funnel_id?: string }) => {
    const formatedData = {
      ...data,
      bump_up_products: isSingleProductTemplate ? [] : [data.bump_up_products], // Empty array if single product template
      funnel,
    };
    setFormattedData(formatedData);
    setIsDialogOpen(true);
  };

  const handlePublish = () => {
    startPublishTransition(async () => {
      const response = await funnelService.publishFunnel(formatedData);
      if (response) {
        Toast.getInstance().showToast({
          title: "Funnel status",
          description: `Funnel successfully published`,
          variant: "default",
        });
        reset();
        setIsDialogOpen(false);
        router.push(`/dashboard/${user?.id}/funnels`);
      }
    });
  };

  const handleSaveToDraft = () => {
    startDraftTransition(async () => {
      const response = await funnelService.saveFunnelToDraft(formatedData);
      if (response) {
        Toast.getInstance().showToast({
          title: "Funnel status",
          description: `Funnel successfully saved to draft`,
          variant: "default",
        });
        reset();
        setIsDialogOpen(false);
        router.push(`/dashboard/${user?.id}/funnels`);
      }
    });
  };

  return (
    <section>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSubmitForm)}>
          <section className={cn(`mt-4 space-y-6 overflow-y-auto p-2`)}>
            <FormField
              label="Title"
              name="title"
              placeholder="Funnel name"
              className={`h-12 bg-low-grey-III`}
              required
            />

            <ThumbNailUpload
              label={`Thumbnail`}
              labelText={``}
              name="thumbnail"
              acceptedFormats="image/jpeg, image/png"
              maxFileSize={2 * 1024 * 1024}
            />

            <FormField
              type={`select`}
              className={`h-12 bg-low-grey-III`}
              label="Products"
              name="product_id"
              options={products}
              placeholder="Choose a product"
              required
            />

            <FormField
              type={`select`}
              className={`h-12 bg-low-grey-III`}
              label="Order Bump"
              name="bump_up_products"
              options={products}
              placeholder="Choose a product (optional)"
              disabled={isSingleProductTemplate} // Disabled when single product template
            />

            <FileUpload
              name="assets"
              label="Files Upload"
              required
              maxFiles={4}
              acceptedFormats="application/pdf, video/mp4"
              maxFileSize={100 * 1024 * 1024}
            />
          </section>

          <div className={`flex items-center gap-4 pt-6`}>
            <CustomButton
              size={`xl`}
              variant={`outline`}
              className="w-full border-mid-danger text-mid-danger"
              onClick={(event) => {
                event.preventDefault();
                reset();
              }}
            >
              Cancel
            </CustomButton>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <CustomButton isDisabled={!isValid} size={`xl`} variant={`primary`} type="submit" className="w-full">
                  Save and Continue
                </CustomButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Do you wish to publish this funnel?</DialogTitle>
                </DialogHeader>
                <div className="mt-4 flex gap-4">
                  <CustomButton
                    isDisabled={isPublishPending || isDraftPending}
                    isLoading={isPublishPending}
                    size={`xl`}
                    className={`w-full`}
                    variant="primary"
                    onClick={handlePublish}
                  >
                    Publish
                  </CustomButton>
                  <CustomButton
                    isDisabled={isDraftPending || isPublishPending}
                    isLoading={isDraftPending}
                    size={`xl`}
                    className={`w-full`}
                    variant="outline"
                    onClick={handleSaveToDraft}
                  >
                    Save to Draft
                  </CustomButton>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </form>
      </FormProvider>
    </section>
  );
};

export const FunnelForm = WithDependency(BaseFunnelForm, {
  funnelService: dependencies.FUNNEL_SERVICE,
  productService: dependencies.PRODUCT_SERVICE,
});
