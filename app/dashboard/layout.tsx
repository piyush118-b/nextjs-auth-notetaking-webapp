import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Suspense } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider className="bg-sidebar">
      <Suspense fallback={<div>Loading...</div>}>
        <AppSidebar />
      </Suspense>
      <main className="flex-1 flex flex-col p-4 md:p-6 ml-0 w-full overflow-hidden">
        <div className="flex-1 bg-background rounded-3xl overflow-hidden shadow-2xl ring-1 ring-border/50">
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
