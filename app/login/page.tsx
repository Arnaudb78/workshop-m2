"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoginAction } from "@/app/actions/login.action";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ mail: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
            });

            if (result.success === false) {
                setError(result.message || "Erreur lors de la connexion.");
                setLoading(false);
                return;
            }

            router.push("/dashboard");
        } catch (err) {
            console.error("[LoginPage] error", err);
            const message = (err as Error).message || "Connexion impossible";
            setError(message);
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto flex w-full max-w-md p-4">
            <Card className="w-full">
                <CardHeader className="pb-0">
                    <CardTitle>Connexion</CardTitle>
                    <CardDescription>Accède à ton espace sécurisé.</CardDescription>
                </CardHeader>

                <CardContent className="pb-6 pt-4">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="mail">Mail</Label>
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

                        <div className="grid gap-2">
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

                        {error && <p className="text-sm text-destructive">{error}</p>}

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Connexion..." : "Se connecter"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}