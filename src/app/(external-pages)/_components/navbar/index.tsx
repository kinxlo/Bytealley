/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { ChevronDown, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import CustomButton from "~/components/common/common-button/common-button";
import { Logo } from "~/components/common/logo";
import { Profile } from "~/components/common/profile";
import { Wrapper } from "~/components/layout/wrapper";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { WithDependency } from "~/HOC/withDependencies";
import { useNavbarVisibility } from "~/hooks/use-navbar-visibility";
import { useProductCategories } from "~/hooks/use-product-categories";
import { useSession } from "~/hooks/use-session";
import { AppService } from "~/services/app.service";
import { externalNavlinks } from "~/utils/constants";
import { dependencies } from "~/utils/dependencies";
import { cn } from "~/utils/utils";
import { ActivePage } from "./active-page";

const BaseNavbar = ({ appService }: { appService: AppService }) => {
  const { user } = useSession();
  const pathname = usePathname();
  const { isNavbarVisible } = useNavbarVisibility();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [navlinks, setNavlinks] = useState<any[]>(externalNavlinks);
  const categories = useProductCategories(appService);

  const { setTheme } = useTheme();

  useEffect(() => {
    setTheme("light");
  }, [setTheme]);

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

  const getRouteTheme = (): string => {
    const colorMap: { [key: string]: string } = {
      "/seller": "text-mid-grey-I bg-mid-purple",
      "/features": "text-mid-grey-III bg-low-coral",
      "/contact": "text-mid-grey-III bg-low-coral",
      "/pricing": "text-mid-grey-III bg-low-warning",
      "/about": "text-mid-grey-III bg-low-warning",
      "/terms-and-conditions": "text-mid-grey-III bg-mid-warning",
      "/privacy-policy": "text-mid-grey-I bg-mid-purple",
    };
    return colorMap[pathname as string] || "text-mid-grey-III";
  };

  return (
    <nav
      className={cn(
        `sticky top-0 z-50 w-full backdrop-blur-sm transition-transform duration-300`,
        isNavbarVisible ? "translate-y-0" : "-translate-y-full",
        getRouteTheme(),
      )}
    >
      <Wrapper>
        <div className="mx-auto flex h-24 items-center justify-between">
          <Logo width={100} height={50} className={`h-fit w-[100px] md:h-auto md:w-auto`} />
          {/* Desktop Links */}
          <div className="hidden items-center gap-8 lg:flex">
            {navlinks.length === 0 ? (
              <p className={cn(getRouteTheme(), "text-sm font-bold transition-colors")}>Loading Links...</p>
            ) : (
              navlinks.map((link, index) =>
                link.type === "dropdown" ? (
                  <DropdownMenu key={index}>
                    <DropdownMenuTrigger className={`cursor-pointer`} asChild>
                      <p
                        className={cn(
                          getRouteTheme(),
                          "flex items-center gap-1 text-sm font-bold",
                          ActivePage(link.name) && `text-mid-danger`,
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
                  <Link
                    key={index}
                    href={link.path}
                    className={cn(
                      getRouteTheme(),
                      "text-sm font-bold transition-colors",
                      ActivePage(link.name) && `text-mid-danger`,
                    )}
                  >
                    {link.name}
                  </Link>
                ),
              )
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center gap-8">
            {user ? (
              <Profile />
            ) : (
              <>
                <Link className="hidden lg:flex" href="/auth/login">
                  <CustomButton size={`xl`} variant={`ghost`}>
                    Login
                  </CustomButton>
                </Link>
                <Link href="/auth/login">
                  <CustomButton size={`xl`} className={`bg-mid-warning text-black`} variant={`primary`}>
                    Get Started
                  </CustomButton>
                </Link>
              </>
            )}
            <CustomButton
              size={`icon`}
              variant={`primary`}
              isIconOnly
              icon={isMobileMenuOpen ? <X /> : <Menu />}
              className="bg-white text-black shadow-sneob lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            getRouteTheme(),
            "fixed left-0 top-20 z-40 w-full overflow-hidden shadow-md transition-all duration-700 lg:hidden",
            isMobileMenuOpen ? "h-auto opacity-100" : "h-0 opacity-0",
          )}
        >
          <div className="flex items-center justify-center gap-8 p-4 py-10">
            {navlinks.map((link, index) =>
              link.type === "dropdown" ? (
                <DropdownMenu key={index}>
                  <DropdownMenuTrigger asChild>
                    <p className={cn(getRouteTheme(), "flex items-center justify-start gap-1 text-sm font-bold")}>
                      <span>{link.name}</span>
                      <ChevronDown className="h-4 w-4 font-medium" />
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
                <Link
                  key={index}
                  href={link.path}
                  className={cn(getRouteTheme(), "text-sm font-bold transition-colors")}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ),
            )}
          </div>
        </div>
      </Wrapper>
    </nav>
  );
};

export const Navbar = WithDependency(BaseNavbar, {
  appService: dependencies.APP_SERVICE,
});
