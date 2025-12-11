"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateAccountAction } from "../actions/create-account.action";
import { AccessLevelEnum } from "@/utils/types/account"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Shield } from "lucide-react";
import { ModeToggle } from "@/components/toggle-mode";

export default function NewAccountAdmin() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const [form, setForm] = useState({
        name: "",
        lastname: "",
        mail: "",
        password: "",
        verificationCode: "",
        poste: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = mounted ? resolvedTheme : "light";
    const logoSrc = currentTheme === "dark" ? "/logo-dc-metrics-dark.png" : "/logo-dc-metrics-light.png";

    const handleChange = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError(null);
        setLoading(true);

        const payload = {
            name: form.name,
            lastname: form.lastname,
            mail: form.mail,
            password: form.password,
            accessLevel: AccessLevelEnum.ADMIN,
            verificationCode: form.verificationCode,
            poste: form.poste,
        };
        const result = await CreateAccountAction(payload);

        if (result.success === false) {
            setError(result.message || "Une erreur est survenue lors de la création du compte.");
            setLoading(false);
            return;
        }

        if (result.success === true && result.pahtParams) {
            router.push(result.pahtParams);
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

            {/* Signup Form */}
            <div className="flex flex-1 items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Card className="w-full">
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <div>
                                    <CardTitle className="text-2xl">Créer un compte administrateur</CardTitle>
                                    <CardDescription className="mt-2">Renseigne tes informations pour créer ton compte admin</CardDescription>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Prénom</Label>
                                        <Input id="name" name="name" value={form.name} onChange={handleChange("name")} placeholder="Jane" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="lastname">Nom</Label>
                                        <Input
                                            id="lastname"
                                            name="lastname"
                                            value={form.lastname}
                                            onChange={handleChange("lastname")}
                                            placeholder="Doe"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="mail">Adresse email</Label>
                                    <Input
                                        id="mail"
                                        name="mail"
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
                                    <Label htmlFor="poste">Poste</Label>
                                    <Input
                                        id="poste"
                                        name="poste"
                                        value={form.poste}
                                        onChange={handleChange("poste")}
                                        placeholder="Ex: Directeur"
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
                                    <p className="text-xs text-muted-foreground">Code requis pour créer un compte administrateur</p>
                                </div>

                                {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                    {loading ? "Création..." : "Créer mon compte"}
                                </Button>

                                <div className="text-center text-sm">
                                    <span className="text-muted-foreground">Déjà un compte ? </span>
                                    <Link href="/login-admin" className="font-medium text-primary hover:underline">
                                        Se connecter
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

