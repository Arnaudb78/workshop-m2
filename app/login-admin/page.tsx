"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginAction } from "@/app/actions/login.action";
import { AccessLevelEnum } from "@/utils/types/account";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ModeToggle } from "@/components/toggle-mode";

export default function LoginAdminPage() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [form, setForm] = useState({ mail: "", password: "", verificationCode: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = mounted ? resolvedTheme : "light";
    const logoSrc = currentTheme === "dark" ? "/logo-dc-metrics-dark.png" : "/logo-dc-metrics-light.png";

    const handleChange = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [key]: event.target.value }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const result = await LoginAction({
                mail: form.mail,
                password: form.password,
                accessLevel: AccessLevelEnum.ADMIN,
                verificationCode: form.verificationCode,
            });

            if (result.success === false) {
                setError(result.message || "Erreur lors de la connexion.");
                setLoading(false);
                return;
            }

            router.push(result.redirectPath || "/dashboard");
        } catch (err) {
            console.error("[LoginAdminPage] error", err);
            const message = (err as Error).message || "Connexion impossible";
            setError(message);
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="w-full flex h-16 items-center justify-between px-4 mx-auto">
                    <div className="flex items-center gap-2">
                        {mounted && <Link href="/"><Image src={logoSrc} alt="DC Metrics Logo" width={120} height={40} className="h-10 w-auto" priority /></Link>}
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="w-full flex flex-col items-center justify-center gap-4 py-8 md:py-12">
                <div className="flex max-w-[980px] flex-col items-center gap-3 text-center px-4 mx-auto">
                    <h1 className="text-2xl font-bold tracking-tighter sm:text-3xl md:text-4xl">DC Metrics</h1>
                    <p className="max-w-[700px] text-sm text-muted-foreground sm:text-base">
                        Surveillez en temps réel les conditions environnementales de vos salles de classe. Température, humidité, CO2 et occupation
                        des salles, tout en un seul endroit.
                    </p>
                </div>
            </section>

            {/* Login Form */}
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Card className="w-full">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div>
                                <CardTitle className="text-2xl">Connexion Administrateur</CardTitle>
                                <CardDescription className="mt-2">Accède à ton espace administrateur</CardDescription>
                            </div>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="mail">Adresse email</Label>
                                <Input
                                    id="mail"
                                    name="mail"
                                    type="email"
                                    value={form.mail}
                                    onChange={handleChange("mail")}
                                    placeholder="admin@example.com"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    value={form.password}
                                    onChange={handleChange("password")}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="verificationCode">Code de vérification</Label>
                                <Input
                                    id="verificationCode"
                                    name="verificationCode"
                                    type="password"
                                    value={form.verificationCode}
                                    onChange={handleChange("verificationCode")}
                                    placeholder="Code d'accès administrateur"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                                    {error}
                                </div>
                            )}

                            <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                {loading ? "Connexion..." : "Se connecter"}
                            </Button>

                            <div className="text-center text-sm">
                                <span className="text-muted-foreground">Pas encore de compte ? </span>
                                <Link href="/new-account-admin" className="font-medium text-primary hover:underline">
                                    Créer un compte administrateur
                                </Link>
                            </div>
                        </form>

                        <div className="mt-6 pt-4 border-t">
                            <Button variant="ghost" size="sm" className="w-full" asChild>
                                <Link href="/">
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    Retour à l&apos;accueil
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                </div>
            </div>
        </div>
    );
}

