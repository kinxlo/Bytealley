/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

import {
  FileUpload,
  FormField,
  Highlights,
  ImageUpload,
  MultiSelect,
  RadioCardGroup,
  RichTextEditor,
  ThumbNailUpload,
} from "~/components/common/FormFields";
import { ProductService } from "~/services/product/product.service";

export const ProductForm = ({ methods, service }: { methods: UseFormReturn<IProduct>; service: ProductService }) => {
  const searchParameters = useSearchParams();
  const productID = searchParameters.get("product_id");
  const productType = methods.watch("product_type");
  const [tags, setTags] = useState<{ value: string; label: string }[]>([]);

  const getProductTags = useCallback(async () => {
    const response = await service.getProductTags();
    if (response) {
      const formattrdTags = response.map((tag) => ({ value: tag, label: tag }));
      setTags(formattrdTags);
    }
  }, [service]);

  useEffect(() => {
    getProductTags();
  }, [getProductTags]);

  const getProductIfExist = useCallback(async () => {
    if (productID) {
      const product = await service.getProductById(productID);

      // setProduct(product || undefined);
      if (product) {
        methods.setValue("product_type", product.product_type);
        methods.setValue("title", product.title);
        methods.setValue("price", product.price);
        methods.setValue("discount_price", product.discount_price);
        methods.setValue("description", product.description);
        methods.setValue("highlights", product.highlights);
        methods.setValue("thumbnail", product.thumbnail);
        methods.setValue("cover_photos", product.cover_photos);
        methods.setValue("tags", product.tags);
        methods.setValue("assets", product.assets);
        methods.setValue("resource_link", product.resource_link);
        methods.setValue("portfolio_link", product.portfolio_link);
        // methods.setValue("category", product.category);
        // if (productType === "digital_product") {
        //   methods.setValue("assets", product.assets);
        // } else {
        //   methods.setValue("resource_link", product.resource_link);
        //   methods.setValue("portfolio_link", product.portfolio_link);
        // }
      }
    }
  }, []);

  useEffect(() => {
    if (productID) {
      getProductIfExist();
    }
  }, [getProductIfExist, productID]);

  return (
    <form className="space-y-[40px]">
      <section>
        <RadioCardGroup
          name="product_type"
          label="Product Type"
          options={[
            {
              value: "digital_product",
              label: "Digital Product",
              description: "Any set of files to download or stream",
              icon: "/images/digital_product_icon.svg",
            },
            {
              value: "skill_selling",
              label: "Skill Selling",
              description: "Let customers hire your services",
              icon: "/images/skill_selling_icon.svg",
            },
          ]}
          required
          className="h-[129px]"
        />
      </section>
      <section className="grid gap-4 sm:grid-cols-2">
        <FormField
          label="Title"
          name="title"
          placeholder={productType === "digital_product" ? "Product name" : "Skill name"}
          className={`h-12 bg-low-grey-III`}
          required
        />
        <FormField
          label="Category"
          name="category"
          type="select"
          placeholder="Select category"
          options={[
            { value: "Product", label: "Product" },
            // { value: "skill", label: "Skill" },
          ]}
          className={`h-12 bg-low-grey-III`}
          required
        />
        <FormField
          label="Price"
          name="price"
          type="number"
          placeholder="₦ 0.00"
          className={`h-12 bg-low-grey-III`}
          required
        />
        <FormField
          label="Discount Price"
          name="discount_price"
          type="number"
          placeholder="₦ 0.00 (optional)"
          className={`h-12 bg-low-grey-III`}
        />
      </section>
      <section>
        <RichTextEditor
          className={`h-[15rem]`}
          label="Description"
          name="description"
          placeholder="Enter description of your product"
        />
      </section>
      {productType === "digital_product" && (
        <section className={`pt-8`}>
          <FileUpload
            name="assets"
            label="Product Files"
            required
            maxFiles={4}
            acceptedFormats="application/pdf, video/mp4, image/jpeg, image/png, image/webp, image/gif, audio/mpeg, audio/wav"
            maxFileSize={100 * 1024 * 1024}
            initialValue={
              methods.getValues("assets") as unknown as {
                name: string;
                size: string;
                mime_type: string;
                extension: string;
              }[]
            }
          />
        </section>
      )}
      <section>
        <ImageUpload
          name="cover_photos"
          label="Cover Photo"
          required
          maxFiles={4}
          acceptedFormats="image/jpeg, image/png, image/webp, image/gif"
          maxFileSize={2 * 1024 * 1024}
          initialValue={methods.getValues("cover_photos")}
        />
      </section>
      {productType === "skill_selling" && (
        <section className="grid gap-4 lg:grid-cols-2">
          <Highlights name="resource_link" label="Resource Link" addButtonText={`Add more resource link`} />
          <FormField
            label="Portfolio Link"
            name="portfolio_link"
            placeholder="Enter portfolio link"
            className={`h-12 bg-low-grey-III`}
          />
        </section>
      )}
      <section className="grid gap-4 lg:grid-cols-2">
        <Highlights name="highlights" label="Highlights" />
        <ThumbNailUpload
          name="thumbnail"
          label="Thumbnail"
          required
          acceptedFormats="image/jpeg, image/png, image/webp, image/gif"
          maxFileSize={2 * 1024 * 1024}
          initialValue={methods.getValues("thumbnail")}
        />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <MultiSelect
          className={`h-12 bg-low-grey-III`}
          label="Tags"
          name="tags"
          options={tags}
          placeholder="Choose options"
          required
        />
      </section>
    </form>
  );
};
