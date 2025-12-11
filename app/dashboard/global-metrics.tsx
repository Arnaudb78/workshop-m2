"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
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

export default function GlobalMetrics() {
    const [metrics, setMetrics] = useState<EnvironmentMetric[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchMetrics = async () => {
        try {
            const response = await fetch("/api/metrics?limit=200");

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("La réponse n'est pas du JSON");
            }

            const result = await response.json();

            if (result.success) {
                setMetrics(result.data || []);
            }
        } catch (err) {
            console.error("[GlobalMetrics] error fetching metrics", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
        
        // Rafraîchir les métriques toutes les 30 secondes
        const interval = setInterval(() => {
            fetchMetrics();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

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

    if (loading) {
        return (
            <div className="space-y-6">
                <h2 className="text-lg font-semibold">Métriques globales</h2>
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-64 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    if (metrics.length === 0) {
        return (
            <div className="space-y-6">
                <h2 className="text-lg font-semibold">Métriques globales</h2>
                <div className="rounded-lg border bg-card p-8 text-center">
                    <p className="text-sm text-muted-foreground">Aucune métrique disponible pour le moment.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-lg font-semibold">Métriques globales</h2>
            <div className="grid gap-6 md:grid-cols-2">
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
        </div>
    );
}
