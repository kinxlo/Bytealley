import Link from "next/link";
import React, { useEffect, useState } from "react";

import { Star } from "~/components/common/rating/star";
import { BlurImage } from "~/components/miscellaneous/blur-image";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { useDiscountCalculator } from "~/hooks/use-discount-calc";

interface CardProperties {
  width?: string;
  image: string;
  heading: string;
  rate?: number;
  price: number;
  publisher: string;
  productID: string;
  aggrRating?: number;
  discountPrice?: number;
}

export const CardComponent: React.FC<CardProperties> = ({
  width = "100%",
  image,
  heading,
  price,
  publisher,
  productID,
  aggrRating,
  discountPrice,
}) => {
  const { calculateDiscountPercentage } = useDiscountCalculator();
  const [discountPercentage, setDiscountPercentage] = useState<string>();

  useEffect(() => {
    if (discountPrice) {
      const result = calculateDiscountPercentage(price, discountPrice);
      if (result) {
        setDiscountPercentage(result.discount.toFixed(0));
      }
    }
  }, [calculateDiscountPercentage, discountPrice, price]);

  return (
    <Link href={`/explore/product/${productID}`}>
      <Card
        className={`flex min-h-[20rem] w-full flex-col items-start justify-between overflow-hidden p-2.5 hover:shadow-lg sm:w-[${width}]`}
      >
        {/* Image Section */}
        <div className="flex h-[12rem] w-full items-center justify-center overflow-hidden rounded-lg">
          <BlurImage
            src={image}
            alt={heading}
            width={300}
            height={200}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out hover:scale-105"
            priority
          />
        </div>

        <section className={`w-full`}>
          {/* Heading */}
          <h3 className="mt-3 line-clamp-2 text-xs font-bold text-high-grey-III lg:text-sm">{heading}</h3>

          {/* Publisher and Rating */}
          <div className="mt-2.5 flex w-full items-center justify-between">
            <p className="line-clamp-1 text-[10px] text-mid-grey-II lg:text-xs">By {publisher}</p>
            {aggrRating ? (
              <div className="flex items-center gap-1">
                <Star filled />
                <span className="text-xs text-gray-600">{aggrRating}</span>
              </div>
            ) : null}
          </div>

          {/* Price and Discount */}
          <div className="mt-2 flex w-full items-center justify-between">
            <div className="flex items-center gap-2">
              <p className="text-xs font-bold text-mid-purple lg:text-sm">
                ₦{discountPrice ? discountPrice.toLocaleString() : price.toLocaleString()}
              </p>
              {discountPrice ? (
                <p className="text-[10px] text-mid-danger line-through lg:text-xs">₦{price.toLocaleString()}</p>
              ) : null}
            </div>
            {discountPercentage && (
              <Badge className="rounded bg-low-warning px-2 py-1 text-[10px] text-black lg:text-xs">
                {-discountPercentage}%
              </Badge>
            )}
          </div>
        </section>
      </Card>
    </Link>
  );
};
