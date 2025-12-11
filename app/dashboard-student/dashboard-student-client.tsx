"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarSeparator,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BarChart3, School, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { AccountCookie } from "@/lib/auth";
import { LogoutAction } from "../actions/logout.action";
import { ModeToggle } from "@/components/toggle-mode";

type Props = {
    account: AccountCookie;
    children: React.ReactNode;
    title?: string;
    description?: string;
};

export default function DashboardStudentClient({ account, children, title = "Dashboard", description }: Props) {
    const pathname = usePathname();
    const handleLogout = async () => {
        await LogoutAction();
    };

    const navItems = [
        { href: "/dashboard-student", icon: BarChart3, label: "Analytics" },
        { href: "/dashboard-student/rooms", icon: School, label: "Salles" },
        { href: "/dashboard-student/support", icon: MessageSquare, label: "Support" },
    ];

    return (
        <SidebarProvider>
            <Sidebar className="border-r bg-card/40 backdrop-blur">
                <SidebarHeader className="gap-3">
                    <div className="flex items-center gap-2 px-2">
                        <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md font-semibold">
                            {account.name?.[0]?.toUpperCase() ?? "U"}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold leading-tight">
                                {account.name} {account.lastname}
                            </span>
                            <span className="text-xs text-muted-foreground">{account.schoolPromotion || "Étudiant"}</span>
                        </div>
                    </div>
                    <SidebarSeparator />
                </SidebarHeader>

                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {navItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive =
                                        pathname === item.href || (item.href !== "/dashboard-student" && pathname?.startsWith(item.href));
                                    return (
                                        <SidebarMenuItem key={item.href}>
                                            <SidebarMenuButton asChild isActive={isActive}>
                                                <Link href={item.href}>
                                                    <Icon />
                                                    <span>{item.label}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <Button variant="destructive" size="sm" className="w-full justify-center" onClick={handleLogout}>
                        Déconnexion
                    </Button>
                </SidebarFooter>
            </Sidebar>

            <SidebarInset className="bg-background">
                <header className="flex h-14 items-center gap-3 border-b px-4">
                    <SidebarTrigger />
                    <Separator orientation="vertical" className="h-6" />
                    <div className="w-full flex justify-between items-center">
                        <span className="text-sm font-semibold">{title}</span>
                        {description && <span className="text-xs text-muted-foreground">{description}</span>}
                        <ModeToggle />
                    </div>
                </header>

                <main className="flex-1 p-6">{children}</main>
            </SidebarInset>
        </SidebarProvider>
    );
}
