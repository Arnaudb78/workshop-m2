"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import CreateRoomForm from "./create-room-form";

type Room = {
    _id: string;
    name?: string;
    floor?: number;
    position?: number;
    description?: string;
    isUsed?: boolean;
    sensorId?: string | null;
};

export default function Rooms() {
    const [isOpen, setIsOpen] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/rooms");
            const result = await response.json();

            if (result.success) {
                setRooms(result.data || []);
            } else {
                setError("Erreur lors de la récupération des pièces.");
            }
        } catch (err) {
            console.error("[Rooms] error fetching rooms", err);
            setError("Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();
    }, []);

    const handleRoomCreated = () => {
        setIsOpen(false);
        fetchRooms(); // Rafraîchir la liste après création
    };

    return (
        <div>
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-2xl font-semibold">Pièces</h1>
                    <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                        Ajouter une pièce
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">Gérez vos pièces et leurs capteurs ici.</p>
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Créer une nouvelle pièce</SheetTitle>
                        <SheetDescription>Remplissez les informations pour créer une nouvelle pièce.</SheetDescription>
                    </SheetHeader>
                    <div className="m-6">
                        <CreateRoomForm onSuccess={handleRoomCreated} />
                    </div>
                </SheetContent>
            </Sheet>

            {/* Display all rooms */}
            <div className="mt-6">
                {loading && <p className="text-sm text-muted-foreground">Chargement des pièces...</p>}
                {error && (
                    <div className="rounded-md bg-destructive/10 border border-destructive/20 p-3 mb-4">
                        <p className="text-sm text-destructive">{error}</p>
                    </div>
                )}
                {!loading && !error && rooms.length === 0 && (
                    <div className="rounded-lg border bg-card p-8 text-center">
                        <p className="text-sm text-muted-foreground">Aucune pièce trouvée. Créez votre première pièce !</p>
                    </div>
                )}
                {!loading && !error && rooms.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {rooms.map((room) => (
                            <div key={room._id} className="rounded-lg border bg-card p-4 shadow-sm">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-semibold">{room.name || "Pièce sans nom"}</h3>
                                    {room.isUsed && (
                                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded">
                                            Utilisée
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                    {room.floor !== undefined && <p>Étage: {room.floor}</p>}
                                    {room.position !== undefined && <p>Position: {room.position}</p>}
                                    {room.description && <p className="mt-2">{room.description}</p>}
                                    {room.sensorId && <p className="text-xs mt-2">Capteur: {room.sensorId}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
