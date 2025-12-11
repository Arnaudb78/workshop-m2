import { redirect } from "next/navigation";
import { getAccountFromCookie } from "@/lib/auth";
import DashboardClient from "./dashboard-client";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = await getAccountFromCookie();
  if (!account) {
    redirect("/login");
  }

  return <DashboardClient account={account}>{children}</DashboardClient>;
}
