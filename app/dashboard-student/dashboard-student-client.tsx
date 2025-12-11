"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/toggle-mode";
import { AccountCookie } from "@/lib/auth";
import { LogoutAction } from "../actions/logout.action";

type Props = {
    account: AccountCookie;
    children: React.ReactNode;
};

export default function DashboardStudentClient({ account, children }: Props) {
    const handleLogout = async () => {
        await LogoutAction();
    };

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="w-full flex h-16 items-center justify-between px-4 mx-auto">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md font-semibold">
                                {account.name?.[0]?.toUpperCase() ?? "U"}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold leading-tight">
                                    {account.name} {account.lastname}
                                </span>
                                <span className="text-xs text-muted-foreground">Étudiant | {account.schoolPromotion}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Button variant="destructive" size="sm" onClick={handleLogout}>
                            Déconnexion
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}
