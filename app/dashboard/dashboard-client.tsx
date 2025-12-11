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
import { Home, LineChart, School, Settings, Users } from "lucide-react";
import Link from "next/link";

import { AccountCookie } from "@/lib/auth";
import { LogoutAction } from "../actions/logout.action";

type Props = {
  account: AccountCookie;
};

export default function DashboardClient({ account }: Props) {
  const handleLogout = async () => {
    await LogoutAction();
  }

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
              <span className="text-xs text-muted-foreground">
                {account.accessLevel}
              </span>
            </div>
          </div>
          <SidebarSeparator />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive>
                    <Link href="/dashboard">
                      <Home />
                      <span>Accueil</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/metrics">
                      <School />
                      <span>Pièces</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/metrics">
                      <LineChart />
                      <span>Mesures</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/users">
                      <Users />
                      <span>Utilisateurs</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link href="/dashboard/settings">
                      <Settings />
                      <span>Paramètres</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <Button variant="outline" size="sm" className="w-full justify-center" onClick={handleLogout}>
            Déconnexion
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="bg-background">
        <header className="flex h-14 items-center gap-3 border-b px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Dashboard</span>
            <span className="text-xs text-muted-foreground">
              Vue d’ensemble de vos capteurs
            </span>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <section className="col-span-2 rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Activité récente</h2>
              <p className="text-sm text-muted-foreground">
                Branche tes capteurs pour commencer à visualiser les métriques.
              </p>
            </section>
            <section className="rounded-lg border bg-card p-4 shadow-sm">
              <h2 className="text-lg font-semibold">Résumé</h2>
              <p className="text-sm text-muted-foreground">
                Ajoute des cartes ici (statuts, alertes, etc.).
              </p>
            </section>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
