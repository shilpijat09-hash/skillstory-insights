import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronsUpDown, FlaskConical, History, LayoutDashboard, LogOut, Plus, Settings, Bot } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Logo } from "@/components/brand/logo";
import { displayName, initials, useAuth, useSignOut } from "@/hooks/use-auth";
import { useProfile } from "@/hooks/use-profile";
import { isMockEngine } from "@/services/analysis";

const NAV = [
  { title: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { title: "New analysis", to: "/upload", icon: Plus },
  { title: "History", to: "/history", icon: History },
  { title: "Settings", to: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { state, isMobile, setOpenMobile } = useSidebar();
  const collapsed = state === "collapsed" && !isMobile;
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const signOut = useSignOut();
  const name = displayName(user, profile?.fullName);

  const isActive = (to: string) =>
    to === "/history" ? pathname.startsWith("/history") || pathname.startsWith("/analyses") : pathname.startsWith(to);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 justify-center border-b px-3">
        <Logo to="/dashboard" compact={collapsed} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map((item) => (
                <SidebarMenuItem key={item.to}>
                  <SidebarMenuButton asChild isActive={isActive(item.to)} tooltip={item.title}>
                    <Link to={item.to} onClick={() => isMobile && setOpenMobile(false)}>
                      <item.icon aria-hidden="true" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="gap-2 border-t">
        {!collapsed && (
          <div className="rounded-lg border bg-background p-3 text-xs">
            <div className="flex items-center gap-1.5 font-medium">
              {isMockEngine ? (
                <FlaskConical className="size-3.5 text-warning" aria-hidden="true" />
              ) : (
                <Bot className="size-3.5 text-primary" aria-hidden="true" />
              )}
              {isMockEngine ? "Demo engine active" : "CrewAI API configured"}
            </div>
            <p className="mt-1 text-muted-foreground">
              {isMockEngine
                ? "Reports are simulated until the AI backend is connected."
                : "Requests use the configured API; backend availability is unverified."}
            </p>
          </div>
        )}
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg" tooltip={name} aria-label="Account menu">
                  <Avatar className="size-8 rounded-lg">
                    {profile?.avatarUrl && <AvatarImage src={profile.avatarUrl} alt="" />}
                    <AvatarFallback className="rounded-lg bg-accent text-xs font-semibold text-accent-foreground">
                      {initials(name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid min-w-0 flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" aria-hidden="true" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuLabel className="truncate font-normal text-muted-foreground">{user?.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/settings">
                    <Settings aria-hidden="true" /> Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => void signOut()}>
                  <LogOut aria-hidden="true" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
