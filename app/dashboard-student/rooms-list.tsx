"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { useState, useEffect } from "react";

type Room = {
    _id: string;
    name?: string;
    floor?: number;
    position?: number;
    description?: string;
    isUsed?: boolean;
    status?: {
        co2?: "REALLY_GOOD" | "GOOD" | "BAD" | "REALLY_BAD" | null;
        decibel?: "REALLY_GOOD" | "GOOD" | "BAD" | "REALLY_BAD" | null;
        humidity?: "REALLY_GOOD" | "GOOD" | "BAD" | "REALLY_BAD" | null;
        temperature?: "REALLY_GOOD" | "GOOD" | "BAD" | "REALLY_BAD" | null;
    };
};

type EnvironmentMetric = {
    _id: string;
    sensorRef: string;
    humidity?: {
        humidityNumber?: string;
        unit?: string;
    };
    temperature?: {
        temperatureReading?: string;
        unit?: string;
    };
    sound?: {
        decibel?: number;
        unit?: string;
    };
    co2?: string;
    refreshAt?: string;
};

type Averages = {
    co2: number | null;
    humidity: number | null;
    temperature: number | null;
    decibel: number | null;
};

const getStatusBadgeVariant = (status: string | null | undefined): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
        case "REALLY_GOOD":
            return "default";
        case "GOOD":
            return "secondary";
        case "BAD":
        case "REALLY_BAD":
            return "destructive";
        default:
            return "outline";
    }
};

const getStatusLabel = (status: string | null | undefined): string => {
    switch (status) {
        case "REALLY_GOOD":
            return "Très bon";
        case "GOOD":
            return "Bon";
        case "BAD":
            return "Mauvais";
        case "REALLY_BAD":
            return "Très mauvais";
        default:
            return "Non disponible";
    }
};

const getStatusColor = (status: string | null | undefined): string => {
    switch (status) {
        case "REALLY_GOOD":
            return "text-green-600";
        case "GOOD":
            return "text-blue-600";
        case "BAD":
            return "text-orange-600";
        case "REALLY_BAD":
            return "text-red-600";
        default:
            return "text-gray-500";
    }
};

export default function RoomsList() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [averages, setAverages] = useState<Averages>({
        co2: null,
        humidity: null,
        temperature: null,
        decibel: null,
    });
    const [loadingMetrics, setLoadingMetrics] = useState(false);

    const fetchRooms = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/rooms");
            const result = await response.json();

            if (result.success) {
                setRooms(result.data || []);
            }
        } catch (err) {
            console.error("[RoomsList] error fetching rooms", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms();

        // Rafraîchir toutes les 30 secondes
        const interval = setInterval(() => {
            fetchRooms();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const calculateAverages = (metrics: EnvironmentMetric[]): Averages => {
        const validMetrics = metrics.filter((m) => m.refreshAt);
        if (validMetrics.length === 0) {
            return { co2: null, humidity: null, temperature: null, decibel: null };
        }

        let co2Sum = 0;
        let co2Count = 0;
        let humiditySum = 0;
        let humidityCount = 0;
        let temperatureSum = 0;
        let temperatureCount = 0;
        let decibelSum = 0;
        let decibelCount = 0;

        validMetrics.forEach((metric) => {
            // CO2
            if (metric.co2) {
                const co2Value = parseFloat(metric.co2);
                if (!isNaN(co2Value)) {
                    co2Sum += co2Value;
                    co2Count++;
                }
            }

            // Humidité
            if (metric.humidity?.humidityNumber) {
                const humidityValue = parseFloat(metric.humidity.humidityNumber);
                if (!isNaN(humidityValue)) {
                    humiditySum += humidityValue;
                    humidityCount++;
                }
            }

            // Température
            if (metric.temperature?.temperatureReading) {
                const tempValue = parseFloat(metric.temperature.temperatureReading);
                if (!isNaN(tempValue)) {
                    temperatureSum += tempValue;
                    temperatureCount++;
                }
            }

            // Décibels
            if (metric.sound?.decibel !== undefined && metric.sound.decibel !== null) {
                decibelSum += metric.sound.decibel;
                decibelCount++;
            }
        });

        return {
            co2: co2Count > 0 ? Math.round(co2Sum / co2Count) : null,
            humidity: humidityCount > 0 ? Math.round((humiditySum / humidityCount) * 100) / 100 : null,
            temperature: temperatureCount > 0 ? Math.round((temperatureSum / temperatureCount) * 100) / 100 : null,
            decibel: decibelCount > 0 ? Math.round((decibelSum / decibelCount) * 100) / 100 : null,
        };
    };

    const fetchMetricsForRoom = async (roomId: string) => {
        setLoadingMetrics(true);
        try {
            const response = await fetch(`/api/metrics?roomId=${roomId}&limit=200`);
            const result = await response.json();

            if (result.success && result.data) {
                const calculatedAverages = calculateAverages(result.data);
                setAverages(calculatedAverages);
            }
        } catch (err) {
            console.error("[RoomsList] error fetching metrics", err);
        } finally {
            setLoadingMetrics(false);
        }
    };

    const handleCardClick = (room: Room) => {
        setSelectedRoom(room);
        setDrawerOpen(true);
        if (room._id) {
            fetchMetricsForRoom(room._id);
        }
    };

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-32" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-24 mt-2" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (rooms.length === 0) {
        return (
            <div className="rounded-lg border bg-card p-8 text-center">
                <p className="text-sm text-muted-foreground">Aucune pièce disponible pour le moment.</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {rooms.map((room) => (
                    <Card
                        key={room._id}
                        className="cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => handleCardClick(room)}>
                        <CardHeader>
                            <CardTitle>{room.name || "Pièce sans nom"}</CardTitle>
                            <Badge
                                variant={room.isUsed ? "destructive" : "default"}
                                className={
                                    room.isUsed
                                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border-red-200 dark:border-red-800"
                                        : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border-green-200 dark:border-green-800"
                                }>
                                {room.isUsed ? "Occupé" : "Disponible"}
                            </Badge>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1 text-sm text-muted-foreground">
                                {room.floor !== undefined && <p>Étage: {room.floor}</p>}
                                {room.position !== undefined && <p>Position: {room.position}</p>}
                                {room.description && <p className="mt-2">{room.description}</p>}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Drawer bottom pour les détails */}
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="bottom">
                <DrawerContent className="max-h-[85vh]">
                    <DrawerHeader>
                        <DrawerTitle>{selectedRoom?.name || "Pièce sans nom"}</DrawerTitle>
                        <DrawerDescription>Informations environnementales de la pièce</DrawerDescription>
                    </DrawerHeader>
                    <div className="overflow-y-auto px-4 pb-4">
                        {selectedRoom && (
                            <div className="space-y-6 py-4">
                                {/* Informations générales */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold uppercase text-muted-foreground">Informations générales</h3>
                                    <Card className="border">
                                        <CardContent className="pt-6">
                                            <div className="space-y-4">
                                                {selectedRoom.floor !== undefined && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-muted-foreground">Étage</span>
                                                        <span className="text-lg font-semibold">{selectedRoom.floor}</span>
                                                    </div>
                                                )}
                                                {selectedRoom.position !== undefined && (
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-sm text-muted-foreground">Position</span>
                                                        <span className="text-lg font-semibold">{selectedRoom.position}</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm text-muted-foreground">Statut</span>
                                                    <Badge
                                                        variant={selectedRoom.isUsed ? "destructive" : "default"}
                                                        className={
                                                            selectedRoom.isUsed
                                                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                        }>
                                                        {selectedRoom.isUsed ? "Occupé" : "Disponible"}
                                                    </Badge>
                                                </div>
                                                {selectedRoom.description && (
                                                    <>
                                                        <div className="border-t pt-4 mt-4" />
                                                        <p className="text-sm text-muted-foreground">{selectedRoom.description}</p>
                                                    </>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Métriques environnementales */}
                                <div className="space-y-3">
                                    <h3 className="text-sm font-semibold uppercase text-muted-foreground">Métriques environnementales</h3>
                                    {loadingMetrics ? (
                                        <div className="grid gap-4 md:grid-cols-2">
                                            {[1, 2, 3, 4].map((i) => (
                                                <Card key={i} className="border">
                                                    <CardContent className="pt-6">
                                                        <Skeleton className="h-6 w-24 mx-auto mb-4" />
                                                        <Skeleton className="h-12 w-32 mx-auto" />
                                                        <Skeleton className="h-4 w-16 mx-auto mt-2" />
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="grid gap-4 md:grid-cols-2">
                                            {(selectedRoom.status?.co2 || averages.co2 !== null) && (
                                                <Card className="border">
                                                    <CardContent className="pt-6">
                                                        <div className="flex flex-col items-center space-y-4">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-sm font-medium text-muted-foreground uppercase">CO₂</h3>
                                                                {selectedRoom.status?.co2 && (
                                                                    <Badge variant={getStatusBadgeVariant(selectedRoom.status.co2)} className="text-xs">
                                                                        {getStatusLabel(selectedRoom.status.co2)}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {averages.co2 !== null ? (
                                                                <div className="flex flex-col items-center min-w-[120px]">
                                                                    <span className="text-4xl font-bold">{averages.co2}</span>
                                                                    <span className="text-xs text-muted-foreground uppercase mt-1">PPM</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center min-w-[120px]">
                                                                    <span className="text-sm text-muted-foreground">Non disponible</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                            {(selectedRoom.status?.humidity || averages.humidity !== null) && (
                                                <Card className="border">
                                                    <CardContent className="pt-6">
                                                        <div className="flex flex-col items-center space-y-4">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-sm font-medium text-muted-foreground uppercase">Humidité</h3>
                                                                {selectedRoom.status?.humidity && (
                                                                    <Badge variant={getStatusBadgeVariant(selectedRoom.status.humidity)} className="text-xs">
                                                                        {getStatusLabel(selectedRoom.status.humidity)}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {averages.humidity !== null ? (
                                                                <div className="flex flex-col items-center min-w-[120px]">
                                                                    <span className="text-4xl font-bold">{averages.humidity}</span>
                                                                    <span className="text-xs text-muted-foreground uppercase mt-1">%</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center min-w-[120px]">
                                                                    <span className="text-sm text-muted-foreground">Non disponible</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                            {(selectedRoom.status?.temperature || averages.temperature !== null) && (
                                                <Card className="border">
                                                    <CardContent className="pt-6">
                                                        <div className="flex flex-col items-center space-y-4">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-sm font-medium text-muted-foreground uppercase">Température</h3>
                                                                {selectedRoom.status?.temperature && (
                                                                    <Badge variant={getStatusBadgeVariant(selectedRoom.status.temperature)} className="text-xs">
                                                                        {getStatusLabel(selectedRoom.status.temperature)}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {averages.temperature !== null ? (
                                                                <div className="flex flex-col items-center min-w-[120px]">
                                                                    <span className="text-4xl font-bold">{averages.temperature}</span>
                                                                    <span className="text-xs text-muted-foreground uppercase mt-1">°C</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center min-w-[120px]">
                                                                    <span className="text-sm text-muted-foreground">Non disponible</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                            {(selectedRoom.status?.decibel || averages.decibel !== null) && (
                                                <Card className="border">
                                                    <CardContent className="pt-6">
                                                        <div className="flex flex-col items-center space-y-4">
                                                            <div className="flex items-center gap-2">
                                                                <h3 className="text-sm font-medium text-muted-foreground uppercase">Décibels</h3>
                                                                {selectedRoom.status?.decibel && (
                                                                    <Badge variant={getStatusBadgeVariant(selectedRoom.status.decibel)} className="text-xs">
                                                                        {getStatusLabel(selectedRoom.status.decibel)}
                                                                    </Badge>
                                                                )}
                                                            </div>
                                                            {averages.decibel !== null ? (
                                                                <div className="flex flex-col items-center min-w-[120px]">
                                                                    <span className="text-4xl font-bold">{averages.decibel}</span>
                                                                    <span className="text-xs text-muted-foreground uppercase mt-1">dB</span>
                                                                </div>
                                                            ) : (
                                                                <div className="flex flex-col items-center min-w-[120px]">
                                                                    <span className="text-sm text-muted-foreground">Non disponible</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )}
                                            {!selectedRoom.status?.co2 &&
                                                !selectedRoom.status?.humidity &&
                                                !selectedRoom.status?.temperature &&
                                                !selectedRoom.status?.decibel &&
                                                averages.co2 === null &&
                                                averages.humidity === null &&
                                                averages.temperature === null &&
                                                averages.decibel === null && (
                                                    <Card className="border md:col-span-2">
                                                        <CardContent className="pt-6">
                                                            <div className="text-center py-8">
                                                                <span className="text-sm text-muted-foreground">Aucune métrique disponible pour le moment</span>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    );
}
