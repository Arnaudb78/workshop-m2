"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
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

    // Rafraîchir les métriques toutes les 30 secondes quand une salle est sélectionnée
    useEffect(() => {
        if (!selectedRoom) return;

        const interval = setInterval(() => {
            fetchMetrics(selectedRoom);
        }, 30000); // 30 secondes

        return () => clearInterval(interval);
    }, [selectedRoom]);

    const getRoomName = (roomId: string | null | undefined) => {
        if (!roomId) return "Non assigné";
        const room = rooms.find((r) => r._id === roomId);
        return room?.name || "Salle inconnue";
    };

    // Afficher tous les capteurs
    const allSensors = sensors;

    // Préparer les données pour les graphiques avec un espacement de 2 minutes
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

        // Si après filtrage on n'a qu'un seul point mais qu'on a plusieurs données,
        // réduire l'intervalle de filtrage ou prendre un échantillonnage
        if (filteredData.length <= 1 && sortedData.length > 1) {
            // Si toutes les données sont dans une fenêtre de moins de 2 minutes,
            // échantillonner pour avoir au moins quelques points visibles
            const maxPoints = Math.min(20, sortedData.length);
            const step = Math.max(1, Math.floor(sortedData.length / maxPoints));
            const sampledData: EnvironmentMetric[] = [];

            for (let i = 0; i < sortedData.length; i += step) {
                sampledData.push(sortedData[i]);
            }

            // S'assurer d'inclure le dernier point
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
        if (!roomId) return; // Ne pas ouvrir le drawer si pas de roomId
        setSelectedRoom(roomId);
        setDrawerOpen(true);
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
                                className={`relative transition-shadow ${sensor.roomId ? "cursor-pointer hover:shadow-md" : ""}`}
                                onClick={() => sensor.roomId && handleRoomClick(sensor.roomId)}>
                                <CardHeader>
                                    <CardTitle>{sensor.name || sensor.reference}</CardTitle>
                                </CardHeader>
                                <CardContent className="relative">
                                    <div className="space-y-1 text-sm text-muted-foreground">
                                        <p>Référence: {sensor.reference}</p>
                                        <p>Salle: {getRoomName(sensor.roomId)}</p>
                                        {sensor.source && <p>Source: {sensor.source}</p>}
                                    </div>
                                    {!sensor.roomId && (
                                        <div className="absolute bottom-0 right-0 pb-4 pr-4">
                                            <Badge variant="destructive">Salle non-assignée</Badge>
                                        </div>
                                    )}
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
        </div>
    );
}
