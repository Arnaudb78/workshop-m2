"use client";

import { ModeToggle } from "@/components/toggle-mode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Thermometer, Droplets, Wind, Smartphone, BarChart3, ShieldCheck, Activity, Users } from "lucide-react";

export default function Home() {
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
                        {mounted && <Image src={logoSrc} alt="DC Metrics Logo" width={120} height={40} className="h-10 w-auto" priority />}
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

            {/* Hero Section */}
            <section className="w-full flex flex-col items-center justify-center gap-6 py-20 md:py-32">
                <div className="flex max-w-[980px] flex-col items-center gap-4 text-center px-4 mx-auto">
                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">DC Metrics</h1>
                    <p className="max-w-[700px] text-lg text-muted-foreground sm:text-xl">
                        Surveillez en temps réel les conditions environnementales de vos salles de classe. Température, humidité, CO2 et occupation
                        des salles, tout en un seul endroit.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <Button size="lg" asChild>
                            <Link href="/new-account">Commencer</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/login">Se connecter</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="w-full py-20 md:py-32">
                <div className="mx-auto flex max-w-232 flex-col items-center justify-center gap-4 text-center px-4">
                    <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">Comment ça fonctionne</h2>
                    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        Une solution IoT complète pour le monitoring environnemental des salles de classe
                    </p>
                </div>

                <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 lg:grid-cols-3 mt-12 max-w-6xl px-4">
                    {/* Capteurs environnementaux */}
                    <Card className="text-center">
                        <CardHeader className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Activity className="h-6 w-6 text-primary" />
                                <CardTitle className="text-center">Capteurs Environnementaux</CardTitle>
                            </div>
                            <CardDescription className="text-center">Boîtier IoT installé dans chaque salle de classe</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-col items-center gap-2">
                                    <Thermometer className="h-5 w-5 text-muted-foreground" />
                                    <div className="text-center">
                                        <p className="font-medium">Température</p>
                                        <p className="text-sm text-muted-foreground">Mesure en temps réel de la température ambiante</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Droplets className="h-5 w-5 text-muted-foreground" />
                                    <div className="text-center">
                                        <p className="font-medium">Humidité</p>
                                        <p className="text-sm text-muted-foreground">Surveillance du taux d&apos;humidité de l&apos;air</p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <Wind className="h-5 w-5 text-muted-foreground" />
                                    <div className="text-center">
                                        <p className="font-medium">CO2</p>
                                        <p className="text-sm text-muted-foreground">Détection de la concentration en dioxyde de carbone</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Boîtier NFC */}
                    <Card className="text-center">
                        <CardHeader className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Smartphone className="h-6 w-6 text-primary" />
                                <CardTitle className="text-center">Détection d&apos;Occupation</CardTitle>
                            </div>
                            <CardDescription className="text-center">Boîtier NFC externe avec badge de contact</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center gap-3">
                                <Users className="h-5 w-5 text-muted-foreground" />
                                <div className="text-center">
                                    <p className="font-medium mb-2">Statut de la salle</p>
                                    <p className="text-sm text-muted-foreground">
                                        Un second boîtier équipé d&apos;un contact NFC permet de détecter si une salle de classe est occupée ou
                                        disponible. Les utilisateurs peuvent badger pour indiquer la présence dans la salle.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dashboard Admin */}
                    <Card className="text-center">
                        <CardHeader className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <BarChart3 className="h-6 w-6 text-primary" />
                                <CardTitle className="text-center">Tableau de Bord Admin</CardTitle>
                            </div>
                            <CardDescription className="text-center">Visualisation centralisée des données</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex flex-col items-center gap-2">
                                    <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                                    <div className="text-center">
                                        <p className="font-medium">Accès Administrateur</p>
                                        <p className="text-sm text-muted-foreground">
                                            Les administrateurs peuvent consulter toutes les métriques environnementales et l&apos;état
                                            d&apos;occupation pour chaque salle.
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <BarChart3 className="h-5 w-5 text-muted-foreground" />
                                    <div className="text-center">
                                        <p className="font-medium">Données en Temps Réel</p>
                                        <p className="text-sm text-muted-foreground">
                                            Visualisation des données historiques et courantes pour chaque salle de classe.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* Team Section */}
            <section className="w-full py-20 md:py-32">
                <div className="mx-auto flex max-w-232 flex-col items-center justify-center gap-4 text-center px-4">
                    <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">L&apos;équipe</h2>
                    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">Les créateurs du concept DC Metrics</p>
                </div>

                <div className="mx-auto grid justify-center gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-12 max-w-6xl px-4">
                    {/* Membre 1 */}
                    <Card className="text-center">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="relative size-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    <Users className="h-16 w-16 text-muted-foreground" />
                                </div>
                            </div>
                            <CardTitle className="text-xl">Nom du créateur</CardTitle>
                            <CardDescription className="text-base font-medium text-primary">Promotion</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Description du rôle et des contributions au projet DC Metrics.</p>
                        </CardContent>
                    </Card>

                    {/* Membre 2 */}
                    <Card className="text-center">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="relative size-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    <Users className="h-16 w-16 text-muted-foreground" />
                                </div>
                            </div>
                            <CardTitle className="text-xl">Nom du créateur</CardTitle>
                            <CardDescription className="text-base font-medium text-primary">Promotion</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Description du rôle et des contributions au projet DC Metrics.</p>
                        </CardContent>
                    </Card>

                    {/* Membre 3 */}
                    <Card className="text-center">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="relative size-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    <Users className="h-16 w-16 text-muted-foreground" />
                                </div>
                            </div>
                            <CardTitle className="text-xl">Nom du créateur</CardTitle>
                            <CardDescription className="text-base font-medium text-primary">Promotion</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Description du rôle et des contributions au projet DC Metrics.</p>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* CTA Section */}
            <section className="w-full py-20 md:py-32">
                <div className="mx-auto flex max-w-232 flex-col items-center justify-center gap-4 text-center px-4">
                    <h2 className="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-4xl">Prêt à commencer ?</h2>
                    <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                        Rejoignez-nous dès aujourd&apos;hui pour surveiller efficacement vos salles de classe.
                    </p>
                    <div className="flex gap-4 mt-4">
                        <Button size="lg" asChild>
                            <Link href="/new-account">Créer un compte</Link>
                        </Button>
                        <Button size="lg" variant="outline" asChild>
                            <Link href="/login">Se connecter</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t py-6 md:py-0 w-full">
                <div className="w-full flex flex-col items-center justify-center gap-4 md:h-24">
                    <p className="text-center text-sm leading-loose text-muted-foreground">
                        © {new Date().getFullYear()} DC Metrics. Projet Master IoT. Group 1.
                    </p>
                </div>
            </footer>
        </div>
    );
}
