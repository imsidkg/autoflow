import AppHeader from "@/components/app-header";
import AppSidebar from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
    <AppHeader/>
  <div className="flex-1"> 

      {children}
  </div>
    </>
  
  );
}
