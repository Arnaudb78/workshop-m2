"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateMessageAction } from "@/app/actions/create-message.action";
import { AccountCookie } from "@/lib/auth";

type Room = {
    _id: string;
    name: string;
    floor: number;
    position: number;
};

type Props = {
    account: AccountCookie;
    onSuccess?: () => void;
};

export default function ReportIssueForm({ account, onSuccess }: Props) {
    const [form, setForm] = useState({
        roomId: "",
        title: "",
        description: "",
    });
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await fetch("/api/rooms");
                const data = await response.json();
                if (data.success && data.data) {
                    setRooms(data.data);
                }
            } catch (err) {
                console.error("[ReportIssueForm] error fetching rooms", err);
            }
        };
        fetchRooms();
    }, []);

    const handleChange = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            const payload = {
                title: form.title,
                description: form.description,
                roomId: form.roomId,
                studentMail: account.mail,
            };

            const result = await CreateMessageAction(payload);

            if (result.success === false) {
                setError(result.message || "Une erreur est survenue lors de l'envoi du message.");
                setLoading(false);
                return;
            }

            // Réinitialiser le formulaire
            setForm({
                roomId: "",
                title: "",
                description: "",
            });

            setSuccess(true);
            onSuccess?.();

            // Réinitialiser le message de succès après 3 secondes
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            console.error("[ReportIssueForm] error", err);
            setError("Une erreur inattendue est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Room Selection */}
            <div className="space-y-2">
                <Label htmlFor="roomId">
                    Salle concernée <span className="text-destructive">*</span>
                </Label>
                <select
                    id="roomId"
                    name="roomId"
                    value={form.roomId}
                    onChange={handleChange("roomId")}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <option value="">Sélectionnez une salle</option>
                    {rooms.map((room) => (
                        <option key={room._id} value={room._id}>
                            {room.name} - Étage {room.floor}, Position {room.position}
                        </option>
                    ))}
                </select>
            </div>

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="title">
                    Titre du problème <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="title"
                    name="title"
                    type="text"
                    value={form.title}
                    onChange={handleChange("title")}
                    required
                    placeholder="Ex: Problème de température"
                    maxLength={200}
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">
                    Description <span className="text-destructive">*</span>
                </Label>
                <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange("description")}
                    required
                    placeholder="Décrivez le problème en détail..."
                    rows={6}
                    maxLength={1000}
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <p className="text-xs text-muted-foreground">
                    {form.description.length}/1000 caractères
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                    {error}
                </div>
            )}

            {/* Success Message */}
            {success && (
                <div className="rounded-md bg-green-500/15 p-3 text-sm text-green-600 dark:text-green-400">
                    Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.
                </div>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={loading} className="w-full">
                {loading ? "Envoi en cours..." : "Envoyer le message"}
            </Button>
        </form>
    );
}
