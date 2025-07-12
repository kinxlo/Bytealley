"use client";

import { DashboardSidebar } from "~/components/common/sidebar/sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { Toaster } from "~/components/ui/sonner";
import { sideItems } from "~/utils/constants";
import { cn } from "~/utils/utils";
import { DashboardNavbar } from "./_components/layout/navbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="overflow-hidden">
      <Toaster />
      <SidebarProvider>
        <DashboardSidebar navItems={sideItems} />
        <SidebarInset className="border-none shadow-none">
          <DashboardNavbar />
          <section className={cn("calculated-height px-4 py-8 lg:px-8")}>{children}</section>
        </SidebarInset>
      </SidebarProvider>
    </main>
  );
}
