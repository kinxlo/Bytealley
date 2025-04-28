/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import empty1 from "@/images/alert.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { BackNavigator } from "~/app/(dashboard-pages)/_components/back-navigator";
import { EmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import Loading from "~/app/Loading";
import { UniversalSwiper } from "~/components/common/carousel";
import CustomButton from "~/components/common/common-button/common-button";
import { StarRating } from "~/components/common/rating/star";
import { SetToolTip } from "~/components/common/tool-tip";
import { Wrapper } from "~/components/layout/wrapper";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { WithDependency } from "~/HOC/withDependencies";
import { useCart } from "~/hooks/use-cart";
import { useSession } from "~/hooks/use-session";
import { AppService } from "~/services/app.service";
import { dependencies } from "~/utils/dependencies";
import { cn } from "~/utils/utils";

const ProductPreview = ({ appService, params }: { appService: AppService; params: { slug: string } }) => {
  const slug = params.slug;
  const [isdataPending, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const [product, setProduct] = useState<IProduct | null>(null);
  const [productReview, setProductReview] = useState<any[]>([]);
  const { user } = useSession();
  const { addToCart, isAddToCartPending, isAddToCartWithRoutePending, addToCartWithRoute } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      startTransition(async () => {
        const [productData, reviewData] = await Promise.all([
          appService.getProductBySlug(slug),
          appService.getProductReviews(slug),
        ]);
        if (productData) {
          setProduct(productData);
        }
        setProductReview(reviewData);
      });
    };

    if (slug) {
      fetchData();
    }
  }, [appService, slug]);

  if (isdataPending) {
    return <Loading text={`Loading ${slug} details...`} className="h-screen w-full p-20" />;
  }

  const description = product?.description || "No description available.";
  const isLongDescription = description.trim().split(" ").length > 10;

  return (
    <Wrapper className="my-20 grid grid-cols-1 gap-6 rounded-lg md:grid-cols-12">
      {/* Main Content Section */}
      <main className="md:col-span-8">
        <section className="mb-5 flex flex-col justify-between space-y-4 md:flex-row md:space-y-0 lg:items-center">
          <BackNavigator text="Back" />
        </section>
        {/* Product Image and Header */}
        <header className="mb-4">
          <UniversalSwiper
            className={`mb-4 h-48 w-full rounded-md border bg-gray-100 md:h-[263px]`}
            items={product?.cover_photos || []}
            renderItem={(image, index) => (
              <div className="relative h-48 w-full md:h-[263px]">
                <Image
                  src={image}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="rounded-md object-cover"
                  priority={index === 0}
                />
              </div>
            )}
            swiperOptions={{
              loop: true,
              autoplay: { delay: 5000 },
            }}
            showNavigation
            navigationVariant="minimal"
          />
          <div className="rounded-md border p-4">
            <h4 className="mb-2 text-h4 sm:text-h3-sm md:text-h3-md">{product?.title}</h4>
            <div className="flex items-center gap-2">
              <Avatar className="relative z-[-1] h-6 w-6">
                <AvatarImage src={typeof product?.publisher?.avatar === "string" ? product.publisher?.avatar : ""} />
                <AvatarFallback>{product?.publisher?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs font-bold lg:text-[16px]">{product?.publisher?.name}</span>
              <StarRating size={`md:text-4xl`} rating={product?.avg_rating} />
              <span className="text-xs font-bold lg:text-[16px]">{product?.avg_rating} ratings</span>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className="mb-4 rounded-md border p-4">
          <h5 className="mb-4 border-b py-4 text-h5 font-bold text-high-grey-III">Features</h5>
          <ul className="list-inside list-disc space-y-4 text-gray-700">
            {product?.highlights.map((highlight, index) => <p key={index}>✔️ {highlight}</p>)}
          </ul>
        </section>

        {/* Description Section */}
        <section className="mb-4 rounded-md border p-4">
          <h5 className="mb-4 border-b py-4 text-h5 font-bold text-high-grey-III">Description</h5>
          <div>
            <p
              className={cn("text-gray-700 transition-all duration-300", {
                "line-clamp-3": !isExpanded,
              })}
            >
              <span dangerouslySetInnerHTML={{ __html: description }} />
            </p>
            {isLongDescription && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-blue-500 hover:underline focus:outline-none"
                aria-expanded={isExpanded}
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Sidebar Section */}
      <aside className="md:col-span-4">
        <div className="sticky top-28 space-y-4">
          {/* Price and Action Buttons */}
          <section className="rounded-md border p-4">
            <div className="mb-8">
              <div className="flex items-center justify-between rounded-md bg-low-purple p-2">
                <p className="font-semibold">Sold</p>
                <p className="text-sm font-semibold">{product?.total_sales}</p>
              </div>
              <div className="mb-7 mt-4 flex items-center gap-2">
                <span className="text-2xl font-bold">
                  ₦
                  {(product?.discount_price ?? 0) > 0
                    ? product?.discount_price?.toLocaleString()
                    : product?.price?.toLocaleString()}
                </span>
                {!!product?.discount_price && (
                  <span className="text-destructive line-through">₦{product?.price.toLocaleString()}</span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <SetToolTip content={"You need to be logged in to purchase product"}>
                  <CustomButton
                    size={`xl`}
                    isLoading={isAddToCartPending}
                    isDisabled={user?.name === product?.publisher || isAddToCartPending}
                    variant="primary"
                    className={cn({ "cursor-not-allowed": user?.name === product?.publisher })}
                    onClick={() => addToCart(slug, 1)}
                  >
                    Add to Cart
                  </CustomButton>
                </SetToolTip>
                <SetToolTip content={"You need to be logged in to purchase product"}>
                  <CustomButton
                    size={`xl`}
                    isLoading={isAddToCartWithRoutePending}
                    isDisabled={user?.name === product?.publisher || isAddToCartPending}
                    onClick={() => {
                      addToCartWithRoute(slug, 1);
                      router.push(`/explore/cart`);
                    }}
                    variant="outline"
                    className={cn(
                      { "cursor-not-allowed": user?.name === product?.publisher },
                      "border-primary text-primary",
                    )}
                  >
                    Buy Now
                  </CustomButton>
                </SetToolTip>
              </div>
            </div>

            {/* Product Includes Section */}
            <div>
              <h5 className="mb-4 border-b py-4 text-h5 font-bold text-high-grey-III">The Product Includes</h5>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Format</span>
                  <span className={"space-x-1"}>
                    {product?.assets?.map((asset, index) => {
                      if (typeof asset === "object" && "extension" in asset) {
                        return <span key={index}>{asset.extension} |</span>;
                      }
                      return null;
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between capitalize">
                  <span>Product Type</span>
                  <span>{product?.product_type.replace("_", " ")}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>File Size</span>
                  <span className={"space-x-1"}>
                    {product?.assets?.map((asset, index) => {
                      if (typeof asset === "object" && "size" in asset) {
                        return <span key={index}>{asset.size} |</span>;
                      }
                      return null;
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Resources</span>
                  <span>{product?.assets?.length}</span>
                </div>
              </div>
              {/* <div className="mt-4 flex items-center gap-4">
              <p className="text-sm font-semibold">Share</p>
              <p className="text-sm font-semibold">Give as Gift</p>
            </div> */}
            </div>
          </section>

          {/* Product Reviews Section */}
          <section className="mt-4 rounded-md border p-4">
            <div className="mb-4 flex items-center justify-between border-b pb-4">
              <h5 className="text-h5 font-bold text-high-grey-III">Product Reviews</h5>
              <p className="text-sm font-semibold text-mid-grey-II">{productReview?.length} reviews</p>
            </div>
            <div className="space-y-4">
              {productReview?.length > 0 ? (
                productReview.map((review, index) => (
                  <div key={index}>
                    <p className="text-sm">{review.comment}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={review.user.logo} />
                          <AvatarFallback>{review.user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="text-[10px] font-semibold capitalize">{review.user.name}</p>
                      </div>
                      <StarRating size="text-xs" rating={review.rating} />
                      <p className="text-[10px]">{new Date(review.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))
              ) : (
                <EmptyState
                  title="No Comments yet."
                  description="There are no reviews available for this product."
                  images={[{ src: empty1.src, alt: "Empty product", width: 50, height: 50 }]}
                />
              )}
            </div>
          </section>
        </div>
      </aside>
    </Wrapper>
  );
};

const ProductView = WithDependency(ProductPreview, {
  appService: dependencies.APP_SERVICE,
});

export default ProductView;
