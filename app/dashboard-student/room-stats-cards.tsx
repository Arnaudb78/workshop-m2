"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useEffect } from "react";
import { GetStudentRoomStatsAction } from "@/app/actions/get-student-room-stats.action";

type RoomStatsData = {
    totalRooms: number;
    availableRooms: number;
    occupiedRooms: number;
};

export default function RoomStatsCards() {
    const [data, setData] = useState<RoomStatsData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const result = await GetStudentRoomStatsAction();
            if (result.success && result.data) {
                setData(result.data);
            }
        } catch (err) {
            console.error("[RoomStatsCards] error fetching stats", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();

        // Rafraîchir les statistiques toutes les 30 secondes
        const interval = setInterval(() => {
            fetchStats();
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="grid gap-4 md:grid-cols-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-5 w-32" />
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

    return (
        <div className="grid gap-4 md:grid-cols-3">
            {/* Nombre total de salles */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground text-center">Salles totales</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-5xl font-bold tracking-tight text-center">{data.totalRooms}</div>
                </CardContent>
            </Card>

            {/* Nombre de salles disponibles */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground text-center">Salles disponibles</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-5xl font-bold tracking-tight text-center text-green-600">{data.availableRooms}</div>
                </CardContent>
            </Card>

            {/* Nombre de salles occupées */}
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground text-center">Salles occupées</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-5xl font-bold tracking-tight text-center text-red-600">{data.occupiedRooms}</div>
                </CardContent>
            </Card>
        </div>
    );
}
