"use client";

import { EmptyState } from "~/app/(dashboard-pages)/_components/empty-state";
import Loading from "~/app/Loading";
import { UniversalSwiper } from "~/components/common/carousel";
import { Wrapper } from "~/components/layout/wrapper";
import { useAppService } from "~/services/app/use-app-service";
import { CardComponent } from "../../_components/product-card";

export const BestSellingProduct = () => {
  const { useGetAllProducts } = useAppService();
  const { data: paginatedResponse, isLoading, isError } = useGetAllProducts();

  const products: IProduct[] = paginatedResponse?.data || [];

  if (isLoading) {
    return <Loading text="Loading trending products..." className="h-fit w-full p-20" />;
  }

  if (isError || products.length === 0) {
    return (
      <EmptyState
        title="No trending products at the moment."
        description="There are no best selling products yet."
        images={[]}
      />
    );
  }

  return (
    <Wrapper>
      <section className={`mb-6`}>
        <h1 className="text-h3 sm:text-h3-sm md:text-h3-md">Trending Products</h1>
      </section>

      <UniversalSwiper
        className={`mb-20`}
        items={products}
        renderItem={(product: IProduct) => (
          <CardComponent
            productID={product.slug}
            image={typeof product.thumbnail === "string" ? product.thumbnail : ""}
            heading={product.title}
            price={product.price}
            publisher={product.publisher?.name || "Unknown Publisher"}
            aggrRating={product.avg_rating}
            discountPrice={product.discount_price}
          />
        )}
        swiperOptions={{
          spaceBetween: 24,
        }}
        showPagination
        showNavigation
        breakpoints={{
          0: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
      />
    </Wrapper>
  );
};
