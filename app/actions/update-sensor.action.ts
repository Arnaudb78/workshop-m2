"use server";

import { connectToDatabase } from "@/lib/database";
import Sensor from "@/models/sensor";
import { Types } from "mongoose";

type UpdateSensorPayload = {
    sensorId: string;
    name?: string;
    roomId?: string | null;
};

export async function UpdateSensorAction(payload: UpdateSensorPayload) {
    try {
        await connectToDatabase();

        if (!payload.sensorId || !Types.ObjectId.isValid(payload.sensorId)) {
            return {
                success: false,
                message: "ID de capteur invalide.",
            };
        }

        const sensorId = new Types.ObjectId(payload.sensorId);

        const updateData: any = {};
        
        if (payload.name !== undefined) {
            updateData.name = payload.name;
        }
        
        if (payload.roomId !== undefined) {
            updateData.roomId = payload.roomId ? new Types.ObjectId(payload.roomId) : null;
        }

        const updatedSensor = await Sensor.findByIdAndUpdate(
            sensorId,
            { $set: updateData },
            { new: true, lean: true }
        );

        if (!updatedSensor) {
            return {
                success: false,
                message: "Capteur non trouvé.",
            };
        }

        const sensorWithStringId = {
            ...updatedSensor,
            _id: updatedSensor._id?.toString(),
            roomId: updatedSensor.roomId ? updatedSensor.roomId.toString() : null,
        };

        return {
            success: true,
            data: sensorWithStringId,
        };
    } catch (error) {
        console.error("[UpdateSensorAction] error", error);
        return {
            success: false,
            message: "Une erreur est survenue lors de la mise à jour du capteur.",
        };
    }
}
