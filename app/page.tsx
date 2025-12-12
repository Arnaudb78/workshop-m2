"use client";

import { ModeToggle } from "@/components/toggle-mode";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Thermometer, Droplets, Wind, Smartphone, BarChart3, ShieldCheck, Activity, Users, Volume2, Settings } from "lucide-react";

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
                        {mounted && (
                            <Link href="/">
                                <Image src={logoSrc} alt="DC Metrics Logo" width={120} height={40} className="h-10 w-auto" priority />
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
                            <div className="space-y-4">
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
                                <div className="flex flex-col items-center gap-3">
                                    <Volume2 className="h-5 w-5 text-muted-foreground" />
                                    <div className="text-center">
                                        <p className="font-medium mb-2">Détection des décibels</p>
                                        <p className="text-sm text-muted-foreground">
                                            Un capteur de décibels intégré permet de mesurer en temps réel le niveau sonore ambiant de la salle de
                                            classe. Cette fonctionnalité aide à maintenir un environnement d&apos;apprentissage optimal.
                                        </p>
                                    </div>
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
                                    <Settings className="h-5 w-5 text-muted-foreground" />
                                    <div className="text-center">
                                        <p className="font-medium">Paramètres Personnalisés</p>
                                        <p className="text-sm text-muted-foreground">
                                            Chaque salle de classe peut être configurée avec ses propres paramètres. Les administrateurs peuvent
                                            définir des seuils différents pour la température, l&apos;humidité, le CO2 et les décibels selon les
                                            besoins spécifiques de chaque classe.
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
                                    <Image
                                        src="/arnaud.png"
                                        alt="Arnaud Beaulieu"
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                            </div>
                            <CardTitle className="text-xl">Arnaud Beaulieu</CardTitle>
                            <CardDescription className="text-base font-medium text-primary">Mastère 2 Tech-Lead</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Développeur full-stack passionné, spécialisé dans la création d&apos;APIs robustes et d&apos;interfaces utilisateur
                                modernes. Expert en architecture backend et développement frontend pour des solutions IoT innovantes.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Membre 2 */}
                    <Card className="text-center">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="relative size-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    <Image
                                        src="/el.png"
                                        alt="Elena Ferreira"
                                        width={128}
                                        height={128}
                                        className="w-full h-full object-cover rounded-full"
                                    />
                                </div>
                            </div>
                            <CardTitle className="text-xl">Elena Ferreira</CardTitle>
                            <CardDescription className="text-base font-medium text-primary">Mastère 2 Tech-Lead</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Spécialisée dans le développement de firmware embarqué, elle a principalement développé les différents firmware des
                                modules ESP-32 utilisés dans le projet pour la collecte et la transmission des données environnementales.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Membre 3 */}
                    <Card className="text-center">
                        <CardHeader>
                            <div className="flex justify-center mb-4">
                                <div className="relative size-32 rounded-full bg-muted flex items-center justify-center overflow-hidden">
                                    <Image
                                            src="/jules.png"
                                            alt="Jules Fakhouri"
                                            width={128}
                                            height={128}
                                            className="w-full h-full object-cover rounded-full"
                                        />
                                </div>
                            </div>
                            <CardTitle className="text-xl">Jules Fakhouri</CardTitle>
                            <CardDescription className="text-base font-medium text-primary">Mastère 2 Tech-Lead</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Spécialisé en design industriel et modélisation 3D, il a principalement travaillé sur les modèles, plans et conception
                                3D des boîtiers pour les modules ESP-32, assurant à la fois l&apos;esthétique et la fonctionnalité des dispositifs
                                IoT.
                            </p>
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
                        © {new Date().getFullYear()} DC Metrics. Workshop Master 2 IoT. Make with ❤️
                    </p>
                </div>
            </footer>
        </div>
    );
}
