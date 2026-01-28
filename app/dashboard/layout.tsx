import Sidebar from "@/components/Sidebar";
import { AvailabilityProvider } from "@/components/AvailabilityProvider";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AvailabilityProvider>
      <div className="flex min-h-screen gap-6 px-6 py-8 lg:px-10">
        <Sidebar />
        <main className="flex-1 space-y-6">{children}</main>
      </div>
    </AvailabilityProvider>
  );
}
