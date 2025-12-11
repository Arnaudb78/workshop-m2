"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardAction } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter } from "@/components/ui/drawer";
import { Trash2, Plus, Minus } from "lucide-react";
import CreateRoomForm from "./create-room-form";
import { UpdateAcceptableValuesRoomAction } from "@/app/actions/update-acceptable-values-room.action";

type Room = {
    _id: string;
    name?: string;
    floor?: number;
    position?: number;
    description?: string;
    acceptable?: {
        co2?: number;
        decibel?: number;
        humidity?: number;
        temperature?: number;
    };
    isUsed?: boolean;
    sensorId?: string | null;
};

export default function Rooms() {
    const [isOpen, setIsOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [acceptableValues, setAcceptableValues] = useState<{
        co2: number;
        decibel: number;
        humidity: number;
        temperature: number;
    }>({
        co2: 0,
        decibel: 0,
        humidity: 0,
        temperature: 0,
    });
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

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
        fetchRooms();
    };

    const handleDestruct = (e: React.MouseEvent, room: Room) => {
        e.stopPropagation(); // Empêcher l'ouverture du drawer
        // TODO: Implémenter la suppression
        console.log("Supprimer room:", room._id);
    };

    const handleCardClick = (room: Room) => {
        console.log("[Rooms] Card clicked, room data:", room);
        setSelectedRoom(room);
        setAcceptableValues({
            co2: room.acceptable?.co2 ?? 0,
            decibel: room.acceptable?.decibel ?? 0,
            humidity: room.acceptable?.humidity ?? 0,
            temperature: room.acceptable?.temperature ?? 0,
        });
        setDrawerOpen(true);
    };

    const handleValueChange = (param: keyof typeof acceptableValues, delta: number) => {
        setAcceptableValues((prev) => ({
            ...prev,
            [param]: Math.max(0, (prev[param] || 0) + delta),
        }));
    };

    const handleSave = async () => {
        if (!selectedRoom) return;

        setSaving(true);
        setError(null);
        try {
            console.log("[Rooms] Saving acceptable values:", {
                roomId: selectedRoom._id,
                acceptableValues,
            });

            const result = await UpdateAcceptableValuesRoomAction({
                roomId: selectedRoom._id,
                acceptable: acceptableValues,
            });

            console.log("[Rooms] Save result:", result);

            if (result.success) {
                await fetchRooms();
                setDrawerOpen(false);
            } else {
                setError(result.message || "Erreur lors de la sauvegarde");
            }
        } catch (err) {
            console.error("[Rooms] error saving", err);
            setError("Une erreur est survenue lors de la sauvegarde.");
        } finally {
            setSaving(false);
        }
    };

    const ParameterCard = ({
        title,
        value,
        unit,
        onIncrement,
        onDecrement,
    }: {
        title: string;
        value: number;
        unit: string;
        onIncrement: () => void;
        onDecrement: () => void;
    }) => (
        <Card className="border">
            <CardContent className="pt-6">
                <div className="flex flex-col items-center space-y-4">
                    <h3 className="text-sm font-medium text-muted-foreground uppercase">{title}</h3>
                    <div className="flex items-center justify-center gap-6">
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={onDecrement}>
                            <Minus className="h-4 w-4" />
                        </Button>
                        <div className="flex flex-col items-center min-w-[120px]">
                            <span className="text-4xl font-bold">{value}</span>
                            <span className="text-xs text-muted-foreground uppercase mt-1">{unit}</span>
                        </div>
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full" onClick={onIncrement}>
                            <Plus className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

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
                {loading && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-32" />
                                    <CardAction>
                                        <Skeleton className="h-9 w-9 rounded-md" />
                                    </CardAction>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-full" />
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
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
                            <Card key={room._id} className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCardClick(room)}>
                                <CardHeader>
                                    <CardTitle>{room.name || "Pièce sans nom"}</CardTitle>
                                    {room.isUsed && (
                                        <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded w-fit">
                                            Utilisée
                                        </span>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        {room.floor !== undefined && <p>Étage: {room.floor}</p>}
                                        {room.position !== undefined && <p>Position: {room.position}</p>}
                                        {room.description && <p className="mt-2">{room.description}</p>}
                                        {room.sensorId && <p className="text-xs mt-2">Capteur: {room.sensorId}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Drawer bottom  */}
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="bottom">
                <DrawerContent className="max-h-[85vh]">
                    <DrawerHeader>
                        <DrawerTitle>{selectedRoom?.name || "Pièce sans nom"}</DrawerTitle>
                        <DrawerDescription>Paramétrez les valeurs acceptables pour cette pièce</DrawerDescription>
                    </DrawerHeader>
                    <div className="overflow-y-auto px-4 pb-4">
                        <div className="flex justify-around gap-4 py-4">
                            <ParameterCard
                                title="CO2"
                                value={acceptableValues.co2}
                                unit="PPM"
                                onIncrement={() => handleValueChange("co2", 10)}
                                onDecrement={() => handleValueChange("co2", -10)}
                            />
                            <ParameterCard
                                title="Decibel"
                                value={acceptableValues.decibel}
                                unit="dB"
                                onIncrement={() => handleValueChange("decibel", 1)}
                                onDecrement={() => handleValueChange("decibel", -1)}
                            />
                            <ParameterCard
                                title="Humidité"
                                value={acceptableValues.humidity}
                                unit="%"
                                onIncrement={() => handleValueChange("humidity", 1)}
                                onDecrement={() => handleValueChange("humidity", -1)}
                            />
                            <ParameterCard
                                title="Température"
                                value={acceptableValues.temperature}
                                unit="°C"
                                onIncrement={() => handleValueChange("temperature", 1)}
                                onDecrement={() => handleValueChange("temperature", -1)}
                            />
                        </div>
                    </div>
                    <DrawerFooter className="flex-col sm:flex-row gap-2">
                        {selectedRoom && (
                            <>
                                <Button
                                    variant="destructive"
                                    className="w-full sm:w-auto"
                                    onClick={(e) => handleDestruct(e, selectedRoom)}
                                    disabled={saving}>
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Supprimer
                                </Button>
                                <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto sm:ml-auto">
                                    {saving ? "Enregistrement..." : "Enregistrer"}
                                </Button>
                            </>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}
