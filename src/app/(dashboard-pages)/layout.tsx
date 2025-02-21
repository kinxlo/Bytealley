"use client";

import { useSession } from "~/hooks/use-session";
import Loading from "../Loading";
import { DashboardNavbar } from "./_components/layout/navbar";
import { Sidebar } from "./_components/layout/sidebar/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = useSession();

  if (!user) {
    return <Loading />;
  }

  return (
    <main className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 z-30 hidden w-64 flex-shrink-0 overflow-y-auto bg-white shadow-lg xl:block">
        <Sidebar />
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col xl:pl-64">
        {/* Navbar */}
        <header className="sticky top-0 z-20 bg-white shadow-sm">
          <DashboardNavbar />
        </header>

        {/* Page Content */}
        <section className={`py-8`}>
          <div className="container mx-auto px-4">{children}</div>
        </section>
      </div>
    </main>
  );
}
