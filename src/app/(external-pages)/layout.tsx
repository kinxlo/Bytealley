"use client";

import { usePathname } from "next/navigation";

// import "../globals.css";

import { Footer } from "./_components/footer";
import { Navbar } from "./_components/navbar";

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  if (pathname.startsWith("/explore")) {
    return <>{children}</>;
  }

  return (
    <main>
      <Navbar />
      {children}
      <Footer />
    </main>
  );
}
