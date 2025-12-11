"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreateRoomAction } from "@/app/actions/create-room.action";
import { cn } from "@/lib/utils";

type Props = {
    onSuccess?: () => void;
};

export default function CreateRoomForm({ onSuccess }: Props) {
    const [form, setForm] = useState({
        name: "",
        floor: "",
        position: "",
        description: "",
        isUsed: false,
        sensorId: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (key: keyof typeof form) => (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const value = e.target.value;
        if (key === "isUsed") {
            setForm((prev) => ({ ...prev, [key]: (e.target as HTMLInputElement).checked }));
        } else {
            setForm((prev) => ({ ...prev, [key]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const payload = {
                name: form.name,
                floor: parseInt(form.floor),
                position: parseInt(form.position),
                description: form.description || undefined,
                isUsed: form.isUsed,
                sensorId: form.sensorId || null,
            };

            const result = await CreateRoomAction(payload);

            if (result.success === false) {
                setError(result.message || "Une erreur est survenue lors de la création de la pièce.");
                setLoading(false);
                return;
            }

            // Réinitialiser le formulaire
            setForm({
                name: "",
                floor: "",
                position: "",
                description: "",
                isUsed: false,
                sensorId: "",
            });

            // Fermer le sheet après succès
            onSuccess?.();
        } catch (err) {
            console.error("[CreateRoomForm] error", err);
            setError("Une erreur inattendue est survenue.");
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5 px-1">
            
            {/* Name */}
            <div className="space-y-2">
                <Label htmlFor="name">
                    Nom de la pièce <span className="text-destructive">*</span>
                </Label>
                <Input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange("name")}
                    required
                    placeholder="Nom de la pièce"
                />
            </div>

            {/* Floor */}
            <div className="space-y-2">
                <Label htmlFor="floor">
                    Étage <span className="text-destructive">*</span>
                </Label>
                <select
                    id="floor"
                    name="floor"
                    value={form.floor}
                    onChange={handleChange("floor")}
                    required
                    className={cn(
                        "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                >
                    <option value="">Sélectionner un étage</option>
                    {[0, 1, 2, 3, 4, 5].map((floor) => (
                        <option key={floor} value={floor}>
                            Étage {floor}
                        </option>
                    ))}
                </select>
            </div>

            {/* Position */}
            <div className="space-y-2">
                <Label htmlFor="position">
                    Position <span className="text-destructive">*</span>
                </Label>
                <select
                    id="position"
                    name="position"
                    value={form.position}
                    onChange={handleChange("position")}
                    required
                    className={cn(
                        "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                >
                    <option value="">Sélectionner une position</option>
                    {[1, 2, 3, 4, 5].map((position) => (
                        <option key={position} value={position}>
                            Position {position}
                        </option>
                    ))}
                </select>
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange("description")}
                    rows={3}
                    placeholder="Description de la pièce (optionnel)"
                    className={cn(
                        "w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs",
                        "placeholder:text-muted-foreground",
                        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        "resize-none"
                    )}
                />
            </div>

            {/* Sensor ID */}
            <div className="space-y-2">
                <Label htmlFor="sensorId">ID du capteur</Label>
                <Input
                    id="sensorId"
                    name="sensorId"
                    type="text"
                    value={form.sensorId}
                    onChange={handleChange("sensorId")}
                    placeholder="ID du capteur (optionnel)"
                />
            </div>

            {/* Is Used */}
            <div className="flex items-center space-x-2">
                <input
                    id="isUsed"
                    name="isUsed"
                    type="checkbox"
                    checked={form.isUsed}
                    onChange={handleChange("isUsed")}
                    className="h-4 w-4 rounded border-input text-primary focus:ring-ring focus:ring-2"
                />
                <Label htmlFor="isUsed" className="!mb-0 cursor-pointer">
                    Pièce utilisée
                </Label>
            </div>

            {/* Error message */}
            {error && (
                <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3">
                    <p className="text-sm text-destructive">{error}</p>
                </div>
            )}

            {/* Submit button */}
            <div className="flex justify-center gap-2 pt-4">
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Création..." : "Créer"}
                </Button>
            </div>
        </form>
    );
}
