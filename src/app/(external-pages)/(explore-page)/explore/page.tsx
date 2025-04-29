"use client";

import { ExploreBanner } from "./_components/banner";
import { BestSellingProduct } from "./_views/best-sellers";
import { FeaturedProducts } from "./_views/featured";

const page = () => {
  return (
    <section>
      <ExploreBanner />
      <BestSellingProduct />
      <FeaturedProducts />
    </section>
  );
};

export default page;
