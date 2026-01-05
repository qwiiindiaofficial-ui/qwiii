import { ReactNode } from 'react';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import AppSidebar from './AppSidebar';
import { useAppSettings } from '@/hooks/useAppSettings';
import { Menu, Bell, Search, Cpu } from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { settings } = useAppSettings();
  
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background bg-grid-pattern">
        <AppSidebar />
        <SidebarInset className="flex-1 flex flex-col">
          {/* Top Header */}
          <header className="h-14 border-b border-border bg-card/60 backdrop-blur-xl flex items-center justify-between px-4 sticky top-0 z-50">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="text-muted-foreground hover:text-foreground transition-colors">
                <Menu size={18} />
              </SidebarTrigger>
              
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/50 border border-border/50 text-muted-foreground text-sm">
                <Search size={14} />
                <span className="text-xs">Search...</span>
                <kbd className="ml-4 text-[10px] bg-background/50 px-1.5 py-0.5 rounded border border-border">⌘K</kbd>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* AI Status */}
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-accent/10 border border-accent/20">
                <Cpu size={14} className="text-accent" />
                <span className="text-xs font-medium text-accent">{settings.app_name} Active</span>
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              </div>

              {/* Notifications */}
              <button className="relative p-2 rounded-md hover:bg-muted transition-colors">
                <Bell size={18} className="text-muted-foreground" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-warning" />
              </button>

              {/* User */}
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-xs font-bold text-primary-foreground">
                AI
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto scrollbar-thin">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
