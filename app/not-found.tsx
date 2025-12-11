"use client";

import { ModeToggle } from "@/components/toggle-mode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Home, ArrowLeft, AlertCircle } from "lucide-react";

export default function NotFound() {
    const { theme, resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = mounted ? resolvedTheme : "light";
    const logoSrc = currentTheme === "dark" ? "/logo-dc-metrics-dark.png" : "/logo-dc-metrics-light.png";

    return (
        <div className="flex flex-col min-h-screen w-full">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="w-full flex h-16 items-center justify-between px-4 mx-auto">
                    <div className="flex items-center gap-2">
                        {mounted && (
                            <Link href="/">
                                <Image
                                    src={logoSrc}
                                    alt="DC Metrics Logo"
                                    width={120}
                                    height={40}
                                    className="h-10 w-auto"
                                    priority
                                />
                            </Link>
                        )}
                    </div>
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                        <Button variant="ghost" asChild>
                            <Link href="/login">Étudiant</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/login-admin">Administrateur</Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* 404 Section */}
            <section className="w-full flex flex-col items-center justify-center gap-6 py-20 md:py-32">
                <div className="flex max-w-[980px] flex-col items-center gap-4 text-center px-4 mx-auto">
                    <div className="flex items-center justify-center mb-4">
                        <AlertCircle className="h-24 w-24 text-muted-foreground" />
                    </div>
                    <h1 className="text-6xl font-bold tracking-tighter sm:text-7xl md:text-8xl">404</h1>
                    <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Page introuvable</h2>
                    <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
                        Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée. Retournez à la page d&apos;accueil pour continuer.
                    </p>
                    <div className="flex gap-4 mt-6">
                        <Button size="lg" asChild>
                            <Link href="/">
                                <Home className="h-4 w-4 mr-2" />
                                Retour à l&apos;accueil
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" onClick={() => window.history.back()}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Page précédente
                        </Button>
                    </div>
                </div>
            </section>

            {/* Helpful Links Section */}
            <section className="w-full py-20 md:py-32 bg-muted/50">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 text-center px-4">
                    <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">Liens utiles</h2>
                    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        Retrouvez rapidement les pages principales de l&apos;application
                    </p>
                </div>

                <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-12 max-w-6xl px-4">
                    <Card className="text-center">
                        <CardHeader className="text-center">
                            <CardTitle className="text-center">Connexion Étudiant</CardTitle>
                            <CardDescription className="text-center">Accédez à votre tableau de bord étudiant</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="/login">Se connecter</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardHeader className="text-center">
                            <CardTitle className="text-center">Connexion Administrateur</CardTitle>
                            <CardDescription className="text-center">Accédez au tableau de bord administrateur</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild className="w-full">
                                <Link href="/login-admin">Se connecter</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="text-center">
                        <CardHeader className="text-center">
                            <CardTitle className="text-center">Créer un compte</CardTitle>
                            <CardDescription className="text-center">Inscrivez-vous pour commencer à utiliser DC Metrics</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/new-account">Créer un compte</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </div>
    );
}
