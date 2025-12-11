"use server";

import { connectToDatabase } from "@/lib/database";
import Room from "@/models/room";
import Sensor from "@/models/sensor";

type Status = "REALLY_GOOD" | "GOOD" | "BAD" | "REALLY_BAD" | null;

/**
 * Calcule le status global d'une pièce en prenant le pire status parmi tous les métriques
 */
function getGlobalStatus(room: {
    status?: {
        co2?: Status;
        decibel?: Status;
        humidity?: Status;
        temperature?: Status;
    } | null;
}): Status {
    if (!room.status) {
        return null;
    }

    const statuses = [
        room.status.co2,
        room.status.decibel,
        room.status.humidity,
        room.status.temperature,
    ].filter((s): s is Exclude<Status, null> => s !== null && s !== undefined);

    if (statuses.length === 0) {
        return null;
    }

    if (statuses.includes("REALLY_BAD")) {
        return "REALLY_BAD";
    }
    if (statuses.includes("BAD")) {
        return "BAD";
    }
    if (statuses.includes("GOOD")) {
        return "GOOD";
    }
    return "REALLY_GOOD";
}

export async function GetAnalyticsAction() {
    try {
        await connectToDatabase();

        const totalRooms = await Room.countDocuments({});

        const totalSensors = await Sensor.countDocuments({});

        const rooms = await Room.find({}).select("status").lean();

        const statusCounts = {
            REALLY_GOOD: 0,
            GOOD: 0,
            BAD: 0,
            REALLY_BAD: 0,
            null: 0,
        };

        rooms.forEach((room) => {
            const globalStatus = getGlobalStatus(room);
            if (globalStatus === null) {
                statusCounts.null++;
            } else {
                statusCounts[globalStatus]++;
            }
        });

        return {
            success: true,
            data: {
                totalRooms,
                totalSensors,
                statusCounts: {
                    REALLY_GOOD: statusCounts.REALLY_GOOD,
                    GOOD: statusCounts.GOOD,
                    BAD: statusCounts.BAD,
                    REALLY_BAD: statusCounts.REALLY_BAD,
                    UNKNOWN: statusCounts.null,
                },
            },
        };
    } catch (error) {
        console.error("[GetAnalyticsAction] error", error);
        return {
            success: false,
            error: "Erreur lors de la récupération des statistiques.",
        };
    }
}
