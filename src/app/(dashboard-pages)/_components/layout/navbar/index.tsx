"use client";

import bell from "@/icons/Property_2_Notifications_1_w4v7g4.svg";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { Profile } from "~/components/common/profile";
import { SearchInput } from "~/components/common/search-input";
import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover";
import { UnreadNotificationCard, useNotifications } from "~/features/push-notification";
import { cn } from "~/utils/utils";
import { Drawer } from "../drawer/drawer";

export const DashboardNavbar = () => {
  const pathname = usePathname();
  const title = pathname.split("/")[3].charAt(0).toUpperCase() + pathname.split("/")[3].slice(1);
  const { unreadCount, fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  return (
    <nav className="sticky top-0 z-[5] border-b-[0.5px] border-border" role="navbar">
      <section className="flex w-full items-center justify-between gap-[20px] bg-white px-[16px] py-[20px] lg:px-[32px]">
        <div className={`flex items-center gap-4`}>
          <Drawer />
          <h6 className="font-semibold">{title}</h6>
        </div>
        <section className="flex items-center justify-between gap-1 md:gap-2 lg:gap-6">
          <SearchInput inputBackgroundColor="bg-low-grey-III" className="hidden w-[100%] lg:flex lg:w-[270px]" />
          <div className="relative flex items-center justify-center">
            <Popover>
              <PopoverTrigger>
                <Image src={bell} alt="bell" className={"h-[32px] w-[32px]"} />
              </PopoverTrigger>
              <PopoverContent
                data-testid="notificationContent"
                align="end"
                className="w-fit border-none p-0 shadow-none"
              >
                <UnreadNotificationCard />
              </PopoverContent>
            </Popover>
            <span
              className={cn(
                "absolute right-1 top-0 h-[6px] w-[6px] rounded-full bg-mid-success",
                unreadCount > 0 ? "block" : "hidden",
              )}
            ></span>
          </div>
          <Profile />
        </section>
      </section>
      <section className="relative z-[5] flex items-center justify-center bg-white p-4 lg:hidden">
        <SearchInput inputBackgroundColor="bg-low-grey-III" className="w-[100%]" />
      </section>
    </nav>
  );
};
