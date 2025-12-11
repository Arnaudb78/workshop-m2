"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Pencil } from "lucide-react";
import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { UpdateSensorAction } from "@/app/actions/update-sensor.action";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

type Sensor = {
    _id: string;
    name?: string;
    reference: string;
    roomId?: string | null;
    source?: string;
};

type Room = {
    _id: string;
    name?: string;
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
    luminos?: number;
    refreshAt?: string;
};

export default function Sensors() {
    const [sensors, setSensors] = useState<Sensor[]>([]);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [metrics, setMetrics] = useState<EnvironmentMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [editingSensor, setEditingSensor] = useState<Sensor | null>(null);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editRoomId, setEditRoomId] = useState<string | null>(null);
    const [updating, setUpdating] = useState(false);

    const fetchSensors = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await fetch("/api/sensors");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("La réponse n'est pas du JSON");
            }

            const result = await response.json();

            if (result.success) {
                setSensors(result.data || []);
            } else {
                setError(result.error || "Erreur lors de la récupération des capteurs.");
            }
        } catch (err) {
            console.error("[Sensors] error fetching sensors", err);
            setError("Une erreur est survenue lors de la récupération des capteurs.");
        } finally {
            setLoading(false);
        }
    };

    const fetchRooms = async () => {
        try {
            const response = await fetch("/api/rooms");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("La réponse n'est pas du JSON");
            }

            const result = await response.json();
            if (result.success) {
                setRooms(result.data || []);
            }
        } catch (err) {
            console.error("[Sensors] error fetching rooms", err);
        }
    };

    const fetchMetrics = async (roomId?: string | null) => {
        try {
            // Augmenter la limite pour récupérer plus de données historiques
            const url = roomId ? `/api/metrics?roomId=${roomId}&limit=200` : `/api/metrics?limit=200`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("La réponse n'est pas du JSON");
            }

            const result = await response.json();

            if (result.success) {
                const newMetrics = result.data || [];
                console.log(`[Sensors] Récupéré ${newMetrics.length} métriques pour la salle ${roomId || "globale"}`);
                setMetrics(newMetrics);
            }
        } catch (err) {
            console.error("[Sensors] error fetching metrics", err);
        }
    };

    useEffect(() => {
        fetchSensors();
        fetchRooms();
    }, []);

    useEffect(() => {
        fetchMetrics(selectedRoom);
    }, [selectedRoom]);

    useEffect(() => {
        if (!selectedRoom) return;

        const interval = setInterval(() => {
            fetchMetrics(selectedRoom);
        }, 10000);

        return () => clearInterval(interval);
    }, [selectedRoom]);

    const getRoomName = (roomId: string | null | undefined) => {
        if (!roomId) return "Non assigné";
        const room = rooms.find((r) => r._id === roomId);
        return room?.name || "Salle inconnue";
    };

    const getRoom = (roomId: string | null | undefined): Room | undefined => {
        if (!roomId) return undefined;
        return rooms.find((r) => r._id === roomId);
    };

    const getStatusBadgeVariant = (
        status: "REALLY_GOOD" | "GOOD" | "BAD" | "REALLY_BAD" | null | undefined
    ): "default" | "secondary" | "destructive" | "outline" => {
        if (!status) return "outline";
        switch (status) {
            case "REALLY_GOOD":
                return "default";
            case "GOOD":
                return "secondary";
            case "BAD":
                return "destructive";
            case "REALLY_BAD":
                return "destructive";
            default:
                return "outline";
        }
    };

    const getStatusLabel = (status: "REALLY_GOOD" | "GOOD" | "BAD" | "REALLY_BAD" | null | undefined): string => {
        if (!status) return "N/A";
        switch (status) {
            case "REALLY_GOOD":
                return "Excellent";
            case "GOOD":
                return "Bon";
            case "BAD":
                return "Mauvais";
            case "REALLY_BAD":
                return "Très mauvais";
            default:
                return "N/A";
        }
    };

    const allSensors = sensors;

    const prepareChartData = (data: EnvironmentMetric[], metricType: "temperature" | "humidity" | "co2" | "sound") => {
        if (!data || data.length === 0) {
            return { labels: [], values: [], sensorRefs: [] };
        }

        const sortedData = [...data].sort((a, b) => {
            const dateA = a.refreshAt ? new Date(a.refreshAt).getTime() : 0;
            const dateB = b.refreshAt ? new Date(b.refreshAt).getTime() : 0;
            return dateA - dateB;
        });

        const filteredData: EnvironmentMetric[] = [];
        let lastTimestamp: number | null = null;
        const TWO_MINUTES_MS = 2 * 60 * 1000; // 2 minutes en millisecondes

        sortedData.forEach((m) => {
            if (!m.refreshAt) return;
            const timestamp = new Date(m.refreshAt).getTime();

            // Toujours ajouter le premier point, puis filtrer selon l'intervalle
            if (lastTimestamp === null || timestamp - lastTimestamp >= TWO_MINUTES_MS) {
                filteredData.push(m);
                lastTimestamp = timestamp;
            }
        });

        if (filteredData.length <= 1 && sortedData.length > 1) {
            const maxPoints = Math.min(20, sortedData.length);
            const step = Math.max(1, Math.floor(sortedData.length / maxPoints));
            const sampledData: EnvironmentMetric[] = [];

            for (let i = 0; i < sortedData.length; i += step) {
                sampledData.push(sortedData[i]);
            }

            if (sortedData.length > 0) {
                const lastPoint = sortedData[sortedData.length - 1];
                if (sampledData.length === 0 || sampledData[sampledData.length - 1]._id !== lastPoint._id) {
                    sampledData.push(lastPoint);
                }
            }

            filteredData.length = 0;
            filteredData.push(...sampledData);
            console.log(`[prepareChartData] Données échantillonnées: ${sortedData.length} → ${filteredData.length} points`);
        }

        const labels = filteredData.map((m) => {
            if (!m.refreshAt) return "";
            const date = new Date(m.refreshAt);
            return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
        });

        const values: number[] = [];
        const sensorRefs: string[] = [];

        filteredData.forEach((m) => {
            sensorRefs.push(m.sensorRef);
            switch (metricType) {
                case "temperature":
                    values.push(parseFloat(m.temperature?.temperatureReading || "0"));
                    break;
                case "humidity":
                    values.push(parseFloat(m.humidity?.humidityNumber || "0"));
                    break;
                case "co2":
                    values.push(parseFloat(m.co2 || "0"));
                    break;
                case "sound":
                    values.push(m.sound?.decibel || 0);
                    break;
            }
        });

        return { labels, values, sensorRefs };
    };

    const temperatureData = prepareChartData(metrics, "temperature");
    const humidityData = prepareChartData(metrics, "humidity");
    const co2Data = prepareChartData(metrics, "co2");
    const soundData = prepareChartData(metrics, "sound");

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    const temperatureChartData = {
        labels: temperatureData.labels,
        datasets: [
            {
                label: "Température (°C)",
                data: temperatureData.values,
                borderColor: "rgb(239, 68, 68)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                tension: 0.4,
            },
        ],
    };

    const humidityChartData = {
        labels: humidityData.labels,
        datasets: [
            {
                label: "Humidité (%)",
                data: humidityData.values,
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.4,
            },
        ],
    };

    const co2ChartData = {
        labels: co2Data.labels,
        datasets: [
            {
                label: "CO2 (PPM)",
                data: co2Data.values,
                borderColor: "rgb(34, 197, 94)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                tension: 0.4,
            },
        ],
    };

    const soundChartData = {
        labels: soundData.labels,
        datasets: [
            {
                label: "Son (dB)",
                data: soundData.values,
                borderColor: "rgb(168, 85, 247)",
                backgroundColor: "rgba(168, 85, 247, 0.1)",
                tension: 0.4,
            },
        ],
    };

    const handleRoomClick = (roomId: string | null) => {
        if (!roomId) return;
        setSelectedRoom(roomId);
        setDrawerOpen(true);
    };

    const handleEditClick = (sensor: Sensor, e: React.MouseEvent) => {
        e.stopPropagation(); // Empêcher l'ouverture du drawer
        setEditingSensor(sensor);
        setEditName(sensor.name || "");
        setEditRoomId(sensor.roomId || null);
        setSheetOpen(true);
    };

    const handleUpdateSensor = async () => {
        if (!editingSensor) return;

        setUpdating(true);
        try {
            const result = await UpdateSensorAction({
                sensorId: editingSensor._id,
                name: editName.trim() || undefined,
                roomId: editRoomId || null,
            });

            if (result.success && result.data) {
                // Mettre à jour la liste des capteurs
                setSensors((prev) => prev.map((s) => (s._id === editingSensor._id ? result.data : s)));
                setSheetOpen(false);
                setEditingSensor(null);
            } else {
                alert(result.message || "Erreur lors de la mise à jour du capteur");
            }
        } catch (err) {
            console.error("[Sensors] error updating sensor", err);
            alert("Une erreur est survenue lors de la mise à jour du capteur");
        } finally {
            setUpdating(false);
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-2">Capteurs et Métriques</h1>
                <p className="text-sm text-muted-foreground">Visualisez les métriques environnementales de vos capteurs par salle.</p>
            </div>

            {/* Liste de tous les capteurs */}
            <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Tous les capteurs</h2>
                {loading && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <Card key={i}>
                                <CardHeader>
                                    <Skeleton className="h-6 w-32" />
                                </CardHeader>
                                <CardContent>
                                    <Skeleton className="h-4 w-24" />
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

                {!loading && !error && allSensors.length === 0 && (
                    <div className="rounded-lg border bg-card p-8 text-center">
                        <p className="text-sm text-muted-foreground">Aucun capteur trouvé.</p>
                    </div>
                )}

                {!loading && !error && allSensors.length > 0 && (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {allSensors.map((sensor) => (
                            <Card
                                key={sensor._id}
                                className={`relative transition-shadow flex flex-col ${sensor.roomId ? "cursor-pointer hover:shadow-md" : ""}`}
                                onClick={() => sensor.roomId && handleRoomClick(sensor.roomId)}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>{sensor.name || sensor.reference}</CardTitle>
                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleEditClick(sensor, e)}>
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-1 flex flex-col">
                                    <div className="space-y-1 text-sm text-muted-foreground mb-4">
                                        <p>Référence: {sensor.reference}</p>
                                        <p>Salle: {getRoomName(sensor.roomId)}</p>
                                        {sensor.source && <p>Source: {sensor.source}</p>}
                                    </div>
                                    <div className="mt-auto pt-4 border-t">
                                        {!sensor.roomId ? (
                                            <Badge variant="destructive">Salle non-assignée</Badge>
                                        ) : (
                                            <div className="flex flex-wrap gap-2">
                                                {(() => {
                                                    const room = getRoom(sensor.roomId);
                                                    if (!room?.status) return null;
                                                    return (
                                                        <>
                                                            {room.status.co2 && (
                                                                <Badge variant={getStatusBadgeVariant(room.status.co2)}>
                                                                    CO₂ {getStatusLabel(room.status.co2)}
                                                                </Badge>
                                                            )}
                                                            {room.status.humidity && (
                                                                <Badge variant={getStatusBadgeVariant(room.status.humidity)}>
                                                                    H {getStatusLabel(room.status.humidity)}
                                                                </Badge>
                                                            )}
                                                            {room.status.temperature && (
                                                                <Badge variant={getStatusBadgeVariant(room.status.temperature)}>
                                                                    T {getStatusLabel(room.status.temperature)}
                                                                </Badge>
                                                            )}
                                                            {room.status.decibel && (
                                                                <Badge variant={getStatusBadgeVariant(room.status.decibel)}>
                                                                    dB {getStatusLabel(room.status.decibel)}
                                                                </Badge>
                                                            )}
                                                        </>
                                                    );
                                                })()}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Drawer pour les détails d'une salle */}
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} direction="bottom">
                <DrawerContent className="max-h-[85vh]">
                    <DrawerHeader>
                        <DrawerTitle>{selectedRoom ? getRoomName(selectedRoom) : "Vue globale"}</DrawerTitle>
                        <DrawerDescription>
                            {selectedRoom ? `Métriques détaillées pour ${getRoomName(selectedRoom)}` : "Métriques globales de toutes les salles"}
                        </DrawerDescription>
                    </DrawerHeader>
                    <div className="overflow-y-auto px-4 pb-4">
                        {metrics.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 py-4">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Température</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Line data={temperatureChartData} options={chartOptions} />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Humidité</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Line data={humidityChartData} options={chartOptions} />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>CO2</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Line data={co2ChartData} options={chartOptions} />
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardHeader>
                                        <CardTitle>Son (Décibels)</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <Line data={soundChartData} options={chartOptions} />
                                    </CardContent>
                                </Card>
                            </div>
                        ) : (
                            <div className="py-8 text-center text-muted-foreground">
                                <p>Aucune métrique disponible pour cette salle.</p>
                            </div>
                        )}
                    </div>
                </DrawerContent>
            </Drawer>

            {/* Sheet pour éditer un capteur */}
            <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Éditer le capteur</SheetTitle>
                        <SheetDescription>Modifiez le nom et assignez une salle au capteur.</SheetDescription>
                    </SheetHeader>
                    <div className="m-6 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="sensor-name">Nom du capteur</Label>
                            <Input
                                id="sensor-name"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                placeholder={editingSensor?.reference}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="sensor-room">Salle</Label>
                            <select
                                id="sensor-room"
                                value={editRoomId || ""}
                                onChange={(e) => setEditRoomId(e.target.value || null)}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="">Aucune salle</option>
                                {rooms.map((room) => (
                                    <option key={room._id} value={room._id}>
                                        {room.name || `Salle ${room._id}`}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <Label>Référence</Label>
                            <Input value={editingSensor?.reference || ""} disabled className="bg-muted" />
                        </div>
                        <div className="flex gap-2 pt-4">
                            <Button onClick={handleUpdateSensor} disabled={updating} className="flex-1">
                                {updating ? "Mise à jour..." : "Enregistrer"}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setSheetOpen(false);
                                    setEditingSensor(null);
                                }}
                                disabled={updating}>
                                Annuler
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}
