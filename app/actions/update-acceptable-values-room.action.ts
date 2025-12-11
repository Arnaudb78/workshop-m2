"use server";

import { connectToDatabase } from "@/lib/database";
import Room from "@/models/room";
import { Types } from "mongoose";

type UpdateAcceptableValuesPayload = {
    roomId: string;
    acceptable: {
        co2: number;
        decibel: number;
        humidity: number;
        temperature: number;
    };
};

export async function UpdateAcceptableValuesRoomAction(payload: UpdateAcceptableValuesPayload) {
    try {
        await connectToDatabase();
        if (!payload.roomId || !Types.ObjectId.isValid(payload.roomId)) {
            return {
                success: false,
                message: "ID de pièce invalide.",
            };
        }

        const roomId = new Types.ObjectId(payload.roomId);

        const acceptableUpdate = {
            co2: Number(payload.acceptable.co2) || 0,
            decibel: Number(payload.acceptable.decibel) || 0,
            humidity: Number(payload.acceptable.humidity) || 0,
            temperature: Number(payload.acceptable.temperature) || 0,
        };

        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { $set: { acceptable: acceptableUpdate } },
            { new: true, lean: true }
        );

        if (!updatedRoom) {
            return {
                success: false,
                message: "Pièce non trouvée.",
            };
        }

        const roomWithStringId = {
            ...updatedRoom,
            _id: updatedRoom._id?.toString(),
        };

        return {
            success: true,
            data: roomWithStringId,
        };
    } catch (error) {
        return {
            success: false,
            message: "Une erreur est survenue lors de la mise à jour de la pièce.",
        };
    }
}
