import { SidebarProvider } from "@/components/ui/sidebar";
import { SettingsSidebar } from "@/components/settings/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <SidebarProvider className="">
        <SettingsSidebar />
        <div className="w-full">{children}</div>
      </SidebarProvider>
    </div>
  );
}
