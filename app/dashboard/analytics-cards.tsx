"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { GetAnalyticsAction } from "@/app/actions/get-analytics.action";

type AnalyticsData = {
    totalRooms: number;
    totalSensors: number;
    statusCounts: {
        REALLY_GOOD: number;
        GOOD: number;
        BAD: number;
        REALLY_BAD: number;
        UNKNOWN: number;
    };
};

const getStatusColor = (status: string): string => {
    switch (status) {
        case "REALLY_GOOD":
            return "text-green-600";
        case "GOOD":
            return "text-blue-600";
        case "BAD":
            return "text-orange-600";
        case "REALLY_BAD":
            return "text-red-600";
        case "UNKNOWN":
            return "text-gray-600";
        default:
            return "text-gray-600";
    }
};

export default function AnalyticsCards() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchAnalytics = async () => {
        try {
            const result = await GetAnalyticsAction();
            if (result.success && result.data) {
                setData(result.data);
            }
        } catch (err) {
            console.error("[AnalyticsCards] error fetching analytics", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalytics();

        // Rafraîchir les statistiques toutes les 30 secondes
        const interval = setInterval(() => {
            fetchAnalytics();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-5 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-16 w-20" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="rounded-lg border bg-card p-4 text-center">
                <p className="text-sm text-muted-foreground">Aucune donnée disponible.</p>
            </div>
        );
    }

    const statusCards = [
        { key: "REALLY_GOOD", label: "Très bon", count: data.statusCounts.REALLY_GOOD },
        { key: "GOOD", label: "Bon", count: data.statusCounts.GOOD },
        { key: "BAD", label: "Mauvais", count: data.statusCounts.BAD },
        { key: "REALLY_BAD", label: "Très mauvais", count: data.statusCounts.REALLY_BAD },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {/* Nombre total de pièces */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground text-center">Pièces totales</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-5xl font-bold tracking-tight text-center">{data.totalRooms}</div>
                </CardContent>
            </Card>

            {/* Nombre total de capteurs */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground text-center">Capteurs</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-5xl font-bold tracking-tight text-center">{data.totalSensors}</div>
                </CardContent>
            </Card>

            {/* Cartes par status */}
            {statusCards.map((status) => (
                <Card key={status.key}>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground text-center">État {status.label}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className={`text-5xl font-bold tracking-tight text-center `}>{status.count}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
