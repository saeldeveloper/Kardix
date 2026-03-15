import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Mobile Top Header */}
      <div className="md:hidden p-4 border-b border-border bg-background flex justify-center sticky top-0 z-40">
        <h1 className="text-lg font-bold text-primary">Kardix</h1>
      </div>

      <Sidebar />
      <main className="pl-0 md:pl-64 pb-20 md:pb-0 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
