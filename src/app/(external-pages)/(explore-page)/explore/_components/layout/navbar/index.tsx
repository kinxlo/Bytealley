/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChevronDown, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation"; // Import useSearchParams
import { useEffect, useState } from "react";
import { IoCartSharp } from "react-icons/io5";

import CustomButton from "~/components/common/common-button/common-button";
import { Logo } from "~/components/common/logo";
import { Profile } from "~/components/common/profile";
import { SearchInput } from "~/components/common/search-input";
import { Wrapper } from "~/components/layout/wrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { WithDependency } from "~/HOC/withDependencies";
import { useCart } from "~/hooks/use-cart";
import { useNavbarVisibility } from "~/hooks/use-navbar-visibility";
import { useProductCategories } from "~/hooks/use-product-categories";
import { useSession } from "~/hooks/use-session";
import { AppService } from "~/services/app.service";
import { externalNavlinks } from "~/utils/constants";
import { dependencies } from "~/utils/dependencies";
import { cn } from "~/utils/utils";

const BaseExploreNavBar = ({ appService }: { appService: AppService }) => {
  const pathname = usePathname();
  const { isNavbarVisible } = useNavbarVisibility();
  const searchParameters = useSearchParams(); // Get search params
  const { user } = useSession();
  const categories = useProductCategories(appService);
  const [navlinks, setNavlinks] = useState<any[]>(externalNavlinks);
  const { cart } = useCart();
  const router = useRouter();

  const tags = ["All", ...categories.map((category: { name: string }) => category.name)];
  const productRoute = pathname.includes(`product`) || pathname.includes(`cart`);

  const currentCategory = searchParameters.get("category") || "all";

  const handleTagClick = (tag: string) => {
    const categoryParameter = tag.toLowerCase() === "all" ? "all" : tag.toLowerCase().replaceAll(/\s+/g, "-");
    router.push(`/explore?category=${categoryParameter}`);
  };

  useEffect(() => {
    if (categories.length > 0) {
      const modifiedLinks = navlinks.map((link) => {
        if (link.name === "Explore") {
          return {
            ...link,
            subLinks: [...link.subLinks, ...categories],
          };
        }
        return link;
      });
      setNavlinks(modifiedLinks);
    }
  }, [categories]);

  return (
    <>
      <nav
        className={cn(
          `sticky top-0 z-[5] w-full items-center justify-between gap-4 bg-mid-coral py-4 backdrop-blur-sm transition-transform duration-300 lg:flex-row`,
          isNavbarVisible ? "translate-y-0" : "-translate-y-full",
          productRoute && `bg-low-grey-III`,
        )}
        // className={cn("bg-mid-coral py-4", productRoute && `bg-low-grey-III`)}
      >
        <Wrapper>
          <section className="flex flex-col items-center justify-between gap-4 lg:flex-row">
            <div className="flex w-full items-center justify-between lg:w-auto">
              <Logo width={100} height={50} className={`h-fit w-[100px] md:h-auto md:w-auto`} />
              <div className={`lg:hidden`}>
                {user ? (
                  <Profile />
                ) : (
                  <CustomButton href={`/auth/login`} size={`xl`} className={`bg-mid-warning text-black`}>
                    Create Account
                  </CustomButton>
                )}
              </div>
            </div>
            <div className="flex w-full items-center justify-between gap-6 lg:w-auto">
              <Sheet>
                <SheetTrigger className="lg:hidden">
                  <Menu className="h-6 w-6" />
                </SheetTrigger>
                <SheetContent className={`bg-mid-coral`} side="top">
                  <section className="flex items-center justify-center gap-4 p-4">
                    <div className={`flex gap-8`}>
                      {navlinks.map((link, index) =>
                        link.type === "dropdown" ? (
                          <DropdownMenu key={index}>
                            <DropdownMenuTrigger asChild>
                              <p
                                className={cn(
                                  // getRouteTheme(),
                                  "flex items-center justify-start gap-1 text-sm font-bold",
                                )}
                              >
                                <span>{link.name}</span>
                                <ChevronDown className="h-4 w-4" />
                              </p>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className={cn("w-48 rounded-md bg-white p-2 shadow-lg")}>
                              {link.subLinks?.map((subLink: any, index: number) => (
                                <DropdownMenuItem key={index} asChild>
                                  <Link
                                    href={subLink.path}
                                    className="block px-4 py-2 text-sm font-medium capitalize hover:bg-mid-grey-III"
                                  >
                                    {subLink.name}
                                  </Link>
                                </DropdownMenuItem>
                              ))}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        ) : (
                          <Link key={link.id} href={link.path} className={cn("text-sm font-bold transition-colors")}>
                            {link.name}
                          </Link>
                        ),
                      )}
                    </div>
                  </section>
                </SheetContent>
              </Sheet>
              <div className="flex-1 lg:flex-none">
                <SearchInput />
              </div>
              <Link href="/explore/cart">
                <div className="relative text-2xl">
                  <IoCartSharp />
                  {cart.length > 0 && (
                    <p
                      className={cn(
                        `absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full border-4 bg-mid-purple text-xs text-white`,
                        productRoute ? `border-low-grey-III` : `border-mid-coral`,
                      )}
                    >
                      {cart.length}
                    </p>
                  )}
                </div>
              </Link>
              <div className={`hidden lg:block`}>
                {user ? (
                  <Profile />
                ) : (
                  <CustomButton href={`/auth/login`} size={`xl`} className={`bg-mid-warning text-black`}>
                    Create Account
                  </CustomButton>
                )}
              </div>
            </div>
          </section>
        </Wrapper>
      </nav>
      {!productRoute && (
        <section className={cn("sticky top-0 z-[4] bg-mid-coral py-4")}>
          <div className="flex flex-wrap justify-center gap-4">
            {tags.map((tag, index) => {
              const tagParameter = tag.toLowerCase() === "all" ? "all" : tag.toLowerCase().replaceAll(/\s+/g, "-");
              const isActive = currentCategory === tagParameter;

              return (
                <CustomButton
                  key={index}
                  variant="ghost"
                  size="lg"
                  onClick={() => handleTagClick(tag)}
                  className={cn(`rounded-full font-semibold capitalize`, isActive && "bg-white shadow-sneob")}
                >
                  {tag}
                </CustomButton>
              );
            })}
          </div>
        </section>
      )}
    </>
  );
};

export const ExploreNavbar = WithDependency(BaseExploreNavBar, {
  appService: dependencies.APP_SERVICE,
});
