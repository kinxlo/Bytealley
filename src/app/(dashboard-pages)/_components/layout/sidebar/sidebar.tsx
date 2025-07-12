"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";

import { Logo } from "~/components/common/logo";
import { useSidebarItems } from "~/utils/constants";
import { cn } from "~/utils/utils";

interface ISidebarProperties extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  sideNavitems?: SidebarItem[];
  logoComponent?: React.ReactNode;
  onClose?: () => void;
}

export const SidebarNav: FC<ISidebarProperties> = ({ sideNavitems, logoComponent, className, onClose }) => {
  const pathname = usePathname();
  const userID = pathname.split("/")[2];

  // Use the custom hook to get dynamically updated sidebar items
  const updatedSideItems = useSidebarItems();

  // Use the passed `sideNavitems` if provided, otherwise use the updated `sideItems`
  const items = sideNavitems || updatedSideItems;

  const renderIcon = (item: SidebarItem) => {
    if (item.icon) {
      const Icon = item.icon;
      return <Icon className="h-5 w-5 dark:invert dark:filter" />;
    }

    if (item.iconUrl) {
      return (
        <div className="relative h-6 w-6">
          {/* <Image
            src={item.iconUrl}
            alt={item.route}
            fill
            className="object-contain dark:invert dark:filter"
            sizes="24px"
          /> */}
        </div>
      );
    }
    return null;
  };

  const renderSidebarItem = (item: SidebarItem) => {
    if (item.divider) {
      return <hr className="invisible my-4" />;
    }

    const isActive = pathname.includes(item.id);
    const dynamicLink = item.link.replace(":userID", userID);

    return (
      <Link
        key={item.id}
        href={dynamicLink}
        data-testid={item.id}
        role="sidebar-link"
        onClick={onClose}
        className={cn(
          "relative z-50 flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium transition-all duration-200",
          isActive ? "border-2 border-primary text-primary shadow-active" : "text-mid-grey-II hover:bg-low-grey-I",
        )}
      >
        {renderIcon(item)}
        <span>{item.route}</span>
        {item.badge && (
          <span
            className={cn(
              "absolute right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs",
              item.badge.variant === "danger" ? "bg-mid-danger text-white" : "bg-gray-200",
              item.badge.count === 0 && "hidden",
            )}
          >
            {item.badge.count}
          </span>
        )}
      </Link>
    );
  };

  return (
    <div className={cn("h-screen flex-col", "xl:block", className)}>
      <div className="flex h-[10.9%] items-center justify-center">
        {logoComponent || <Logo width={140} height={47} />}
      </div>
      <nav className="h-[89.9%] space-y-2 overflow-auto p-4">
        {items.map((item) => (
          <div key={item.id}>{renderSidebarItem(item)}</div>
        ))}
      </nav>
    </div>
  );
};
