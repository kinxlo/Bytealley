"use client";

import { useEffect, useState, useTransition } from "react";

import { CopyAction } from "~/app/(dashboard-pages)/_components/copy-action";
import Loading from "~/app/Loading";
import { BlurImage } from "~/components/miscellaneous/blur-image";
import { ProductService } from "~/services/product/product.service";
import { cn } from "~/utils/utils";

type ShareProductViewProperties = {
  productId: string;
  productService: ProductService;
};

export const ShareProductView = ({ productId, productService }: ShareProductViewProperties) => {
  const [product, setProduct] = useState<IProduct>();
  const [isPending, startTransition] = useTransition();
  useEffect(() => {
    const fetchProduct = () => {
      startTransition(async () => {
        const productData = await productService.getProductById(productId);
        setProduct(productData);
      });
    };

    fetchProduct();
  }, [productId, productService]);

  if (isPending) {
    return <Loading />;
  }

  if (!product?.link) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-center text-muted-foreground">No product link available</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6 p-4 md:p-6">
      {/* Product Card */}
      <div className="w-full max-w-[542px] space-y-6">
        <div className="space-y-2 rounded-md border-default p-2 transition-all">
          <div className="h-[197px] w-full rounded-md bg-muted">
            <BlurImage
              src={typeof product.thumbnail === "string" ? product.thumbnail : ""}
              alt={product.title}
              width={542}
              height={197}
              className="h-full w-full object-contain"
            />
          </div>
          <div className="space-y-2">
            <p className="truncate text-center font-semibold">{product.title}</p>
            <p className="text-center font-semibold">N{product.price.toLocaleString()}</p>
          </div>
        </div>

        {/* Success Message */}
        <div className="space-y-3 text-center">
          <h2 className="text-h4 font-bold sm:text-h4-sm">
            Product {product.status === `published` ? `published` : `unpublished`} Successfully!
          </h2>
          <p hidden={product.status !== `published`} className={`text-mid-grey-III`}>
            Share this link with others to let them purchase your product
          </p>
        </div>

        {/* Link Container */}
        <div
          className={cn(
            "flex w-full flex-col gap-4 rounded-lg border-default bg-low-grey-III p-2 md:flex-row md:items-center md:justify-between",
            product.status !== `published` && "hidden",
          )}
        >
          <p className="flex-1 truncate text-sm text-foreground/80">{product.link}</p>
          <CopyAction textToCopy={product.link} className="w-full md:w-auto" />
        </div>
      </div>
    </div>
  );
};
