"use client"

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreateAccountAction } from "../actions/create-account.action";
import { AccessLevelEnum } from "@/utils/types/account";
import { SchoolPromotionEnum } from "@/utils/enums/school-promotion.enum";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ModeToggle } from "@/components/toggle-mode";

export default function NewAccount() {
    const router = useRouter();
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    const [form, setForm] = useState({
        name: "",
        lastname: "",
        mail: "",
        password: "",
        schoolPromotion: "",
    });

    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const currentTheme = mounted ? resolvedTheme : "light";
    const logoSrc = currentTheme === "dark" ? "/logo-dc-metrics-dark.png" : "/logo-dc-metrics-light.png";

    const handleChange = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
            accessLevel: AccessLevelEnum.STUDENT,
            schoolPromotion: form.schoolPromotion,
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
                        {mounted && <Image src={logoSrc} alt="DC Metrics Logo" width={120} height={40} className="h-10 w-auto" priority />}
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
                        <CardHeader className="space-y-4 pb-4">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <CardTitle className="text-2xl">Créer un compte étudiant</CardTitle>
                                    <CardDescription className="mt-2">Renseigne tes informations pour créer ton compte</CardDescription>
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
                                        type="email"
                                        value={form.mail}
                                        onChange={handleChange("mail")}
                                        placeholder="johndoe@gmail.com"
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
                                    <Label htmlFor="schoolPromotion">Promotion</Label>
                                    <select
                                        id="schoolPromotion"
                                        name="schoolPromotion"
                                        value={form.schoolPromotion}
                                        onChange={(e) => {
                                            handleChange("schoolPromotion")(e);
                                        }}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        required>
                                        <option value="">Sélectionnez votre promotion</option>
                                        <optgroup label="Bachelors">
                                            <option value={SchoolPromotionEnum.BACHELOR_DIGITAL_1}>{SchoolPromotionEnum.BACHELOR_DIGITAL_1}</option>
                                            <option value={SchoolPromotionEnum.BACHELOR_DIGITAL_2}>{SchoolPromotionEnum.BACHELOR_DIGITAL_2}</option>
                                            <option value={SchoolPromotionEnum.BACHELOR_DIGITAL_3}>{SchoolPromotionEnum.BACHELOR_DIGITAL_3}</option>
                                            <option value={SchoolPromotionEnum.MARKETING_DIGITAL_INFLUENCE_1}>
                                                {SchoolPromotionEnum.MARKETING_DIGITAL_INFLUENCE_1}
                                            </option>
                                            <option value={SchoolPromotionEnum.MARKETING_DIGITAL_INFLUENCE_2}>
                                                {SchoolPromotionEnum.MARKETING_DIGITAL_INFLUENCE_2}
                                            </option>
                                            <option value={SchoolPromotionEnum.MARKETING_DIGITAL_INFLUENCE_3}>
                                                {SchoolPromotionEnum.MARKETING_DIGITAL_INFLUENCE_3}
                                            </option>
                                            <option value={SchoolPromotionEnum.UX_DESIGN_PRODUCT_OWNER_1}>
                                                {SchoolPromotionEnum.UX_DESIGN_PRODUCT_OWNER_1}
                                            </option>
                                            <option value={SchoolPromotionEnum.UX_DESIGN_PRODUCT_OWNER_2}>
                                                {SchoolPromotionEnum.UX_DESIGN_PRODUCT_OWNER_2}
                                            </option>
                                            <option value={SchoolPromotionEnum.UX_DESIGN_PRODUCT_OWNER_3}>
                                                {SchoolPromotionEnum.UX_DESIGN_PRODUCT_OWNER_3}
                                            </option>
                                            <option value={SchoolPromotionEnum.MOTION_DESIGN_1}>{SchoolPromotionEnum.MOTION_DESIGN_1}</option>
                                            <option value={SchoolPromotionEnum.MOTION_DESIGN_2}>{SchoolPromotionEnum.MOTION_DESIGN_2}</option>
                                            <option value={SchoolPromotionEnum.MOTION_DESIGN_3}>{SchoolPromotionEnum.MOTION_DESIGN_3}</option>
                                            <option value={SchoolPromotionEnum.UI_WEBDESIGN_1}>{SchoolPromotionEnum.UI_WEBDESIGN_1}</option>
                                            <option value={SchoolPromotionEnum.UI_WEBDESIGN_2}>{SchoolPromotionEnum.UI_WEBDESIGN_2}</option>
                                            <option value={SchoolPromotionEnum.UI_WEBDESIGN_3}>{SchoolPromotionEnum.UI_WEBDESIGN_3}</option>
                                            <option value={SchoolPromotionEnum.DEVELOPPEMENT_WEB_1}>{SchoolPromotionEnum.DEVELOPPEMENT_WEB_1}</option>
                                            <option value={SchoolPromotionEnum.DEVELOPPEMENT_WEB_2}>{SchoolPromotionEnum.DEVELOPPEMENT_WEB_2}</option>
                                            <option value={SchoolPromotionEnum.DEVELOPPEMENT_WEB_3}>{SchoolPromotionEnum.DEVELOPPEMENT_WEB_3}</option>
                                            <option value={SchoolPromotionEnum.IA_AUTOMATION_1}>{SchoolPromotionEnum.IA_AUTOMATION_1}</option>
                                            <option value={SchoolPromotionEnum.IA_AUTOMATION_2}>{SchoolPromotionEnum.IA_AUTOMATION_2}</option>
                                            <option value={SchoolPromotionEnum.IA_AUTOMATION_3}>{SchoolPromotionEnum.IA_AUTOMATION_3}</option>
                                        </optgroup>
                                        <optgroup label="Prépa Mastère">
                                            <option value={SchoolPromotionEnum.PREPA_MASTERE}>{SchoolPromotionEnum.PREPA_MASTERE}</option>
                                        </optgroup>
                                        <optgroup label="Masters">
                                            <option value={SchoolPromotionEnum.BRAND_CONTENT_1}>{SchoolPromotionEnum.BRAND_CONTENT_1}</option>
                                            <option value={SchoolPromotionEnum.BRAND_CONTENT_2}>{SchoolPromotionEnum.BRAND_CONTENT_2}</option>
                                            <option value={SchoolPromotionEnum.DATA_CUSTOMER_EXPERIENCE_1}>
                                                {SchoolPromotionEnum.DATA_CUSTOMER_EXPERIENCE_1}
                                            </option>
                                            <option value={SchoolPromotionEnum.DATA_CUSTOMER_EXPERIENCE_2}>
                                                {SchoolPromotionEnum.DATA_CUSTOMER_EXPERIENCE_2}
                                            </option>
                                            <option value={SchoolPromotionEnum.DIRECTION_ARTISTIQUE_DIGITALE_1}>
                                                {SchoolPromotionEnum.DIRECTION_ARTISTIQUE_DIGITALE_1}
                                            </option>
                                            <option value={SchoolPromotionEnum.DIRECTION_ARTISTIQUE_DIGITALE_2}>
                                                {SchoolPromotionEnum.DIRECTION_ARTISTIQUE_DIGITALE_2}
                                            </option>
                                            <option value={SchoolPromotionEnum.LEAD_UX_1}>{SchoolPromotionEnum.LEAD_UX_1}</option>
                                            <option value={SchoolPromotionEnum.LEAD_UX_2}>{SchoolPromotionEnum.LEAD_UX_2}</option>
                                            <option value={SchoolPromotionEnum.TECH_LEAD_1}>{SchoolPromotionEnum.TECH_LEAD_1}</option>
                                            <option value={SchoolPromotionEnum.TECH_LEAD_2}>{SchoolPromotionEnum.TECH_LEAD_2}</option>
                                        </optgroup>
                                    </select>
                                </div>

                                {error && <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">{error}</div>}

                                <Button type="submit" className="w-full" size="lg" disabled={loading}>
                                    {loading ? "Création..." : "Créer mon compte"}
                                </Button>

                                <div className="text-center text-sm">
                                    <span className="text-muted-foreground">Déjà un compte ? </span>
                                    <Link href="/login" className="font-medium text-primary hover:underline">
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