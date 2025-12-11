"use server";

import { connectToDatabase } from "@/lib/database";
import Room from "@/models/room";

export async function GetStudentRoomStatsAction() {
    try {
        await connectToDatabase();

        const totalRooms = await Room.countDocuments({});
        const availableRooms = await Room.countDocuments({ isUsed: false });
        const occupiedRooms = await Room.countDocuments({ isUsed: true });

        return {
            success: true,
            data: {
                totalRooms,
                availableRooms,
                occupiedRooms,
            },
        };
    } catch (error) {
        console.error("[GetStudentRoomStatsAction] error", error);
        return {
            success: false,
            error: "Erreur lors de la récupération des statistiques des salles.",
        };
    }
}
