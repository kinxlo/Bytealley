/* eslint-disable unicorn/consistent-function-scoping */
// components/profile.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LuChevronDown, LuLogOut, LuSettings } from "react-icons/lu";

import { logoutAction } from "~/actions/auth";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useSession } from "~/hooks/use-session";
import { ThemeSwitch } from "../theme-toggle";

export const Profile = () => {
  const { user } = useSession();
  const pathname = usePathname();

  const isDashboard = pathname.includes(`/dashboard`);

  const handleLogOut = async () => {
    await logoutAction();
    window.location.href = "/auth/login";
  };

  return (
    <div className="flex items-center gap-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none active:outline-none">
          <Avatar className="border-2 border-primary bg-low-purple">
            <AvatarImage src={user?.logo || "https://github.com/shadcn.png"} />
            <AvatarFallback>{user?.name[0]?.toUpperCase() || "U"}</AvatarFallback>
          </Avatar>
          <div className="hidden items-center lg:flex">
            <p className="text-sm font-medium capitalize">{user?.username || user?.name || "User"}</p>
            <LuChevronDown className="ml-1" size={18} />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-[15rem] space-y-2 border-default p-2" align="end" sideOffset={8}>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.name || "User"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          {isDashboard && (
            <>
              <div className="flex items-center justify-between px-2 py-1.5 text-sm font-medium">
                <span>Dark Mode</span>
                <ThemeSwitch />
              </div>

              <DropdownMenuSeparator />
            </>
          )}

          <DropdownMenuItem className="cursor-pointer">
            <Link className={`flex items-center font-medium`} href={`/dashboard/${user?.id}/profile`}>
              <LuSettings className="mr-2 h-4 w-4" />
              <span>Profile Settings</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="cursor-pointer font-medium text-mid-danger" onClick={handleLogOut}>
            <LuLogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
