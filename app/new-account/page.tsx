"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreateAccountAction } from "../actions/create-account.action";
import { AccessLevelEnum } from "@/utils/types/account"

export default function NewAccount() {
    const [form, setForm] = useState({
        name: "",
        lastname: "",
        mail: "",
        password: "",
        accessLevel: AccessLevelEnum.STUDENT,
    });

    const handleChange = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const value = event.target.value;
        setForm((prev) => ({
            ...prev,
            [key]: key === "accessLevel" ? (value as AccessLevelEnum) : value,
        }));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const payload = {
            name: form.name,
            lastname: form.lastname,
            mail: form.mail,
            password: form.password,
            accessLevel: form.accessLevel,
        };
        const result = await CreateAccountAction(payload);

        if(result.success === false) {
          console.log(result.success, result.message);
        };

        console.log(result.data);
    };

    return (
        <div className="mx-auto flex w-full max-w-md p-4">
            <Card className="w-full">
                <CardHeader className="pb-0">
                    <CardTitle>Créer un compte</CardTitle>
                    <CardDescription>Renseigne les informations du compte.</CardDescription>
                </CardHeader>

                <CardContent className="pb-6 pt-4">
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Prénom</Label>
                            <Input id="name" name="name" value={form.name} onChange={handleChange("name")} placeholder="Jane" required />
                        </div>

                        <div className="grid gap-2">
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

                        <div className="grid gap-2">
                            <Label htmlFor="mail">Mail</Label>
                            <Input id="mail" name="mail" value={form.mail} onChange={handleChange("mail")} placeholder="johndoe@gmail.com" required />
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

                        <div className="grid gap-2">
                            <Label htmlFor="accessLevel">Niveau d&apos;accès</Label>
                            <select
                                id="accessLevel"
                                name="accessLevel"
                                value={form.accessLevel}
                                onChange={handleChange("accessLevel")}
                                className="border-input bg-transparent text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 rounded-md border px-3 py-2">
                                <option value={AccessLevelEnum.ADMIN}>ADMIN</option>
                                <option value={AccessLevelEnum.STUDENT}>STUDENT</option>
                            </select>
                        </div>

                        <Button type="submit" className="w-full">
                            Créer le compte
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}