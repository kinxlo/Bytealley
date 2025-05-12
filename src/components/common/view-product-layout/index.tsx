/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import empty1 from "@/images/alert.png";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { EmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { useSession } from "~/hooks/use-session";
import { cn } from "~/utils/utils";
import { UniversalSwiper } from "../carousel";
import CustomButton from "../common-button/common-button";
import { StarRating } from "../rating/star";

export function ViewProductLayout({ productService }: { productService: any }) {
  const searchParameters = useSearchParams();
  const productID = searchParameters.get("product_id");
  const router = useRouter();
  const [product, setProduct] = useState<IProduct>();
  const { user } = useSession();

  useEffect(() => {
    const fetchProduct = async () => {
      if (productID) {
        const product = await productService.getProductById(productID);
        setProduct(product);
      }
    };
    fetchProduct();
  }, [productID, productService]);

  const [isExpanded, setIsExpanded] = useState(false);

  const description = `Lorem ipsum eurolip: viva nyvir terast, beligi. Tinyng dena pros tetragisala, dar ultraska astrodadis. Ninca
    bizonnat sydovie och disejortad, reel och nektigt epogisk fagsik endotet ifall trernfaktisk dobektig.
    Jumbeat digital villing variet. Intravasse autongen nagon, nöselingbar egorad, innan vytöra datas som
    tiverar, tar. Koktiga ortoktig om spogi phippo padio gon eper. Sed konsejo gol och olisi plåtiga att fara,
    sedat i ren i takvisnins. Juje sasseligi en att tiivis utom trefaleries beprecis i homoliga i onale, den
    nesade radiocepiton. Synt mis ansam lelingar i kroheten att sotögen att egojusonde i rom respektive kontrad
    mikrossa mitfoligt. Miv dinur och blikad, seda om än kvasiit öna. Al etnovalens resultat problem aktivitet
    med. Ete: normen avsed i homet på kunst presenter. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolore hic voluptate tempora laudantium
	aperiam sunt sint accusantium doloremque, itaque asperiores ab excepturi blanditiis veniam, minima debitis impedit, reiciendis eligendi id. Lorem ipsum`;

  const isLongDescription = description.trim().split(" ").length > 10;

  if (!product) {
    return (
      <EmptyState
        images={[{ src: empty1.src, alt: "Empty product", width: 100, height: 100 }]}
        title="Ops!"
        description="No product found."
        button={{
          text: "Add New Product",
          onClick: () => {
            router.push(`/dashboard/${user?.id}/products/new`);
          },
        }}
      />
    );
  }

  return (
    <section className="mx-auto grid max-w-[990px] grid-cols-1 gap-6 rounded-lg md:grid-cols-12">
      {/* Main Content Section */}
      <main className="md:col-span-8">
        {/* Product Image and Header */}
        <header className="mb-4">
          <UniversalSwiper
            className={`mb-4 h-48 w-full rounded-md border-default bg-gray-100 md:h-[263px]`}
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
          <div className={`rounded-md border-default p-4`}>
            <h4 className="mb-2 text-h4 sm:text-h3-sm md:text-h3-md">{product?.title}</h4>
            <div className="flex items-center gap-2">
              <p className="flex items-center gap-2">
                <Avatar className="relative z-[-1] h-6 w-6 border-default">
                  <AvatarImage src={user?.logo || ""} />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className={`text-xs font-bold lg:text-[16px]`}>{user?.name}</span>
              </p>
              <div className="flex items-center gap-2">
                <StarRating rating={product?.avg_rating} />
                <span className="text-xs font-bold lg:text-[16px]">{product?.avg_rating} ratings</span>
              </div>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className={`mb-4 rounded-md border-default p-4`}>
          <h5 className="border-bottom mb-4 py-4 text-h5 font-bold text-high-grey-III">Features</h5>
          <ul className="list-inside list-disc space-y-4">
            {product?.highlights.map((highlight, index) => <p key={index}>✔️ {highlight}</p>)}
          </ul>
        </section>

        {/* Description Section */}
        <section className="mb-4 rounded-md border-default p-4">
          <h5 className="border-bottom mb-4 py-4 text-h5 font-bold text-high-grey-III">Description</h5>
          <div>
            <p
              className={cn("transition-all duration-300", {
                "line-clamp-3": !isExpanded,
              })}
            >
              <span dangerouslySetInnerHTML={{ __html: product?.description || "" }} />
            </p>
            {isLongDescription && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-blue-500 hover:underline focus:outline-none"
              >
                {isExpanded ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
        </section>
      </main>

      {/* Sidebar Section */}
      <aside className="md:col-span-4">
        {/* Price and Action Buttons */}
        <section className="rounded-md border-default p-4">
          <div className="mb-8">
            <div className={`flex items-center justify-between rounded-md bg-low-purple p-2`}>
              <p className="font-semibold">Sold</p>
              <p className="text-sm font-semibold">{product?.total_order}</p>
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
              <CustomButton
                isDisabled={user?.id === product?.user_id}
                variant={`primary`}
                className={cn({ "cursor-not-allowed": user?.id !== product?.user_id })}
              >
                Add to Cart
              </CustomButton>
              <CustomButton
                isDisabled={user?.id === product?.user_id}
                variant={`outline`}
                className={cn({ "cursor-not-allowed": user?.id === product?.user_id }, "border-primary text-primary")}
              >
                Buy Now
              </CustomButton>
            </div>
          </div>

          {/* Product Includes Section */}
          <div>
            <h5 className="border-bottom mb-4 py-4 text-h5 font-bold text-high-grey-III">The Product Includes</h5>
            <div className="list-disc space-y-4">
              <div className="flex items-center justify-between">
                <span>Format</span>
                <span>MP4</span>
              </div>
              <div className="flex items-center justify-between">
                <span>File Type</span>
                <span>{product?.product_type.replace("_", " ")}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Articles</span>
                <span>7</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Resources</span>
                <span>4</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-4">
              <p className="text-sm font-semibold">Share</p>
              <p className="text-sm font-semibold">Give as Gift</p>
            </div>
          </div>
        </section>

        {/* Product Reviews Section */}
        <section className="mt-4 rounded-md border-default p-4">
          <div className="border-bottom mb-4 flex items-center justify-between pb-4">
            <h5 className="text-h5 font-bold text-high-grey-III">Product Reviews</h5>
            <p className="text-sm font-semibold text-mid-grey-II">10 reviews</p>
          </div>
          <div className="space-y-4">
            <EmptyState
              title="No Comments yet."
              description="There are no reviews available for this product."
              images={[{ src: empty1.src, alt: "Empty product", width: 50, height: 50 }]}
            />
          </div>
        </section>
      </aside>
    </section>
  );
}
