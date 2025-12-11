"use server";

import { connectToDatabase } from "@/lib/database";
import Room from "@/models/room";
import Sensor from "@/models/sensor";
import { Types } from "mongoose";

type DeleteRoomPayload = {
    roomId: string;
};

export async function DeleteRoomAction(payload: DeleteRoomPayload) {
    if (!payload?.roomId) {
        return {
            success: false,
            message: "ID de pièce manquant.",
        };
    }

    try {
        await connectToDatabase();

        if (!Types.ObjectId.isValid(payload.roomId)) {
            return {
                success: false,
                message: "ID de pièce invalide.",
            };
        }

        const roomObjectId = new Types.ObjectId(payload.roomId);

        const room = await Room.findById(roomObjectId);
        if (!room) {
            return {
                success: false,
                message: "Pièce non trouvée.",
            };
        }

        await Sensor.updateMany(
            { roomId: roomObjectId },
            { $set: { roomId: null } }
        );

        await Room.findByIdAndDelete(roomObjectId);

        return {
            success: true,
            message: "Pièce supprimée avec succès.",
        };
    } catch (error) {
        console.error("[DeleteRoomAction] error deleting room", error);
        return {
            success: false,
            message: "Erreur lors de la suppression de la pièce.",
        };
    }
}
