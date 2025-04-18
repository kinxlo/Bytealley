export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex">
      <section className="w-full">
        <div className="bg-high-grey-I p-[16px] lg:p-[32px]">{children}</div>
      </section>
    </main>
  );
}
