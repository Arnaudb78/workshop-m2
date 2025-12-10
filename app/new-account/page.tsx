"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function NewAccount() {
  const [form, setForm] = useState({
    name: "",
    lastname: "",
    mail: "",
    password: "",
    accessLevel: "STUDENT",
  })

  const handleChange = (key: keyof typeof form) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }))
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // TODO: send form to API / action
    console.log("new account", form)
  }

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
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange("name")}
                placeholder="Jane"
                required
              />
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
              <Input
                id="mail"
                name="mail"
                value={form.mail}
                onChange={handleChange("mail")}
                placeholder="Doe"
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

            <div className="grid gap-2">
              <Label htmlFor="accessLevel">Niveau d&apos;accès</Label>
              <select
                id="accessLevel"
                name="accessLevel"
                value={form.accessLevel}
                onChange={handleChange("accessLevel")}
                className="border-input bg-transparent text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 rounded-md border px-3 py-2"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="STUDENT">STUDENT</option>
              </select>
            </div>

            <Button type="submit" className="w-full">
              Créer le compte
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}