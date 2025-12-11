import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import EnvironmentMetrics from "@/models/environment-metrics";
import Sensor from "@/models/sensor";

export async function GET(request: Request) {
    try {
        await connectToDatabase();
        
        const { searchParams } = new URL(request.url);
        const sensorRef = searchParams.get("sensorRef");
        const roomId = searchParams.get("roomId");
        const limit = parseInt(searchParams.get("limit") || "50");

        let query: any = {};

        // Si roomId est fourni, récupérer les sensorRef correspondants
        if (roomId) {
            const sensors = await Sensor.find({ roomId }).select("reference").lean();
            const sensorRefs = sensors.map((s) => s.reference);
            query.sensorRef = { $in: sensorRefs };
        } else if (sensorRef) {
            query.sensorRef = sensorRef;
        }

        const metrics = await EnvironmentMetrics.find(query)
            .sort({ refreshAt: -1 })
            .limit(limit)
            .lean();

        const metricsWithStringIds = metrics.map((metric) => ({
            ...metric,
            _id: metric._id?.toString(),
            refreshAt: metric.refreshAt ? new Date(metric.refreshAt).toISOString() : null,
        }));

        return NextResponse.json({ success: true, data: metricsWithStringIds }, { status: 200 });
    } catch (error) {
        console.error("[GET /api/metrics] error fetching metrics", error);
        return NextResponse.json(
            { success: false, error: "Erreur lors de la récupération des métriques." },
            { status: 500 }
        );
    }
}
