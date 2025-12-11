"use server";

import { connectToDatabase } from "@/lib/database";
import { CreateRoomValidation } from "@/utils/validations/create-room.validation";
import Room from "@/models/room";
import { CreateRoomPayload } from "@/utils/types/room";

export async function CreateRoomAction(payload: CreateRoomPayload) {
    const validation = CreateRoomValidation.safeParse(payload);
    if (!validation.success) {
        return {
            success: false,
            message: 
                validation.error.issues.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ") || 
                "Erreur lors de la validation. Merci de vérifier les informations saisies.",
        };
    }

    try {
        await connectToDatabase();

        const createdDoc = await Room.create({
            name: payload.name,
            floor: payload.floor,
            position: payload.position,
            description: payload.description || "",
            isUsed: payload.isUsed,
            sensorId: payload.sensorId || null,
            acceptable: {
                co2: 0,
                decibel: 0,
                humidity: 0,
                temperature: 0,
            },
        });

        const createdJson = createdDoc.toJSON({ versionKey: false });
        const created = { ...createdJson, _id: createdDoc._id.toString() };

        return {
            success: true,
            data: created,
        };
    } catch (error) {
        console.error("[CreateRoomAction] error creating room", error);
        return {
            success: false,
            message: "Une erreur est survenue lors de la création de la pièce.",
        };
    }
}
