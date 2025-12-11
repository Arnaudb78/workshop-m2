import { redirect } from "next/navigation";
import { getAccountFromCookie } from "@/lib/auth";
import DashboardStudentClient from "./dashboard-student-client";

export default async function DashboardStudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const account = await getAccountFromCookie();
  if (!account) {
    redirect("/login");
  }

  // Rediriger les admins vers leur dashboard
  if (account.accessLevel === "ADMIN") {
    redirect("/dashboard");
  }

  return (
      <DashboardStudentClient account={account} title="Dashboard Étudiant">
          {children}
      </DashboardStudentClient>
  );
}

